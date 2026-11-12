import "server-only";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function requireAccess() {
  const client = await createServerSupabaseClient();
  if (!client) redirect("/login");
  const {
    data: { user },
    error,
  } = await client.auth.getUser();
  if (error || !user) redirect("/login");
  const { data: memberships, error: accessError } = await client
    .from("memberships")
    .select("workspace_id,role")
    .eq("user_id", user.id);
  if (accessError) throw new Error("Não foi possível verificar seu acesso.");
  if (!memberships?.length) redirect("/login?status=not-invited");
  return { client, user, memberships };
}
