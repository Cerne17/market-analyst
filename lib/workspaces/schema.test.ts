import { describe, expect, it } from "vitest";
import { inviteSchema, revokeSchema } from "./schema";

describe("validação dos convites no servidor", () => {
  const valid = {
    workspaceId: "10000000-0000-4000-8000-000000000001",
    email: " Pessoa@Example.Test ",
    role: "viewer",
  };
  it("normaliza identidade e rejeita papel owner e workspace arbitrário", () => {
    expect(inviteSchema.parse(valid).email).toBe("pessoa@example.test");
    for (const change of [
      { role: "owner" },
      { role: "admin" },
      { workspaceId: "../pessoal" },
      { email: "inválido" },
    ])
      expect(inviteSchema.safeParse({ ...valid, ...change }).success).toBe(
        false,
      );
  });
  it("revogação exige workspace e e-mail, sem aceitar campos ausentes", () => {
    expect(revokeSchema.safeParse(valid).success).toBe(true);
    expect(
      revokeSchema.safeParse({ workspaceId: valid.workspaceId }).success,
    ).toBe(false);
  });
});
