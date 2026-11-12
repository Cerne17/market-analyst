// Executar localmente: node --env-file=.env.local scripts/bootstrap-owner.mjs
// A service role não é usada pelas páginas, ações ou pelo navegador.
const {
  NEXT_PUBLIC_SUPABASE_URL: url,
  SUPABASE_SERVICE_ROLE_KEY: key,
  SONDA_OWNER_EMAIL: email,
} = process.env;

try {
  const parsed = URL.parse(url ?? "");
  const local = parsed && ["localhost", "127.0.0.1"].includes(parsed.hostname);
  if (
    !parsed ||
    !key ||
    !email ||
    email.trim().length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
    parsed.username ||
    parsed.password ||
    parsed.search ||
    parsed.hash ||
    parsed.pathname !== "/" ||
    (parsed.protocol !== "https:" && !(local && parsed.protocol === "http:"))
  )
    throw new Error(
      "Configuração incompleta: confira URL, service role e SONDA_OWNER_EMAIL em .env.local.",
    );
  const response = await fetch(
    new URL("/rest/v1/rpc/bootstrap_owner", parsed),
    {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ owner_email: email.trim().toLowerCase() }),
    },
  );
  if (!response.ok)
    throw new Error(
      `Bootstrap não aplicado (HTTP ${response.status}). Confira migrations, seed e a identidade já configurada. Nenhuma credencial foi impressa.`,
    );
  console.log(
    "Convites iniciais preparados. O owner deve confirmar o e-mail pelo login para ativar seus vínculos.",
  );
} catch (error) {
  console.error(
    error instanceof Error && !error.message.includes("fetch")
      ? error.message
      : "Não foi possível conectar ao Supabase. Confira a configuração e a rede.",
  );
  process.exitCode = 1;
}
