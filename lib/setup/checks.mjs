import { z } from "zod";

/** @typedef {{id: string, state: 'ok' | 'falha' | 'pendente', message: string}} SetupCheck */
/** @typedef {Record<string, string | undefined>} Environment */

const originSchema = z.url().pipe(
  z.string().refine((value) => {
    const url = new URL(value);
    return (
      !url.username &&
      !url.password &&
      url.pathname === "/" &&
      !url.search &&
      !url.hash &&
      (url.protocol === "https:" ||
        (url.protocol === "http:" &&
          ["localhost", "127.0.0.1"].includes(url.hostname)))
    );
  }),
);
const settingsSchema = z.object({
  external: z.object({
    email: z.boolean(),
    github: z.boolean(),
    anonymous_users: z.boolean(),
  }),
  mailer_autoconfirm: z.boolean(),
  disable_signup: z.boolean(),
});
const workspacesSchema = z.array(
  z.object({ id: z.uuid(), slug: z.string(), is_personal: z.boolean() }),
);
const invitesSchema = z.array(
  z.object({
    email: z.string(),
    workspace_id: z.uuid(),
    role: z.literal("owner"),
  }),
);

/**
 * Somente leituras: não envia e-mails, cria contas, aplica SQL ou altera flags.
 * Nenhuma resposta bruta, chave, origem ou identidade integra o relatório.
 * @param {Environment} env
 * @param {typeof fetch} request
 */
