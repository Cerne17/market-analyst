-- Fundação: aplicar como postgres por migration. Nunca executar pelo cliente.
begin;

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(name) between 1 and 120),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  accent text not null default 'ascensao',
  is_personal boolean not null default false,
  personal_owner_id uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (is_personal or personal_owner_id is null)
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '' check (length(name) <= 120),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.invites (
  email text not null check (email = lower(btrim(email)) and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  role text not null check (role in ('owner', 'editor', 'viewer')),
  invited_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (email, workspace_id)
);

create table public.memberships (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'editor', 'viewer')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);
create index invites_workspace_id_idx on public.invites(workspace_id);
create index memberships_user_id_idx on public.memberships(user_id);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null check (length(name) between 1 and 120),
  mode text not null check (mode in ('sprint', 'venture')),
  sprint_subtype text not null default 'ideia_livre' check (sprint_subtype in ('ideia_livre', 'desafio_corporativo')),
  pitch_at timestamptz,
  share_token text unique,
  share_enabled boolean not null default false,
  created_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index projects_workspace_id_idx on public.projects(workspace_id);

create table public.steps (
  project_id uuid not null references public.projects(id) on delete cascade,
  step smallint not null check (step between 1 and 7),
  data jsonb not null default '{}' check (jsonb_typeof(data) = 'object'),
  status text not null default 'vazio' check (status in ('vazio', 'rascunho', 'ok', 'alerta')),
  updated_by uuid default auth.uid() references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (project_id, step)
);

create table public.assumptions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  key text not null,
  label text not null,
  value numeric not null,
  unit text not null,
  source_type text not null check (source_type in ('manual', 'cnae', 'web', 'ia_nao_verificado')),
  source_url text,
  source_note text,
  accessed_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, key)
);

create table public.scenarios (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  overrides jsonb not null default '{}' check (jsonb_typeof(overrides) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, name)
);

