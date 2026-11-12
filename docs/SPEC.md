# Sonda: ferramenta de análise de mercado

> Especificação para desenvolvimento agêntico. Leia este arquivo inteiro antes de escrever código.
> Nome e subdomínio são provisórios (`sonda.cerne.pro`). Para trocar, basta buscar e substituir "Sonda".

---

## 0. Instruções para o agente

- Trabalhe **por fase** (seção 11). Não comece uma fase antes de os critérios de aceite da anterior passarem.
- Toda fórmula de domínio fica em `lib/domain/` como **função pura com testes** (seção 6). A UI só chama essas funções.
- Commits **atômicos**, no formato **Conventional Commits** (`feat:`, `fix:`, `refactor:`, `test:`, `chore:`, `docs:`). **Nunca mencione IA, agentes ou assistentes em commits, PRs ou qualquer mensagem de git.**
- Estratégia de git: rebase.
- Antes de cada commit: `pnpm lint && pnpm typecheck && pnpm test`.
- Se uma decisão não está coberta aqui, escolha a opção mais simples que atende os critérios de aceite e registre a decisão em `docs/decisions.md` (uma linha por decisão).
- Não adicione dependências fora da seção 9 sem registrar o motivo em `docs/decisions.md`.

---

## 1. Visão

Ferramenta web privada para fazer **análise de mercado guiada** em duas frentes:

1. **Time de hackathon (Do Fundo do Poço):** análise rápida, em horas, que termina nos slides de mercado do pitch.
2. **Projetos para vender (SaaS próprios):** análise mais profunda, em semanas, com validação por entrevistas e, depois, acompanhamento de métricas.

O fluxo segue **7 perguntas, em ordem de dependência**:

| # | Etapa | Pergunta |
|---|---|---|
| 1 | Dor | Existe um problema caro e frequente? |
| 2 | Cliente | Quem sente a dor e quem paga? (ICP, persona, JTBD) |
| 3 | Tamanho | Quantos são e quanto pagam? (TAM/SAM/SOM bottom-up) |
| 4 | Alternativas | O que usam hoje? Por que trocariam? |
| 5 | Modelo e preço | Como cobra? (plano, preço, ARPA) |
| 6 | Economia da unidade | Cada cliente dá lucro? (CAC, churn, LTV, payback) |
| 7 | Tração / PMF | As pessoas ficam e sentiriam falta? |

A IA é um **copiloto**: sugere, critica premissas e pesquisa com fontes. **Quem decide e edita é sempre o usuário.**

### Objetivos do MVP
- Fazer a análise de mercado completa de um projeto de hackathon em **menos de 3 horas**, já com os slides prontos.
- Toda premissa numérica tem **origem visível**: manual, CNAE/Receita ou web com URL.
- Um **score de prontidão** aponta as lacunas antes do pitch.

### Fora do escopo (não fazer)
- Edição simultânea em tempo real (cursores, CRDT).
- Integração com Stripe ou outros sistemas de cobrança.
- Cadastro público ou multi-tenant aberto. Só usuários convidados.
- App mobile nativo. Web responsiva basta, com foco em desktop.
- Editor de slides livre. Os slides são **gerados** a partir dos dados.

---

## 2. Usuários e acesso

- **Login obrigatório** (Supabase Auth: magic link por e-mail + GitHub OAuth).
- **Sem cadastro aberto:** só entra quem tem e-mail na tabela `invites` (allowlist). O primeiro usuário é o owner (Miguel).
- **Workspaces:** começa com dois.
  - `Do Fundo do Poço` (time; membros convidados)
  - `Meus projetos` (só o owner)
- **Papéis por workspace:** `owner`, `editor`, `viewer`.
- **Link público read-only** por projeto: token aleatório que pode ser revogado. Mostra o relatório e os slides, nunca o diário de entrevistas.

---

## 3. Modos

Todo projeto tem um `mode` escolhido na criação. Ele pode ser trocado depois sem perder dados.

### 3.1 Modo Sprint (hackathon)
- **Cronômetro de evento** opcional: o usuário informa a hora do pitch e a trilha mostra o tempo sugerido por etapa:
  - Dor + ICP: 1h
  - Conversas: 1h
  - TAM/SAM/SOM: 1h
  - Alternativas: 1h
  - Modelo: junto do MVP
