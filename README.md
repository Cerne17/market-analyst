# Sonda · Market Analyst

Ferramenta privada de análise de mercado guiada para hackathons (Sprint) e projetos para vender (Venture). Interface e documentação em PT-BR.

**Estado:** fundação local implementada: Next.js, layout Ascensão, trilha navegável, temas e pipeline de qualidade. Autenticação, banco e deploy ainda aguardam configuração e implementação.

Entrega inicial: [#1 — Layout Ascensão e checks automatizados](https://github.com/Cerne17/market-analyst/issues/1). As demais entregas da milestone 0 continuam pendentes.

## Documentação

- [Especificação original](docs/SPEC.md)
- [Índice da documentação](docs/README.md)
- [Contexto e vocabulário](CONTEXT.md)
- [Plano de entregas](docs/planning/backlog.md)
- [Decisões técnicas](docs/decisions.md)
- [Orientações de desenvolvimento](AGENTS.md)
- [Execução e validação local](docs/development.md)
- [Configuração de Supabase e Vercel](docs/setup-services.md)

## Trabalho

[Issues](https://github.com/Cerne17/market-analyst/issues) · [Milestones](https://github.com/Cerne17/market-analyst/milestones)

O desenvolvimento segue as fases 0–3 do SPEC. Não iniciar a próxima fase antes de verificar o aceite da anterior. Não há data de hackathon confirmada.

## Executar localmente

Requisitos: Node.js 24 e pnpm 12.18.0 (fixado em `packageManager`; use Corepack se necessário).

```bash
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
```

Abra [localhost:3000](http://localhost:3000). A página inicial e a apresentação das sete etapas funcionam sem credenciais. `/login` informa que o acesso ainda está em preparação; não há criação ou salvamento de projetos nesta entrega.

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
```

Os testes de navegador usam o build de produção, que deve existir antes da execução. O workflow de CI executa essa sequência. Chaves reais ficam em `.env.local` ou no serviço de hospedagem, nunca no Git.
