# Contribuindo

Site pessoal `euhenriq.com` — Next.js 16 (App Router), React 19, Tailwind 4,
Clerk para contas e Stripe para o plano do Rabiscando.

## Antes de escrever código

Leia `AGENTS.md`. Esta versão do Next tem quebras em relação ao que a maioria
das referências (e modelos) conhece: a documentação que vale é a de
`node_modules/next/dist/docs/`. O caso mais visível é que `middleware.ts` virou
`proxy.ts` — o arquivo na raiz do repositório.

## Ambiente

Pré-requisitos: Node.js 24 LTS, npm, conta com acesso ao projeto na Vercel.

```bash
npm install
vercel env pull .env.local   # traz as chaves de Clerk e Stripe
npm run dev                  # http://localhost:3000
```

As variáveis estão documentadas em [ENV.md](./ENV.md).

<!-- AUTO-GENERATED -->
## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Sobe o servidor de desenvolvimento do Next em `localhost:3000`. |
| `npm run build` | Build de produção (inclui checagem de tipos). |
| `npm run start` | Serve o build de produção localmente. |
| `npm run lint` | Roda o ESLint (`eslint.config.mjs`, base `eslint-config-next`). |
<!-- AUTO-GENERATED -->

## Testes

O repositório **não tem suíte de testes automatizados** hoje — não há runner,
nem arquivos de teste, nem cobertura. A verificação antes de subir é manual:

1. `npm run build` passa sem erro de tipo.
2. `npm run lint` sem erro NOVO. Atenção: a base já tem 9 erros herdados
   (`react-hooks/set-state-in-effect` e `react-hooks/refs`, em `app/presets/*`,
   `components/count-up.tsx`, `portfolio-gallery.tsx`, `terrain-map.tsx` e
   `ui/map.tsx`) — compare com a saída antes da sua mudança.
3. Fluxos sensíveis conferidos no navegador: entrar em `/rabiscando/app`
   (portão do Clerk renderizado pelo layout, não redirect para accounts.dev),
   checkout, e o retorno do checkout.

Se for adicionar testes, comece pelos limites que quebram calado: as rotas
Stripe e a geração de traçado do Rabiscando (`app/rabiscando/*.ts`).

## Estilo

- Comentários e mensagens de commit em português.
- Comentário explica *por que*, não *o que* — o padrão do repositório é
  registrar a decisão e o que ela evita (ver `next.config.ts` e `proxy.ts`).
- Arquivos focados; extraia utilitário em vez de deixar módulo crescer.
- Sem segredo hardcoded. Chave de servidor só em módulo de servidor.

## Commits e PR

Conventional commits, com escopo quando houver: `fix(rabiscando): ...`.
Tipos em uso: `feat`, `fix`, `refactor`, `docs`, `chore`, `perf`, `ci`.

Checklist antes de abrir PR:

- [ ] `npm run build` passa e o `npm run lint` não ganhou erro novo
- [ ] Nenhum segredo novo no diff
- [ ] Variável de ambiente nova documentada em `docs/ENV.md`
- [ ] Deploy de preview da Vercel conferido no navegador
- [ ] `graphify update .` rodado se arquivos de código mudaram (ver `CLAUDE.md`)