- **Subtipo:**
  - `ideia_livre`: a etapa 3 usa TAM/SAM/SOM.
  - `desafio_corporativo`: a etapa 3 vira **Valor do Problema** (ocorrências × tempo × custo/hora × % resolvido), e TAM/SAM/SOM passa a ser opcional ("e fora daqui?").
- Etapas 6 e 7 ficam **reduzidas**: hipóteses de LTV:CAC marcadas como hipótese, com um rótulo visível.
- A saída principal são os **slides de mercado**.

### 3.2 Modo Venture (projeto para vender)
- As 7 etapas completas.
- O diário de entrevistas tem peso maior no score.
- Etapa 7 com teste dos 40% (Sean Ellis): o usuário lança as respostas e vê o score por segmento.
- **Fase 3 (pós-MVP):** aba **Métricas** com lançamento manual mensal (MRR, clientes, novos, churn, gasto de aquisição por canal), gráficos e coortes simples. É barato (uma tabela e alguns gráficos), então fica planejado, mas **não bloqueia** o MVP do hackathon.

---

## 4. Features

Prioridade: **P0** = MVP para o próximo hackathon; **P1** = logo depois; **P2** = futuro.

### F1. Canvas guiado (P0)
- Trilha lateral com as 7 etapas e o status de cada uma: `vazio`, `rascunho`, `ok`, `alerta`.
- Cada etapa tem campos estruturados, um texto livre e uma caixa "Como isso funciona?" que pode ser recolhida, com a explicação do conceito (texto estático em `content/concepts/*.md`).
- Salvamento automático (debounce de 800 ms) e histórico de versões por projeto (snapshot a cada 10 minutos de edição ou num salvamento manual "marcar versão").
- **Campos por etapa:**
  1. **Dor:** descrição; frase JTBD (*Quando… quero… para…*); calculadora de custo da dor (F2).
  2. **Cliente:** ICP com lista de critérios verificáveis (mínimo 3); personas (nome, papel, rotina, dor, quem decide); papéis usuário/comprador/veto.
  3. **Tamanho:** calculadora TAM/SAM/SOM (F2), com cada premissa ligada a uma fonte (F5).
  4. **Alternativas:** matriz de critérios × alternativas (sempre inclui "Não fazer nada"); mapa de posicionamento 2×2 com eixos escolhidos; frase de posicionamento a partir de um template.
  5. **Modelo e preço:** planos (nome, preço, intervalo); custo para servir; âncoras de preço (custo, concorrência, valor).
  6. **Economia da unidade:** calculadora LTV/CAC/payback com cenários (F2).
  7. **Tração/PMF:** compromissos (vindos do diário, F4); teste dos 40%; métricas (P1).
- **Aceite:** criar um projeto Sprint, preencher as etapas 1 a 4, recarregar a página e encontrar tudo salvo; restaurar uma versão anterior.

### F2. Calculadoras (P0)
Todas usam as funções da seção 6, mostram a **conta passo a passo** (as mesmas linhas do material de estudo) e aceitam **cenários** (base, pessimista, otimista, ou cenários com nome dado pelo usuário).
- **Custo da dor:** ocorrências/período × custo unitário.
- **TAM/SAM/SOM bottom-up:** nº de clientes × ARPA anual, com filtros do SAM aplicados como percentuais ou como contagens.
  - O SOM tem **dois modos**: percentual do SAM ou **capacidade de vendas** (vendedores × vendas/mês × meses − churn).
  - O SOM **exige um prazo**.
  - Aviso quando o SOM ficar acima de 10% do SAM ou acima da capacidade de vendas.
- **Valor do Problema** (desafio corporativo): ocorrências/mês × horas por ocorrência × custo/hora × % resolvido, anualizado.
- **Unit economics:** ARPA, margem bruta, churn mensal, CAC (total ou por canal) → vida média, LTV, LTV:CAC, payback, churn anual equivalente.
  - Tabela comparando os cenários lado a lado.
  - Faixas de referência (verde/amarelo/vermelho) configuráveis em `lib/domain/benchmarks.ts`, com a fonte em comentário. Padrões:
    - LTV:CAC: ≥ 3 verde; 2 a 3 amarelo; < 2 vermelho; > 5 mostra a nota "pode estar investindo pouco".
    - Payback: < 12 m verde; 12 a 18 m amarelo; > 18 m vermelho.
