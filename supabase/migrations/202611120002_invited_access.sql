begin;

-- A ativação do hook no painel é obrigatória; RLS continua fechada se for esquecida.
create function public.before_user_created(event jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
begin
  if exists (select 1 from public.invites where email = lower(btrim(event->'user'->>'email'))) then
    return '{}'::jsonb;
  end if;
  return jsonb_build_object('error', jsonb_build_object('http_code', 403, 'message', 'O acesso ao Sonda requer um convite.'));
end;
$$;
revoke all on function public.before_user_created(jsonb) from public, anon, authenticated;
grant usage on schema public to supabase_auth_admin;
grant execute on function public.before_user_created(jsonb) to supabase_auth_admin;

create function public.accept_invites()
returns void language plpgsql security definer set search_path = '' as $$
declare current_user_id uuid := auth.uid(); verified_email text; invitation record;
begin
  select lower(email) into verified_email from auth.users where id = current_user_id and email_confirmed_at is not null;
  if verified_email is null or not exists (select 1 from public.invites where email = verified_email) then
    raise exception 'Acesso não autorizado.' using errcode = '42501';
  end if;

  insert into public.profiles(id, name) values (current_user_id, split_part(verified_email, '@', 1)) on conflict (id) do nothing;
  for invitation in select i.* from public.invites i where i.email = verified_email for update loop
    if exists (select 1 from public.workspaces where id = invitation.workspace_id and is_personal) then
      if invitation.role <> 'owner' then raise exception 'Workspace pessoal não aceita convidados.' using errcode = '42501'; end if;
      update public.workspaces set personal_owner_id = current_user_id where id = invitation.workspace_id and (personal_owner_id is null or personal_owner_id = current_user_id);
      if not found then raise exception 'Workspace pessoal já possui owner.' using errcode = '42501'; end if;
    end if;
    insert into public.memberships(workspace_id, user_id, role) values (invitation.workspace_id, current_user_id, invitation.role)
      on conflict (workspace_id, user_id) do update set role = excluded.role;
  end loop;
end;
$$;
revoke all on function public.accept_invites() from public, anon;
grant execute on function public.accept_invites() to authenticated;

create function public.invite_member(target_workspace uuid, target_email text, target_role text)
returns void language plpgsql security definer set search_path = '' as $$
declare normalized_email text := lower(btrim(target_email));
begin
  if not private.has_workspace_role(target_workspace, array['owner']) then
    raise exception 'Somente o owner pode convidar.' using errcode = '42501';
  end if;
  if exists (select 1 from public.workspaces where id = target_workspace and is_personal) then
    raise exception 'Workspace pessoal não aceita convidados.' using errcode = '42501';
  end if;
  if target_role is null or target_role not in ('editor','viewer') or normalized_email is null or normalized_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
    raise exception 'E-mail ou papel inválido.' using errcode = '22023';
  end if;
  -- Serializar convites/revogações para a mesma identidade e workspace.
  perform pg_advisory_xact_lock(hashtextextended(target_workspace::text || normalized_email, 0));
  if exists (select 1 from public.invites where workspace_id = target_workspace and email = normalized_email and role = 'owner') then
    raise exception 'O owner não pode ser alterado por convite.' using errcode = '42501';
  end if;
  insert into public.invites(email, workspace_id, role, invited_by) values (normalized_email, target_workspace, target_role, auth.uid())
    on conflict (email, workspace_id) do update set role = excluded.role, invited_by = excluded.invited_by;
  update public.memberships m set role = target_role from auth.users u
    where m.user_id = u.id and m.workspace_id = target_workspace and lower(u.email) = normalized_email;
end;
$$;
revoke all on function public.invite_member(uuid,text,text) from public, anon;
grant execute on function public.invite_member(uuid,text,text) to authenticated;

create function public.revoke_invite(target_workspace uuid, target_email text)
returns void language plpgsql security definer set search_path = '' as $$
declare normalized_email text := lower(btrim(target_email));
begin
  if not private.has_workspace_role(target_workspace, array['owner']) then
    raise exception 'Somente o owner pode revogar.' using errcode = '42501';
  end if;
  perform pg_advisory_xact_lock(hashtextextended(target_workspace::text || coalesce(normalized_email,''), 0));
  if exists (select 1 from public.invites where workspace_id = target_workspace and email = normalized_email and role = 'owner') then
    raise exception 'O convite do owner não pode ser revogado.' using errcode = '42501';
  end if;
  delete from public.invites where workspace_id = target_workspace and email = normalized_email;
  delete from public.memberships m using auth.users u where m.user_id = u.id and m.workspace_id = target_workspace and lower(u.email) = normalized_email;
end;
$$;
revoke all on function public.revoke_invite(uuid,text) from public, anon;
grant execute on function public.revoke_invite(uuid,text) to authenticated;

-- RPC administrativa: não concede owner ao primeiro login e nunca é chamada pela UI.
create function public.bootstrap_owner(owner_email text)
returns void language plpgsql security definer set search_path = '' as $$
declare normalized_email text := lower(btrim(owner_email)); target_workspace uuid;
begin
  if normalized_email is null or normalized_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
    raise exception 'Informe o e-mail do owner.' using errcode = '22023';
  end if;
  perform pg_advisory_xact_lock(2026111200);
  if (select count(*) from public.workspaces where slug in ('do-fundo-do-poco','meus-projetos')) <> 2 then
    raise exception 'Execute o seed dos workspaces antes do bootstrap.';
  end if;
  if exists (select 1 from public.invites i join public.workspaces w on w.id = i.workspace_id
    where w.slug in ('do-fundo-do-poco','meus-projetos') and i.role = 'owner' and i.email <> normalized_email) then
    raise exception 'O bootstrap já pertence a outro owner.' using errcode = '42501';
  end if;
  for target_workspace in select id from public.workspaces where slug in ('do-fundo-do-poco','meus-projetos') loop
    insert into public.invites(email,workspace_id,role) values (normalized_email,target_workspace,'owner')
      on conflict (email,workspace_id) do update set role = 'owner';
  end loop;
end;
$$;
revoke all on function public.bootstrap_owner(text) from public, anon, authenticated;
grant execute on function public.bootstrap_owner(text) to service_role;

commit;
