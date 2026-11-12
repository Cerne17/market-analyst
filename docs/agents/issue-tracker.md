# Issue tracker: GitHub

Repositório: `Cerne17/market-analyst`. Issues e milestones vivem no GitHub; não criar tracker local paralelo.

Preferir o conector GitHub quando ele suportar a operação. Para milestones, labels e dependências não suportadas pelo conector, usar `gh api`. Informar o repositório explicitamente em operações do CLI.

- Consultar: `gh issue view NUMERO --repo Cerne17/market-analyst --comments`.
- Listar: `gh issue list --repo Cerne17/market-analyst --state open --limit 100`.
- Criar: `gh issue create --repo Cerne17/market-analyst --title 'Título' --body-file /caminho/corpo.md`.
- Editar: `gh issue edit NUMERO --repo Cerne17/market-analyst --body-file /caminho/corpo.md`.

Corpos multilinha devem usar argumento estruturado ou arquivo e `--body-file`; nunca interpolar texto arbitrário no shell. Não enviar comentários ou mensagens a pessoas sem autorização específica.

Antes de publicar, conferir títulos existentes para evitar duplicatas. Publicar bloqueadores antes das dependentes e usar referências reais `#N`. Cada issue deve conter objetivo, critérios verificáveis, dependências, prioridade, milestone e necessidade de interação humana.

Uma issue bloqueada não está pronta para execução autônoma. Só aplicar `ready-for-agent` depois de remover bloqueios e esclarecer decisões. Fechar após evidência de aceite; concluir uma issue não implica que a fase inteira passou.