export async function inspectSetup(env, request = fetch) {
  /** @type {SetupCheck[]} */
  const checks = [];
  /** @param {string} id @param {boolean} ok @param {string} message */
  const add = (id, ok, message) =>
    checks.push({ id, state: ok ? "ok" : "falha", message });
  /** @param {string} id @param {string} message */
  const pending = (id, message) =>
    checks.push({ id, state: "pendente", message });
  const url = originSchema.safeParse(env.NEXT_PUBLIC_SUPABASE_URL?.trim());
  const appOrigin = originSchema.safeParse(env.NEXT_PUBLIC_APP_URL?.trim());
  const publicKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const owner = z
    .email()
    .safeParse(env.SONDA_OWNER_EMAIL?.trim().toLowerCase());

  add(
    "supabase_url",
    url.success,
    url.success
      ? "Origem do Supabase válida."
      : "Preencha NEXT_PUBLIC_SUPABASE_URL com uma origem HTTPS válida (HTTP somente local).",
  );
  add(
    "public_key",
    !!publicKey,
    publicKey
      ? "Chave pública presente; seu valor não será exibido."
      : "Preencha NEXT_PUBLIC_SUPABASE_ANON_KEY.",
  );
  add(
    "app_origin",
    appOrigin.success,
    appOrigin.success
      ? "Origem canônica da aplicação válida."
      : "Confira NEXT_PUBLIC_APP_URL: use somente a origem, sem caminho ou credenciais.",
  );
  add(
    "owner_email",
    owner.success,
    owner.success
      ? "Identidade local do owner válida."
      : "Confira SONDA_OWNER_EMAIL no ambiente local.",
  );
  if (env.SONDA_AUTH_ENABLED === "true")
    add("auth_enabled", true, "Acesso habilitado explicitamente no ambiente.");
  else
    pending(
      "auth_enabled",
      "O acesso permanece fechado; habilite somente após configurar os serviços e validar o fluxo.",
    );

  /**
   * @param {string} path @param {string} key
   * @returns {Promise<{status: number, value: unknown}>}
   */
  async function read(path, key) {
    if (!url.success) throw new Error("Origem indisponível.");
    const response = await request(new URL(path, url.data), {
      method: "GET",
      redirect: "error",
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    // Não ler corpos de erro: podem conter dados ou detalhes internos.
    if (!response.ok) return { status: response.status, value: null };
    try {
      return { status: response.status, value: await response.json() };
    } catch {
      return { status: response.status, value: null };
    }
  }

  if (url.success && publicKey) {
    let publicKeyVerified = false;
    try {
      const result = await read("/auth/v1/settings", publicKey);
      const settings = settingsSchema.safeParse(result.value);
      if (result.status !== 200 || !settings.success) {
        add(
          "auth_connection",
          false,
          "Não foi possível validar o Auth e a chave pública. Confira o projeto, a chave e a disponibilidade do serviço.",
        );
      } else {
        publicKeyVerified = true;
        add(
          "auth_connection",
          true,
          "Configuração pública do Auth consultada.",
        );
        add(
          "email_provider",
          settings.data.external.email,
          settings.data.external.email
            ? "Provedor de e-mail habilitado."
            : "Habilite o provedor de e-mail no Supabase.",
        );
        add(
          "github_provider",
          settings.data.external.github,
          settings.data.external.github
            ? "Provedor GitHub habilitado; o fluxo OAuth ainda precisa de validação."
            : "Configure e habilite o provedor GitHub.",
        );
        add(
          "email_confirmation",
          !settings.data.mailer_autoconfirm,
          !settings.data.mailer_autoconfirm
            ? "Confirmação de e-mail exigida pelo Auth."
            : "Desative a confirmação automática de e-mail antes de abrir o acesso.",
        );
        add(
          "anonymous_users",
          !settings.data.external.anonymous_users,
          !settings.data.external.anonymous_users
            ? "Login anônimo desabilitado."
            : "Desabilite login anônimo no Auth.",
        );
        add(
          "invite_signup",
          !settings.data.disable_signup,
          !settings.data.disable_signup
            ? "Criação de conta permitida pelo Auth; confirme que o hook restringe a convidados."
            : "O cadastro está totalmente fechado no Auth; convidados novos não conseguirão entrar. Configure o hook antes de permitir criação de contas.",
        );
      }
    } catch {
      add(
        "auth_connection",
        false,
        "Falha de rede, redirecionamento ou tempo limite ao consultar o Auth. Nenhum segredo foi exibido.",
      );
    }
    // Um 401 por chave inválida não é evidência de isolamento.
    if (publicKeyVerified) {
      try {
        const result = await read(
          "/rest/v1/workspaces?select=id&limit=1",
          publicKey,
        );
        add(
          "anonymous_data",
          [401, 403].includes(result.status),
          [401, 403].includes(result.status)
            ? "Consulta anônima de workspaces recusada."
            : "A API não recusou a consulta anônima como esperado. Confira migrations, grants e RLS; tabela ausente também reprova este check.",
        );
      } catch {
        add(
          "anonymous_data",
          false,
          "Não foi possível verificar a recusa de leitura anônima.",
        );
      }
    }
  }

  if (url.success && serviceKey && owner.success) {
    try {
      const response = await read(
        "/rest/v1/workspaces?select=id,slug,is_personal&slug=in.(do-fundo-do-poco,meus-projetos)",
        serviceKey,
      );
      const workspaces = workspacesSchema.safeParse(response.value);
      if (response.status !== 200 || !workspaces.success) {
        add(
          "workspace_seed",
          false,
          "Não foi possível consultar os workspaces com a chave administrativa. Confira migrations e credencial local.",
        );
      } else {
        const team = workspaces.data.find(
          (w) => w.slug === "do-fundo-do-poco" && !w.is_personal,
        );
        const personal = workspaces.data.find(
          (w) => w.slug === "meus-projetos" && w.is_personal,
        );
        const seeded = workspaces.data.length === 2 && !!team && !!personal;
        add(
          "workspace_seed",
          seeded,
          seeded
            ? "Os dois workspaces do seed foram encontrados com os tipos esperados."
            : "Aplique ou confira o seed dos dois workspaces e seus tipos.",
        );
        if (seeded) {
          const response = await read(
            "/rest/v1/invites?select=email,workspace_id,role&role=eq.owner",
            serviceKey,
          );
          const invites = invitesSchema.safeParse(response.value);
          const expected = [team?.id, personal?.id];
          const initialOwners = invites.success
            ? invites.data.filter((i) => expected.includes(i.workspace_id))
            : [];
          const ready =
            response.status === 200 &&
            invites.success &&
            initialOwners.length === 2 &&
            initialOwners.every((i) => i.email === owner.data) &&
            expected.every((id) =>
              initialOwners.some(
                (i) => i.workspace_id === id && i.email === owner.data,
              ),
            );
          add(
            "owner_bootstrap",
            ready,
            ready
              ? "Convites do owner local encontrados nos dois workspaces."
              : "Execute ou confira o bootstrap do owner. Nenhuma identidade foi alterada por este comando.",
          );
        }
      }
    } catch {
      add(
        "workspace_seed",
        false,
        "Não foi possível consultar o seed/bootstrap. Confira rede, migrations e chave administrativa local.",
      );
    }
  } else {
    pending(
      "workspace_seed",
      "Verificação administrativa de seed/bootstrap pendente; exige origem, service role e owner válidos apenas no ambiente local.",
    );
  }

  return {
    checks,
    manual: [
      "Conferir Before User Created hook e template de magic link no Supabase.",
      "Validar magic link e GitHub com o owner e um e-mail não convidado.",
      "Validar papéis e revogação com sessões reais antes de concluir a milestone 0.",
    ],
    exitCode: checks.some((c) => c.state === "falha")
      ? 1
      : checks.some((c) => c.state === "pendente")
        ? 2
        : 0,
  };
}
