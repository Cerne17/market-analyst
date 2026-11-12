# Configuração dos serviços

O mantenedor informou que os projetos Supabase/Vercel ainda não foram configurados. A CLI Vercel tem sessão válida; isso não significa que o projeto, domínio ou deploy já existam. Os passos abaixo preparam as issues [#2](https://github.com/Cerne17/market-analyst/issues/2) a [#4](https://github.com/Cerne17/market-analyst/issues/4).

## Supabase — próximo desbloqueio

1. Criar ou selecionar organização e projeto Supabase, escolhendo região e plano apropriados. Guardar senha do banco fora do repositório.
2. Informar o e-mail exato do owner e convidados iniciais. O owner será criado por bootstrap explícito; o primeiro login desconhecido não recebe privilégios.
3. Configurar localmente `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` em `.env.local`. Configurar service role somente quando a implementação do servidor a exigir; nunca colar segredos em issues ou no chat.
4. Implementar e validar migrations, RLS e seed antes de abrir login. Resolver as pendências de convites/chaves descritas em [decisions.md](decisions.md).
5. Configurar magic link e aplicativo GitHub OAuth com URLs de callback aprovadas. A implementação definirá a rota de callback antes de preencher os provedores.
6. Validar convidado, não convidado e isolamento de workspaces com usuários distintos. Só então concluir #2/#3.

Não aplicar migrations ou cadastrar provedores presumindo rotas, e-mails ou credenciais: esses valores ainda não foram definidos. A tela atual de acesso não realiza autenticação.

## Vercel — após autenticação e isolamento

1. Confirmar equipe/projeto de destino e importar `Cerne17/market-analyst` com framework Next.js, Node.js 24 e pnpm fixado pelo repositório.
2. Definir variáveis separadas para preview e produção. Segredos permanecem no servidor; definir `NEXT_PUBLIC_APP_URL` para o ambiente correspondente.
3. Confirmar acesso ao domínio `sonda.cerne.pro`, associá-lo ao projeto e configurar callbacks de autenticação com URLs reais.
4. Validar build, HTTPS, magic link, GitHub e rejeição de não convidados no domínio publicado. Registrar URL e evidências antes de concluir o gate da fase 0.

Publicar esta fundação visual isoladamente não satisfaz o aceite da milestone 0. Não avançar para a fase 1 antes da validação completa do acesso e do deploy.

## Referências

- [Supabase: SSR com Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Supabase: GitHub OAuth](https://supabase.com/docs/guides/auth/social-login/auth-github)
- [Vercel: projetos Next.js](https://vercel.com/docs/frameworks/full-stack/nextjs)
