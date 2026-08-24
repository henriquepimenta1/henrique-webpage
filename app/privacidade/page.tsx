import Link from "next/link";
import DarkTopNav from "@/components/dark-nav";
import DarkFooter from "@/components/dark-footer";

export const metadata = {
  title: "Privacidade — henriq.eu",
  description:
    "Que dados o site coleta, com quem eles são compartilhados e como pedir para apagá-los.",
  alternates: { canonical: "https://euhenriq.com/privacidade" },
};

// Política de privacidade. Descreve o sistema como ele É — se o Rabiscando
// passar a guardar ajustes no navegador, ou se entrar qualquer analytics,
// esta página muda junto. Uma política que descreve outro produto é pior do
// que nenhuma.

const ATUALIZADA_EM = "24 de agosto de 2026";
const CONTATO = "contato@euhenriq.com";

interface Secao {
  n: string;
  titulo: string;
  corpo: React.ReactNode;
}

const SECOES: Secao[] = [
  {
    n: "01",
    titulo: "Quem sou",
    corpo: (
      <>
        <p>
          Este site é operado por Henrique Sesana, pessoa física, em São Paulo, Brasil. O
          contato para qualquer assunto desta página é{" "}
          <a href={`mailto:${CONTATO}`}>{CONTATO}</a>.
        </p>
      </>
    ),
  },
  {
    n: "02",
    titulo: "O que o site coleta",
    corpo: (
      <>
        <p>
          <strong>Navegando pelas páginas públicas</strong> — portfolio, expedições, presets,
          a apresentação do Rabiscando —, nada é coletado sobre você. Não há analytics, não há
          pixel de rede social, não há cookie de publicidade. Nenhum banner de cookies aparece
          porque não há o que consentir.
        </p>
        <p>
          <strong>Ao criar conta no Rabiscando</strong>, são coletados nome, e-mail e foto de
          perfil. Se você entrar por uma conta Google, esses dados vêm do Google, junto com o
          identificador dessa conta; se entrar por e-mail, apenas o e-mail que você digitar. Um
          cookie de sessão mantém você conectado — sem ele, seria preciso fazer login a cada
          página.
        </p>
        <p>
          <strong>Ao assinar</strong>, os dados de pagamento são digitados dentro do ambiente do
          Stripe. Número de cartão nunca passa por este site nem é armazenado por mim. Do
          pagamento, ficam guardados apenas o identificador de cliente e de assinatura no
          Stripe, o plano escolhido e até quando ele vale — o suficiente para liberar seu acesso
          e nada além.
        </p>
        <p>
          <strong>Ao me escrever</strong>, ficam guardados seu e-mail e o que você mandou,
          enquanto a conversa fizer sentido.
        </p>
      </>
    ),
  },
  {
    n: "03",
    titulo: "Com quem esses dados são compartilhados",
    corpo: (
      <>
        <p>
          Nenhum dado é vendido, alugado ou cedido para publicidade. Três empresas processam
          dados porque operam partes do serviço:
        </p>
        <ul>
          <li>
            <strong>Clerk</strong> — guarda as contas e cuida do login.
          </li>
          <li>
            <strong>Stripe</strong> — processa os pagamentos e é quem, de fato, vê os dados do
            seu cartão.
          </li>
          <li>
            <strong>Vercel e Cloudflare</strong> — hospedam o site e entregam as páginas. Como
            todo servidor, registram endereço IP e navegador nos registros de acesso, usados
            para segurança e diagnóstico.
          </li>
        </ul>
        <p>
          Essas empresas ficam nos Estados Unidos, então seus dados são processados fora do
          Brasil. Fora isso, dados só são entregues a terceiros mediante ordem judicial.
        </p>
      </>
    ),
  },
  {
    n: "04",
    titulo: "Por quanto tempo ficam guardados",
    corpo: (
      <>
        <p>
          Os dados da conta ficam enquanto a conta existir. Se você pedir exclusão, a conta e os
          dados de perfil são apagados.
        </p>
        <p>
          Os registros de pagamento são a exceção: o Stripe é obrigado por lei fiscal e por
          regras antifraude a manter o histórico das transações por alguns anos, mesmo depois do
          cancelamento. Isso não está sob meu controle e não é negociável de nenhum dos dois
          lados.
        </p>
      </>
    ),
  },
  {
    n: "05",
    titulo: "O que você faz com o que é gerado no Rabiscando",
    corpo: (
      <>
        <p>
          Os arquivos que você exporta são gerados no seu próprio navegador e baixados direto
          para o seu computador. Eles não passam por nenhum servidor meu e eu não tenho como
          vê-los. O texto que você escreve na ferramenta também não é enviado para lugar
          nenhum.
        </p>
        <p>
          O que você produz é seu, para uso comercial inclusive. As fontes usadas são livres
          para uso comercial (SIL OFL ou Apache 2.0), com os textos de licença disponíveis junto
          aos arquivos.
        </p>
      </>
    ),
  },
  {
    n: "06",
    titulo: "Seus direitos",
    corpo: (
      <>
        <p>
          Pela Lei Geral de Proteção de Dados, você pode pedir a qualquer momento: confirmação
          de que trato dados seus, acesso a eles, correção do que estiver errado, exclusão,
          portabilidade e revogação do consentimento.
        </p>
        <p>
          Escreva para <a href={`mailto:${CONTATO}`}>{CONTATO}</a>. Respondo em até 15 dias, sem
          custo e sem exigir justificativa. Para excluir a conta, basta pedir por esse e-mail.
        </p>
      </>
    ),
  },
  {
    n: "07",
    titulo: "Mudanças nesta página",
    corpo: (
      <>
        <p>
          Se o que o site faz com dados mudar, esta página muda antes — não depois. Alterações
          relevantes para quem já é assinante são avisadas por e-mail.
        </p>
      </>
    ),
  },
];

