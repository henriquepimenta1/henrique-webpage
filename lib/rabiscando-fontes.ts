// Regras das fontes que o próprio assinante traz.
//
// Nesta versão elas NÃO saem do navegador: o arquivo é lido da máquina da
// pessoa, vira uma URL de objeto local e desaparece ao fechar a aba. É o que
// mantém intacta a frase da landing e da política de privacidade — nada do
// que a pessoa escreve ou traz passa por servidor nosso.
//
// A versão que guarda na conta existe pronta na branch `fontes-na-conta`,
// esperando o BLOB_READ_WRITE_TOKEN. Quando entrar, vira uma escolha da
// pessoa, desmarcada por padrão, e os dois textos acima mudam junto.

/** Teto por sessão. Cada fonte fica na memória do navegador enquanto a aba
 *  estiver aberta; passar disso é desperdício sem ganho. */
export const MAX_FONTES = 10;

/** 3 MB. A maior fonte que embarcamos tem 416 KB; isso cobre com folga
 *  qualquer manuscrita e ainda barra um arquivo trocado por engano. */
export const MAX_BYTES = 3 * 1024 * 1024;

/** Prefixo que distingue uma fonte trazida das que vêm com a ferramenta. */
export const PREFIXO_USUARIO = "u_";

export function ehFonteDoUsuario(id: string): boolean {
  return id.startsWith(PREFIXO_USUARIO);
}
