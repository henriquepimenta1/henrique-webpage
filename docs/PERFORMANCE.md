# Performance da home — o que foi feito e o que falta

Última atualização: 2026-09-05. Commits `c485d0a` → `4dc7da8`.

## Ponto de partida

PageSpeed Insights mobile em euhenriq.com: **Performance 66, LCP 28,7 s**.

## Onde o tempo estava

A ordem importa: os problemas 2 e 3 só ficaram visíveis depois de resolver o 1.
Se você atacar imagem primeiro numa situação parecida, vai medir ruído.

| # | Causa | LCP depois |
|---|---|---|
| 1 | `app/template.tsx` envolvia toda página num `motion.div` do framer-motion com `initial={{opacity:0}}`. O HTML saía do servidor invisível e esperava o bundle hidratar — o LCP era refém do JS, não dos bytes de imagem. | 28,7 s → **4,5 s** |
| 2 | O elemento de LCP era um `<div class="v3-panel-bg">` com `background-image` em CSS: indetectável no HTML inicial, descoberto só depois de baixar e casar o CSS. | 4,5 s → **3,6 s** |
| 3 | 6 arquivos de fonte (209 KB) começavam a baixar **antes** da imagem do LCP e disputavam a mesma banda. | 3,6 s → **2,4 s** |

## Estado atual

Lighthouse 12 mobile, `throttling-method=simulate`, 4 execuções válidas:

| Métrica | Valor |
|---|---|
| LCP | 2,3 / 2,4 / 2,8 / 2,8 s |
| Performance | 95 / 97 / 98 |
| Acessibilidade | **100** |
| Práticas recomendadas | 100 |
| TBT | 0–10 ms |
| CLS | 0 |

**Critério de aceite:** Performance (>90) e Acessibilidade (100) batidos. LCP na
fronteira dos 2,5 s — mediana 2,6 s, com metade das runs abaixo do alvo.

### ⚠️ Ressalva sobre a medição

**Estes números NÃO são do PageSpeed Insights.** A quota diária da API pública
estourou (HTTP 429) nas duas tentativas. Foi usado Lighthouse 12 local — mesmo
motor, mesmo perfil mobile — mas **a partir da rede local**. O TTFB medido foi de
641 ms, quase todo latência até a edge da Vercel. O PSI roda dos servidores do
Google e tende a medir TTFB menor, logo **LCP menor**.

**Pendência: rodar o PSI oficial e confirmar.** A expectativa é ficar
confortavelmente abaixo de 2,5 s, mas isso não foi verificado.

Para reproduzir a medição local:

```bash
npx lighthouse@12 https://euhenriq.com/ \
  --form-factor=mobile --screenEmulation.mobile \
  --throttling-method=simulate \
  --only-categories=performance,accessibility \
  --chrome-flags="--headless=new --no-sandbox" --view
```

Rode **3 a 5 vezes e use a mediana**. A variância entre execuções é alta e vem da
conexão, não do site: uma run chegou a dar LCP 7,2 s com FCP 5,4 s, e outra falhou
com `NO_FCP`. Descarte outliers com FCP anômalo.

## Mudanças aplicadas

### `app/template.tsx`
Framer-motion → animação CSS (`.page-enter` em `globals.css`). Deixou de ser
client component. O framer-motion sumiu por completo dos chunks da home.

### `app/globals.css`
- `@keyframes page-enter` substituindo a animação JS.
- `.reveal`/`.reveal-up`: o estado inicial `opacity:0` agora fica atrás de
  `html.reveal-js`. Sem isso, quem estivesse com o JS ainda não executado veria
  página em branco — e o conteúdo acima da dobra esperava o observer.
- `.v3-panel-bg` / `.v3-door-bg` / `.v3-cta-bg`: `background-size:cover` →
  `object-fit:cover` (o `fill` do next/image já aplica position/inset inline).

### `app/page.tsx`
- Observer do reveal saiu do `useEffect` e virou script inline (roda no parse do
  HTML, não espera hidratação). Sem hooks, a home virou **server component**.
- 3 `background-image` + 2 `<img>` → `next/image`. Zero de cada um sobrou.
- `priority` **só no primeiro painel** — o Lighthouse confirma que é ele o LCP.
  Prear o segundo junto só tirava banda do primeiro.

### `app/layout.tsx`
`Newsreader` com `preload: false`. É a família mais pesada (4 faces, com itálico)
e acima da dobra aparece só num kicker pequeno. Como o LCP da home é uma
**imagem**, prearregar serif na frente dela é prioridade invertida.

Preloads no `<head>`: 6 fontes + 2 imagens → **4 fontes + 1 imagem**.

### `next.config.ts`
```ts
images: {
  formats: ["image/webp"],                                  // sem AVIF
  deviceSizes: [400, 640, 828, 1080, 1280, 1600, 1920],      // breakpoints reais
  imageSizes: [128, 256, 384],
  minimumCacheTTL: 31536000,
}
```
Os `deviceSizes` saem dos breakpoints do CSS (640 / 900 / 960), não da lista
padrão do Next — que inclui 2048 e 3840, larguras que este site nunca serve.
Menos variantes = menos transformação cobrada pela Vercel.

