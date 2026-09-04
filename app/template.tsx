// Transição de entrada de página.
//
// Isto já foi um `motion.div` do framer-motion com `initial={{opacity:0}}`.
// O efeito era o mesmo, mas o custo não: o HTML saía do servidor invisível e
// só aparecia depois que o bundle do framer-motion baixava e hidratava — ou
// seja, o LCP de TODA página ficava refém do JavaScript. Em CSS puro a
// animação começa no primeiro paint e o componente deixa de ser client,
// então não vai bundle nenhum junto.
//
// A regra `.page-enter` vive em app/globals.css.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
