// Contrato das tabelas usadas nesta entrega. Regenerar pelo CLI após provisionar o banco.
export type Role = "owner" | "editor" | "viewer";
type Table<Row> = {
  Row: Row;
  Insert: Partial<Row>;
  Update: Partial<Row>;
  Relationships: [];
};

export type Workspace = {
  id: string;
  name: string;
  slug: string;
  accent: string;
  is_personal: boolean;
  personal_owner_id: string | null;
  created_at: string;
  updated_at: string;
};
export type Membership = {
  workspace_id: string;
  user_id: string;
  role: Role;
  created_at: string;
  updated_at: string;
};
export type Invite = {
  email: string;
  workspace_id: string;
  role: Role;
  invited_by: string | null;
  created_at: string;
  updated_at: string;
};
export type Project = {
  id: string;
  workspace_id: string;
  name: string;
  mode: "sprint" | "venture";
  sprint_subtype: "ideia_livre" | "desafio_corporativo";
  pitch_at: string | null;
  share_token: string | null;
  share_enabled: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      workspaces: Table<Workspace>;
      memberships: Table<Membership>;
      invites: Table<Invite>;
      projects: Table<Project>;
    };
    Views: Record<string, never>;
    Functions: {
      accept_invites: { Args: Record<string, never>; Returns: undefined };
      invite_member: {
        Args: {
          target_workspace: string;
          target_email: string;
          target_role: "editor" | "viewer";
        };
        Returns: undefined;
      };
      revoke_invite: {
        Args: { target_workspace: string; target_email: string };
        Returns: undefined;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
