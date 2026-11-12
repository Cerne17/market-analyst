-- Repetível: não troca identidades, não cria usuários e não grava e-mails reais.
insert into public.workspaces(id, name, slug, accent, is_personal) values
  ('10000000-0000-4000-8000-000000000001', 'Do Fundo do Poço', 'do-fundo-do-poco', 'ascensao', false),
  ('10000000-0000-4000-8000-000000000002', 'Meus projetos', 'meus-projetos', 'ascensao', true)
on conflict (slug) do nothing;