create table public.interviews (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  held_at date not null,
  person_alias text not null,
  segment text not null default '',
  script text not null default '',
  notes text not null default '',
  quotes jsonb not null default '[]' check (jsonb_typeof(quotes) = 'array'),
  commitment_type text not null default 'nenhum' check (commitment_type in ('nenhum', 'tempo', 'reputacao', 'dinheiro')),
  commitment_note text not null default '',
  has_pain boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.pmf_responses (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  segment text not null,
  answer text not null check (answer in ('muito', 'pouco', 'nada', 'nao_usa')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.metrics_monthly (
  project_id uuid not null references public.projects(id) on delete cascade,
  month date not null check (extract(day from month) = 1),
  mrr_start numeric not null default 0 check (mrr_start >= 0),
  new_mrr numeric not null default 0 check (new_mrr >= 0),
  expansion_mrr numeric not null default 0 check (expansion_mrr >= 0),
  churned_mrr numeric not null default 0 check (churned_mrr >= 0),
  contraction_mrr numeric not null default 0 check (contraction_mrr >= 0),
  customers_start int not null default 0 check (customers_start >= 0),
  customers_new int not null default 0 check (customers_new >= 0),
  customers_churned int not null default 0 check (customers_churned >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (project_id, month)
);

create table public.acquisition_spend (
  project_id uuid not null references public.projects(id) on delete cascade,
  month date not null check (extract(day from month) = 1),
  channel text not null,
  spend numeric not null check (spend >= 0),
  new_customers int not null check (new_customers >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (project_id, month, channel)
);

create table public.versions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  snapshot jsonb not null check (jsonb_typeof(snapshot) = 'object'),
  label text,
  created_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.activity (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id),
  step smallint check (step between 1 and 7),
  action text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ai_usage (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id),
  input_tokens int not null check (input_tokens >= 0),
  output_tokens int not null check (output_tokens >= 0),
  kind text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.cnae (
  code text primary key,
  description text not null,
  section text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.municipios (
  code text primary key,
  name text not null,
  uf char(2) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.establishment_counts (
  cnae_code text not null references public.cnae(code),
  uf char(2) not null,
  municipio_code text not null references public.municipios(code),
  porte text not null check (porte in ('MEI', 'ME', 'EPP', 'demais')),
  count int not null check (count >= 0),
  competencia date not null check (extract(day from competencia) = 1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (cnae_code, uf, municipio_code, porte, competencia)
);

-- SECURITY DEFINER: apenas predicados relativos ao usuário verificado da requisição.
-- schema private não deve fazer parte dos schemas expostos pelo PostgREST.
create function private.has_workspace_role(target uuid, allowed_roles text[])
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.memberships m
    join public.workspaces w on w.id = m.workspace_id
    join auth.users u on u.id = m.user_id
    join public.invites i on i.workspace_id = m.workspace_id and i.email = lower(u.email) and i.role = m.role
    where m.workspace_id = target and m.user_id = (select auth.uid())
      and m.role = any(allowed_roles) and u.email_confirmed_at is not null
      and (not w.is_personal or w.personal_owner_id = u.id)
  );
$$;

create function private.has_project_role(target uuid, allowed_roles text[])
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.projects p where p.id = target and private.has_workspace_role(p.workspace_id, allowed_roles));
$$;

create function private.shares_workspace(target_user uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.memberships m where m.user_id = target_user
    and private.has_workspace_role(m.workspace_id, array['owner','editor','viewer']));
$$;

create function private.touch_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at := clock_timestamp();
  if tg_table_name = 'steps' then new.updated_by := auth.uid(); end if;
  return new;
end;
$$;

revoke all on all functions in schema private from public, anon, authenticated;
grant execute on function private.has_workspace_role(uuid, text[]), private.has_project_role(uuid, text[]), private.shares_workspace(uuid) to authenticated;

-- Começar sem grants implícitos: inclusive projetos compartilhados continuam privados.
grant usage on schema public to authenticated, service_role;

do $$
declare table_name text;
begin
  foreach table_name in array array['workspaces','profiles','invites','memberships','projects','steps','assumptions','scenarios','interviews','pmf_responses','metrics_monthly','acquisition_spend','versions','activity','ai_usage','cnae','municipios','establishment_counts'] loop
    execute format('revoke all on public.%I from public, anon, authenticated', table_name);
    execute format('grant select on public.%I to authenticated', table_name);
    execute format('grant all on public.%I to service_role', table_name);
    execute format('alter table public.%I enable row level security', table_name);
    execute format('create trigger touch_updated_at before update on public.%I for each row execute function private.touch_updated_at()', table_name);
  end loop;

  foreach table_name in array array['steps','assumptions','scenarios','interviews','pmf_responses','metrics_monthly','acquisition_spend','versions','activity','ai_usage'] loop
    execute format('create policy member_read on public.%I for select to authenticated using (private.has_project_role(project_id, array[''owner'',''editor'',''viewer'']))', table_name);
    if table_name not in ('steps','metrics_monthly','acquisition_spend') then
      execute format('create index %I on public.%I(project_id)', table_name || '_project_id_idx', table_name);
    end if;
  end loop;

  foreach table_name in array array['steps','assumptions','scenarios','interviews','pmf_responses','metrics_monthly','acquisition_spend'] loop
    execute format('grant insert, update, delete on public.%I to authenticated', table_name);
    execute format('create policy editor_insert on public.%I for insert to authenticated with check (private.has_project_role(project_id, array[''owner'',''editor'']))', table_name);
    execute format('create policy editor_update on public.%I for update to authenticated using (private.has_project_role(project_id, array[''owner'',''editor''])) with check (private.has_project_role(project_id, array[''owner'',''editor'']))', table_name);
    execute format('create policy editor_delete on public.%I for delete to authenticated using (private.has_project_role(project_id, array[''owner'',''editor'']))', table_name);
  end loop;

  foreach table_name in array array['cnae','municipios','establishment_counts'] loop
    execute format('create policy authenticated_reference_read on public.%I for select to authenticated using ((select auth.uid()) is not null)', table_name);
  end loop;
end;
$$;

create trigger set_step_author before insert on public.steps for each row execute function private.touch_updated_at();

create policy member_read on public.workspaces for select to authenticated using (private.has_workspace_role(id, array['owner','editor','viewer']));
create policy member_read on public.memberships for select to authenticated using (private.has_workspace_role(workspace_id, array['owner','editor','viewer']));
create policy owner_read on public.invites for select to authenticated using (private.has_workspace_role(workspace_id, array['owner']));
create policy colleague_read on public.profiles for select to authenticated using (id = (select auth.uid()) or private.shares_workspace(id));
grant update (name, avatar_url) on public.profiles to authenticated;
create policy own_profile_update on public.profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

grant insert, delete on public.projects to authenticated;
grant update (name, mode, sprint_subtype, pitch_at, share_token, share_enabled) on public.projects to authenticated;
create policy member_read on public.projects for select to authenticated using (private.has_workspace_role(workspace_id, array['owner','editor','viewer']));
create policy editor_insert on public.projects for insert to authenticated with check (created_by = (select auth.uid()) and private.has_workspace_role(workspace_id, array['owner','editor']));
create policy editor_update on public.projects for update to authenticated using (private.has_workspace_role(workspace_id, array['owner','editor'])) with check (private.has_workspace_role(workspace_id, array['owner','editor']));
create policy editor_delete on public.projects for delete to authenticated using (private.has_workspace_role(workspace_id, array['owner','editor']));

grant insert on public.versions to authenticated;
create policy editor_insert on public.versions for insert to authenticated with check (created_by = (select auth.uid()) and private.has_project_role(project_id, array['owner','editor']));

commit;
