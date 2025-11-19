"use client";

import { getTickerTapeData } from "@/services/ticker-tapes";
import { ITickerTapeItem } from "@/services/ticker-tapes/type";
import React, {
  createContext,
  useCallback,
  useState,
  ReactNode,
  FC,
  useRef,
  useEffect,
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

  const loadingRef = useRef(loadingQuote);
  
  // 6. SINCRONIZAÇÃO DA REF: Mantém a Ref atualizada com o Estado real
  useEffect(() => {
    loadingRef.current = loadingQuote;
  }, [loadingQuote]);

  // A função de busca, exatamente como no seu exemplo
  const fetchTickerTapeData = useCallback(async () => {
    
    // 7. VERIFICAÇÃO COM A REF: Acessa o valor mais recente sem ser dependência
    if (loadingRef.current) return; 

    setLoadingQuote(true);
    console.log("[QuoteContext] Iniciando busca de dados do Ticker Tape...");

    try {
      const data = await getTickerTapeData();
      setTickerTapeItems([...data, ...data]);
      console.log("[QuoteContext] Dados recebidos.");
    } catch (error) {
      console.error("[QuoteContext] Falha ao buscar dados:", error);
      setTickerTapeItems([]);
    } finally {
      setLoadingQuote(false);
      console.log("[QuoteContext] Busca de dados finalizada.");
    }
    
  }, []); // Dependência 'loading' como no seu exemplo

  return (
    <QuoteContext.Provider
      value={{ tickerTapeItems, loadingQuote, fetchTickerTapeData }}
    >
      {children}
    </QuoteContext.Provider>
  );
};
