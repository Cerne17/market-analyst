import { PGlite } from "@electric-sql/pglite";
import { readFile, readdir } from "node:fs/promises";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";

const owner = "20000000-0000-4000-8000-000000000001";
const editor = "20000000-0000-4000-8000-000000000002";
const viewer = "20000000-0000-4000-8000-000000000003";
const outsider = "20000000-0000-4000-8000-000000000004";
const unverified = "20000000-0000-4000-8000-000000000005";
const team = "10000000-0000-4000-8000-000000000001";
const personal = "10000000-0000-4000-8000-000000000002";
const teamProject = "30000000-0000-4000-8000-000000000001";
const privateProject = "30000000-0000-4000-8000-000000000002";
let db: PGlite;

async function as(user: string, role = "authenticated") {
  await db.exec("reset role");
  await db.query("select set_config('request.jwt.claim.sub', $1, true)", [
    user,
  ]);
  // Papéis são constantes deste teste, nunca entrada da aplicação.
  await db.exec(`set local role ${role}`);
}

async function query<T>(sql: string, params?: unknown[]) {
  await db.exec("savepoint request");
  try {
    const result = await db.query<T>(sql, params);
    await db.exec("release savepoint request");
    return result;
  } catch (error) {
    await db.exec("rollback to savepoint request; release savepoint request");
    throw error;
  }
}

