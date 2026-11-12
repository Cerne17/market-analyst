import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileStack, LockKeyhole } from "lucide-react";
import { requireAccess } from "@/lib/auth/access";
import { Members } from "@/components/workspaces/members";

export const dynamic = "force-dynamic";

export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ workspace: string }>;
}) {
  const { workspace: slug } = await params;
  const { client, memberships } = await requireAccess();
  const { data: workspace, error } = await client
    .from("workspaces")
    .select("id,name,slug,is_personal")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error("Não foi possível abrir o workspace.");
  if (!workspace) notFound();
  const membership = memberships.find((m) => m.workspace_id === workspace.id);
  if (!membership) notFound();
  const { data: projects, error: projectsError } = await client
    .from("projects")
    .select("id,name,mode,updated_at")
    .eq("workspace_id", workspace.id)
    .order("updated_at", { ascending: false });
  if (projectsError) throw new Error("Não foi possível abrir os projetos.");
  const canInvite = membership.role === "owner" && !workspace.is_personal;
  const { data: invites, error: invitesError } = canInvite
    ? await client
        .from("invites")
        .select("email,role")
        .eq("workspace_id", workspace.id)
        .order("created_at")
    : { data: [], error: null };
  if (invitesError) throw new Error("Não foi possível abrir os convites.");
  return (
    <>
      <Link className="text-link" href="/workspaces">
        <ArrowLeft size={15} aria-hidden="true" /> Todos os workspaces
      </Link>
      <div className="page-heading workspace-heading">
        <div>
          <p className="eyebrow">
            {workspace.is_personal ? "ESPAÇO PESSOAL" : "ESPAÇO DO TIME"}
          </p>
          <h1>
            {workspace.name}
            <span className="text-primary">.</span>
          </h1>
          <p className="page-description">
            {membership.role === "viewer"
              ? "Seu acesso é de leitura. Você pode consultar os projetos deste workspace."
              : "Seu espaço está pronto. A criação e edição de análises chegam na próxima fase."}
          </p>
        </div>
        <span className="phase-tag">
          <LockKeyhole size={13} aria-hidden="true" />
          {membership.role === "owner"
            ? "Owner"
            : membership.role === "editor"
              ? "Editor"
              : "Leitura"}
        </span>
      </div>
      <section className="projects-panel">
        <div className="section-title">
          <h2>Projetos</h2>
          <span className="subtle-label">
            {projects?.length ?? 0} NO WORKSPACE
          </span>
        </div>
        {projects?.length ? (
          <ul className="project-list">
            {projects.map((project) => (
              <li key={project.id}>
                <FileStack size={20} aria-hidden="true" />
                <strong>{project.name}</strong>
                <span className="role-chip">
                  {project.mode === "sprint" ? "Sprint" : "Venture"}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-projects">
            <span className="empty-icon">
              <FileStack size={28} aria-hidden="true" />
            </span>
            <h3>Nenhuma análise por aqui ainda.</h3>
            <p>
              O acesso ao workspace está configurado.
              <br />A criação de projetos será entregue na próxima fase.
            </p>
            <Link className="text-link" href="/trilha/1">
              Enquanto isso, conheça a trilha
            </Link>
          </div>
        )}
      </section>
      {canInvite && (
        <Members workspaceId={workspace.id} invites={invites ?? []} />
      )}
    </>
  );
}
