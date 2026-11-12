import "server-only";
import { NextResponse } from "next/server";
import { getAuthConfig } from "./config";
import type { createServerSupabaseClient } from "@/lib/supabase/server";

type Client = NonNullable<
  Awaited<ReturnType<typeof createServerSupabaseClient>>
>;

export function loginRedirect(origin: string, status: string) {
  const response = NextResponse.redirect(
    new URL(`/login?status=${status}`, origin),
  );
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}

export async function completeSignIn(client: Client, destination: string) {
  const config = getAuthConfig(process.env);
  if (!config) throw new Error("Autenticação indisponível.");
  const {
    data: { user },
    error,
  } = await client.auth.getUser();
  const accepted =
    !error && user?.email_confirmed_at
      ? await client.rpc("accept_invites")
      : { error: true };
  if (accepted.error) {
    await client.auth.signOut({ scope: "local" });
    return loginRedirect(config.origin, "not-invited");
  }
  const response = NextResponse.redirect(new URL(destination, config.origin));
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}
