"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { getAuthConfig } from "@/lib/auth/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type LoginState = { status: "idle" | "sent" | "error"; message: string };

export async function requestMagicLink(
  _previous: LoginState,
  form: FormData,
): Promise<LoginState> {
  const parsed = z
    .string()
    .trim()
    .toLowerCase()
    .max(254)
    .pipe(z.email())
    .safeParse(form.get("email"));
  if (!parsed.success)
    return { status: "error", message: "Informe um e-mail válido." };
  const config = getAuthConfig(process.env);
  const client = await createServerSupabaseClient(true);
  if (!config || !client)
    return {
      status: "error",
      message: "A configuração do acesso ainda não foi concluída.",
    };
  try {
    const { error } = await client.auth.signInWithOtp({
      email: parsed.data,
      options: { emailRedirectTo: `${config.origin}/auth/confirm` },
    });
    if (error && (error.status === 429 || (error.status ?? 0) >= 500))
      return {
        status: "error",
        message:
          "O envio está indisponível ou atingiu o limite de tentativas. Aguarde e tente novamente.",
      };
    // Mesma resposta para e-mails convidados e não convidados; o hook decide.
    return {
      status: "sent",
      message:
        "Se este e-mail estiver convidado, você receberá um link de acesso. Confira sua caixa de entrada.",
    };
  } catch {
    return {
      status: "error",
      message: "Não foi possível solicitar o acesso agora. Tente novamente.",
    };
  }
}

export async function signInWithGitHub() {
  const config = getAuthConfig(process.env);
  const client = await createServerSupabaseClient(true);
  if (!config || !client) redirect("/login?status=unavailable");
  let url: string | undefined;
  try {
    const { data, error } = await client.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: `${config.origin}/auth/callback` },
    });
    if (!error) url = data.url;
  } catch {
    /* Mensagem fixa, sem detalhes do provedor. */
  }
  redirect(url ?? "/login?status=unavailable");
}

export async function signOut() {
  const client = await createServerSupabaseClient(true);
  if (client) await client.auth.signOut({ scope: "local" });
  redirect("/login?status=signed-out");
}
