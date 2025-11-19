"use client";

import React, {
  createContext,
  useCallback,
  useState,
  useRef, // 1. Importar useRef
  useEffect, // 2. Importar useEffect
  ReactNode,
} from "react";
import { getPortfolio } from "@/services/portfolio";
import { IPortfolio } from "@/services/portfolio/type";

interface PortfolioContextProps {
  portfolio: IPortfolio[];
  loading: boolean;
  handleGetPortfolio: (userId: string, page?: number) => Promise<void>;
}

export const PortfolioContext = createContext<PortfolioContextProps>({
  portfolio: [],
  loading: false,
  handleGetPortfolio: async () => {
    console.warn("handleGetPortfolio chamado fora do PortfolioProvider");
  },
});

interface PortfolioProps {
  children: ReactNode;
}

export const PortfolioProvider: React.FC<PortfolioProps> = ({ children }) => {
  const [portfolio, setPortfolio] = useState<IPortfolio[]>([]);
  const [loading, setLoading] = useState(false);

  // --- CORREÇÃO DO LOOP INFINITO ---
  // 3. Usamos uma Ref para controlar o 'loading' dentro do useCallback
  //    sem precisar listá-lo como dependência.
  const loadingRef = useRef(loading);

  // 4. Sincroniza a Ref com o Estado
  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  const handleGetPortfolio = useCallback(
    async (userId: string, page?: number) => {
      // 5. Verifica a Ref em vez do Estado
      if (loadingRef.current) return;

      setLoading(true);
      console.log("[PortfolioContext] Iniciando busca de dados... ", userId);

      try {
        const result = await getPortfolio({ page, size: 10, userId });
        console.log("[PortfolioContext] Dados recebidos da API:", result);
        setPortfolio(result.content || []);
      } catch (error) {
        console.error("[PortfolioContext] Falha ao buscar dados:", error);
        setPortfolio([]);
      } finally {
        setLoading(false);
        console.log("[PortfolioContext] Busca de dados finalizada.");
      }
    },
    [] // 6. Array de dependência VAZIO. A função agora é estável.
  );
  // --- FIM DA CORREÇÃO ---

  return (
    <PortfolioContext.Provider
      value={{ portfolio, loading, handleGetPortfolio }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};
