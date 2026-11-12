# Labels

## Papéis de triagem

| Papel                         | Label exata       | Significado                                                          |
| ----------------------------- | ----------------- | -------------------------------------------------------------------- |
| Avaliação                     | `needs-triage`    | Esclarecer escopo ou dependências antes de executar.                 |
| Aguardando informação         | `needs-info`      | Falta uma resposta ou informação externa.                            |
| Pronta para execução autônoma | `ready-for-agent` | Sem bloqueadores e com critérios suficientes para execução autônoma. |
| Pronta para execução humana   | `ready-for-human` | Sem bloqueadores, mas requer interação humana.                       |
| Não executar                  | `wontfix`         | Decisão explícita de não realizar.                                   |

Manter um papel de triagem ativo por vez. Labels existentes do GitHub, como `bug`, `documentation` e `enhancement`, podem complementar o papel.

## Planejamento

- `priority:P0`: MVP (fases 0–2).
- `priority:P1`: pós-MVP (fase 3).
- `execution:AFK`: implementação prevista sem interação humana, depois de desbloqueada.
- `execution:HITL`: exige intervenção humana, por exemplo contas, credenciais ou ensaio com o time.
- `blocked`: dependências ainda não concluídas ou aceite da fase anterior pendente.

Prioridade não é ordem de execução. Milestone identifica a fase; dependências identificam a ordem. Na publicação inicial, issues dependentes recebem `blocked` e `needs-triage`, sem `ready-for-agent` prematuro.