Valores de `sizes` em uso na home:

| Elemento | `sizes` |
|---|---|
| `.v3-panel-bg` (hero) | `(max-width: 900px) 100vw, 34vw` |
| `.v2-exp-img-col` | `(max-width: 960px) 100vw, 52vw` |
| `.v3-frame` | `(max-width: 640px) 100vw, (max-width: 960px) 50vw, 42vw` |
| `.v3-door-bg` (cards) | `(max-width: 960px) 100vw, 50vw` |
| `.v3-cta-bg` | `100vw` |

### `components/dark-footer.tsx`
`opacity: 0.6` → `0.75` em "Desde 2018". Era a única falha de acessibilidade:
3,76:1, abaixo dos 4,5:1 exigidos para 13px. Agora 5,28:1.

### Imagens recomprimidas
Só as 10 que a home usa: **10,41 MB → 2,51 MB**. Estavam salvas em qualidade
~100, daí quedas de até 92% sem diferença visível. `outdoor-grain-capa.jpg`
sozinho era 3,9 MB → 386 KB.

A imagem do LCP no mobile chega hoje em **26 KB de WebP** (era 368 KB de JPEG).

- Script: `scripts/recompress-imagens.mjs` (teto 2000 px, qualidade 82, mozjpeg).
- Originais preservados **fora do repo**, em
  `../henrique-webpage-originais-pre-otimizacao/`.

## O que NÃO foi feito, e por quê

| Item da lista original | Status |
|---|---|
| CSS crítico / dividir chunk bloqueante (~320 ms) | **Desnecessário.** O Lighthouse hoje reporta `render-blocking-resources: 0 ms`. O chunk caiu para 15 KB e deixou de ser gargalo sozinho, ao remover o framer-motion. |
| JS não usado (~52 KiB) + bundle analyzer | **Não feito.** Sobrou `unused-javascript: -50ms / -28KiB`. Com TBT em 0 ms, não é o que separa o site dos 2,5 s. |
| Polyfills / browserslist (~26 KiB) | **Não feito.** O audit reporta `legacy-javascript: -0ms`. Custa bytes, não tempo. |
| Cache-control `immutable` em `/_next/static` e `/images` | **Não feito.** Só o `minimumCacheTTL` das imagens otimizadas entrou. Ganho estimado de 4 KiB. |

## Próximos passos

1. **Rodar o PSI oficial** e confirmar o LCP real (ver ressalva acima). É o único
   item que fecha o critério de aceite de verdade.
2. **Migrar o resto do site para `next/image`** — 34 `<img>` e 8
   `background-image` em `presets/*`, `expedicoes/*`, `midiakit`, `quadros`,
   `sobre` e `components/portfolio-gallery.tsx`. Não afeta o score da home;
   é consistência e peso das outras páginas.
   **Cuidado:** os sliders de antes/depois em `presets/fotografia`,
   `presets/outdoor-grain` e `portfolio-gallery` usam containers clipados e
   precisam ser testados um a um.
3. **Recomprimir o resto de `public/images`** (~200 MB fora da home) com
   `scripts/recompress-imagens.mjs`. Maiores ofensores conhecidos:
   `exp-huayhuash.jpg` (8,7 MB), `hiker.jpg` (5,1 MB), `work/*` e `quadros/*`
   (2–3 MB cada).
4. **Monitorar a cota de Image Optimization da Vercel.** São 332 imagens; com
   `next/image` cada origem única gera transformações cobradas. Se apertar, o
   plano B é pré-gerar tamanhos no build e usar `unoptimized`.

## Fora de escopo, mas anotado

**SEO aparece 92, não 100** — e não tem relação com este trabalho. A falha é
`robots.txt is not valid`, na linha:

```
Content-Signal: search=yes,ai-train=no,use=reference
```

O Lighthouse não reconhece essa diretiva. Veio do commit `2592e15` (24/08,
lançamento do Rabiscando). Como o pedido era não mexer em SEO, ficou como está.

## Armadilhas encontradas (para não repetir)

- **`npm start` falhando silencioso.** Um `next start` antigo segurava a porta
  3000; o novo morria com `EADDRINUSE` e o navegador continuava servindo o build
  anterior. Isso gerou "regressões" que não existiam. Sempre
  `lsof -ti:3000 | xargs -r kill -9` antes, e confira o log do start.
- **Aquecer o cache do otimizador antes de medir.** A primeira requisição a
  `/_next/image?...` faz a transformação sob demanda. Medir a frio mede um custo
  que nenhum usuário real paga depois.
- **`NO_FCP` no Lighthouse headless é flake**, não bug do site. Confirme com
  `--throttling-method=provided` (deu FCP 0,2 s) antes de sair caçando causa.
