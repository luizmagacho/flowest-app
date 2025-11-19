"use client";

// ✅ 1. Importe o 'useCallback'
import { createContext, useState, useCallback } from "react";
import {
  ISimulation,
  ISimulationCreatePayload,
  ISimulationUpdatePayload,
  ISimulatorParams,
} from "@/services/simulator/type";
import {
  createSimulator,
  deleteSimulator,
  getSimulators,
  updateSimulator,
} from "@/services/simulator";
import { isApiResponseError } from "@/lib/utils";

interface SimulatorsContextProps {
  // ... (interface sem mudanças)
  simulators: ISimulation[];
  loading: boolean;
  error: string | null;
  handleGetSimulators: (query?: string) => Promise<void>;
  handleCreateSimulator: (
    payload: ISimulationCreatePayload
  ) => Promise<ISimulation | undefined>;
  handleUpdateSimulator: (
    id: string,
    payload: ISimulationUpdatePayload
  ) => Promise<void>;
  handleDeleteSimulator: (id: string) => Promise<void>;
  clearError: () => void;
}

export const SimulatorsContext = createContext<SimulatorsContextProps>(
  {} as SimulatorsContextProps
);

interface SimulatorsProviderProps {
  children: React.ReactNode;
}

export const SimulatorsProvider: React.FC<SimulatorsProviderProps> = ({
  children,
}) => {
  const [simulators, setSimulators] = useState<ISimulation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ 2. Envolva as funções helper com useCallback
  const clearError = useCallback(() => setError(null), []);

  const handleError = useCallback((err: unknown, defaultMessage: string) => { // ✅ CORREÇÃO 1: Use 'unknown'
    if (isApiResponseError(err)) { // ✅ CORREÇÃO 2: Use o type guard
        // Tenta obter a mensagem aninhada da API ou a mensagem padrão do objeto Error, ou o fallback
        setError(
            err.response?.data?.message || err.message || defaultMessage
        );
    } else if (err instanceof Error) {
        // Se for um erro JS padrão, pegue a message
        setError(err.message || defaultMessage);
    } else {
        // Fallback genérico (se for string, number, etc.)
        setError(defaultMessage);
    }
}, []);

  const handleGetSimulators = useCallback(
    async (query?: string) => {
      setLoading(true);
      clearError();
      try {
        const params: ISimulatorParams = {};
        if (query) {
          params.query = query;
        }

        const data = await getSimulators(params);
        console.log("Array: ", Array.isArray(data));
        if (Array.isArray(data)) {
          setSimulators(data);
        } else {
          setSimulators([]);
        }
      } catch (err) {
        handleError(err, "Erro ao buscar simulações.");
        setSimulators([]);
      } finally {
        setLoading(false);
      }
    },
    [clearError, handleError]
  );

  const handleCreateSimulator = useCallback(
    async (payload: ISimulationCreatePayload) => {
      setLoading(true);
      clearError();
      try {
        const newSimulator = await createSimulator(payload);
        setSimulators((prev) => [newSimulator, ...prev]);
        return newSimulator;
      } catch (err) {
        handleError(err, "Erro ao criar simulação.");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [clearError, handleError]
  );

  const handleUpdateSimulator = useCallback(
    async (id: string, payload: ISimulationUpdatePayload) => {
      setLoading(true);
      clearError();
      try {
        const updatedSimulator = await updateSimulator(id, payload);
        setSimulators((prev) =>
          prev.map((sim) => (sim._id === id ? updatedSimulator : sim))
        );
      } catch (err) {
        handleError(err, "Erro ao atualizar simulação.");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [clearError, handleError]
  );

  const handleDeleteSimulator = useCallback(
    async (id: string) => {
      setLoading(true);
      clearError();
      try {
        await deleteSimulator(id);
        setSimulators((prev) => prev.filter((sim) => sim._id !== id));
      } catch (err) {
        handleError(err, "Erro ao deletar simulação.");
      } finally {
        setLoading(false);
      }
    },
    [clearError, handleError]
  );

  return (
    <SimulatorsContext.Provider
      value={{
        simulators,
        loading,
        error,
        clearError,
        handleGetSimulators,
        handleCreateSimulator,
        handleUpdateSimulator,
        handleDeleteSimulator,
      }}
    >
      {children}
    </SimulatorsContext.Provider>
  );
};
