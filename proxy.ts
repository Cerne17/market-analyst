import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getAuthConfig } from "@/lib/auth/config";
import type { Database } from "@/lib/supabase/types";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  response.headers.set("Cache-Control", "private, no-store");
  const config = getAuthConfig(process.env);
  if (!config) return response;
  const client = createServerClient<Database>(config.url, config.anonKey, {
    cookieOptions: {
      secure: config.origin.startsWith("https://"),
      sameSite: "lax",
      path: "/",
    },
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(values) {
        for (const { name, value } of values) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of values)
          response.cookies.set(name, value, options);
        response.headers.set("Cache-Control", "private, no-store");
      },
    },
  });
  // Apenas renova/verifica. Autorização é refeita nas páginas, ações e políticas RLS.
  try {
    await client.auth.getUser();
  } catch {
    /* A página mostra indisponibilidade sem confiar no cookie. */
  }
  return response;
}

export const config = {
  matcher: ["/login", "/workspaces", "/w/:path*", "/auth/:path*"],
};
