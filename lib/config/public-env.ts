import { z } from "zod";

const publicSupabaseSchema = z.object({
  url: z.url().pipe(
    z.string().refine((value) => {
      const url = new URL(value);
      return (
        url.protocol === "https:" ||
        (url.protocol === "http:" &&
          ["localhost", "127.0.0.1"].includes(url.hostname))
      );
    }, "Use HTTPS fora do ambiente local."),
  ),
  anonKey: z.string().trim().min(1),
});

// Apenas configuração pública. Nunca repassar process.env inteiro para o cliente.
export function readPublicSupabaseConfig(
  env: Record<string, string | undefined>,
) {
  const result = publicSupabaseSchema.safeParse({
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
  return result.success ? result.data : null;
}
