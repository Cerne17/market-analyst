"use server";

import { revalidatePath } from "next/cache";
import { requireAccess } from "@/lib/auth/access";
import { inviteSchema, revokeSchema } from "@/lib/workspaces/schema";

export type MemberActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function inviteMember(
  _previous: MemberActionState,
  form: FormData,
): Promise<MemberActionState> {
  const parsed = inviteSchema.safeParse({
    workspaceId: form.get("workspaceId"),
    email: form.get("email"),
    role: form.get("role"),
  });
  if (!parsed.success)
    return {
      status: "error",
      message: "Confira o e-mail e escolha Editor ou Leitura.",
    };
  const { client } = await requireAccess();
  const { error } = await client.rpc("invite_member", {
    target_workspace: parsed.data.workspaceId,
    target_email: parsed.data.email,
    target_role: parsed.data.role,
  });
  if (error)
    return {
      status: "error",
      message:
        "Não foi possível salvar o convite. Confira suas permissões e o workspace.",
    };
  revalidatePath("/w", "layout");
  return {
    status: "success",
    message:
      "Convite registrado. A pessoa já pode entrar com esse e-mail. Nenhum e-mail foi enviado automaticamente.",
  };
}

export async function revokeInvite(
  _previous: MemberActionState,
  form: FormData,
): Promise<MemberActionState> {
  const parsed = revokeSchema.safeParse({
    workspaceId: form.get("workspaceId"),
    email: form.get("email"),
  });
  if (!parsed.success)
    return {
      status: "error",
      message: "Não foi possível identificar o convite.",
    };
  const { client } = await requireAccess();
  const { error } = await client.rpc("revoke_invite", {
    target_workspace: parsed.data.workspaceId,
    target_email: parsed.data.email,
  });
  if (error)
    return {
      status: "error",
      message: "Não foi possível revogar. O convite do owner é protegido.",
    };
  revalidatePath("/w", "layout");
  return {
    status: "success",
    message: "Convite revogado e acesso ao workspace removido.",
  };
}
