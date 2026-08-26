# Runbook — euhenriq.com

Hospedagem: Vercel. DNS: Cloudflare. Contas: Clerk. Pagamento: Stripe.

## Deploy

Deploy é por git: push na branch `main` promove para produção; qualquer outra
branch gera preview. Não há `vercel.json`/`vercel.ts` — a configuração vive no
painel do projeto.

```bash
git push origin main          # produção
vercel                        # preview manual
vercel --prod                 # produção manual (evite; prefira o push)
```

Depois do deploy, confira:

1. Home carrega e os cabeçalhos de segurança vieram (`X-Frame-Options: DENY`,
   `Content-Security-Policy: frame-ancestors 'none'`, `X-Content-Type-Options`,
   `Referrer-Policy`, `Permissions-Policy`) — definidos em `next.config.ts`.
2. `/rabiscando` (venda) renderiza.
3. `/rabiscando/app` deslogado mostra o portão próprio, no domínio, com o tema
   do site — **não** a tela hospedada do Clerk em accounts.dev.
4. Um checkout de teste chega ao Stripe e volta para a URL certa.

<!-- AUTO-GENERATED -->
## Superfície de API

| Rota | Método | Auth | Observação |
|------|--------|------|------------|
| `/api/stripe/checkout` | POST | Clerk (`auth.protect()` no `proxy.ts`) | Cria a sessão de checkout do plano. |
| `/api/stripe/portal` | POST | Clerk (`auth.protect()` no `proxy.ts`) | Abre o portal de billing do cliente. |
| `/api/stripe/webhook` | POST | Assinatura HMAC do Stripe | Fora do `auth.protect()` de propósito — quem chama é o Stripe. `runtime = "nodejs"`. |

O matcher do `proxy.ts` é deliberadamente estreito (`/rabiscando/app/:path*` e
`/api/stripe/:path*`) para as ~18 páginas estáticas não perderem o prerender.
Ampliar esse matcher é uma mudança de performance, não de conveniência.
<!-- AUTO-GENERATED -->

## Health checks e observabilidade

Não há endpoint `/health` dedicado. O que se usa:

- Vercel → Deployments → Runtime Logs (erros de função em tempo real).
- Vercel → Web Analytics (queda de tráfego costuma ser o primeiro sintoma).
- Stripe → Developers → Webhooks: taxa de entrega de `/api/stripe/webhook`.
- Clerk → Dashboard: sessões e falhas de login.

## Problemas comuns

| Sintoma | Causa provável | Correção |
|---------|----------------|----------|
| Rota Stripe responde 500 com "variável de ambiente ausente: X" | Chave faltando naquele ambiente (comum em preview de branch) | Adicione a variável na Vercel para o ambiente certo e faça redeploy. O build passa sem elas de propósito. |
| Webhook do Stripe falhando com 400 | `STRIPE_WEBHOOK_SECRET` é de outro endpoint/ambiente | Pegue o segredo do endpoint correto no painel do Stripe. |
| Deslogado cai em accounts.dev ao abrir `/rabiscando/app` | Alguém pôs a rota em `rotasProtegidas` no `proxy.ts` | Tire de lá. O portão daquela área é o layout, que lê `auth()` no servidor. |
| Páginas estáticas ficaram lentas / perderam prerender | Matcher do `proxy.ts` alargado | Volte ao matcher estreito. |
| Login quebrado só em produção após mexer em cabeçalhos | CSP restritiva demais bloqueando o script do Clerk (clerk.euhenriq.com) | Só `frame-ancestors` é seguro sem inventário completo de scripts — ver comentário no `next.config.ts`. |

## Rollback

Vercel → Deployments → escolha o deploy anterior bom → **Promote to
Production**. É instantâneo e não depende de rebuild. Só depois investigue e
corrija no git.

Se o problema for de configuração (variável de ambiente), corrija a variável e
faça redeploy — promover deploy antigo não resolve, porque as variáveis são
lidas em runtime.

## Escalonamento

Projeto de uma pessoa. Não há plantão nem alerta automático configurado. O
canal de contato do site é `/contato`.