- **CAC por canal:** tabela canal × gasto × clientes novos → CAC por canal e CAC total.
- **Teste dos 40%:** contagem por resposta e por segmento → % de "muito decepcionado" por segmento.
- **Aceite:** os casos de teste da seção 6.3 aparecem na UI com os mesmos números.

### F3. Copiloto de IA (P0 básico, P1 completo)
Painel à direita, ciente da etapa ativa e do projeto inteiro.
- **P0:**
  - **Chat contextual** (streaming).
  - **Criticar etapa:** devolve uma lista de problemas com severidade. Exemplos: "SOM sem prazo", "ICP com critério não verificável", "pergunta de entrevista hipotética".
  - **Sugerir rascunho:** preenche campos vazios como **sugestão** pendente. O usuário aceita ou descarta cada campo; nada é gravado sem aceite.
- **P1:**
  - **Pesquisar concorrentes:** web search devolve alternativas com nome, URL, preço público (se houver) e um resumo; o usuário marca quais entram na matriz.
  - **Pesquisar premissa:** para um número da calculadora, busca fontes e propõe valor + URL + data de acesso.
- **Regras:**
  - Toda afirmação factual vinda da web carrega uma URL. Sem URL, a sugestão vem marcada como "não verificado".
  - Respostas em PT-BR por padrão.
  - O prompt de sistema (`lib/ai/prompts/system.md`) inclui as regras do Mom Test, a ordem das 7 perguntas e a instrução de **nunca inventar números**: quando não souber, deve propor como obter o dado.
  - Rate limit simples por usuário (ex.: 60 requisições/hora) e log de tokens por projeto na tabela `ai_usage`.
- **Implementação:** Vercel AI SDK + provider Anthropic. Web search pela ferramenta de web search do servidor da Anthropic (confirmar a disponibilidade e o nome atual na documentação em `docs.claude.com` antes de implementar; se não houver, usar um provider de busca, registrando a decisão). Saída estruturada com schemas Zod.
- **Aceite:** com uma etapa 3 sem prazo no SOM, "Criticar etapa" aponta o problema; "Sugerir rascunho" na etapa 2 cria sugestões que só são gravadas depois do aceite.

### F4. Diário de entrevistas (P0)
- Entrevista: data, pessoa (nome ou apelido; **sem dados sensíveis**), segmento/ICP, roteiro usado, notas, **frases literais** (lista), **compromisso** (`nenhum`, `tempo`, `reputacao`, `dinheiro`, com descrição).
- Roteiro padrão de 15 minutos (contexto → último episódio → soluções atuais → prioridade → próximo passo) com as perguntas sugeridas.
- **Detector de pergunta ruim** (heurística local + IA opcional): sinaliza perguntas hipotéticas ("você usaria…", "você pagaria…", "seria útil…").
- Agregados: nº de entrevistas, % com a dor, nº de compromissos por tipo. Alimentam a etapa 7 e o score.
- Frases literais podem ser marcadas com ⭐ e aparecem no slide de Problema.
- **Aceite:** registrar 3 entrevistas, 1 com compromisso em dinheiro; a etapa 7 mostra "1 compromisso (dinheiro)".

### F5. Fontes de dados (P0 manual + CNAE, P1 web)
- **Proveniência de premissa:** toda premissa numérica tem `source_type` (`manual`, `cnae`, `web`, `ia_nao_verificado`), `source_url`, `accessed_at` e uma nota. Na UI, aparece um chip de origem ao lado do número.
- **Contagem por CNAE/município (P0):**
  - Busca de CNAE por código ou descrição.
  - Filtros: UF, município, porte (MEI / ME / EPP / demais) e situação ativa.
  - Retorna a contagem de estabelecimentos, que pode ser inserida como "nº de clientes" no TAM ou no SAM, com a fonte "Receita Federal: dados abertos do CNPJ, competência AAAA-MM".
  - Pipeline em `scripts/cnpj/` (seção 8).
- **Aceite:** buscar o CNAE de cabeleireiros no RJ e inserir a contagem no TAM; o chip mostra a competência da base.

### F6. Score de prontidão (P0)
- Regras determinísticas em `lib/domain/readiness.ts`, de 0 a 100, com o peso por modo. Cada regra devolve `{id, ok, severity, message, step}`.
- Regras mínimas:

