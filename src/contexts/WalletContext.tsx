"use client";
import React, { createContext, useState } from "react";
// 🚨 ATENÇÃO: Você deve criar e importar estes tipos e serviços.
// import { getWallets } from "@/services/wallets";
// import { WalletResponse } from "@/services/wallets/types";


// ⚠️ Tipos de Exemplo (Assumindo que você os definirá em outro arquivo)
interface WalletResponse {
  id: string;
  name: string;
  balance: number;
  // ... outros campos do item da carteira
}

interface GetWalletsParams {
  page?: number;
  size?: number;
  name?: string;
}

// Fim dos Tipos de Exemplo

interface WalletsContextProps {
  wallets: WalletResponse[]; // Adiciona o array de itens
  page: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  loading: boolean;
  // Adiciona a função para buscar dados
  handleGetWallets: (params: GetWalletsParams) => Promise<void>;
}

export const WalletsContext = createContext<WalletsContextProps>(
  {} as WalletsContextProps
);

interface WalletsProps {
  children: React.ReactNode;
}

export const WalletsProvider: React.FC<WalletsProps> = ({ children }) => {
  // 1. Definição dos estados (Como no UserProvider)
  const [wallets, setWallets] = useState<WalletResponse[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  // 2. Função Assíncrona para buscar dados
  async function handleGetWallets(params: GetWalletsParams = {}) {
    setLoading(true);

    // Define valores padrão para paginação
    const { page = 0, size = 10, name } = params;

    try {
      // ⚠️ Substitua esta linha pela sua chamada de API real
      /*
      const walletsResponse = await getWallets({
        page,
        size,
        name,
      });
      */
      
      // MOCK temporário para fins de demonstração
      const walletsResponse = {
        content: [], // Substituir por walletsResponse.content
        totalElements: 0,
        size: 10,
        totalPages: 1,
        page: 0,
      };

      // 3. Atualiza o estado com a resposta da API
      setWallets(walletsResponse.content as WalletResponse[]);
      setTotalElements(walletsResponse.totalElements);
      setPageSize(walletsResponse.size);
      setTotalPages(walletsResponse.totalPages);
      setPage(walletsResponse.page);
    } catch (error) {
      console.error("Erro ao buscar carteiras:", error);
      setWallets([]);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  }

  // Opcional: Chama a busca inicial de dados ao montar o Provider
  /*
  useEffect(() => {
    handleGetWallets({});
  }, []);
  */

  return (
    <WalletsContext.Provider
      value={{
        wallets, // Adiciona 'wallets' ao valor
        page,
        pageSize,
        totalPages,
        totalElements,
        loading,
        handleGetWallets, // Adiciona a função
      }}
    >
      {children}
    </WalletsContext.Provider>
  );
};