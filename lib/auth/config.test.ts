import { describe, expect, it } from "vitest";
import { getAuthConfig, safeNext } from "./config";

const config = {
  SONDA_AUTH_ENABLED: "true",
  NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "chave-publica",
  NEXT_PUBLIC_APP_URL: "https://sonda.example.test",
};

describe("fronteiras de autenticação", () => {
  it("só habilita login após configuração explícita, completa e válida", () => {
    expect(
      getAuthConfig({ ...config, SONDA_AUTH_ENABLED: "false" }),
    ).toBeNull();
    expect(
      getAuthConfig({ ...config, NEXT_PUBLIC_APP_URL: undefined }),
    ).toBeNull();
    expect(
      getAuthConfig({ ...config, NEXT_PUBLIC_SUPABASE_ANON_KEY: "" }),
    ).toBeNull();
    expect(getAuthConfig(config)?.origin).toBe("https://sonda.example.test");
  });
  it("não constrói callbacks com URL insegura, credenciais ou caminho arbitrário", () => {
    for (const url of [
      "inválida",
      "http://example.test",
      "https://user:pass@example.test",
      "https://example.test/externo",
      "https://example.test?next=outra",
      "https://example.test/#fragmento",
    ])
      expect(getAuthConfig({ ...config, NEXT_PUBLIC_APP_URL: url })).toBeNull();
    expect(
      getAuthConfig({ ...config, NEXT_PUBLIC_APP_URL: "http://localhost:3000" })
        ?.origin,
    ).toBe("http://localhost:3000");
  });
  it("restringe o destino pós-login a workspaces internos conhecidos", () => {
    expect(safeNext(null)).toBe("/workspaces");
    expect(safeNext("/w/do-fundo-do-poco")).toBe("/w/do-fundo-do-poco");
    for (const path of [
      "https://evil.test",
      "//evil.test",
      "/\\evil.test",
      "/%2f%2fevil.test",
      "/w/time/../../auth/callback",
      "/workspaces?next=https://evil.test",
      "/auth/callback",
      "javascript:alert(1)",
      "/w/time\n",
      "/w/time#hash",
    ])
      expect(safeNext(path)).toBeNull();
  });
});