| id | Regra | Sprint | Venture |
|---|---|---|---|
| `pain_cost` | Custo da dor calculado | 10 | 8 |
| `jtbd` | Frase JTBD preenchida | 5 | 5 |
| `icp_criteria` | ICP com ≥ 3 critérios | 10 | 10 |
| `interviews` | ≥ 3 (Sprint) / ≥ 12 (Venture) entrevistas | 10 | 15 |
| `commitment` | ≥ 1 compromisso de tempo, reputação ou dinheiro | 10 | 15 |
| `sizing_bottomup` | TAM ou Valor do Problema calculado bottom-up | 15 | 10 |
| `som_deadline` | SOM com prazo (se houver SOM) | 5 | 5 |
| `som_sanity` | SOM ≤ capacidade de vendas e ≤ 10% do SAM | 5 | 5 |
| `sources` | ≥ 80% das premissas com fonte ≠ `ia_nao_verificado` | 10 | 7 |
| `alternatives` | ≥ 3 alternativas, incluindo "não fazer nada" | 10 | 5 |
| `pricing` | Preço justificado (preço < 20% do custo da dor ou do valor) | 10 | 5 |
| `unit_econ` | Cenário base de LTV:CAC calculado | — | 5 |
| `pmf` | Teste dos 40% com ≥ 30 respostas | — | 5 |

  Os pesos de cada modo somam 100. Regras que não se aplicam ao modo (—) não contam.
- Na UI: um anel com o score no topo da trilha, a lista de lacunas ordenada por severidade e um clique que leva à etapa.
- **Aceite:** um projeto Sprint vazio tem score 0; preencher dor e ICP sobe o score conforme os pesos.

### F7. Saídas (P0 slides + MD, P1 PDF do relatório)
- **Slides de mercado** (rota `/p/[id]/slides`): 6 slides gerados (Problema, Para quem, Mercado, Concorrência, Modelo, Próximos passos), em 16:9, na identidade Ascensão, **tema claro por padrão**, com modo apresentação (setas) e **exportação para PDF** via CSS de impressão (`@page { size: 1920px 1080px }`). Hipóteses aparecem com o rótulo "hipótese".
- **Relatório:** exportação em `.md` (P0) com todas as etapas, premissas e fontes; PDF via rota de impressão (P1).
- **Link público read-only:** `/s/[token]` mostra o relatório e os slides; sem diário e sem copiloto; pode ser revogado.
- **Aceite:** gerar os slides de um projeto Sprint completo e exportar um PDF com 6 páginas sem quebra; abrir o link público numa janela anônima.

### F8. Métricas pós-lançamento (P1, só Venture)
- Lançamento mensal: MRR início, novos, expansão, churn, contração, clientes ativos, gasto de aquisição por canal.
- Cálculos derivados: net new MRR, churn %, CAC por canal, NRR/GRR por coorte anual (quando houver 12 meses).
- Gráficos: MRR (barras empilhadas por movimento), churn % (linha).
- **Aceite:** os números do exemplo da seção 6.3 (MRR) aparecem iguais.

### F9. Workspaces e colaboração (P0)
- Editores do mesmo workspace editam o mesmo projeto. Conflito: a última gravação vence **por campo**, com o aviso "editado por X há N s" quando o registro mudar desde a leitura (`updated_at` otimista).
- Atividade recente por projeto (quem editou qual etapa).

---

## 5. Modelo de dados (Supabase / Postgres)

Todas as tabelas com `id uuid default gen_random_uuid()`, `created_at` e `updated_at`. **RLS ligado em todas.**

