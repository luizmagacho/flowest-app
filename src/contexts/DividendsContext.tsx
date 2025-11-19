import React, { createContext, useState } from "react";
// 🚨 ATENÇÃO: Você deve criar e importar estes tipos e serviços.
// import { getDividends } from "@/services/dividends";
// import { DividendResponse } from "@/services/dividends/types";


// ⚠️ Tipos de Exemplo (Ajuste conforme sua API)
interface DividendResponse {
  id: string;
  ticker: string;
  amount: number;
  date: string;
}

interface GetDividendsParams {
  page?: number;
  size?: number;
  ticker?: string;
  startDate?: string;
}
// Fim dos Tipos de Exemplo


interface DividendsContextProps {
  dividends: DividendResponse[]; // Adiciona o array de itens
  page: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  loading: boolean;
  // Adiciona a função para buscar dados
  handleGetDividends: (params: GetDividendsParams) => Promise<void>;
}

export const DividendsContext = createContext<DividendsContextProps>(
  {} as DividendsContextProps
);

interface DividendsProps {
  children: React.ReactNode;
}

export const DividendsProvider: React.FC<DividendsProps> = ({ children }) => {
  // 1. Definição dos estados (Espelhando UserProvider)
  const [dividends, setDividends] = useState<DividendResponse[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  // 2. Função Assíncrona para buscar dados
  async function handleGetDividends(params: GetDividendsParams = {}) {
    setLoading(true);

    // Define valores padrão para paginação
    const { page = 0, size = 10, ticker, startDate } = params;

    try {
      // ⚠️ Substitua esta linha pela sua chamada de API real (ex: getDividends)
      /*
      const dividendsResponse = await getDividends({
        page,
        size,
        ticker,
        startDate,
      });
      */
      
      // MOCK temporário para fins de demonstração
      const dividendsResponse = {
        content: [], // Substituir por dividendsResponse.content
        totalElements: 0,
        size: 10,
        totalPages: 1,
        page: 0,
      };

      // 3. Atualiza o estado com a resposta da API
      setDividends(dividendsResponse.content as DividendResponse[]);
      setTotalElements(dividendsResponse.totalElements);
      setPageSize(dividendsResponse.size);
      setTotalPages(dividendsResponse.totalPages);
      setPage(dividendsResponse.page);
    } catch (error) {
      console.error("Erro ao buscar dividendos:", error);
      setDividends([]);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  }

  return (
    <DividendsContext.Provider
      value={{
        dividends, // Adicionado
        page,
        pageSize,
        totalPages,
        totalElements,
        loading,
        handleGetDividends, // Adicionado
      }}
    >
      {children}
    </DividendsContext.Provider>
  );
};