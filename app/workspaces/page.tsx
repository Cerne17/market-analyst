import Link from "next/link";
import { ArrowUpRight, LockKeyhole, UsersRound } from "lucide-react";
import { requireAccess } from "@/lib/auth/access";
import { signOut } from "@/app/login/actions";
import { SubmitButton } from "@/components/auth/submit-button";

export const dynamic = "force-dynamic";

export default async function WorkspacesPage() {
  const { client, user, memberships } = await requireAccess();
  const { data: workspaces, error } = await client
    .from("workspaces")
    .select("id,name,slug,is_personal")
    .order("created_at");
  if (error) throw new Error("Não foi possível abrir seus workspaces.");
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">SEU ESPAÇO, SUAS EVIDÊNCIAS</p>
          <h1>
            Escolha seu workspace<span className="text-primary">.</span>
          </h1>
          <p className="page-description">Você entrou com {user.email}.</p>
        </div>
        <form action={signOut}>
          <SubmitButton variant="outline" pendingLabel="Saindo…">
            Sair
          </SubmitButton>
        </form>
      </div>
      <div className="workspace-cards">
        {workspaces?.map((workspace) => (
          <Link
            href={`/w/${workspace.slug}`}
            key={workspace.id}
            className="workspace-card"
          >
            {workspace.is_personal ? (
              <LockKeyhole size={26} aria-hidden="true" />
            ) : (
              <UsersRound size={26} aria-hidden="true" />
            )}
            <span className="role-chip">
              {memberships.find((m) => m.workspace_id === workspace.id)
                ?.role === "owner"
                ? "Owner"
                : memberships.find((m) => m.workspace_id === workspace.id)
                      ?.role === "editor"
                  ? "Editor"
                  : "Leitura"}
            </span>
            <h2>{workspace.name}</h2>
            <p>
              {workspace.is_personal
                ? "Seu espaço pessoal. Somente você tem acesso."
                : "Projetos e validações compartilhados com o time."}
            </p>
            <span className="text-link">
              Abrir workspace <ArrowUpRight size={15} aria-hidden="true" />
            </span>
          </Link>
        ))}
      </div>
      {!workspaces?.length && (
        <div className="setup-notice" role="status">
          Nenhum workspace está disponível para sua conta. Peça ao owner para
          conferir seu convite.
        </div>
      )}
    </>
  );
}
