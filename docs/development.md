# Desenvolvimento local

## Requisitos

Node.js 24 (`.nvmrc`) e pnpm 12.18.0, fixado com hash em `packageManager`. Corepack pode executar a versão declarada no projeto. Dependências têm versões exatas e lockfile versionado.

```bash
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
```

Abrir `http://localhost:3000`. Não é necessário configurar Supabase para explorar a fundação. O cache pnpm fica em `node_modules/.pnpm-store`, permitindo instalação isolada no diretório do projeto.

## Rotas disponíveis

| Rota                      | Comportamento atual                                                                                     |
| ------------------------- | ------------------------------------------------------------------------------------------------------- |
| `/`                       | Visão geral, estado vazio de projetos e acesso à trilha.                                                |
| `/trilha/1` a `/trilha/7` | Apresentação informativa das sete perguntas; não contém formulário, projeto ou persistência de análise. |
| `/login`                  | Estado de acesso pendente; configuração inválida ou ausente não derruba a página.                       |
| Rota/etapa inválida       | Página não encontrada com retorno ao início.                                                            |

O tema claro é padrão. A escolha de tema fica no navegador; nenhum dado de análise é salvo localmente. A sidebar permite ↑/↓, Home/End e Enter. Em telas menores que 1024 px, usar o seletor de etapas. O link Pular para o conteúdo aparece ao receber foco.

Há skeleton de carregamento e boundary de erro com nova tentativa, além dos estados vazio e acesso indisponível. O erro não expõe stack ou detalhes internos ao usuário. As fontes Inter/Montserrat são empacotadas pelo Fontsource; build e navegação não exigem acesso ao Google Fonts.

O símbolo anel/seta é provisório, criado em SVG/CSS a partir da descrição; não representa um arquivo oficial do time ainda não fornecido.

## Checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
```

- ESLint + Prettier: código e documentação; o SPEC original é excluído da formatação para preservar a cópia.
- Typecheck: geração de tipos de rota pelo Next e TypeScript strict.
- Vitest: configuração pública, destinos de callback, contratos de Auth com provider controlado, validação de convites e migrations/RLS no Postgres embarcado. Não requer Docker nem credenciais.
- Playwright: quatro fluxos em Chromium desktop e celular (oito execuções), usando servidor de produção local. Verifica trilha completa, teclado, ausência de overflow/erros de navegador, tema persistido, acesso pendente, proteção de rotas privadas/callbacks e 404. Gera capturas claro/escuro em `test-results/`.
- CI: executa todos os checks, build e e2e em push na main e em PRs; instala Chromium no runner e guarda evidências em caso de falha.

A suíte Postgres executa migrations reais e verifica isolamento, papéis, revogação, bootstrap e grants. Somente o contrato Supabase Auth é fornecido localmente. Os testes de callback usam provider controlado. Login hospedado, SMTP, hook efetivamente configurado, PostgREST, GitHub OAuth, fórmulas e deploy ainda precisam de validação própria.

`next-env.d.ts` é gerado pelo Next.js e fica fora do Git: os imports variam entre os modos dev/build. O Next também mantém um bloco próprio no final de `AGENTS.md`, com referência à documentação da versão instalada.

## Variáveis de ambiente

Usar `.env.example` como template. Nenhum segredo é necessário para os fluxos atuais. O login exige `SONDA_AUTH_ENABLED=true`, URL/chave pública válidas e origem canônica em `NEXT_PUBLIC_APP_URL`. A flag só deve ser habilitada depois do [setup dos serviços](setup-services.md). A detecção não comprova conexão com o Supabase.

`SUPABASE_SERVICE_ROLE_KEY` é usada somente pelo script administrativo local de bootstrap nesta entrega; não é necessária nas páginas/ações. `ANTHROPIC_API_KEY` permanece reservada para a integração futura no servidor. Nunca adicionar prefixo `NEXT_PUBLIC_` a elas nem enviar `process.env` inteiro a componentes cliente.

## Banco e bootstrap

As migrations e o seed estão em `supabase/`. Não executam automaticamente ao iniciar o Next.js. `pnpm test` valida a SQL em PGlite, sem persistir dados nem tocar um Supabase real. Seguir [ADR-0001](adr/0001-acesso-por-convite-e-isolamento.md) e [setup dos serviços](setup-services.md) para provisionar.

O e-mail do owner fica em `SONDA_OWNER_EMAIL` local. O script `node --env-file=.env.local scripts/bootstrap-owner.mjs` só pode rodar após aplicar migrations/seed; ele não cria usuários e não imprime credenciais. A UI de convites usa a sessão comum e RPCs restritas.
