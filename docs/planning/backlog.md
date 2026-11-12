# Plano de entregas do Sonda

Status: **aprovado e publicado no GitHub em 2026-11-12**. IDs locais preservam rastreabilidade; os links apontam para as issues reais. GitHub é a fonte de estado atual.

Base: [SPEC original](../SPEC.md), especialmente §11. O plano cobre P0 (fases 0–2) e P1 (fase 3). P2 permanece fora deste lote. Datas de conclusão dependem da confirmação do hackathon.

AFK = implementação sem interação humana depois de desbloqueada. HITL = exige interação humana/credenciais/ensaio. Dependências entre fases são gates: a fase seguinte só começa após aceite integral da anterior.

## Milestones publicados

### [Fase 0 — Fundação](https://github.com/Cerne17/market-analyst/milestone/1)

Aplicação acessível com login por convite, workspaces isolados e deploy no domínio. Aceite: convidado entra, não convidado é recusado e ambiente publicado é verificável.

### [Fase 1 — Núcleo Sprint](https://github.com/Cerne17/market-analyst/milestone/2)

Fluxos Sprint ideia livre e desafio corporativo completos sem IA, com dados persistidos, versões, entrevistas, fontes, calculadoras e score. Aceite: demonstração ponta a ponta dos dois subtipos e cobertura da seção 6.3.

### [Fase 2 — Copiloto e saídas](https://github.com/Cerne17/market-analyst/milestone/3)

Copiloto com sugestões sob aceite, slides, relatório e compartilhamento revogável. Aceite: ensaio com o time em menos de 3 horas, terminando em PDF de seis slides e com e2e aprovados.

### [Fase 3 — Venture](https://github.com/Cerne17/market-analyst/milestone/4)

Etapas completas de economia da unidade e PMF, pesquisa com fontes, métricas e relatório PDF. Aceite: cenários, segmentos e métricas reproduzem exemplos do SPEC sem regressão do Sprint.

## Sequência publicada

