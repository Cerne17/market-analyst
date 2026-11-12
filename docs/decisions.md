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

## Pendências

- Confirmar contas/projetos Supabase e Vercel, acesso a DNS/domínio e ambientes de preview/produção.
- Confirmar e-mail do owner e convidados iniciais; definir bootstrap seguro e repetível, sem inferir identidade pelo primeiro login público.
- Definir se um e-mail pode receber convites para múltiplos workspaces: o SPEC declara `email` como chave primária de invites, mas prevê associação por workspace; resolver antes da migration.
- Documentar exceções do esquema a campos universais `id` e timestamps: o SPEC também lista chaves naturais e compostas; resolver antes da migration.
- Decidir campos, retenção e política de restauração dos snapshots sem restaurar segredos, tokens públicos ou registros de uso de IA.
- Definir periodicidade e unidades comparáveis no critério de preço (< 20% do custo da dor/valor) antes de implementar o score.
- Confirmar layout vigente dos dados CNPJ, volume agregado e competência real antes de importação.
- Confirmar modelo Claude Sonnet disponível e nomes das ferramentas de pesquisa na documentação oficial antes da integração.
- Confirmar data do hackathon; não transformar estimativas de dias do SPEC em datas de compromisso.
