# Contexto do Sonda

Sonda é uma ferramenta web privada, acessível por convite, para transformar evidências e premissas em análise de mercado e slides. O nome e o subdomínio `sonda.cerne.pro` são provisórios.

## Vocabulário

| Termo               | Significado no projeto                                                                               |
| ------------------- | ---------------------------------------------------------------------------------------------------- |
| Workspace           | Grupo que delimita acesso aos projetos; inicialmente Do Fundo do Poço e Meus projetos.               |
| Projeto             | Análise com modo, sete etapas, premissas, cenários, entrevistas e saídas.                            |
| Sprint              | Modo rápido para hackathon; economia da unidade e tração reduzidas, saída principal em slides.       |
| Venture             | Modo aprofundado; validação e acompanhamento pós-lançamento.                                         |
| Ideia livre         | Subtipo Sprint cuja etapa de tamanho usa TAM/SAM/SOM.                                                |
| Desafio corporativo | Subtipo Sprint cuja etapa de tamanho prioriza Valor do Problema.                                     |
| Etapa               | Dor, Cliente, Tamanho, Alternativas, Modelo e preço, Economia da unidade ou Tração/PMF, nessa ordem. |
| Premissa            | Valor numérico com unidade e origem manual, CNAE, web ou IA não verificada.                          |
| Cenário             | Conjunto nomeado de valores que substitui premissas para comparação.                                 |
| TAM / SAM / SOM     | Mercado total, mercado atendível e parcela alcançável; SOM exige prazo e respeita capacidade.        |
| ARPA                | Receita média por conta; explicitar periodicidade mensal ou anual.                                   |
| Valor do Problema   | Economia anual potencial: ocorrências × horas × custo/hora × parcela resolvida.                      |
| Compromisso         | Evidência de tempo, reputação ou dinheiro obtida em entrevista; diferente de elogio.                 |
| Score de prontidão  | Pontuação determinística 0–100 por modo; revela lacunas, não comprova viabilidade.                   |
| Hipótese            | Premissa ainda sem validação, identificada como tal na UI e nas saídas.                              |
| Versão              | Snapshot restaurável do conteúdo de um projeto.                                                      |

## Limites

O MVP cobre P0 das fases 0–2. Métricas e pesquisa web ficam na fase 3. Edição simultânea em tempo real, Stripe, cadastro público, app nativo e editor livre de slides ficam fora do MVP. Itens P2 do SPEC não têm implementação autorizada por este planejamento.

O copiloto sugere e critica; o usuário decide e aceita cada alteração. Toda premissa tem origem visível; dados de demonstração nunca se passam por dados da Receita.

## Estado atual

Fundação local implementada: aplicação Next.js com identidade Ascensão, temas e apresentação navegável das sete etapas. A trilha pública é informativa e não representa projetos ou dados persistidos.

Código de login por convite (magic link/GitHub), callbacks, seleção de workspaces e gestão de convites implementado. Migrations cobrem as 18 tabelas com RLS e testes em Postgres embarcado. Sem credenciais, o login permanece desabilitado e rotas privadas redirecionam para `/login`.

O e-mail do owner foi confirmado e fica apenas no ambiente local. Supabase ainda não foi provisionado: aplicar migrations/seed, executar bootstrap e configurar hook/template/OAuth para validar os fluxos hospedados. A CLI Vercel possui sessão válida; nenhum deploy foi realizado. As issues #2–#4 seguem abertas até seus aceites reais.
