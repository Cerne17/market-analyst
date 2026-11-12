import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getAuthConfig } from "@/lib/auth/config";
import type { Database } from "./types";

export async function createServerSupabaseClient(writable = false) {
  const config = getAuthConfig(process.env);
  if (!config) return null;
  const cookieStore = await cookies();
  return createServerClient<Database>(config.url, config.anonKey, {
    cookieOptions: {
      secure: config.origin.startsWith("https://"),
      sameSite: "lax",
      path: "/",
    },
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(values) {
        // Componentes servidor só leem. O proxy renova sessões nessas requisições.
        if (writable)
          for (const { name, value, options } of values)
            cookieStore.set(name, value, options);
      },
    },
  });
}
