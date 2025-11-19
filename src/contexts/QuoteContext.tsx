"use client";

import { getTickerTapeData } from "@/services/ticker-tapes";
import { ITickerTapeItem } from "@/services/ticker-tapes/type";
import React, {
  createContext,
  useCallback,
  useState,
  ReactNode,
  FC,
} from "react";

// 1. Definição da interface do Contexto (como no seu exemplo)
interface QuoteContextProps {
  tickerTapeItems: ITickerTapeItem[];
  loadingQuote: boolean;
  fetchTickerTapeData: () => Promise<void>;
}

// 2. Criação do Contexto com valor padrão (como no seu exemplo)
export const QuoteContext = createContext<QuoteContextProps>({
  tickerTapeItems: [],
  loadingQuote: false,
  fetchTickerTapeData: async () => {
    console.warn("fetchTickerTapeData chamado fora do QuoteProvider");
  },
});

// 3. Definição das props do Provedor (como no seu exemplo)
interface QuoteProviderProps {
  children: ReactNode;
}

// 4. Componente Provedor (como no seu exemplo)
export const QuoteProvider: FC<QuoteProviderProps> = ({ children }) => {
  const [tickerTapeItems, setTickerTapeItems] = useState<ITickerTapeItem[]>([]);
  const [loadingQuote, setLoadingQuote] = useState(false);

  // A função de busca, exatamente como no seu exemplo
  const fetchTickerTapeData = useCallback(async () => {
    if (loadingQuote) return;

    setLoadingQuote(true);
    console.log("[QuoteContext] Iniciando busca de dados do Ticker Tape...");

    try {
      const data = await getTickerTapeData();
      // Duplica os dados para o loop infinito do carrossel
      setTickerTapeItems([...data, ...data]);
      console.log("data: ", data);
      console.log("[QuoteContext] Dados recebidos.");
    } catch (error) {
      console.error("[QuoteContext] Falha ao buscar dados:", error);
      setTickerTapeItems([]);
    } finally {
      setLoadingQuote(false);
      console.log("[QuoteContext] Busca de dados finalizada.");
    }
  }, [loadingQuote]); // Dependência 'loading' como no seu exemplo

  return (
    <QuoteContext.Provider
      value={{ tickerTapeItems, loadingQuote, fetchTickerTapeData }}
    >
      {children}
    </QuoteContext.Provider>
  );
};
