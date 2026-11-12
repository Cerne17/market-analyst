import Link from "next/link";
import { ArrowLeft, KeyRound, LockKeyhole } from "lucide-react";
import { readPublicSupabaseConfig } from "@/lib/config/public-env";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const configured = !!readPublicSupabaseConfig(process.env);
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
        <div className="setup-notice" role="status">
          <LockKeyhole size={20} aria-hidden="true" />
          <div>
            <h2>
              {configured
                ? "Integração de acesso em preparação"
                : "A configuração do acesso ainda não foi concluída"}
            </h2>
            <p>
              {configured
                ? "A configuração foi detectada. O login será liberado após a validação da conexão, dos convites e dos provedores de autenticação."
                : "Estamos preparando a conexão segura com os workspaces. Você já pode explorar as sete etapas pela trilha."}
            </p>
          </div>
        </div>
        <p className="muted-caption">
          Login com link por e-mail e GitHub estará disponível após a
          configuração.
        </p>
        <Link className="text-link" href="/trilha/1">
          Conhecer a trilha{" "}
          <ArrowLeft className="rotate-180" size={15} aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}