```sql
-- acesso
invites(email text primary key, workspace_id uuid, role text, invited_by uuid)
profiles(id uuid primary key references auth.users, name text, avatar_url text)
workspaces(id, name text, slug text unique, accent text)            -- accent: 'ascensao' | ...
memberships(workspace_id, user_id, role text check (role in ('owner','editor','viewer')),
            primary key (workspace_id, user_id))

-- projetos
projects(id, workspace_id, name text, mode text check (mode in ('sprint','venture')),
         sprint_subtype text check (sprint_subtype in ('ideia_livre','desafio_corporativo')),
         pitch_at timestamptz, share_token text unique, share_enabled bool default false,
         created_by uuid)

-- conteúdo das etapas: 1 linha por (projeto, etapa); dados em jsonb validado por Zod no app
steps(project_id, step smallint check (step between 1 and 7), data jsonb not null default '{}',
      status text, updated_by uuid, primary key (project_id, step))

-- premissas numéricas com proveniência (referenciadas por id dentro de steps.data)
assumptions(id, project_id, key text, label text, value numeric, unit text,
            source_type text check (source_type in ('manual','cnae','web','ia_nao_verificado')),
            source_url text, source_note text, accessed_at date)

scenarios(id, project_id, name text, overrides jsonb)              -- {assumption_key: value}

interviews(id, project_id, held_at date, person_alias text, segment text, notes text,
           quotes jsonb,           -- [{text, starred}]
           commitment_type text check (commitment_type in ('nenhum','tempo','reputacao','dinheiro')),
           commitment_note text, has_pain bool)

pmf_responses(id, project_id, segment text,
              answer text check (answer in ('muito','pouco','nada','nao_usa')))

metrics_monthly(project_id, month date, mrr_start numeric, new_mrr numeric, expansion_mrr numeric,
                churned_mrr numeric, contraction_mrr numeric, customers_start int, customers_new int,
                customers_churned int, primary key (project_id, month))       -- P1
acquisition_spend(project_id, month date, channel text, spend numeric, new_customers int)  -- P1

versions(id, project_id, snapshot jsonb, label text, created_by uuid)
activity(id, project_id, user_id, step smallint, action text)
ai_usage(id, project_id, user_id, input_tokens int, output_tokens int, kind text)

-- dados de referência (somente leitura para usuários)
cnae(code text primary key, description text, section text)
establishment_counts(cnae_code text, uf char(2), municipio_code text, porte text,
                     count int, competencia date,
                     primary key (cnae_code, uf, municipio_code, porte, competencia))
municipios(code text primary key, name text, uf char(2))
```

**RLS:**
- `projects` e as tabelas filhas: leitura para membros do workspace; escrita para `owner` e `editor`.
- `cnae`, `establishment_counts` e `municipios`: `select` para `authenticated`.
- **Link público:** rota server-side que valida `share_token` + `share_enabled` e lê com a service role, devolvendo **apenas** os campos do relatório e dos slides. Nunca expor a service role ao cliente.

---

## 6. Lógica de domínio (`lib/domain/`)

Funções puras em TypeScript, sem I/O, sem arredondamento interno; a formatação fica na UI. Dinheiro em `number` (reais), percentuais como fração (0,04 = 4%).

### 6.1 Fórmulas

```ts
painCost({ occurrencesPerPeriod, unitCost }) = occurrencesPerPeriod * unitCost
problemValueAnnual({ occurrencesPerMonth, hoursPerOccurrence, hourlyCost, solvedShare })
  = occurrencesPerMonth * hoursPerOccurrence * hourlyCost * 12 * solvedShare
arpaAnnual(monthlyPrice) = monthlyPrice * 12            // planos anuais: price / 12 para o mensal
tam({ customers, arpaAnnual }) = customers * arpaAnnual
sam({ samCustomers, arpaAnnual }) = samCustomers * arpaAnnual
somCapacity({ reps, salesPerRepPerMonth, months, retainedShare })
  = reps * salesPerRepPerMonth * months * retainedShare  // nº de clientes
somRevenue({ somCustomers, arpaAnnual }) = somCustomers * arpaAnnual
mrrEnd({ start, newMrr, expansion, churned, contraction }) = start + newMrr + expansion - churned - contraction
cac({ spend, newCustomers }) = spend / newCustomers     // newCustomers = 0 → null
lifetimeMonths(monthlyChurn) = 1 / monthlyChurn         // churn = 0 → Infinity, a UI mostra "∞ (sem churn)"
annualChurn(monthlyChurn) = 1 - (1 - monthlyChurn) ** 12
grossProfitMonthly({ arpa, grossMargin }) = arpa * grossMargin
ltv({ arpa, grossMargin, monthlyChurn }) = arpa * grossMargin / monthlyChurn
ltvCac = ltv / cac
paybackMonths({ cac, arpa, grossMargin }) = cac / (arpa * grossMargin)
nrr({ startArr, churned, contraction, expansion }) = (startArr - churned - contraction + expansion) / startArr
grr({ startArr, churned, contraction }) = (startArr - churned - contraction) / startArr
pmfScore(responses) = count(muito) / count(answer != 'nao_usa')
```

