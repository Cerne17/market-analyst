import { z } from "zod";

export const inviteSchema = z.object({
  workspaceId: z.uuid(),
  email: z.string().trim().toLowerCase().max(254).pipe(z.email()),
  role: z.enum(["editor", "viewer"]),
});

export const revokeSchema = inviteSchema.omit({ role: true });
