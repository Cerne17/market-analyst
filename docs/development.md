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
- Vitest: configuração pública, entradas inválidas, transporte seguro e exclusão de segredos da saída.
- Playwright: três fluxos em Chromium desktop e celular (seis execuções), usando servidor de produção local. Verifica trilha completa, teclado, ausência de overflow/erros de navegador, tema persistido, acesso pendente e 404. Gera capturas claro/escuro em `test-results/`.
- CI: executa todos os checks, build e e2e em push na main e em PRs; instala Chromium no runner e guarda evidências em caso de falha.

As suítes ainda não comprovam login, RLS, persistência, fórmulas ou deploy; esses critérios pertencem às próximas entregas.

## Variáveis de ambiente

Usar `.env.example` como template. Nenhum segredo é necessário para os fluxos atuais. A detecção de configuração em `/login` valida apenas a presença/formato dos campos públicos e não comprova conexão com o Supabase.

`SUPABASE_SERVICE_ROLE_KEY` e `ANTHROPIC_API_KEY` serão usadas exclusivamente no servidor nas respectivas integrações. Nunca adicionar prefixo `NEXT_PUBLIC_` a elas nem enviar `process.env` inteiro a componentes cliente.
