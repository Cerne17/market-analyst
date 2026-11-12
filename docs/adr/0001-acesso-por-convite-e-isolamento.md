# 0001 — Acesso por convite e isolamento de workspaces

Data: 2026-11-12

Status: aceita para implementação; validação no Supabase hospedado pendente.

## Contexto

O SPEC prevê dois workspaces e convites com papel, mas define o e-mail sozinho como chave primária de `invites`. Também pede UUID universal enquanto descreve tabelas com chaves naturais e compostas. O projeto precisa impedir cadastro aberto, autoatribuição de owner e leitura entre workspaces.

## Decisão

- `invites` usa chave `(email, workspace_id)`, e-mail normalizado e papel. Um e-mail pode ser convidado para ambos os workspaces. A linha permanece como allowlist depois do aceite.
- Tabelas com chave natural/composta preservam essa chave, sem UUID redundante. Todas as 18 tabelas têm `created_at`, `updated_at` e RLS. `acquisition_spend` usa `(project_id, month, channel)`.
- `workspaces` ganha `is_personal` e `personal_owner_id`. O workspace pessoal admite somente o owner explícito. Seu nome/slug não é usado sozinho como autorização.
- Seed cria os dois workspaces de forma repetível, sem usuários nem e-mails reais. `bootstrap_owner` só pode ser executado administrativamente; prepara convites de owner, sem criar sessão nem presumir o primeiro login. Repetir com outro e-mail é recusado.
- O hook `before_user_created` verifica a allowlist antes da criação de conta e precisa ser ativado no Supabase. Após verificar o e-mail, o callback chama `accept_invites` para criar perfil e memberships. Cookies recebidos não bastam: `getUser` verifica o usuário no serviço de Auth.
- O owner gerencia convites de Editor/Leitura no workspace do time por RPCs restritas. Promoção/transferência de owner não entra nesta entrega. Cliente não escreve diretamente em memberships/convites. Revogar convite remove memberships; políticas também conferem a allowlist e o e-mail atual confirmado, cortando acesso na próxima consulta sem esperar o JWT expirar.
- Funções auxiliares ficam em schema `private`, fora dos schemas expostos pelo PostgREST, com `search_path` vazio e execução restrita. Retornam permissões relativas ao usuário atual. Papéis não vêm de metadados editáveis do usuário.
- Escrita em projetos e filhos é limitada a owner/editor. Projeto não pode ser movido para outro workspace por update direto; autor de projeto/versão/etapa não pode ser falsificado. Logs de atividade/uso só recebem escrita privilegiada; versões são imutáveis para clientes. Referências CNAE são somente leitura para usuários autenticados.
- Clientes SSR usam somente chave pública. Service role aparece apenas no script administrativo local de bootstrap. Compartilhamento público não é implementado aqui; anônimos continuam sem leitura SQL, inclusive quando `share_enabled` está ligado.
- `NEXT_PUBLIC_APP_URL` define uma origem canônica validada. Destinos pós-login se limitam a `/workspaces` e `/w/<slug>`. Header Host e entradas `next` não escolhem origens externas.
- `SONDA_AUTH_ENABLED=false` mantém acesso fechado até completar migrations, seed, bootstrap, hook, template de e-mail e OAuth. O template de magic link usa `RedirectTo` apontando a `/auth/confirm`; GitHub usa `/auth/callback` com PKCE.

## Alternativas consideradas

- Chave apenas por e-mail: não representa acesso independente aos dois workspaces.
- Provisionar owner no primeiro login: abre uma disputa de privilégio sem identificar o mantenedor.
- Autorizar apenas na interface ou em claims de papel: permite bypass via API ou preserva papéis revogados até expiração do token.
- Service role nas ações de convite: acrescenta privilégios desnecessários; RPCs validam o owner usando a sessão e o banco.

## Consequências

O e-mail do owner fica no ambiente local, fora do Git. Alteração de identidade do owner exige procedimento administrativo específico, ainda fora de escopo. Sem o hook ativado, RLS impede acesso aos dados, mas não impede o Auth de criar uma conta sem convite.

`@electric-sql/pglite` é exclusivo de desenvolvimento e executa migrations/testes de políticas Postgres sem Docker. A suíte fornece o contrato `auth.users`/`auth.uid()` e roles do Supabase. Não substitui verificação de PostgREST, entrega de e-mails, hook configurado ou OAuth no Supabase real.

## Referências

- SPEC §§2 e 5; issues #2 e #3.
- [Auth hooks](https://supabase.com/docs/guides/auth/auth-hooks/before-user-created-hook).
- [Supabase SSR](https://supabase.com/docs/guides/auth/server-side/nextjs).
- [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security).
- [PGlite](https://pglite.dev/docs/).
