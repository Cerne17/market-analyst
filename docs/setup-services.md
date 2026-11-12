# Configuração dos serviços

O código de acesso por convite está implementado. O aceite das issues [#2](https://github.com/Cerne17/market-analyst/issues/2) e [#3](https://github.com/Cerne17/market-analyst/issues/3) depende de um Supabase real. O login fica fechado enquanto `SONDA_AUTH_ENABLED` não for `true`.

Use `pnpm setup:check` antes e depois da configuração para identificar os pré-requisitos faltantes. O comando só lê o ambiente e os endpoints do projeto, sem aplicar SQL ou ativar acesso. Não exibe segredos e não substitui os testes com sessões reais abaixo. Para configurar o projeto por uma integração conectada, confirmar primeiro o projeto de destino; a ausência de chaves no arquivo local não comprova ausência de um projeto na conta.

## Preparar o Supabase

1. Criar um projeto dedicado e guardar a senha do banco fora do repositório. Confirmar região/plano com o mantenedor.
2. Aplicar em ordem, usando Supabase CLI ou SQL Editor administrativo:
   - `supabase/migrations/202611120001_foundation.sql`
   - `supabase/migrations/202611120002_invited_access.sql`
   - `supabase/seed.sql`
3. Conferir RLS nas 18 tabelas. **Não expor o schema `private`** pelo PostgREST.
4. Configurar `.env.local` com URL/chave pública e `SUPABASE_SERVICE_ROLE_KEY` (legacy `service_role` administrativa). O e-mail do owner informado pelo mantenedor já foi salvo localmente. Não sobrescrever o arquivo existente nem versionar seus valores.
5. Executar o bootstrap local:

   ```bash
   node --env-file=.env.local scripts/bootstrap-owner.mjs
   ```

   O script prepara os dois convites do owner sem criar usuário. Repetir com o mesmo e-mail é permitido; trocar o owner é recusado. Perfil e memberships são ativados após confirmação do e-mail no login.

## Configurar o acesso

1. No painel Auth Hooks, selecionar **Before User Created** e a função Postgres `public.before_user_created`. A migration restringe sua execução. Testar um e-mail fora da allowlist antes de liberar o acesso.
2. Em URL Configuration, definir Site URL e permitir os callbacks reais de cada ambiente:
   - `http://localhost:3000/auth/confirm`
   - `http://localhost:3000/auth/callback`
   - equivalentes HTTPS de preview/produção aprovados.
3. No template de **Magic Link**, usar:

   ```html
   <a href="{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=email"
     >Entrar no Sonda</a
   >
   ```

   A aplicação define `RedirectTo` como origem canônica mais `/auth/confirm`. Essa rota valida token hash do tipo `email`. Não presumir que o template padrão atende esse contrato. Respeitar os limites de envio do ambiente; produção pode exigir SMTP próprio.

4. Criar GitHub OAuth App e configurar Client ID/Secret no Supabase, usando o callback fornecido pelo painel (normalmente `https://<project-ref>.supabase.co/auth/v1/callback`). Esse endereço é diferente do callback final da aplicação, `/auth/callback`, que troca o código PKCE. O usuário deve usar o e-mail confirmado do convite.
5. Configurar `NEXT_PUBLIC_APP_URL` como origem sem path/query/credenciais, com HTTPS fora de localhost. Definir `SONDA_AUTH_ENABLED=true` somente após os passos acima e reiniciar a aplicação.
6. Validar magic link, GitHub e logout. Link expirado/inválido e `next` externo devem falhar. E-mail não convidado/não confirmado não pode obter memberships nem ler projetos.

## Validar convites e papéis

1. Owner deve ver Do Fundo do Poço e Meus projetos em `/workspaces`.
2. No workspace do time, registrar convite Editor ou Leitura. A operação salva a allowlist; **não envia e-mail automaticamente**. A pessoa solicita seu próprio link ou usa GitHub. O convite do owner é protegido de alteração/revogação pela UI.
3. Editor/viewer veem somente o time. Viewer não escreve, mesmo via API direta. A criação/edição de análises pela UI pertence à fase 1; usar registros de teste controlados para verificar escrita no banco.
4. Revogar convite e repetir leitura com a sessão antiga: o acesso deve cessar. Testar alteração direta de papel/membership, acesso ao workspace pessoal pela URL e escrita em outro projeto.
5. Guardar evidências reais antes de concluir #2/#3. A suíte local testa Postgres e contratos com provider controlado; não comprova integração hospedada.

## Vercel — após autenticação e isolamento

A CLI possui sessão válida; nenhum projeto/deploy foi criado nesta etapa.

1. Confirmar equipe/projeto, importar o repositório com Next.js, Node.js 24 e pnpm fixado.
2. Separar variáveis de preview/produção. Só habilitar Auth em ambientes completamente configurados. O script de bootstrap roda localmente; a aplicação não precisa de service role nesta entrega.
3. Confirmar acesso a `sonda.cerne.pro`, associar domínio e adicionar callbacks reais ao Supabase.
4. Validar HTTPS, e-mail, GitHub, rejeição de não convidados e isolamento no domínio. Registrar URL/evidências antes de concluir [#4](https://github.com/Cerne17/market-analyst/issues/4) e liberar a fase 1.

## Referências

- [SSR](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Before User Created](https://supabase.com/docs/guides/auth/auth-hooks/before-user-created-hook)
- [Passwordless](https://supabase.com/docs/guides/auth/auth-email-passwordless)
- [GitHub OAuth](https://supabase.com/docs/guides/auth/social-login/auth-github)
- [Vercel Next.js](https://vercel.com/docs/frameworks/full-stack/nextjs)
