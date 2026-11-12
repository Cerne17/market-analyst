import { describe, expect, it } from "vitest";
import { readPublicSupabaseConfig } from "./public-env";

describe("configuração pública do Supabase", () => {
  it("mantém acesso indisponível sem URL e chave completas", () => {
    expect(readPublicSupabaseConfig({})).toBeNull();
    expect(
      readPublicSupabaseConfig({
        NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      }),
    ).toBeNull();
    expect(
      readPublicSupabaseConfig({
        NEXT_PUBLIC_SUPABASE_URL: "inválida",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "chave-publica",
      }),
    ).toBeNull();
  });
  it("não permite transporte inseguro fora do desenvolvimento local", () => {
    expect(
      readPublicSupabaseConfig({
        NEXT_PUBLIC_SUPABASE_URL: "http://example.com",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "chave-publica",
      }),
    ).toBeNull();
    expect(
      readPublicSupabaseConfig({
        NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "chave-publica",
      }),
    ).not.toBeNull();
  });
  it("retorna somente campos públicos mesmo recebendo segredos no ambiente", () => {
    expect(
      readPublicSupabaseConfig({
        NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "chave-publica",
        SUPABASE_SERVICE_ROLE_KEY: "nao-expor",
      }),
    ).toEqual({ url: "https://example.supabase.co", anonKey: "chave-publica" });
  });
});
