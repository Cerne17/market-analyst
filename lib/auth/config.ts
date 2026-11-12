import { readPublicSupabaseConfig } from "../config/public-env";

export function getAuthConfig(env: Record<string, string | undefined>) {
  if (env.SONDA_AUTH_ENABLED !== "true") return null;
  const supabase = readPublicSupabaseConfig(env);
  if (!supabase || !env.NEXT_PUBLIC_APP_URL) return null;
  try {
    const url = new URL(env.NEXT_PUBLIC_APP_URL);
    const local = ["localhost", "127.0.0.1"].includes(url.hostname);
    if (
      (url.protocol !== "https:" && !(local && url.protocol === "http:")) ||
      url.username ||
      url.password ||
      url.pathname !== "/" ||
      url.search ||
      url.hash
    )
      return null;
    return { ...supabase, origin: url.origin };
  } catch {
    return null;
  }
}

export function safeNext(value: string | null): string | null {
  if (value === null || value === "/workspaces") return "/workspaces";
  return value === value.trim() && /^\/w\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
    ? value
    : null;
}

export const loginMessages: Record<string, string> = {
  "invalid-link": "Este link é inválido ou expirou. Solicite um novo acesso.",
  "not-invited":
    "Seu acesso não foi autorizado. Peça ao owner para conferir seu convite.",
  unavailable:
    "O acesso está indisponível no momento. Tente novamente em alguns instantes.",
  "signed-out": "Você saiu do seu espaço.",
};
