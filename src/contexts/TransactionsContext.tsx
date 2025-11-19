"use client";

import React, { createContext, useCallback, useState } from "react";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "@/services/transactions";
import {
  ITransaction,
  ITransactionCreatePayload,
  TransactionPayload,
} from "@/services/transactions/type";
import { Page } from "@/shared";

// 1. Definição da interface do Contexto aprimorada
interface TransactionsContextProps {
  transactions: ITransaction[];
  loading: boolean;
  error: string | null; // Adicionado para feedback de erro na UI
  handleGetTransactions: (userId: string, page?: number) => Promise<void>;
  handleCreateTransaction: (
    payload: ITransactionCreatePayload
  ) => Promise<void>;
  handleUpdateTransaction: (
    id: string,
    payload: TransactionPayload
  ) => Promise<void>;
  handleDeleteTransaction: (id: string) => Promise<void>;
  clearError: () => void; // Adicionado para limpar o estado de erro
}

// 2. Criação do Contexto com um valor padrão seguro
export const TransactionsContext = createContext<TransactionsContextProps>(
  {} as TransactionsContextProps
);

// 3. Definição das props do Provedor
interface TransactionsProviderProps {
  children: React.ReactNode;
}

// 4. Componente Provedor com a lógica de busca de dados aprimorada
export const TransactionsProvider: React.FC<TransactionsProviderProps> = ({
  children,
}) => {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>("");

  const clearError = () => setError(null);

  const handleGetTransactions = useCallback(
    async (userId: string, page?: number) => {
      setLoading(true);
      clearError();
      setCurrentUserId(userId); // Armazena o userId para recarregar
      try {
        const result: Page<ITransaction> = await getTransactions({
          page,
          size: 20,
          userId,
        });
        setTransactions(result.content || []);
      } catch (err) {
        console.error("[TransactionsContext] Falha ao buscar dados:", err);
        setError(
          "Não foi possível carregar as transações. Tente novamente mais tarde."
        );
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleCreateTransaction = useCallback(
    async (payload: ITransactionCreatePayload) => {
      try {
        console.log("Vai chamar a API");
        // 1. Tenta chamar a API
        const newTransaction = await createTransaction(payload);

        // Lógica de sucesso (atualizar estado, etc.)
        setTransactions((prev) => [newTransaction, ...prev]);
      } catch (error) {
        // 2. Se a API der erro, pega o erro...
        console.error("Erro no contexto ao criar transação:", error);

        // 3. E o mais importante: LANÇA ELE NOVAMENTE!
        // É isso que permite que a página (e o modal) saibam do erro.
        throw error;
      }
    },
    []
  );

  const handleUpdateTransaction = useCallback(
    async (id: string, payload: TransactionPayload) => {
      clearError();
      try {
        await updateTransaction(id, payload);
        await handleGetTransactions(payload.userId); // Recarrega a lista
      } catch (err) {
        console.error(
          "[TransactionsContext] Falha ao atualizar transação:",
          err
        );
        setError("Não foi possível atualizar a transação.");
      }
    },
    [handleGetTransactions]
  );

  const handleDeleteTransaction = useCallback(
    async (id: string) => {
      clearError();
      const originalTransactions = [...transactions];

      // Atualização Otimista: remove o item da UI imediatamente
      setTransactions((prev) => prev.filter((tx) => tx._id !== id));

      try {
        await deleteTransaction(id);
        // Se a chamada à API for bem-sucedida, não fazemos nada, pois a UI já foi atualizada.
      } catch (err) {
        console.error("[TransactionsContext] Falha ao deletar transação:", err);
        setError("Erro ao deletar a transação. A operação foi revertida.");
        // Reversão: se a API falhar, restaura a lista original
        setTransactions(originalTransactions);
      }
    },
    [transactions]
  );

  const value = {
    transactions,
    loading,
    error,
    handleGetTransactions,
    handleCreateTransaction,
    handleUpdateTransaction,
    handleDeleteTransaction,
    clearError,
  };

  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  );
};