export default function PrivacidadePage() {
  return (
    <div className="theme-fdl">
      <style>{`
.prv-wrap{max-width:760px;margin:0 auto;padding:var(--hero-clear) var(--pad-page) var(--sect-xl)}
.prv-kicker{font-family:var(--font-mono);font-size:10px;letter-spacing:.24em;text-transform:uppercase;color:var(--text-3);margin:0}
.prv-h1{font-family:var(--font-serif);font-weight:500;font-size:clamp(38px,5vw,60px);letter-spacing:-.015em;line-height:1.05;color:var(--text-1);margin:16px 0 24px;text-wrap:balance}
.prv-h1 em{font-style:italic;font-weight:400;color:var(--text-2)}
.prv-lead{font-family:var(--font-serif);font-style:italic;font-size:clamp(16px,1.5vw,19px);line-height:1.65;color:var(--text-2);max-width:50ch;margin:0}
.prv-meta{font-family:var(--font-mono);font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--text-3);margin:32px 0 0;padding-top:20px;border-top:1px solid var(--border)}

.prv-secao{padding:40px 0;border-top:1px solid var(--border)}
.prv-secao:first-of-type{border-top:none}
.prv-num{font-family:var(--font-mono);font-size:10px;letter-spacing:.2em;color:var(--accent);display:block;margin-bottom:10px}
.prv-h2{font-family:var(--font-serif);font-weight:500;font-size:24px;line-height:1.2;color:var(--text-1);margin:0 0 16px}
.prv-corpo p{font-family:var(--font-serif);font-size:15px;line-height:1.75;color:var(--text-2);max-width:60ch;margin:0 0 14px}
.prv-corpo p:last-child{margin-bottom:0}
.prv-corpo strong{color:var(--text-1);font-weight:600}
.prv-corpo ul{margin:0 0 14px;padding-left:20px;max-width:60ch}
.prv-corpo li{font-family:var(--font-serif);font-size:15px;line-height:1.75;color:var(--text-2);margin-bottom:8px}
.prv-corpo a{color:var(--accent);border-bottom:1px solid var(--accent);text-decoration:none}
.prv-corpo a:hover{color:var(--accent-hover);border-bottom-color:var(--accent-hover)}

.prv-volta{display:inline-block;margin-top:48px;font-family:var(--font-mono);font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--text-3);text-decoration:none}
.prv-volta:hover{color:var(--accent)}

@media(max-width:640px){
  .prv-wrap{padding-top:96px}
  .prv-secao{padding:32px 0}
}
      `}</style>

      <DarkTopNav />

      <main className="prv-wrap">
        <header>
          <p className="prv-kicker">Privacidade</p>
          <h1 className="prv-h1">
            O que este site sabe <em>sobre você</em>.
          </h1>
          <p className="prv-lead">
            Escrito para ser lido, não para se proteger de você. Se algo aqui estiver vago,
            escreva e eu esclareço.
          </p>
          <p className="prv-meta">Atualizada em {ATUALIZADA_EM}</p>
        </header>

        <div>
          {SECOES.map((s) => (
            <section className="prv-secao" key={s.n}>
              <span className="prv-num">{s.n}</span>
              <h2 className="prv-h2">{s.titulo}</h2>
              <div className="prv-corpo">{s.corpo}</div>
            </section>
          ))}
        </div>

        <Link className="prv-volta" href="/">
          ← voltar ao site
        </Link>
      </main>

      <DarkFooter />
    </div>
  );
}