### 6.2 Regras de validação
- Divisão por zero → `null` e mensagem na UI; nunca `NaN` na tela.
- O SOM em clientes não pode passar o SAM em clientes (erro). Acima de 10% do SAM gera um alerta.
- Cada função tem uma versão `explain*` que devolve os passos `[{label, expression, value}]` usados no "passo a passo" da UI e no relatório.

### 6.3 Casos de teste obrigatórios (Vitest)
Os mesmos números do material de estudo:

| Caso | Entrada | Esperado |
|---|---|---|
| Custo da dor | 6 horários/sem × R$ 50 × 4 | 1.200 |
| ARPA anual | R$ 80/mês | 960 |
| TAM | 100.000 × 960 | 96.000.000 |
| SAM | 20.000 × 960 | 19.200.000 |
| SOM capacidade | 2 × 15 × 36 × 1 | 1.080 clientes |
| SOM receita | 1.000 × 960 | 960.000 |
| MRR fim | 40.000 + 2.400 + 400 − 1.600 − 0 | 41.200 |
| CAC total | 12.000 / 30 | 400 |
| CAC indicação | 1.000 / 8 | 125 |
| Vida média | churn 0,04 | 25 |
| Churn anual | churn 0,04 | ≈ 0,3873 |
| LTV | 80 × 0,8 / 0,04 | 1.600 |
| LTV:CAC | 1.600 / 400 | 4 |
| Payback | 400 / 64 | 6,25 |
| LTV churn 8% | 80 × 0,8 / 0,08 | 800 |
| NRR | (100k − 20k − 5k + 30k) / 100k | 1,05 |
| GRR | (100k − 20k − 5k) / 100k | 0,75 |
| PMF | 18 / 50 | 0,36 |
| Valor do problema | 500 × (1/3) × 60 × 12 × 0,7 | 84.000 |
| Quiz | ARPA 100, margem 0,7, churn 0,05, CAC 700 | LTV 1.400; LTV:CAC 2; payback 10 |

Mais: um teste por regra de `readiness.ts` (ok e não ok) e um teste de que os pesos de cada modo somam 100.

---

## 7. Copiloto: contrato

```
POST /api/ai/chat        { projectId, step, messages }  → stream de texto
POST /api/ai/critique    { projectId, step }            → { issues: [{severity:'alta'|'media'|'baixa', field, message, fix}] }
POST /api/ai/draft       { projectId, step }            → { suggestions: [{field, value, rationale, sources:[{url,title}]}] }
POST /api/ai/research    { projectId, kind:'competitors'|'assumption', query, assumptionKey? }   (P1)
                         → { items: [{name|value, url, title, accessedAt, summary, verified:boolean}] }
```

- O contexto enviado é um resumo do projeto (`lib/ai/context.ts`, ≤ 6k tokens): etapas preenchidas, premissas com origem, até 10 frases literais com ⭐.
- **Nunca** enviar nomes de pessoas do diário; usar só `person_alias`.
- Modelo configurável por variável de ambiente (`AI_MODEL`); padrão: um modelo Claude Sonnet atual.

---

## 8. Pipeline CNAE / CNPJ (`scripts/cnpj/`)

Roda **localmente** (não na Vercel), por exemplo uma vez por trimestre.

1. Baixar os arquivos `Estabelecimentos*`, `Empresas*`, `Simples*`, `Cnaes` e `Municipios` dos dados abertos do CNPJ da Receita Federal (CSV `;`, codificação latin-1; verificar o layout atual no PDF de layout publicado junto com os dados).
2. Processar em streaming com **DuckDB**, sem carregar tudo em memória:
   - filtrar `situacao_cadastral = ativa`;
   - juntar porte (Empresas) e MEI (Simples);
   - agregar `count(*)` por `cnae_fiscal_principal × uf × municipio × porte`.
3. Gerar `establishment_counts.csv` + `cnae.csv` + `municipios.csv` com a coluna `competencia`.
4. Subir para o Supabase via `COPY` (substituindo a competência anterior).
5. **Medir o tamanho da tabela agregada** antes de subir e registrar em `docs/decisions.md`. Se passar de ~150 MB, agregar só por UF + município sem porte, ou só por CNAE de interesse.

