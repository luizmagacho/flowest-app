"use client";

import { searchTickers } from "@/services/tickers";
import { ITicker } from "@/services/tickers/type";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

interface TickerContextProps {
  tickers: ITicker[];
  loading: boolean;
  handleSearchTickers: (query: string) => Promise<void>;
}

export const TickerContext = createContext<TickerContextProps>({
  tickers: [],
  loading: false,
  handleSearchTickers: async () => {
    console.warn("handleGetTicker chamado fora do TickerProvider");
  },
});

interface TickerProps {
  children: React.ReactNode;
}

export const TickerProvider: React.FC<TickerProps> = ({ children }) => {
  const [tickers, setTickers] = useState<ITicker[]>([]);
  const [loading, setLoading] = useState(false);

  const loadingRef = useRef(loading);
  
  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  const handleSearchTickers = useCallback(
    async (query: string) => {
      if (loadingRef.current) return;

      if (!query) {
        setTickers([]);
        return;
      }

      setLoading(true);
      console.log("[TickerContext] Iniciando busca de dados... ");

      try {
        const result = await searchTickers(query);

        console.log(result);

        setTickers(result || []);
      } catch (error) {
        console.error("[TickerContext] Falha ao buscar dados:", error);
        // Em caso de erro, limpa o portfólio para evitar mostrar dados antigos
        setTickers([]);
      } finally {
        setLoading(false);
        console.log("[TickerContext] Busca de dados finalizada.");
      }
    },
    []
  );

  return (
    <TickerContext.Provider value={{ tickers, loading, handleSearchTickers }}>
      {children}
    </TickerContext.Provider>
  );
};

export const useTicker = () => {
  const context = useContext(TickerContext);
  if (context === undefined) {
    throw new Error("useTicker deve ser usado dentro de um TickerProvider");
  }
  return context;
};
