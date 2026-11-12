import { NextResponse, type NextRequest } from "next/server";
import { getAuthConfig, safeNext } from "@/lib/auth/config";
import { completeSignIn, loginRedirect } from "@/lib/auth/callback";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const config = getAuthConfig(process.env);
  if (!config)
    return NextResponse.json(
      { error: "Acesso ainda não configurado." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type");
  const destination = safeNext(request.nextUrl.searchParams.get("next"));
  if (!tokenHash || type !== "email" || !destination)
    return loginRedirect(config.origin, "invalid-link");
  const client = await createServerSupabaseClient(true);
  if (!client) return loginRedirect(config.origin, "unavailable");
  try {
    const { error } = await client.auth.verifyOtp({
      token_hash: tokenHash,
      type: "email",
    });
    return error
      ? loginRedirect(config.origin, "invalid-link")
      : await completeSignIn(client, destination);
  } catch {
    return loginRedirect(config.origin, "unavailable");
  }
}