describe("migrations e RLS no Postgres embarcado", () => {
  beforeAll(async () => {
    db = new PGlite();
    // Somente o contrato do Supabase Auth é simulado. As migrations e políticas
    // são executadas sem substituições no motor Postgres, com roles não privilegiadas.
    await db.exec(`
      create role anon;
      create role authenticated;
      create role service_role bypassrls;
      create role supabase_auth_admin;
      create schema auth;
      create table auth.users(id uuid primary key, email text, email_confirmed_at timestamptz);
      create function auth.uid() returns uuid language sql stable as $$
        select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
      $$;
      grant usage on schema auth to authenticated, anon, service_role;
      grant execute on function auth.uid() to authenticated, anon, service_role;
    `);
    for (const file of (await readdir("supabase/migrations"))
      .filter((x) => x.endsWith(".sql"))
      .sort()) {
      await db.exec(await readFile(`supabase/migrations/${file}`, "utf8"));
    }
    await db.exec(await readFile("supabase/seed.sql", "utf8"));
  }, 30_000);

  beforeEach(async () => {
    await db.exec("begin");
    for (const [id, email, verified] of [
      [owner, "owner@example.test", true],
      [editor, "editor@example.test", true],
      [viewer, "viewer@example.test", true],
      [outsider, "outsider@example.test", true],
      [unverified, "unverified@example.test", false],
    ] as const) {
      await db.query("insert into auth.users values ($1, $2, $3)", [
        id,
        email,
        verified ? new Date().toISOString() : null,
      ]);
    }
    await db.query("select public.bootstrap_owner($1)", [
      " Owner@Example.Test ",
    ]);
    await as(owner);
    await db.exec("select public.accept_invites()");
    for (const [email, role] of [
      ["editor@example.test", "editor"],
      ["viewer@example.test", "viewer"],
      ["unverified@example.test", "viewer"],
    ]) {
      await db.query("select public.invite_member($1,$2,$3)", [
        team,
        email,
        role,
      ]);
    }
    for (const user of [editor, viewer]) {
      await as(user);
      await db.exec("select public.accept_invites()");
    }
    await as(owner);
    await db.query(
      "insert into public.projects(id,workspace_id,name,mode,share_enabled,share_token) values ($1,$2,'Time','sprint',true,'token-publico-nao-autoriza-sql'), ($3,$4,'Pessoal','venture',false,null)",
      [teamProject, team, privateProject, personal],
    );
    await db.exec("reset role");
  });

  afterEach(async () => {
    await db.exec("rollback");
  });
  afterAll(async () => {
    await db?.close();
  });

  it("ativa RLS em todas as 18 tabelas do modelo, inclusive P1", async () => {
    const result = await db.query<{ name: string; enabled: boolean }>(
      "select relname as name, relrowsecurity as enabled from pg_class join pg_namespace on pg_namespace.oid=relnamespace where nspname='public' and relkind='r'",
    );
    expect(result.rows).toHaveLength(18);
    expect(result.rows.every((row) => row.enabled)).toBe(true);
  });

  it("seed e bootstrap são repetíveis sem trocar a identidade do owner", async () => {
    await db.exec(await readFile("supabase/seed.sql", "utf8"));
    await query("select public.bootstrap_owner($1)", ["owner@example.test"]);
    await expect(
      query("select public.bootstrap_owner($1)", ["outsider@example.test"]),
    ).rejects.toMatchObject({ code: "42501" });
    expect((await query("select * from public.workspaces")).rows).toHaveLength(
      2,
    );
    expect(
      (await query("select * from public.invites where role='owner'")).rows,
    ).toHaveLength(2);
  });

  it("hook aceita apenas convidados, normaliza e-mail e recusa e-mail ausente", async () => {
    await as("", "supabase_auth_admin");
    expect(
      (
        await query<{ result: object }>(
          "select public.before_user_created($1) as result",
          [{ user: { email: "EDITOR@EXAMPLE.TEST" } }],
        )
      ).rows[0].result,
    ).toEqual({});
    for (const event of [
      { user: { email: "outsider@example.test" } },
      { user: {} },
      {},
    ]) {
      const result = await query<{ result: { error: { http_code: number } } }>(
        "select public.before_user_created($1) as result",
        [event],
      );
      expect(result.rows[0].result.error.http_code).toBe(403);
    }
  });

  it("RPCs administrativas e o hook não são executáveis por clientes", async () => {
    await as(editor);
    await expect(
      query("select public.bootstrap_owner('editor@example.test')"),
    ).rejects.toMatchObject({ code: "42501" });
    await expect(
      query("select public.before_user_created('{}')"),
    ).rejects.toMatchObject({ code: "42501" });
    await as("", "anon");
    await expect(query("select public.accept_invites()")).rejects.toMatchObject(
      { code: "42501" },
    );
  });

  it("owner vê os dois workspaces; editor e viewer veem somente o time", async () => {
    await as(owner);
    expect((await query("select id from public.workspaces")).rows).toHaveLength(
      2,
    );
    for (const user of [editor, viewer]) {
      await as(user);
      expect(
        (await query<{ id: string }>("select id from public.workspaces")).rows,
      ).toEqual([{ id: team }]);
      expect(
        (await query<{ id: string }>("select id from public.projects")).rows,
      ).toEqual([{ id: teamProject }]);
    }
  });

  it("usuário sem convite e e-mail não confirmado não ativam memberships", async () => {
    for (const user of [outsider, unverified]) {
      await as(user);
      await expect(
        query("select public.accept_invites()"),
      ).rejects.toMatchObject({ code: "42501" });
      expect((await query("select * from public.projects")).rows).toHaveLength(
        0,
      );
      expect(
        (await query("select * from public.workspaces")).rows,
      ).toHaveLength(0);
    }
  });

  it("convidados não podem conceder papéis nem criar convites diretamente", async () => {
    await as(editor);
    await expect(
      query("update public.memberships set role='owner' where user_id=$1", [
        editor,
      ]),
    ).rejects.toMatchObject({ code: "42501" });
    await expect(
      query(
        "insert into public.invites(email,workspace_id,role) values ('intruso@example.test',$1,'owner')",
        [team],
      ),
    ).rejects.toMatchObject({ code: "42501" });
    await expect(
      query("select public.invite_member($1,'intruso@example.test','viewer')", [
        team,
      ]),
    ).rejects.toMatchObject({ code: "42501" });
    expect((await query("select * from public.invites")).rows).toHaveLength(0);
  });

  it("owner só convida editor/viewer no workspace de time, sem alterar o owner", async () => {
    await as(owner);
    for (const [workspace, email, role] of [
      [personal, "intruso@example.test", "viewer"],
      [team, "owner@example.test", "viewer"],
    ]) {
      await expect(
        query("select public.invite_member($1,$2,$3)", [
          workspace,
          email,
          role,
        ]),
      ).rejects.toMatchObject({ code: "42501" });
    }
    await expect(
      query("select public.invite_member($1,'intruso@example.test','owner')", [
        team,
      ]),
    ).rejects.toMatchObject({ code: "22023" });
    await expect(
      query("select public.revoke_invite($1,'owner@example.test')", [team]),
    ).rejects.toMatchObject({ code: "42501" });
  });

  it("editor grava no time; viewer não grava e ninguém move projetos para o pessoal", async () => {
    await as(editor);
    expect(
      (
        await query(
          "update public.projects set name='Atualizado' where id=$1 returning id",
          [teamProject],
        )
      ).rows,
    ).toHaveLength(1);
    await expect(
      query(
        "insert into public.projects(workspace_id,name,mode) values ($1,'Intruso','sprint')",
        [personal],
      ),
    ).rejects.toMatchObject({ code: "42501" });
    await expect(
      query("update public.projects set workspace_id=$1 where id=$2", [
        personal,
        teamProject,
      ]),
    ).rejects.toMatchObject({ code: "42501" });
    await as(viewer);
    expect(
      (
        await query(
          "update public.projects set name='Negado' where id=$1 returning id",
          [teamProject],
        )
      ).rows,
    ).toHaveLength(0);
    await expect(
      query(
        "insert into public.projects(workspace_id,name,mode) values ($1,'Intruso','sprint')",
        [team],
      ),
    ).rejects.toMatchObject({ code: "42501" });
  });

  it("todas as tabelas filhas respeitam o projeto e não permitem mover uma etapa", async () => {
    const rows = [
      ["steps", "step,data", "1,'{}'"],
      [
        "assumptions",
        "key,label,value,unit,source_type",
        "'clientes','Clientes',10,'clientes','manual'",
      ],
      ["scenarios", "name", "'Base'"],
      ["interviews", "held_at,person_alias", "'2026-11-12','Pessoa A'"],
      ["pmf_responses", "segment,answer", "'ICP','muito'"],
      ["metrics_monthly", "month", "'2026-11-01'"],
      [
        "acquisition_spend",
        "month,channel,spend,new_customers",
        "'2026-11-01','orgânico',0,0",
      ],
      ["versions", "snapshot,created_by", `'{}','${owner}'`],
      ["activity", "user_id,action", `'${owner}','teste'`],
      [
        "ai_usage",
        "user_id,input_tokens,output_tokens,kind",
        `'${owner}',0,0,'chat'`,
      ],
    ];
    for (const [table, fields, values] of rows) {
      await db.query(
        `insert into public.${table}(project_id,${fields}) values ($1,${values}),($2,${values})`,
        [teamProject, privateProject],
      );
    }
    await as(editor);
    for (const [table] of rows)
      expect(
        (
          await query<{ project_id: string }>(
            `select project_id from public.${table}`,
          )
        ).rows,
      ).toEqual([{ project_id: teamProject }]);
    await expect(
      query("update public.steps set project_id=$1 where project_id=$2", [
        privateProject,
        teamProject,
      ]),
    ).rejects.toMatchObject({ code: "42501" });
    await as(viewer);
    expect(
      (
        await query(
          "update public.steps set data='{\"alterado\":true}' returning step",
        )
      ).rows,
    ).toHaveLength(0);
    await expect(
      query(
        "insert into public.interviews(project_id,held_at,person_alias) values ($1,'2026-11-12','B')",
        [teamProject],
      ),
    ).rejects.toMatchObject({ code: "42501" });
  });

  it("revogação corta leitura imediatamente, mesmo com sessão ainda válida", async () => {
    await as(owner);
    await query("select public.revoke_invite($1,'editor@example.test')", [
      team,
    ]);
    await as(editor);
    expect((await query("select * from public.projects")).rows).toHaveLength(0);
    await expect(query("select public.accept_invites()")).rejects.toMatchObject(
      { code: "42501" },
    );
  });

  it("autor da etapa é derivado da sessão e não do payload", async () => {
    await as(editor);
    expect(
      (
        await query<{ updated_by: string }>(
          "insert into public.steps(project_id,step,updated_by) values ($1,1,$2) returning updated_by",
          [teamProject, owner],
        )
      ).rows,
    ).toEqual([{ updated_by: editor }]);
    expect(
      (
        await query<{ updated_by: string }>(
          'update public.steps set updated_by=$1, data=\'{"dor":"atualizada"}\' where project_id=$2 returning updated_by',
          [owner, teamProject],
        )
      ).rows,
    ).toEqual([{ updated_by: editor }]);
  });

  it("troca de e-mail não herda os privilégios da identidade anterior", async () => {
    await db.query(
      "update auth.users set email='novo@example.test' where id=$1",
      [editor],
    );
    await as(editor);
    expect((await query("select * from public.projects")).rows).toHaveLength(0);
  });

  it("redução de papel vale na próxima consulta, sem renovar JWT", async () => {
    await as(owner);
    await query(
      "select public.invite_member($1,'editor@example.test','viewer')",
      [team],
    );
    await as(editor);
    expect((await query("select id from public.projects")).rows).toHaveLength(
      1,
    );
    expect(
      (await query("update public.projects set name='Negado' returning id"))
        .rows,
    ).toHaveLength(0);
  });

  it("logs não podem ser falsificados e versões são imutáveis para clientes", async () => {
    await as(editor);
    await expect(
      query(
        "insert into public.ai_usage(project_id,user_id,input_tokens,output_tokens,kind) values ($1,$2,1,1,'chat')",
        [teamProject, editor],
      ),
    ).rejects.toMatchObject({ code: "42501" });
    await expect(
      query(
        "insert into public.activity(project_id,user_id,action) values ($1,$2,'falso')",
        [teamProject, editor],
      ),
    ).rejects.toMatchObject({ code: "42501" });
    await expect(
      query("update public.versions set snapshot='{}'"),
    ).rejects.toMatchObject({ code: "42501" });
    await expect(
      query(
        "insert into public.versions(project_id,created_by,snapshot) values ($1,$2,'{}')",
        [teamProject, owner],
      ),
    ).rejects.toMatchObject({ code: "42501" });
  });

  it("anônimo não lê projetos compartilhados nem entrevistas por SQL", async () => {
    await as("", "anon");
    for (const table of ["projects", "interviews", "memberships", "invites"])
      await expect(
        query(`select * from public.${table}`),
      ).rejects.toMatchObject({ code: "42501" });
  });

  it("referências são somente leitura e perfis de outro usuário não são editáveis", async () => {
    await as(viewer);
    await expect(
      query(
        "insert into public.cnae(code,description) values ('0000000','Falso')",
      ),
    ).rejects.toMatchObject({ code: "42501" });
    expect(
      (
        await query(
          "update public.profiles set name='Outro' where id=$1 returning id",
          [owner],
        )
      ).rows,
    ).toHaveLength(0);
    expect(
      (
        await query(
          "update public.profiles set name='Meu nome' where id=$1 returning name",
          [viewer],
        )
      ).rows,
    ).toEqual([{ name: "Meu nome" }]);
  });
});
