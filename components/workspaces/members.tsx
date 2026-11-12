"use client";
import { useActionState } from "react";
import {
  inviteMember,
  revokeInvite,
  type MemberActionState,
} from "@/app/w/[workspace]/actions";
import { SubmitButton } from "@/components/auth/submit-button";
import type { Invite } from "@/lib/supabase/types";

function RevokeForm({
  workspaceId,
  email,
}: {
  workspaceId: string;
  email: string;
}) {
  const [state, action] = useActionState<MemberActionState, FormData>(
    revokeInvite,
    {
      status: "idle",
      message: "",
    },
  );
  return (
    <form action={action} className="revoke-form">
      <input type="hidden" name="workspaceId" value={workspaceId} />
      <input type="hidden" name="email" value={email} />
      <SubmitButton variant="outline" pendingLabel="Revogando…">
        Revogar
      </SubmitButton>
      {state.message && (
        <p
          role={state.status === "error" ? "alert" : "status"}
          className="form-message"
        >
          {state.message}
        </p>
      )}
    </form>
  );
}

export function Members({
  workspaceId,
  invites,
}: {
  workspaceId: string;
  invites: Pick<Invite, "email" | "role">[];
}) {
  const [state, action] = useActionState<MemberActionState, FormData>(
    inviteMember,
    {
      status: "idle",
      message: "",
    },
  );
  return (
    <section className="members-panel">
      <h2>Convites do time</h2>
      <p className="page-description">
        Escolha quem participa e o que cada pessoa pode fazer.
      </p>
      <form action={action} className="invite-form">
        <input type="hidden" name="workspaceId" value={workspaceId} />
        <div>
          <label htmlFor="invite-email">E-mail</label>
          <input
            id="invite-email"
            name="email"
            type="email"
            autoComplete="off"
            required
            maxLength={254}
            placeholder="pessoa@exemplo.com"
          />
        </div>
        <div>
          <label htmlFor="invite-role">Permissão</label>
          <select id="invite-role" name="role" defaultValue="viewer">
            <option value="viewer">Leitura</option>
            <option value="editor">Editor</option>
          </select>
        </div>
        <SubmitButton pendingLabel="Salvando…">Registrar convite</SubmitButton>
      </form>
      {state.message && (
        <p
          role={state.status === "error" ? "alert" : "status"}
          className={state.status === "error" ? "form-error" : "form-message"}
        >
          {state.message}
        </p>
      )}
      <ul className="invite-list">
        {invites.map((invite) => (
          <li key={invite.email}>
            <div>
              <strong>{invite.email}</strong>
              <span>
                {invite.role === "owner"
                  ? "Owner"
                  : invite.role === "editor"
                    ? "Editor"
                    : "Leitura"}
              </span>
            </div>
            {invite.role !== "owner" && (
              <RevokeForm workspaceId={workspaceId} email={invite.email} />
            )}
          </li>
        ))}
      </ul>
      <p className="muted-caption">
        O convite libera o acesso pelo e-mail informado. Use o formulário
        novamente para alterar a permissão de Editor ou Leitura.
      </p>
    </section>
  );
}
