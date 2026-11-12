import { describe, expect, it, vi } from "vitest";
import { inspectSetup } from "./checks.mjs";

const env = {
  NEXT_PUBLIC_SUPABASE_URL: "https://project.example.test",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "public-test-key-not-real",
  SUPABASE_SERVICE_ROLE_KEY: "admin-secret-not-real",
  NEXT_PUBLIC_APP_URL: "https://sonda.example.test",
  SONDA_OWNER_EMAIL: "owner@example.test",
  SONDA_AUTH_ENABLED: "true",
};
const team = "10000000-0000-4000-8000-000000000001";
const personal = "10000000-0000-4000-8000-000000000002";
const settings = {
  external: { email: true, github: true, anonymous_users: false },
  mailer_autoconfirm: false,
  disable_signup: false,
};

function api(
  options: {
    authStatus?: number;
    authValue?: unknown;
    anonStatus?: number;
    seeded?: boolean;
    bootstrapped?: boolean;
  } = {},
) {
  return vi.fn<typeof fetch>(async (input, init) => {
    const url = new URL(String(input));
    const key = new Headers(init?.headers).get("apikey");
    if (url.pathname === "/auth/v1/settings")
      return Response.json(options.authValue ?? settings, {
        status: options.authStatus ?? 200,
      });
    if (
      url.pathname === "/rest/v1/workspaces" &&
      key === env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
      return Response.json([], { status: options.anonStatus ?? 403 });
    if (
      url.pathname === "/rest/v1/workspaces" &&
      key === env.SUPABASE_SERVICE_ROLE_KEY
    )
      return Response.json(
        options.seeded === false
          ? []
          : [
              { id: team, slug: "do-fundo-do-poco", is_personal: false },
              { id: personal, slug: "meus-projetos", is_personal: true },
            ],
      );
    if (
      url.pathname === "/rest/v1/invites" &&
      key === env.SUPABASE_SERVICE_ROLE_KEY
    )
      return Response.json(
        options.bootstrapped === false
          ? []
          : [
              {
                email: env.SONDA_OWNER_EMAIL,
                workspace_id: team,
                role: "owner",
              },
              {
                email: env.SONDA_OWNER_EMAIL,
                workspace_id: personal,
                role: "owner",
              },
            ],
      );
    throw new Error("Requisição não prevista no contrato do teste.");
  });
}

describe("verificação operacional somente leitura", () => {
  it("ambiente vazio identifica pendências sem requisições ou vazamento de valores", async () => {
    const request = api();
    const report = await inspectSetup({}, request);
    expect(report.exitCode).toBe(1);
    expect(report.checks.find((c) => c.id === "supabase_url")?.state).toBe(
      "falha",
    );
    expect(report.checks.find((c) => c.id === "auth_enabled")?.state).toBe(
      "pendente",
    );
    expect(request).not.toHaveBeenCalled();
  });

  it("origem inválida não recebe credenciais, mesmo quando há chaves locais", async () => {
    for (const origin of [
      "http://evil.test",
      "https://user:pass@example.test",
      "https://example.test/path",
      "https://example.test/?secret=valor",
    ]) {
      const request = api();
      const report = await inspectSetup(
        { ...env, NEXT_PUBLIC_SUPABASE_URL: origin },
        request,
      );
      expect(report.exitCode).toBe(1);
      expect(request).not.toHaveBeenCalled();
      expect(JSON.stringify(report)).not.toContain(origin);
    }
  });

  it("confere providers, seed e owner sem tratar isso como aceite hospedado", async () => {
    const request = api();
    const report = await inspectSetup(env, request);
    expect(report.exitCode).toBe(0);
    expect(report.checks.every((c) => c.state === "ok")).toBe(true);
    expect(report.manual).toHaveLength(3);
    for (const value of [
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      env.SUPABASE_SERVICE_ROLE_KEY,
      env.SONDA_OWNER_EMAIL,
      env.NEXT_PUBLIC_SUPABASE_URL,
    ])
      expect(JSON.stringify(report)).not.toContain(value);
    for (const [input, init] of request.mock.calls) {
      expect(new URL(String(input)).origin).toBe(env.NEXT_PUBLIC_SUPABASE_URL);
      expect(init?.method).toBe("GET");
      expect(init?.redirect).toBe("error");
      expect(init?.signal).toBeInstanceOf(AbortSignal);
    }
    const authCall = request.mock.calls.find(([url]) =>
      String(url).includes("/auth/v1/settings"),
    );
    expect(new Headers(authCall?.[1]?.headers).get("apikey")).toBe(
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    );
  });

  it("401 de chave inválida não comprova recusa de leitura anônima", async () => {
    const report = await inspectSetup(env, api({ authStatus: 401 }));
    expect(report.exitCode).toBe(1);
    expect(report.checks.find((c) => c.id === "auth_connection")?.state).toBe(
      "falha",
    );
    expect(report.checks.some((c) => c.id === "anonymous_data")).toBe(false);
  });

  it("resposta pública inesperada reprova a verificação do Auth", async () => {
    const report = await inspectSetup(
      env,
      api({ authValue: { message: "detalhe-interno" } }),
    );
    expect(report.exitCode).toBe(1);
    expect(JSON.stringify(report)).not.toContain("detalhe-interno");
    expect(report.checks.some((c) => c.id === "anonymous_data")).toBe(false);
  });

  it("consulta anônima aceita ou tabela ausente não passa por isolamento", async () => {
    for (const anonStatus of [200, 404]) {
      const report = await inspectSetup(env, api({ anonStatus }));
      expect(report.checks.find((c) => c.id === "anonymous_data")?.state).toBe(
        "falha",
      );
    }
  });

  it("provedor ausente e confirmação automática são apontados sem alterar a conta", async () => {
    const report = await inspectSetup(
      env,
      api({
        authValue: {
          ...settings,
          external: {
            ...settings.external,
            github: false,
            anonymous_users: true,
          },
          mailer_autoconfirm: true,
          disable_signup: true,
        },
      }),
    );
    for (const id of [
      "github_provider",
      "anonymous_users",
      "email_confirmation",
      "invite_signup",
    ])
      expect(report.checks.find((c) => c.id === id)?.state).toBe("falha");
  });

  it("identifica seed ausente e bootstrap incompleto separadamente", async () => {
    const unseeded = await inspectSetup(env, api({ seeded: false }));
    expect(unseeded.checks.find((c) => c.id === "workspace_seed")?.state).toBe(
      "falha",
    );
    expect(unseeded.checks.some((c) => c.id === "owner_bootstrap")).toBe(false);
    const pendingOwner = await inspectSetup(env, api({ bootstrapped: false }));
    expect(
      pendingOwner.checks.find((c) => c.id === "owner_bootstrap")?.state,
    ).toBe("falha");
  });

  it("sem service role verifica acesso público e deixa bootstrap pendente", async () => {
    const request = api();
    const report = await inspectSetup(
      { ...env, SUPABASE_SERVICE_ROLE_KEY: "" },
      request,
    );
    expect(report.exitCode).toBe(2);
    expect(report.checks.find((c) => c.id === "workspace_seed")?.state).toBe(
      "pendente",
    );
    expect(
      request.mock.calls.some(([url]) => String(url).includes("/invites")),
    ).toBe(false);
  });

  it("owner inesperado nos workspaces iniciais reprova o bootstrap", async () => {
    const base = api();
    const request = vi.fn<typeof fetch>(async (input, init) => {
      const response = await base(input, init);
      if (!String(input).includes("/invites")) return response;
      const rows: unknown[] = await response.json();
      return Response.json([
        ...rows,
        { email: "outro@example.test", workspace_id: team, role: "owner" },
      ]);
    });
    const report = await inspectSetup(env, request);
    expect(report.checks.find((c) => c.id === "owner_bootstrap")?.state).toBe(
      "falha",
    );
    expect(JSON.stringify(report)).not.toContain("outro@example.test");
  });

  it("falhas de rede ou redirecionamento não imprimem mensagens internas ou chaves", async () => {
    const request = vi
      .fn<typeof fetch>()
      .mockRejectedValue(
        new Error(`erro com ${env.SUPABASE_SERVICE_ROLE_KEY}`),
      );
    const report = await inspectSetup(env, request);
    expect(report.exitCode).toBe(1);
    expect(JSON.stringify(report)).not.toContain(env.SUPABASE_SERVICE_ROLE_KEY);
  });
});