Opcional (P2): também contar CNAEs secundários.

---

## 9. Stack

| Camada | Escolha |
|---|---|
| Framework | **Next.js** (App Router, Server Actions, Route Handlers), TypeScript strict |
| UI | Tailwind CSS + componentes shadcn/ui (Radix), ícones lucide |
| Formulários / validação | React Hook Form + Zod (schemas compartilhados entre UI, API e `steps.data`) |
| Gráficos | Recharts |
| Auth / DB / Storage | **Supabase** (Auth, Postgres, RLS), `@supabase/ssr`; free tier |
| IA | Vercel AI SDK + provider Anthropic (Claude) |
| Dados CNPJ | DuckDB (script local) |
| Testes | Vitest (domínio), Playwright (2 a 3 fluxos e2e: login → criar projeto → slides) |
| Qualidade | ESLint, Prettier, `tsc --noEmit` |
| Deploy | Vercel, no subdomínio `sonda.cerne.pro` (domínio já está na Vercel) |
| Gerenciador | pnpm |

Use as versões estáveis mais recentes na data do setup; registre-as em `docs/decisions.md`.

### Variáveis de ambiente
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # só servidor
ANTHROPIC_API_KEY=                # só servidor
AI_MODEL=
AI_RATE_LIMIT_PER_HOUR=60
NEXT_PUBLIC_APP_URL=https://sonda.cerne.pro
```

### Estrutura de pastas
```
app/
  (auth)/login/
  (app)/w/[workspace]/                 # lista de projetos
  (app)/p/[id]/step/[n]/               # canvas
  (app)/p/[id]/interviews/
  (app)/p/[id]/metrics/                # P1
  (app)/p/[id]/slides/                 # também rota de impressão
  (app)/p/[id]/report/
  s/[token]/                           # público read-only
  api/ai/{chat,critique,draft,research}/route.ts
components/{canvas,calculators,copilot,slides,ui}/
lib/
  domain/       # fórmulas, readiness, benchmarks, explain* (+ __tests__)
  schemas/      # Zod por etapa
  ai/           # prompts/, context.ts, tools.ts
  supabase/     # clients server/browser, queries
