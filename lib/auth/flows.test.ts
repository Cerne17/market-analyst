import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => {
  const client = {
    auth: {
      signInWithOtp: vi.fn(),
      signInWithOAuth: vi.fn(),
      signOut: vi.fn(),
      getUser: vi.fn(),
      exchangeCodeForSession: vi.fn(),
      verifyOtp: vi.fn(),
    },
    rpc: vi.fn(),
  };
  return { client, factory: vi.fn(), redirect: vi.fn() };
});
vi.mock("server-only", () => ({}));
vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: mocks.factory,
}));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));

import { GET as callback } from "@/app/auth/callback/route";
import { GET as confirm } from "@/app/auth/confirm/route";
import { requestMagicLink, signInWithGitHub } from "@/app/login/actions";

describe("contrato dos fluxos de autenticação (provider controlado)", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv("SONDA_AUTH_ENABLED", "true");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "chave-publica");
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://sonda.example.test");
    mocks.factory.mockResolvedValue(mocks.client);
    mocks.client.auth.getUser.mockResolvedValue({
      data: { user: { id: "usuario", email_confirmed_at: "2026-11-12" } },
      error: null,
    });
    mocks.client.auth.exchangeCodeForSession.mockResolvedValue({ error: null });
    mocks.client.auth.verifyOtp.mockResolvedValue({ error: null });
    mocks.client.auth.signOut.mockResolvedValue({ error: null });
    mocks.client.auth.signInWithOtp.mockResolvedValue({ error: null });
    mocks.client.rpc.mockResolvedValue({ error: null });
    mocks.redirect.mockImplementation((url: string) => {
      throw new Error(`REDIRECT:${url}`);
    });
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("não verifica tokens ou inicia sessão antes de configurar o acesso", async () => {
    vi.stubEnv("SONDA_AUTH_ENABLED", "false");
    expect(
      (
        await callback(
          new NextRequest(
            "https://sonda.example.test/auth/callback?code=segredo",
          ),
        )
      ).status,
    ).toBe(503);
    expect(
      (
        await confirm(
          new NextRequest(
            "https://sonda.example.test/auth/confirm?token_hash=segredo&type=email",
          ),
        )
      ).status,
    ).toBe(503);
    expect(mocks.factory).not.toHaveBeenCalled();
  });

  it("callback inválido ou com redirecionamento externo não consome o código", async () => {
    for (const params of [
      "",
      "?code=segredo&next=https://evil.test",
      "?error=access_denied",
    ]) {
      const response = await callback(
        new NextRequest(`https://host-forjado.test/auth/callback${params}`),
      );
      expect(response.headers.get("location")).toBe(
        "https://sonda.example.test/login?status=invalid-link",
      );
      expect(await response.text()).not.toContain("segredo");
    }
    expect(mocks.client.auth.exchangeCodeForSession).not.toHaveBeenCalled();
  });

  it("código expirado não aceita convites e não expõe erro do provider", async () => {
    mocks.client.auth.exchangeCodeForSession.mockResolvedValue({
      error: { message: "detalhe-interno" },
    });
    const response = await callback(
      new NextRequest("https://sonda.example.test/auth/callback?code=expirado"),
    );
    expect(response.headers.get("location")).toBe(
      "https://sonda.example.test/login?status=invalid-link",
    );
    expect(mocks.client.rpc).not.toHaveBeenCalled();
  });

  it("convidado confirmado ativa os vínculos antes do redirecionamento interno", async () => {
    const response = await callback(
      new NextRequest(
        "https://host-forjado.test/auth/callback?code=valido&next=/w/do-fundo-do-poco",
      ),
    );
    expect(mocks.client.auth.exchangeCodeForSession).toHaveBeenCalledWith(
      "valido",
    );
    expect(mocks.client.rpc).toHaveBeenCalledWith("accept_invites");
    expect(response.headers.get("location")).toBe(
      "https://sonda.example.test/w/do-fundo-do-poco",
    );
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(response.headers.get("referrer-policy")).toBe("no-referrer");
  });

  it("sem convite o callback encerra a sessão local e recusa acesso", async () => {
    mocks.client.rpc.mockResolvedValue({ error: { code: "42501" } });
    const response = await callback(
      new NextRequest("https://sonda.example.test/auth/callback?code=valido"),
    );
    expect(mocks.client.auth.signOut).toHaveBeenCalledWith({ scope: "local" });
    expect(response.headers.get("location")).toBe(
      "https://sonda.example.test/login?status=not-invited",
    );
  });

  it("cookie sem usuário validado e e-mail não confirmado não ativam convites", async () => {
    for (const user of [null, { id: "usuario", email_confirmed_at: null }]) {
      mocks.client.auth.getUser.mockResolvedValue({
        data: { user },
        error: null,
      });
      const response = await callback(
        new NextRequest("https://sonda.example.test/auth/callback?code=valido"),
      );
      expect(response.headers.get("location")).toBe(
        "https://sonda.example.test/login?status=not-invited",
      );
    }
    expect(mocks.client.rpc).not.toHaveBeenCalled();
  });

  it("magic link aceita somente token hash do tipo email e destino interno", async () => {
    for (const params of [
      "?token_hash=segredo&type=recovery",
      "?token_hash=segredo&type=email&next=//evil.test",
      "?type=email",
    ]) {
      const response = await confirm(
        new NextRequest(`https://sonda.example.test/auth/confirm${params}`),
      );
      expect(response.headers.get("location")).toBe(
        "https://sonda.example.test/login?status=invalid-link",
      );
    }
    expect(mocks.client.auth.verifyOtp).not.toHaveBeenCalled();
    const response = await confirm(
      new NextRequest(
        "https://sonda.example.test/auth/confirm?token_hash=valido&type=email",
      ),
    );
    expect(mocks.client.auth.verifyOtp).toHaveBeenCalledWith({
      token_hash: "valido",
      type: "email",
    });
    expect(response.headers.get("location")).toBe(
      "https://sonda.example.test/workspaces",
    );
  });

  it("formulário valida e normaliza o e-mail antes de chamar Auth", async () => {
    const form = new FormData();
    form.set("email", "não é email");
    expect(
      (await requestMagicLink({ status: "idle", message: "" }, form)).status,
    ).toBe("error");
    expect(mocks.client.auth.signInWithOtp).not.toHaveBeenCalled();
    form.set("email", " User@Example.Test ");
    expect(
      (await requestMagicLink({ status: "idle", message: "" }, form)).status,
    ).toBe("sent");
    expect(mocks.client.auth.signInWithOtp).toHaveBeenCalledWith({
      email: "user@example.test",
      options: { emailRedirectTo: "https://sonda.example.test/auth/confirm" },
    });
  });

  it("não revela no formulário se o e-mail pertence à allowlist", async () => {
    const form = new FormData();
    form.set("email", "user@example.test");
    const invited = await requestMagicLink(
      { status: "idle", message: "" },
      form,
    );
    mocks.client.auth.signInWithOtp.mockResolvedValue({
      error: { status: 403, message: "não convidado" },
    });
    expect(
      await requestMagicLink({ status: "idle", message: "" }, form),
    ).toEqual(invited);
  });

  it("falhas operacionais e limite de envio recebem mensagem fixa", async () => {
    const form = new FormData();
    form.set("email", "user@example.test");
    for (const status of [429, 503]) {
      mocks.client.auth.signInWithOtp.mockResolvedValue({
        error: { status, message: "detalhe-interno" },
      });
      const result = await requestMagicLink(
        { status: "idle", message: "" },
        form,
      );
      expect(result.status).toBe("error");
      expect(result.message).not.toContain("detalhe-interno");
    }
  });

  it("GitHub recebe callback canônico e falhas não incluem detalhes externos", async () => {
    mocks.client.auth.signInWithOAuth.mockResolvedValue({
      data: { url: "https://example.supabase.co/auth/v1/authorize" },
      error: null,
    });
    await expect(signInWithGitHub()).rejects.toThrow(
      "REDIRECT:https://example.supabase.co/auth/v1/authorize",
    );
    expect(mocks.client.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: "github",
      options: { redirectTo: "https://sonda.example.test/auth/callback" },
    });
    mocks.client.auth.signInWithOAuth.mockRejectedValue(
      new Error("detalhe-interno"),
    );
    await expect(signInWithGitHub()).rejects.toThrow(
      "REDIRECT:/login?status=unavailable",
    );
  });
});