| ID                                                                 | Entrega                                                       | Tipo | Bloqueada por       |
| ------------------------------------------------------------------ | ------------------------------------------------------------- | ---- | ------------------- |
| [F0-01 · #1](https://github.com/Cerne17/market-analyst/issues/1)   | Abrir a aplicação com layout Ascensão e checks automatizados  | AFK  | Nenhuma             |
| [F0-02 · #2](https://github.com/Cerne17/market-analyst/issues/2)   | Entrar por convite com magic link e GitHub                    | HITL | F0-01               |
| [F0-03 · #3](https://github.com/Cerne17/market-analyst/issues/3)   | Navegar pelos workspaces com acesso por papel                 | AFK  | F0-02               |
| [F0-04 · #4](https://github.com/Cerne17/market-analyst/issues/4)   | Publicar e validar a fundação no domínio do Sonda             | HITL | F0-03               |
| [F1-01 · #5](https://github.com/Cerne17/market-analyst/issues/5)   | Criar um Sprint e calcular o custo da dor com autosave        | AFK  | F0-04               |
| [F1-02 · #6](https://github.com/Cerne17/market-analyst/issues/6)   | Definir o cliente com ICP verificável e personas              | AFK  | F1-01               |
| [F1-03 · #7](https://github.com/Cerne17/market-analyst/issues/7)   | Dimensionar TAM/SAM/SOM com cenários e prazo                  | AFK  | F1-02               |
| [F1-04 · #8](https://github.com/Cerne17/market-analyst/issues/8)   | Calcular o Valor do Problema no desafio corporativo           | AFK  | F1-03               |
| [F1-05 · #9](https://github.com/Cerne17/market-analyst/issues/9)   | Comparar alternativas e formular posicionamento               | AFK  | F1-02               |
| [F1-06 · #10](https://github.com/Cerne17/market-analyst/issues/10) | Definir planos e comparar âncoras de preço                    | AFK  | F1-03, F1-04        |
| [F1-07 · #11](https://github.com/Cerne17/market-analyst/issues/11) | Registrar entrevistas e compromissos com roteiro guiado       | AFK  | F1-02               |
| [F1-08 · #12](https://github.com/Cerne17/market-analyst/issues/12) | Restaurar versões e avisar sobre edições concorrentes         | AFK  | F1-05, F1-06, F1-07 |
| [F1-09 · #13](https://github.com/Cerne17/market-analyst/issues/13) | Gerar e importar contagens reais da Receita por CNAE          | HITL | F1-01               |
| [F1-10 · #14](https://github.com/Cerne17/market-analyst/issues/14) | Buscar estabelecimentos por CNAE e usar a contagem no mercado | AFK  | F1-03, F1-09        |
| [F1-11 · #15](https://github.com/Cerne17/market-analyst/issues/15) | Exibir prontidão e validar os dois fluxos Sprint sem IA       | AFK  | F1-08, F1-10        |
| [F2-01 · #16](https://github.com/Cerne17/market-analyst/issues/16) | Conversar com o copiloto contextual por streaming             | HITL | F1-11               |
| [F2-02 · #17](https://github.com/Cerne17/market-analyst/issues/17) | Criticar a etapa e apontar lacunas acionáveis                 | AFK  | F2-01               |
| [F2-03 · #18](https://github.com/Cerne17/market-analyst/issues/18) | Revisar e aceitar sugestões de rascunho por campo             | AFK  | F2-01               |
| [F2-04 · #19](https://github.com/Cerne17/market-analyst/issues/19) | Exibir hipóteses de unidade e compromissos no Sprint          | AFK  | F1-11               |
| [F2-05 · #20](https://github.com/Cerne17/market-analyst/issues/20) | Apresentar seis slides e exportar PDF sem quebras             | AFK  | F2-04               |
| [F2-06 · #21](https://github.com/Cerne17/market-analyst/issues/21) | Exportar relatório Markdown com premissas e fontes            | AFK  | F2-04               |
| [F2-07 · #22](https://github.com/Cerne17/market-analyst/issues/22) | Compartilhar relatório e slides por link revogável            | AFK  | F2-05, F2-06        |
| [F2-08 · #23](https://github.com/Cerne17/market-analyst/issues/23) | Validar o MVP em ensaio completo e testes e2e                 | HITL | F2-02, F2-03, F2-07 |
| [F3-01 · #24](https://github.com/Cerne17/market-analyst/issues/24) | Comparar cenários completos de economia da unidade no Venture | AFK  | F2-08               |
| [F3-02 · #25](https://github.com/Cerne17/market-analyst/issues/25) | Medir PMF por segmento com o teste dos 40%                    | AFK  | F2-08               |
| [F3-03 · #26](https://github.com/Cerne17/market-analyst/issues/26) | Pesquisar concorrentes e selecionar alternativas com fontes   | AFK  | F2-08               |
| [F3-04 · #27](https://github.com/Cerne17/market-analyst/issues/27) | Pesquisar uma premissa e aceitar valor com proveniência       | AFK  | F3-03               |
| [F3-05 · #28](https://github.com/Cerne17/market-analyst/issues/28) | Acompanhar movimentos de MRR e aquisição mensal               | AFK  | F3-01               |
| [F3-06 · #29](https://github.com/Cerne17/market-analyst/issues/29) | Imprimir relatório Venture em PDF legível                     | AFK  | F3-02, F3-04, F3-05 |

## Convenções de publicação

- Publicação feita em ordem de dependência; corpos das issues referenciam bloqueadores reais `#N`.
- Atribuir milestone da fase, prioridade P0/P1 e tipo de execução; reutilizar labels existentes.
- A única entrega inicialmente sem bloqueio é F0-01. Demais issues ficam `blocked` + `needs-triage`; HITL usa `ready-for-human` somente após desbloqueio e confirmação dos pré-requisitos.
- Critérios globais para cada UI: PT-BR, claro/escuro, teclado, estados vazio/carregando/erro e validação no servidor. Testar isolamento quando houver dados privados.
- A conclusão de uma dependência não elimina o gate de fase. Registrar evidências antes de promover issues para prontas.
- Não atribuir responsáveis ou datas sem definição do mantenedor.

<a id="f0-01"></a>

## F0-01 — Abrir a aplicação com layout Ascensão e checks automatizados

Issue publicada: [#1](https://github.com/Cerne17/market-analyst/issues/1).

Milestone: **Fase 0 — Fundação** · Prioridade: **P0** · Tipo: **AFK**

Referência: SPEC §9–10; fase 0.

### O que construir

Entregar uma aplicação Next.js navegável com trilha das sete etapas, temas e pipeline de qualidade.

### Critérios de aceite

- [ ] Fixar versões estáveis verificadas de Next.js, TypeScript, pnpm e dependências da stack; registrar versões e lockfile.
- [ ] Layout responsivo em PT-BR com tokens Ascensão, tema claro padrão, tema escuro, foco e navegação por teclado.
- [ ] Configurar lint, Prettier, typecheck, Vitest e Playwright; pipeline executa os checks e um smoke test da página inicial.
- [ ] Documentar execução local e variáveis de ambiente sem segredos; estados vazio, carregando e erro verificáveis.

### Dependências

Nenhuma — pode começar imediatamente.

<a id="f0-02"></a>

## F0-02 — Entrar por convite com magic link e GitHub

Issue publicada: [#2](https://github.com/Cerne17/market-analyst/issues/2).

Milestone: **Fase 0 — Fundação** · Prioridade: **P0** · Tipo: **HITL**

Referência: SPEC Fase 0; §2, §5.

### O que construir

Permitir acesso apenas a convidados, com bootstrap explícito do owner e schema/RLS inicial completo.

### Critérios de aceite

- [ ] Confirmar com o mantenedor conta Supabase, e-mail do owner e credenciais OAuth; não inferir owner pelo primeiro login.
- [ ] Resolver e registrar ambiguidades de invites por workspace e chaves/timestamps antes das migrations; cobrir todas as tabelas do SPEC, incluindo as previstas para P1.
- [ ] Migrations e seed repetíveis criam os dois workspaces e vínculo do owner de forma segura; RLS ligada em todas as tabelas.
- [ ] Magic link e GitHub funcionam em ambiente real para convidado; login não convidado, callback inválido e redirecionamento externo são recusados.
- [ ] Bootstrap e vínculo de memberships por convite executam no servidor; chaves privilegiadas não chegam ao cliente.

### Dependências

[#1](https://github.com/Cerne17/market-analyst/issues/1)

<a id="f0-03"></a>

## F0-03 — Navegar pelos workspaces com acesso por papel

Issue publicada: [#3](https://github.com/Cerne17/market-analyst/issues/3).

Milestone: **Fase 0 — Fundação** · Prioridade: **P0** · Tipo: **AFK**

Referência: SPEC F9; §2, §5.

### O que construir

Mostrar apenas workspaces e projetos permitidos e aplicar papéis owner/editor/viewer no servidor e banco.

### Critérios de aceite

- [ ] Owner entra em Do Fundo do Poço e Meus projetos; um convidado do time não acessa o workspace pessoal.
- [ ] Owner/editor podem escrever onde são membros; viewer só lê; acesso direto a rotas e consultas não contorna a regra.
- [ ] Fluxo controlado permite ao owner convidar membro com papel; editor/viewer não elevam privilégios nem criam convites indevidos.
- [ ] Testes de integração com usuários distintos comprovam isolamento e políticas de leitura/escrita; UI trata vazio, carregamento e acesso negado.

### Dependências

[#2](https://github.com/Cerne17/market-analyst/issues/2)

<a id="f0-04"></a>

## F0-04 — Publicar e validar a fundação no domínio do Sonda

Issue publicada: [#4](https://github.com/Cerne17/market-analyst/issues/4).

Milestone: **Fase 0 — Fundação** · Prioridade: **P0** · Tipo: **HITL**

Referência: SPEC Fase 0; §9.

### O que construir

Disponibilizar a fundação em Vercel com autenticação funcional no domínio configurado.

### Critérios de aceite

- [ ] Confirmar acesso Vercel/DNS e domínio antes de configurar produção; separar variáveis de servidor e públicas.
- [ ] Deploy em HTTPS no domínio aprovado; callbacks de auth validados em produção e previews conforme configuração.
- [ ] Convidado entra por magic link/GitHub, não convidado é recusado e workspaces permanecem isolados.
- [ ] Registrar URL e evidências; somente então encerrar o gate da fase 0.

### Dependências

[#3](https://github.com/Cerne17/market-analyst/issues/3)

<a id="f1-01"></a>

## F1-01 — Criar um Sprint e calcular o custo da dor com autosave

Issue publicada: [#5](https://github.com/Cerne17/market-analyst/issues/5).

Milestone: **Fase 1 — Núcleo Sprint** · Prioridade: **P0** · Tipo: **AFK**

Referência: SPEC F1–F2; §6.3.

### O que construir

Criar projeto em workspace e preencher Dor/JTBD com cálculo explicado e persistência real.

### Critérios de aceite

- [ ] Criar projeto Sprint escolhendo subtipo e pitch opcional; alternar modo/subtipo preserva dados existentes.
- [ ] Descrição, JTBD e custo da dor são validados e salvos após 800 ms; recarregar mantém os campos.
- [ ] Calculadora usa função pura e explain, mostra 6 × 50 × 4 = R$ 1.200 e premissas com origem visível.
- [ ] Conceito recolhível, status da etapa e estados de gravação/erro são acessíveis; servidor impede escrita de viewer.

### Dependências

[#4](https://github.com/Cerne17/market-analyst/issues/4)

<a id="f1-02"></a>

## F1-02 — Definir o cliente com ICP verificável e personas

Issue publicada: [#6](https://github.com/Cerne17/market-analyst/issues/6).

Milestone: **Fase 1 — Núcleo Sprint** · Prioridade: **P0** · Tipo: **AFK**

Referência: SPEC F1 etapa 2.

### O que construir

Registrar critérios do ICP, personas e papéis de usuário/comprador/veto no projeto.

### Critérios de aceite

- [ ] Lista editável de pelo menos três critérios verificáveis, sem tratar critérios vagos como evidência suficiente.
- [ ] Personas incluem nome, papel, rotina, dor e quem decide; papéis usuário/comprador/veto são distintos.
- [ ] Campos estruturados e texto livre persistem com autosave, schemas compartilhados e status da etapa.
- [ ] Ajuda recolhível explica ICP/JTBD; recarregar preserva os dados e papel viewer continua somente leitura.

### Dependências

[#5](https://github.com/Cerne17/market-analyst/issues/5)

<a id="f1-03"></a>

## F1-03 — Dimensionar TAM/SAM/SOM com cenários e prazo

Issue publicada: [#7](https://github.com/Cerne17/market-analyst/issues/7).

Milestone: **Fase 1 — Núcleo Sprint** · Prioridade: **P0** · Tipo: **AFK**

Referência: SPEC F1–F2–F5; §6.

### O que construir

Estimar mercado bottom-up com premissas rastreáveis, filtros SAM e SOM por participação ou capacidade.

### Critérios de aceite

- [ ] Clientes × ARPA anual calcula TAM/SAM; planos anuais e mensais convertem de forma explícita.
- [ ] SAM aceita filtros por contagem ou percentual; SOM exige prazo e aceita percentual ou vendedores × vendas/mês × meses × retenção.
- [ ] Bloquear SOM acima de SAM; alertar acima de 10% do SAM ou capacidade comercial, sem NaN na tela.
- [ ] Cenários base, pessimista, otimista e nomeados persistem com overrides; passos e chips de origem aparecem na UI.
- [ ] Exemplos: ARPA 960; TAM 96.000.000; SAM 19.200.000; capacidade 1.080 clientes; receita SOM 960.000, com testes e UI consistentes.

### Dependências

[#6](https://github.com/Cerne17/market-analyst/issues/6)

<a id="f1-04"></a>

## F1-04 — Calcular o Valor do Problema no desafio corporativo

Issue publicada: [#8](https://github.com/Cerne17/market-analyst/issues/8).

Milestone: **Fase 1 — Núcleo Sprint** · Prioridade: **P0** · Tipo: **AFK**

Referência: SPEC F1–F2; §3.1, §6.

### O que construir

Adaptar etapa 3 ao desafio corporativo com economia anual e dimensionamento de mercado opcional.

### Critérios de aceite

- [ ] Ocorrências/mês × horas × custo/hora × parcela resolvida anualiza o valor, com explain e proveniência.
- [ ] Exemplo 500 × (1/3) × 60 × 12 × 0,7 retorna R$ 84.000 em teste e UI.
- [ ] TAM/SAM/SOM fica opcional nesse subtipo; alternar subtipo preserva dados e cenários.
- [ ] Validação rejeita unidades inválidas e percentuais fora do intervalo; autosave e recarga mantêm o resultado.

### Dependências

[#7](https://github.com/Cerne17/market-analyst/issues/7)

<a id="f1-05"></a>

## F1-05 — Comparar alternativas e formular posicionamento

Issue publicada: [#9](https://github.com/Cerne17/market-analyst/issues/9).

Milestone: **Fase 1 — Núcleo Sprint** · Prioridade: **P0** · Tipo: **AFK**

Referência: SPEC F1 etapa 4.

### O que construir

Construir matriz, mapa 2×2 e frase de posicionamento usando as alternativas reais do projeto.

### Critérios de aceite

- [ ] Matriz editável de critérios × alternativas inclui sempre Não fazer nada e persiste após recarga.
- [ ] Mapa 2×2 permite escolher eixos e posicionar alternativas com controles acessíveis.
- [ ] Template gera frase de posicionamento editável sem inventar vantagens ou evidências.
- [ ] Texto livre, conceito recolhível, status e autorização por papel seguem o canvas.

### Dependências

[#6](https://github.com/Cerne17/market-analyst/issues/6)

<a id="f1-06"></a>

## F1-06 — Definir planos e comparar âncoras de preço

Issue publicada: [#10](https://github.com/Cerne17/market-analyst/issues/10).

Milestone: **Fase 1 — Núcleo Sprint** · Prioridade: **P0** · Tipo: **AFK**

Referência: SPEC F1 etapa 5; F2 CAC.

### O que construir

Registrar planos, custo para servir e âncoras de custo, concorrência e valor, com cálculo de aquisição.

### Critérios de aceite

- [ ] Planos nomeados com preço e intervalo, custo para servir e justificativa persistem; valores com origem visível.
- [ ] CAC por canal mostra gasto, clientes novos, CAC do canal e total ponderado pelos clientes, sem média simples de CACs.
- [ ] Exemplos de CAC total 12.000 / 30 = 400 e indicação 1.000 / 8 = 125; zero clientes retorna null com mensagem.
- [ ] Definir e documentar periodicidade comparável do preço e custo da dor/valor para o critério de 20%.

### Dependências

[#7](https://github.com/Cerne17/market-analyst/issues/7), [#8](https://github.com/Cerne17/market-analyst/issues/8)

<a id="f1-07"></a>

## F1-07 — Registrar entrevistas e compromissos com roteiro guiado

Issue publicada: [#11](https://github.com/Cerne17/market-analyst/issues/11).

Milestone: **Fase 1 — Núcleo Sprint** · Prioridade: **P0** · Tipo: **AFK**

Referência: SPEC F4.

### O que construir

Manter diário privado por projeto com evidências, roteiro de 15 minutos e detector de perguntas hipotéticas.

### Critérios de aceite

- [ ] Registrar data, apelido sem dados sensíveis, segmento, roteiro, notas, frases literais e indicador de dor.
- [ ] Compromisso admite nenhum, tempo, reputação e dinheiro com descrição; frases podem receber estrela.
- [ ] Heurística destaca você usaria, você pagaria e seria útil; roteiro foca episódios passados e próximos passos.
- [ ] Três entrevistas, uma com dinheiro, produzem agregado 1 compromisso (dinheiro); totais e percentual com dor são verificáveis.
- [ ] Persistência, estados da UI e isolamento por workspace são testados; diário não fica público.

### Dependências

[#6](https://github.com/Cerne17/market-analyst/issues/6)

<a id="f1-08"></a>

## F1-08 — Restaurar versões e avisar sobre edições concorrentes

Issue publicada: [#12](https://github.com/Cerne17/market-analyst/issues/12).

Milestone: **Fase 1 — Núcleo Sprint** · Prioridade: **P0** · Tipo: **AFK**

Referência: SPEC F1 versões; F9.

### O que construir

Proteger edição assíncrona com histórico restaurável, atualização por campo e atividade recente.

### Critérios de aceite

- [ ] Snapshot a cada 10 minutos de edição e versão manual com rótulo; lista e restauração verificáveis após recarga.
- [ ] Definir e registrar quais dados compõem snapshots e restauração; tokens de compartilhamento, segredos e logs de IA não são restaurados.
- [ ] Duas sessões editando campos distintos preservam ambos; mesmo campo segue última gravação com aviso editado por X há N s baseado em updated_at.
- [ ] Atividade recente mostra autor e etapa; viewers não criam/restauram versões.
- [ ] Fluxo etapas 1–4 → recarga → restauração anterior passa com dados reais persistidos.

### Dependências

[#9](https://github.com/Cerne17/market-analyst/issues/9), [#10](https://github.com/Cerne17/market-analyst/issues/10), [#11](https://github.com/Cerne17/market-analyst/issues/11)

<a id="f1-09"></a>

## F1-09 — Gerar e importar contagens reais da Receita por CNAE

Issue publicada: [#13](https://github.com/Cerne17/market-analyst/issues/13).

Milestone: **Fase 1 — Núcleo Sprint** · Prioridade: **P0** · Tipo: **HITL**

Referência: SPEC F5; §8.

### O que construir

Executar pipeline local DuckDB desde arquivos reais do CNPJ até contagens consultáveis no Supabase.

### Critérios de aceite

- [ ] Confirmar layout oficial e competência da Receita; documentar URLs e acesso, sem inventar resultados.
- [ ] Processar latin-1 separado por ponto e vírgula em streaming; ativos, porte de Empresas e MEI de Simples corretamente unidos.
- [ ] Agregar por CNAE principal, UF, município, porte e competência; exportar contagens, CNAEs e municípios com metadados de competência compatíveis com o esquema.
- [ ] Medir volume antes de importar; registrar medida e aplicar fallback documentado se acima de ~150 MB.
- [ ] Importação COPY controlada e repetível substitui competência de forma segura; amostra consultável confere com entrada e referência é somente leitura para usuários.

### Dependências

[#5](https://github.com/Cerne17/market-analyst/issues/5)

<a id="f1-10"></a>

## F1-10 — Buscar estabelecimentos por CNAE e usar a contagem no mercado

Issue publicada: [#14](https://github.com/Cerne17/market-analyst/issues/14).

Milestone: **Fase 1 — Núcleo Sprint** · Prioridade: **P0** · Tipo: **AFK**

Referência: SPEC F5.

### O que construir

Encontrar contagens reais de estabelecimentos e inseri-las no TAM ou SAM com proveniência completa.

### Critérios de aceite

- [ ] Buscar CNAE por código/descrição e filtrar UF, município, porte e situação ativa suportada pela base.
- [ ] Consulta retorna contagem e competência real; vazio e base indisponível têm mensagens próprias.
- [ ] CNAE de cabeleireiros no RJ pode alimentar TAM/SAM; chip mostra Receita Federal e competência AAAA-MM.
- [ ] Premissa persiste com source_type cnae, nota, data e referência; não substituir com dados fictícios se faltar importação.

### Dependências

[#7](https://github.com/Cerne17/market-analyst/issues/7), [#13](https://github.com/Cerne17/market-analyst/issues/13)

<a id="f1-11"></a>

## F1-11 — Exibir prontidão e validar os dois fluxos Sprint sem IA

Issue publicada: [#15](https://github.com/Cerne17/market-analyst/issues/15).

Milestone: **Fase 1 — Núcleo Sprint** · Prioridade: **P0** · Tipo: **AFK**

Referência: SPEC F6; §6.3; aceite fase 1.

### O que construir

Exibir score determinístico e lacunas navegáveis, fechando o aceite do núcleo Sprint e do domínio.

### Critérios de aceite

- [ ] Cada regra retorna id, ok, severity, message e step; pesos por modo somam 100, com casos ok/não ok para todas as regras.
- [ ] Sprint vazio vale zero; dor/JTBD/ICP elevam score pelos pesos; regras sem dados ou não aplicáveis não geram prontidão artificial.
- [ ] Anel e lacunas ordenadas por severidade navegam à etapa; limiares de entrevistas e pesos Venture são testados.
- [ ] Concluir funções puras e explain para todas as fórmulas da seção 6, incluindo métricas e PMF; testes de toda a seção 6.3 e bordas passam.
- [ ] Comprovar ideia livre e desafio corporativo ponta a ponta sem IA, com dados salvos, fontes e versões; registrar evidência antes de liberar fase 2.

### Dependências

[#12](https://github.com/Cerne17/market-analyst/issues/12), [#14](https://github.com/Cerne17/market-analyst/issues/14)

<a id="f2-01"></a>

## F2-01 — Conversar com o copiloto contextual por streaming

Issue publicada: [#16](https://github.com/Cerne17/market-analyst/issues/16).

Milestone: **Fase 2 — Copiloto e saídas** · Prioridade: **P0** · Tipo: **HITL**

Referência: SPEC F3 P0; §7.

### O que construir

Oferecer chat contextual em PT-BR com provider Anthropic, autorização, limites e contabilização.

### Critérios de aceite

- [ ] Confirmar chave e modelo Sonnet disponível na documentação oficial; configurar AI_MODEL e registrar versão/decisão.
- [ ] Contexto de até 6k tokens resume etapas, premissas e até dez frases com estrela sem nomes de pessoas; limitar entrada e testar redução.
- [ ] Prompt aplica Mom Test e ordem das sete perguntas; não inventa números e propõe como obter dados ausentes.
- [ ] Chat faz streaming, trata cancelamento/erros e não modifica dados do canvas.
- [ ] Validar autenticação e acesso ao projeto no servidor; rate limit persistente por usuário (padrão 60/h) e ai_usage por projeto, inclusive em múltiplas instâncias.

### Dependências

[#15](https://github.com/Cerne17/market-analyst/issues/15)

<a id="f2-02"></a>

## F2-02 — Criticar a etapa e apontar lacunas acionáveis

Issue publicada: [#17](https://github.com/Cerne17/market-analyst/issues/17).

Milestone: **Fase 2 — Copiloto e saídas** · Prioridade: **P0** · Tipo: **AFK**

Referência: SPEC F3 P0 critique; §7.

### O que construir

Produzir críticas estruturadas ligadas a campos da etapa, com severidade, motivo e correção sugerida.

### Critérios de aceite

- [ ] Saída validada por Zod contém severity, field, message e fix; lidar com saída inválida sem quebrar a UI.
- [ ] Etapa 3 com SOM sem prazo gera crítica explícita; critérios ICP não verificáveis e perguntas hipotéticas são cobertos.
- [ ] Críticas aparecem em painel acessível com aria-live; não alteram campos e podem orientar navegação.
- [ ] Autorização, rate limit e uso de tokens seguem o contrato do chat; testes determinísticos usam respostas controladas.

### Dependências

[#16](https://github.com/Cerne17/market-analyst/issues/16)

<a id="f2-03"></a>

## F2-03 — Revisar e aceitar sugestões de rascunho por campo

Issue publicada: [#18](https://github.com/Cerne17/market-analyst/issues/18).

Milestone: **Fase 2 — Copiloto e saídas** · Prioridade: **P0** · Tipo: **AFK**

Referência: SPEC F3 P0 draft; §7.

### O que construir

Propor preenchimento de campos vazios com justificativa e aceite ou descarte individual.

### Critérios de aceite

- [ ] Etapa 2 vazia gera sugestões estruturadas e validadas; não sobrescrever campos preenchidos.
- [ ] Cards mostram valor, justificativa e fontes; sem URL marcar como não verificado.
- [ ] Gerar ou descartar não grava dados do canvas; aceitar grava somente o campo escolhido com proveniência adequada.
- [ ] Aceite verifica se campo mudou desde a sugestão; conflito não sobrescreve silenciosamente trabalho novo.
- [ ] Isolamento por projeto, limites, tokens e aria-live cobertos por testes.

### Dependências

[#16](https://github.com/Cerne17/market-analyst/issues/16)

<a id="f2-04"></a>

## F2-04 — Exibir hipóteses de unidade e compromissos no Sprint

Issue publicada: [#19](https://github.com/Cerne17/market-analyst/issues/19).

Milestone: **Fase 2 — Copiloto e saídas** · Prioridade: **P0** · Tipo: **AFK**

Referência: SPEC F1 etapas 6–7; F2; §3.1.

### O que construir

Completar as etapas reduzidas do Sprint com economia da unidade explícita como hipótese e evidências do diário.

### Critérios de aceite

- [ ] ARPA, margem, churn e CAC produzem vida média, LTV, LTV:CAC, payback e churn anual com passos do domínio.
- [ ] Exemplos ARPA 80, margem 0,8, churn 0,04 e CAC 400 mostram LTV 1.600, razão 4 e payback 6,25; zero churn e denominadores nulos têm apresentação definida.
- [ ] Rótulo hipótese acompanha resultados na UI e futuras saídas; benchmarks configuráveis com fonte comentada e nota acima de 5.
- [ ] Etapa 7 agrega entrevistas e tipos de compromisso; três entrevistas com uma em dinheiro mostram o agregado esperado.

### Dependências

[#15](https://github.com/Cerne17/market-analyst/issues/15)

<a id="f2-05"></a>

## F2-05 — Apresentar seis slides e exportar PDF sem quebras

Issue publicada: [#20](https://github.com/Cerne17/market-analyst/issues/20).

Milestone: **Fase 2 — Copiloto e saídas** · Prioridade: **P0** · Tipo: **AFK**

Referência: SPEC F7 slides; §10.3.

### O que construir

Gerar slides de mercado em identidade Ascensão diretamente do projeto persistido.

### Critérios de aceite

- [ ] Seis slides: Problema, Para quem, Mercado, Concorrência, Modelo e Próximos passos; destaque de frases com estrela e hipóteses.
- [ ] Formato 16:9 claro por padrão, modo apresentação com setas, rodapé do workspace e escolha matriz/mapa na concorrência.
- [ ] Mercado exibe TAM/SAM/SOM ou Valor do Problema conforme subtipo, com contas, fontes e competência.
- [ ] Impressão CSS 1920 × 1080 produz PDF de exatamente seis páginas sem recortes/quebras internas; verificar arquivo gerado.
- [ ] Rota privada respeita papéis e workspace; dados faltantes aparecem como lacunas, sem números inventados.

### Dependências

[#19](https://github.com/Cerne17/market-analyst/issues/19)

<a id="f2-06"></a>

## F2-06 — Exportar relatório Markdown com premissas e fontes

Issue publicada: [#21](https://github.com/Cerne17/market-analyst/issues/21).

Milestone: **Fase 2 — Copiloto e saídas** · Prioridade: **P0** · Tipo: **AFK**

Referência: SPEC F7 relatório MD.

### O que construir

Gerar relatório legível em Markdown com as sete etapas, cálculos, cenários, premissas e URLs.

### Critérios de aceite

- [ ] Arquivo .md baixável em PT-BR, com fórmulas explicadas a partir das mesmas funções do domínio.
- [ ] Fontes, competência CNAE, datas de acesso e hipóteses ficam visíveis; dados ausentes são identificados.
- [ ] Testes verificam conteúdo contra projeto conhecido, incluindo caracteres especiais e cenários.
- [ ] Definir projeção reutilizável para compartilhamento que exclui diário privado e dados internos; frases destacadas só entram como conteúdo de saída previsto, sem identidade de entrevistados.

### Dependências

[#19](https://github.com/Cerne17/market-analyst/issues/19)

<a id="f2-07"></a>

## F2-07 — Compartilhar relatório e slides por link revogável

Issue publicada: [#22](https://github.com/Cerne17/market-analyst/issues/22).

Milestone: **Fase 2 — Copiloto e saídas** · Prioridade: **P0** · Tipo: **AFK**

Referência: SPEC F7 público; §2, §5.

### O que construir

Criar e revogar link público somente leitura sem expor dados privados do projeto.

### Critérios de aceite

- [ ] Owner/editor autorizado gera token aleatório imprevisível; viewer não habilita nem revoga compartilhamento.
- [ ] Janela anônima acessa relatório e slides de projeto habilitado; token inválido ou revogado é recusado.
- [ ] Leitura privilegiada fica no servidor e retorna allowlist de campos; resposta/HTML não contêm diário, apelidos, notas privadas, chat, logs ou segredos.
- [ ] Definir cache para que revogação impeça novas leituras, inclusive de slides e impressão; testar payload e acesso após revogar.

### Dependências

[#20](https://github.com/Cerne17/market-analyst/issues/20), [#21](https://github.com/Cerne17/market-analyst/issues/21)

<a id="f2-08"></a>

## F2-08 — Validar o MVP em ensaio completo e testes e2e

Issue publicada: [#23](https://github.com/Cerne17/market-analyst/issues/23).

Milestone: **Fase 2 — Copiloto e saídas** · Prioridade: **P0** · Tipo: **HITL**

Referência: SPEC Aceite fase 2; §12.

### O que construir

Comprovar o caminho de login até slides e ensaiar análise Sprint com o time em menos de três horas.

### Critérios de aceite

- [ ] Playwright cobre login convidado → criar projeto → preencher → recarregar → slides e exportação PDF de seis páginas.
- [ ] Cobrir sugestão sem gravação antes do aceite e link público revogado; testes controlam dados externos para serem repetíveis.
- [ ] Executar lint, typecheck, testes de domínio e e2e; registrar evidências e limitações reais.
- [ ] Ensaio com Do Fundo do Poço em ambiente publicado registra duração inferior a 3 h e saídas; corrigir bloqueadores antes de concluir a fase.

### Dependências

[#17](https://github.com/Cerne17/market-analyst/issues/17), [#18](https://github.com/Cerne17/market-analyst/issues/18), [#22](https://github.com/Cerne17/market-analyst/issues/22)

<a id="f3-01"></a>

## F3-01 — Comparar cenários completos de economia da unidade no Venture

Issue publicada: [#24](https://github.com/Cerne17/market-analyst/issues/24).

Milestone: **Fase 3 — Venture** · Prioridade: **P1** · Tipo: **AFK**

Referência: SPEC F2 Venture; fase 3.

### O que construir

Expandir economia da unidade para cenários nomeados comparáveis e benchmarks configuráveis.

### Critérios de aceite

- [ ] Tabela lado a lado exibe ARPA, margem, CAC, churn, vida média, LTV, razão, payback e churn anual.
- [ ] Limiares LTV:CAC e payback seguem SPEC, com nota de possível subinvestimento acima de 5 e cores acessíveis.
- [ ] Exemplos de churn 4%/8% e quiz ARPA 100, margem 0,7, churn 0,05, CAC 700 aparecem iguais ao domínio.
- [ ] Alterar modo mantém dados; casos sem churn ou sem denominador válido apresentam mensagem sem NaN.

### Dependências

[#23](https://github.com/Cerne17/market-analyst/issues/23)

<a id="f3-02"></a>

## F3-02 — Medir PMF por segmento com o teste dos 40%

Issue publicada: [#25](https://github.com/Cerne17/market-analyst/issues/25).

Milestone: **Fase 3 — Venture** · Prioridade: **P1** · Tipo: **AFK**

Referência: SPEC F2 PMF; F1 etapa 7; F6.

### O que construir

Registrar respostas por segmento e refletir o teste dos 40% na etapa de tração e score Venture.

### Critérios de aceite

- [ ] Coletar muito, pouco, nada e não usa por segmento com validação e persistência.
- [ ] Denominador exclui não usa; vazio retorna null com explicação, não zero enganoso.
- [ ] 18 respostas muito de 50 elegíveis resulta 36%; resultados por segmento e agregado são conferíveis.
- [ ] Regra de prontidão exige ao menos 30 respostas conforme contrato documentado e não confunde volume de respostas com atingir 40%.

### Dependências

[#23](https://github.com/Cerne17/market-analyst/issues/23)

<a id="f3-03"></a>

## F3-03 — Pesquisar concorrentes e selecionar alternativas com fontes

Issue publicada: [#26](https://github.com/Cerne17/market-analyst/issues/26).

Milestone: **Fase 3 — Venture** · Prioridade: **P1** · Tipo: **AFK**

Referência: SPEC F3 P1 research competitors.

### O que construir

Pesquisar alternativas na web e permitir inclusão seletiva na matriz do projeto.

### Critérios de aceite

- [ ] Verificar disponibilidade/nome atual da ferramenta web search Anthropic na documentação oficial; documentar fallback de provider se necessário.
- [ ] Retornar nome, URL, preço público quando disponível, resumo e data de acesso; sem URL marcar não verificado e não inventar preço.
- [ ] Usuário escolhe quais sugestões entram na matriz; pesquisar sozinho não altera conteúdo.
- [ ] Schemas, autorização, limites, logs de tokens e tratamento de falha/indisponibilidade seguem o copiloto.

### Dependências

[#23](https://github.com/Cerne17/market-analyst/issues/23)

<a id="f3-04"></a>

## F3-04 — Pesquisar uma premissa e aceitar valor com proveniência

Issue publicada: [#27](https://github.com/Cerne17/market-analyst/issues/27).

Milestone: **Fase 3 — Venture** · Prioridade: **P1** · Tipo: **AFK**

Referência: SPEC F3 P1 research assumption; F5.

### O que construir

Pesquisar fontes para uma premissa numérica e revisar valor, unidade, URL e data antes de aplicar.

### Critérios de aceite

- [ ] Consulta contextual identifica a premissa e retorna valor proposto com fonte, resumo, acesso e verificação.
- [ ] Sem fonte confiável, propor como obter o dado em vez de fabricar número.
- [ ] Aceite explícito grava valor e proveniência web; descarte não grava; conflitos com edição posterior são tratados.
- [ ] Fonte acompanha calculadora, relatório e slides; isolamento, limites e saída Zod são testados.

### Dependências

[#26](https://github.com/Cerne17/market-analyst/issues/26)

<a id="f3-05"></a>

## F3-05 — Acompanhar movimentos de MRR e aquisição mensal

Issue publicada: [#28](https://github.com/Cerne17/market-analyst/issues/28).

Milestone: **Fase 3 — Venture** · Prioridade: **P1** · Tipo: **AFK**

Referência: SPEC F8; §6.3.

### O que construir

Registrar métricas Venture e visualizar MRR, churn e aquisição por canal com retenção anual quando houver dados.

### Critérios de aceite

- [ ] Lançamento mensal de MRR início, novos, expansão, churn, contração e clientes, mais gasto/novos clientes por canal.
- [ ] MRR 40.000 + 2.400 + 400 − 1.600 − 0 = 41.200; CAC total ponderado e canal são iguais aos exemplos.
- [ ] Barras por movimento de MRR e linha de churn com acessibilidade; divisão por zero e histórico incompleto têm estados explícitos.
- [ ] NRR 1,05 e GRR 0,75 conferem com exemplo; coortes anuais só aparecem com 12 meses adequados e base definida.
- [ ] Permissões por papel, persistência e efeitos no relatório são verificados sem habilitar cobrança Stripe.

### Dependências

[#24](https://github.com/Cerne17/market-analyst/issues/24)

<a id="f3-06"></a>

## F3-06 — Imprimir relatório Venture em PDF legível

Issue publicada: [#29](https://github.com/Cerne17/market-analyst/issues/29).

Milestone: **Fase 3 — Venture** · Prioridade: **P1** · Tipo: **AFK**

Referência: SPEC F7 relatório PDF P1.

### O que construir

Disponibilizar rota de impressão do relatório completo, reutilizando dados, fórmulas e fontes do relatório.

### Critérios de aceite

- [ ] PDF inclui etapas completas, cenários, métricas disponíveis e fontes, com hipóteses identificadas.
- [ ] Layout paginado sem tabelas/gráficos cortados; renderizar e inspecionar PDF de projeto representativo.
- [ ] Versão pública respeita a mesma projeção sem diário e a revogação do link.
- [ ] Validar que Sprint, Markdown e slides permanecem funcionais; registrar aceite final da fase 3.

### Dependências

[#25](https://github.com/Cerne17/market-analyst/issues/25), [#27](https://github.com/Cerne17/market-analyst/issues/27), [#28](https://github.com/Cerne17/market-analyst/issues/28)

## Fora deste lote

P2: edição em tempo real, CNAEs secundários, Stripe, templates e comparação de projetos. O SPEC lista alguns desses itens também como fora de escopo; qualquer promoção exige decisão explícita, revisão de escopo e novo planejamento.
