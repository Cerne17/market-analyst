import Link from "next/link";
import { ArrowLeft, KeyRound, LockKeyhole } from "lucide-react";
import { getAuthConfig, loginMessages } from "@/lib/auth/config";
import { LoginForm } from "@/components/auth/login-form";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const configured = !!getAuthConfig(process.env);
  const { status } = await searchParams;
  const client = await createServerSupabaseClient();
  if (client) {
    const {
      data: { user },
    } = await client.auth.getUser();
    if (user) {
      const { data: memberships } = await client
        .from("memberships")
        .select("workspace_id")
        .eq("user_id", user.id)
        .limit(1);
      if (memberships?.length) redirect("/workspaces");
    }
  }
  return (
    <div className="reading-column">
      <Link href="/" className="text-link">
        <ArrowLeft size={15} aria-hidden="true" /> Visão geral
      </Link>
      <section className="access-card">
        <span className="step-hero-icon">
          <KeyRound size={30} aria-hidden="true" />
        </span>
        <p className="eyebrow">SEU ESPAÇO, SEU TIME</p>
        <h1>
          Acesso por convite<span className="text-primary">.</span>
        </h1>
        <p>
          O Sonda é um espaço privado. Somente e-mails convidados poderão
          acessar os projetos.
        </p>
        {!configured && (
          <div className="setup-notice" role="status">
            <LockKeyhole size={20} aria-hidden="true" />
            <div>
              <h2>A configuração do acesso ainda não foi concluída</h2>
              <p>
                Estamos preparando a conexão segura com os workspaces. Você já
                pode explorar as sete etapas pela trilha.
              </p>
            </div>
          </div>
        )}
        {status && Object.hasOwn(loginMessages, status) && (
          <p className="form-message" role="status">
            {loginMessages[status]}
          </p>
        )}
        <LoginForm enabled={configured} />
        <Link className="text-link" href="/trilha/1">
          Conhecer a trilha{" "}
          <ArrowLeft className="rotate-180" size={15} aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}
