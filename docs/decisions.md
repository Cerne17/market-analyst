# Decisões técnicas

O SPEC original fica preservado em `docs/SPEC.md`. Este registro documenta decisões posteriores; o que ainda depende de informação externa aparece como pendência.

## Registro

- 2026-11-12 — Usar GitHub Issues e Milestones em `Cerne17/market-analyst` para acompanhar trabalho; o backlog local guarda a proposta inicial, sem duplicar status após publicação.
- 2026-11-12 — Adotar contexto único em `CONTEXT.md`, ADRs em `docs/adr/` e convenções em `docs/agents/`, pois o escopo é uma aplicação única.
- 2026-11-12 — Centralizar orientações em `AGENTS.md`; `CLAUDE.md` encaminha para essas orientações, conforme pedido de manter ambos os arquivos.
- 2026-11-12 — Planejar quatro milestones sem prazos de calendário até confirmação da data do hackathon; respeitar o aceite sequencial das fases 0–3.
- 2026-11-12 — Dividir entregas em fluxos verificáveis de ponta a ponta; domínio e seus testes entram com cada fluxo, com cobertura integral da seção 6.3 conferida no fechamento da fase 1.
- 2026-11-12 — Manter a stack prevista no SPEC; versões estáveis serão verificadas e registradas durante o setup, sem presumir versões ou dependências já instaladas.
- 2026-11-12 — O SPEC pede RLS em todas as tabelas; verificar acesso e isolamento com testes negativos, incluindo autenticação por convite e projeção pública sem dados de entrevistas.
- 2026-11-12 — Itens HITL exigem interação humana ou credenciais de serviços; bloqueio por dependência e necessidade de interação humana serão registrados separadamente da prioridade.

- 2026-11-12 — Mantenedor aprovou a divisão inicial: quatro milestones e 29 issues publicados no GitHub, com prioridade, tipo de execução e referências aos bloqueadores; F0-01 (#1) é a única inicialmente pronta.

- 2026-11-12 — Fundação usa Next.js App Router, Tailwind v4 e botão no padrão shadcn/Radix; trilha informativa em `/trilha/[step]` é pública e não substitui o canvas privado futuro.
- 2026-11-12 — Node.js 24 e pnpm 12.18.0 fixados para setup; versões de pacotes verificadas no registry e fixadas exatamente com lockfile. ESLint 9.39.5 e TypeScript 6.0.3 substituem os majors mais novos (10/7) porque os plugins do Next/TypeScript ESLint ainda declaram peers incompatíveis; `pnpm peers check` passou após o ajuste.
- 2026-11-12 — Dependências auxiliares fora da lista nominal do SPEC: `next-themes` para persistência do tema sem flash; CVA/clsx/tailwind-merge e Radix Slot para composição do botão shadcn; Fontsource para empacotar Inter/Montserrat sem requisição ao Google Fonts em build/runtime; plugin Prettier Tailwind para ordem das classes.
- 2026-11-12 — O pnpm usa `pnpm-workspace.yaml` para configurações do projeto; cache em `node_modules/.pnpm-store` evita escrita em diretórios externos durante checks. Não há monorepo.
- 2026-11-12 — A trilha e o estado vazio funcionam sem segredos; `/login` apenas informa acesso em preparação até a implementação e validação das issues #2/#3. Nenhum dado ou autenticação simulado é tratado como real.
- 2026-11-12 — Mantenedor informou que Supabase/Vercel ainda não foram configurados. Sessão Vercel CLI foi verificada, mas nenhum projeto ou deploy foi criado nesta entrega; Docker local está instalado, com daemon indisponível.

- 2026-11-12 — [ADR-0001](adr/0001-acesso-por-convite-e-isolamento.md) resolve convites por workspace, chaves naturais/compostas, bootstrap, privacidade do workspace pessoal e enforcement por RLS/RPC. O aceite hospedado segue pendente.
- 2026-11-12 — Adicionar `@electric-sql/pglite` 0.5.16 apenas em desenvolvimento para testar SQL/grants/RLS no Postgres sem Docker; o contrato de Supabase Auth é fornecido pela suíte e não representa integração real com o provedor.
- 2026-11-12 — Adicionar `server-only` 0.0.1 para proteger módulos de sessão. Login habilitado por `SONDA_AUTH_ENABLED`; owner local em `SONDA_OWNER_EMAIL`, sem versionar o valor.

## Pendências

- Confirmar contas/projetos Supabase e Vercel, acesso a DNS/domínio e ambientes de preview/produção.
- Owner confirmado e salvo apenas em `.env.local`; executar bootstrap no Supabase real e confirmar convidados iniciais.
- Decidir campos, retenção e política de restauração dos snapshots sem restaurar segredos, tokens públicos ou registros de uso de IA.
- Definir periodicidade e unidades comparáveis no critério de preço (< 20% do custo da dor/valor) antes de implementar o score.
- Confirmar layout vigente dos dados CNPJ, volume agregado e competência real antes de importação.
- Confirmar modelo Claude Sonnet disponível e nomes das ferramentas de pesquisa na documentação oficial antes da integração.
- Confirmar data do hackathon; não transformar estimativas de dias do SPEC em datas de compromisso.

## Versões instaladas na fundação

Verificadas em 2026-11-12 no registry; lockfile registra as transitivas.

| Pacote                        | Versão  |
| ----------------------------- | ------- |
| `@electric-sql/pglite`        | 0.5.16  |
| `@fontsource/inter`           | 5.3.0   |
| `@fontsource/montserrat`      | 5.3.0   |
| `@playwright/test`            | 1.65.0  |
| `@radix-ui/react-slot`        | 1.5.0   |
| `@supabase/ssr`               | 0.12.7  |
| `@supabase/supabase-js`       | 2.119.0 |
| `@tailwindcss/postcss`        | 4.3.5   |
| `@types/node`                 | 24.19.2 |
| `@types/react`                | 19.3.0  |
| `@types/react-dom`            | 19.3.0  |
| `class-variance-authority`    | 0.7.1   |
| `clsx`                        | 2.1.1   |
| `eslint`                      | 9.39.5  |
| `eslint-config-next`          | 16.4.6  |
| `lucide-react`                | 1.72.0  |
| `next`                        | 16.4.6  |
| `next-themes`                 | 0.4.6   |
| `prettier`                    | 3.10.0  |
| `prettier-plugin-tailwindcss` | 0.8.1   |
| `react`                       | 19.3.1  |
| `react-dom`                   | 19.3.1  |
| `server-only`                 | 0.0.1   |
| `tailwind-merge`              | 3.7.0   |
| `tailwindcss`                 | 4.3.5   |
| `typescript`                  | 6.0.3   |
| `vitest`                      | 5.1.0   |
| `zod`                         | 4.6.7   |

Referências: [Next.js](https://nextjs.org/docs/app/getting-started/installation), [shadcn manual](https://ui.shadcn.com/docs/installation/manual), [configuração pnpm](https://pnpm.io/settings).
