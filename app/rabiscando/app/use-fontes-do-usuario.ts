"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ScribbleFont } from "../fonts";
import { MAX_BYTES, MAX_FONTES, PREFIXO_USUARIO } from "@/lib/rabiscando-fontes";

// Fontes que a pessoa traz do próprio computador, sem sair do navegador.
//
// O arquivo vira uma URL de objeto local, e daí em diante o editor a trata
// como qualquer outra: o mesmo `fetch` do carregador de fontes funciona sobre
// uma URL blob: — não há caminho especial em lugar nenhum do editor.

export interface EstadoFontes {
  fontes: ScribbleFont[];
  enviando: boolean;
  erro: string | null;
  adicionar: (arquivo: File) => Promise<string | null>;
  remover: (id: string) => void;
  cheio: boolean;
}

export function useFontesDoUsuario(): EstadoFontes {
  const [fontes, setFontes] = useState<ScribbleFont[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // As URLs de objeto seguram memória até serem revogadas. Guardadas aqui
  // para liberar quando a pessoa remove a fonte ou fecha a página.
  const urls = useRef(new Map<string, string>());

  useEffect(() => {
    const mapa = urls.current;
    return () => {
      mapa.forEach((url) => URL.revokeObjectURL(url));
      mapa.clear();
    };
  }, []);

  const adicionar = useCallback(
    async (arquivo: File): Promise<string | null> => {
      setErro(null);

      if (arquivo.size > MAX_BYTES) {
        setErro("a fonte passa de 3 MB");
        return null;
      }
      if (!/\.(ttf|otf)$/i.test(arquivo.name)) {
        setErro("só .ttf ou .otf");
        return null;
      }
      if (fontes.length >= MAX_FONTES) {
        setErro(`no máximo ${MAX_FONTES} fontes por sessão`);
        return null;
      }

      setEnviando(true);
      try {
        const bytes = await arquivo.arrayBuffer();

        // Parseia ANTES de aceitar: o que o opentype.js não abre também não
        // desenha, e é aqui que sai o nome real da fonte — melhor do que o
        // nome do arquivo, que costuma ser "font-final-v2".
        const opentype = await import("opentype.js");
        let nome = arquivo.name.replace(/\.[^.]+$/, "");
        try {
          const fonte = opentype.parse(bytes);
          nome = fonte.names?.fullName?.en ?? fonte.names?.fontFamily?.en ?? nome;
        } catch {
          setErro("não parece uma fonte válida (.ttf ou .otf)");
          return null;
        }

        const id = `${PREFIXO_USUARIO}${crypto.randomUUID().slice(0, 8)}`;
        const url = URL.createObjectURL(new Blob([bytes], { type: "font/ttf" }));
        urls.current.set(id, url);

        setFontes((atuais) => [
          ...atuais,
          {
            id,
            name: nome.slice(0, 48),
            file: url,
            nota: "sua fonte · só nesta sessão",
            // `pontos` orienta a calibragem do tremor nas fontes que
            // embarcamos, onde foi medido. Numa fonte de fora não há medição,
            // e inventar um número seria pior que admitir que não se sabe.
            pontos: 0,
            licenca: "OFL",
          },
        ]);
        return id;
      } catch {
        setErro("não foi possível ler o arquivo");
        return null;
      } finally {
        setEnviando(false);
      }
    },
    [fontes.length],
  );

  const remover = useCallback((id: string) => {
    const url = urls.current.get(id);
    if (url) {
      URL.revokeObjectURL(url);
      urls.current.delete(id);
    }
    setFontes((atuais) => atuais.filter((f) => f.id !== id));
  }, []);

  return { fontes, enviando, erro, adicionar, remover, cheio: fontes.length >= MAX_FONTES };
}