content/concepts/*.md                  # textos "Como isso funciona?"
scripts/cnpj/
supabase/migrations/*.sql
docs/decisions.md
```

---

## 10. Design

### 10.1 Identidade: Ascensão (Do Fundo do Poço)
- **Cores:**
  - `--brand-deep: #102C26` (texto forte, sidebar, cabeçalhos de tabela)
  - `--brand-accent: #16C784` (ação primária, status ok, progresso)
  - `--brand-paper: #F5F3ED` (fundo de superfícies)
  - Neutros: `#17201D` (texto), `#5B6662` (texto secundário), `#D9DDD6` (bordas)
  - Semânticas: alerta `#B4540A` / fundo `#FDF0E2`; erro `#C0392B`
- **Tipografia:** Montserrat (títulos, 600–800) + Inter (corpo e números, `font-variant-numeric: tabular-nums` nas calculadoras).
- **Tema claro por padrão**, com alternância para o escuro (escuro: fundo `#0B1F1B`, superfícies `#102C26`, texto `#F5F3ED`, acento igual).
- **Tom:** leve e direto, mas profissional. Microcopy em PT-BR ("Faltou o prazo do SOM", e não "Erro de validação").
- **Logo:** anel do poço + seta para cima (assets do time); favicon com a seta.

### 10.2 Layout do canvas (desktop ≥ 1280 px)
```
┌──────────────┬───────────────────────────────────────────┬──────────────────┐
│ ◯ 62  Score  │  3. Tamanho · TAM/SAM/SOM      [Sprint ⏱ 1:12]│  Copiloto        │
│──────────────│───────────────────────────────────────────│  [Criticar etapa]│
│ ● 1 Dor    ok│  Como isso funciona? ▸                    │  [Sugerir rascunho]
│ ● 2 Cliente ok│                                          │                  │
│ ◐ 3 Tamanho  │  Clientes possíveis  [100.000] (CNAE ⓘ)   │  ⚠ SOM sem prazo │
│ ○ 4 Altern.  │  ARPA anual          [R$ 960] (manual)    │     → definir    │
│ ○ 5 Modelo   │  ...                                      │                  │
│ ○ 6 Unidade  │  Passo a passo ▾                          │  chat…           │
│ ○ 7 Tração   │   TAM = 100.000 × 960 = R$ 96 mi          │                  │
│──────────────│  Cenários: [Base] [Pessimista] [+]        │                  │
│ Entrevistas  │                                           │                  │
│ Slides  Rel. │                                           │                  │
└──────────────┴───────────────────────────────────────────┴──────────────────┘
```
- Trilha lateral: 240 px, fundo `--brand-deep`, texto claro; status por ícone (○ vazio, ◐ rascunho, ● ok, ▲ alerta).
- Centro: no máximo 760 px de largura de leitura; números grandes nas calculadoras; um chip de origem em cada premissa (cor por `source_type`).
- Copiloto: 360 px, que pode ser recolhido; sugestões aparecem como **cards de diff** com Aceitar e Descartar.
- Abaixo de 1024 px, a trilha vira um menu suspenso e o copiloto vira um painel inferior.

### 10.3 Slides
- 16:9, fundo `--brand-paper`, título em Montserrat 800 `--brand-deep`, números em destaque `--brand-accent`.
- Mercado: círculos concêntricos TAM/SAM/SOM com a conta embaixo (fonte pequena com as premissas e a origem).
- Concorrência: matriz ou mapa 2×2 (o usuário escolhe na geração).
- Rodapé: logo DFP (workspace do time) ou neutro (Meus projetos), com o número do slide.

### 10.4 Acessibilidade
Contraste AA, foco visível, navegação da trilha pelo teclado (↑/↓ e Enter), `aria-live` nas sugestões do copiloto.

---

## 11. Fases (alvo: pronto para o próximo hackathon, ~2 semanas)

### Fase 0: fundação (dias 1–2)
- [ ] Setup Next.js + Tailwind + shadcn + ESLint/Prettier + Vitest + Playwright
- [ ] Projeto Supabase, migrations da seção 5, RLS, seed dos 2 workspaces e do owner
- [ ] Auth (magic link + GitHub) com allowlist `invites`
- [ ] Tokens de design (10.1), layout base com trilha, tema claro/escuro
- [ ] Deploy na Vercel com subdomínio
- **Aceite:** login com e-mail convidado funciona; e-mail não convidado é recusado; deploy no ar.

### Fase 1: núcleo do Modo Sprint (dias 3–8)
- [ ] `lib/domain` completo com os testes da 6.3 passando
- [ ] F1 canvas: etapas 1–5 com autosave e versões
- [ ] F2 calculadoras: dor, TAM/SAM/SOM, valor do problema, CAC por canal
- [ ] F4 diário de entrevistas + roteiro + detector heurístico
- [ ] F5 proveniência + pipeline CNAE + busca de contagem na UI
- [ ] F6 score de prontidão
- [ ] F9 workspace do time, papéis, aviso de edição concorrente
- **Aceite:** fluxo completo de um projeto Sprint `ideia_livre` e um `desafio_corporativo`, de ponta a ponta, sem IA.

### Fase 2: copiloto + saídas (dias 9–12)
- [ ] F3 P0: chat, criticar, sugerir com aceitar/descartar; rate limit; `ai_usage`
- [ ] F7: slides com exportação PDF, relatório `.md`, link público
- [ ] Etapas 6–7 reduzidas no Sprint
- [ ] e2e Playwright: login → projeto → slides PDF
- **Aceite:** ensaio completo com o time em menos de 3 h, terminando nos slides.

### Fase 3: Modo Venture (pós-hackathon)
- [ ] Etapas 6–7 completas, cenários lado a lado, teste dos 40% por segmento
- [ ] F3 P1: pesquisa de concorrentes e de premissas com web search
- [ ] F8 métricas manuais + gráficos + NRR/GRR
- [ ] Relatório em PDF

### Backlog P2
Edição em tempo real; CNAE secundário; integração com Stripe; templates de projeto; comparação entre projetos.

---

## 12. Definição de pronto (por feature)
- Critérios de aceite da feature passando.
- Tipos sem `any`, lint limpo, testes de domínio verdes.
- Estados vazio, carregando e erro implementados.
- Textos em PT-BR, sem placeholder em inglês.
- Funciona nos temas claro e escuro.
- Commit(s) atômico(s) em Conventional Commits.
