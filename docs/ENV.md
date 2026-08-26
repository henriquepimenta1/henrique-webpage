# Variáveis de ambiente

Este site não tem `.env.example`. A fonte de verdade prática é o `.env.local`
(local, fora do git) e o painel de Environment Variables da Vercel.

`vercel env pull .env.local` traz a lista, **mas volta com valor vazio (`""`)
toda variável marcada como sensitive** — hoje é o caso das 4 do Stripe e das 2
do Clerk. Sem preenchê-las à mão o `/rabiscando/app` local quebra logo no
`clerkMiddleware` com "Missing publishableKey". Copie os valores do painel da
Vercel (ou dos dashboards do Clerk/Stripe) para o `.env.local` depois do pull.

<!-- AUTO-GENERATED -->
## Obrigatórias

| Variável | Onde é lida | Descrição |
|----------|-------------|-----------|
| `STRIPE_SECRET_KEY` | `lib/stripe.ts:21` | Chave secreta do servidor Stripe. Nunca importar `lib/stripe.ts` de componente cliente. |
| `STRIPE_PRICE_MENSAL` | `lib/stripe.ts:41` | Price ID do plano mensal do Rabiscando. |
| `STRIPE_PRICE_ANUAL` | `lib/stripe.ts:40` | Price ID do plano anual do Rabiscando. |
| `STRIPE_WEBHOOK_SECRET` | `lib/stripe.ts:45` | Segredo de assinatura HMAC usado por `app/api/stripe/webhook/route.ts`. |
| `CLERK_SECRET_KEY` | SDK `@clerk/nextjs` | Chave secreta do Clerk (servidor). |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | SDK `@clerk/nextjs` | Chave pública do Clerk (browser). |

Nenhuma delas é lida no topo de módulo: `lib/stripe.ts` instancia sob demanda,
então um build sem chaves passa e só a rota que usa Stripe falha em runtime.

## Opcionais

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `NEXT_PUBLIC_APP_URL` | fallback `https://$VERCEL_URL`, senão `http://localhost:3000` | URL base usada para montar as URLs de retorno do checkout (`lib/stripe.ts:53`). |

## Injetadas pela plataforma

Não configure à mão. `VERCEL`, `VERCEL_ENV`, `VERCEL_URL`, `VERCEL_TARGET_ENV`,
`VERCEL_OIDC_TOKEN`, `VERCEL_GIT_*`, `TURBO_*`, `NX_DAEMON` chegam prontas da
Vercel e aparecem no `.env.local` só porque o `vercel env pull` as traz.

`BLOB_STORE_ID` e `BLOB_WEBHOOK_PUBLIC_KEY` estão no ambiente mas nenhum
código do repositório as lê hoje — resquício de um Blob store conectado ao
projeto.
<!-- AUTO-GENERATED -->
