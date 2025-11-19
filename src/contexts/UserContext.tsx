"use client";
import { getUsers } from "@/services/users";
import { UserResponse } from "@/services/users/types";
import React, { createContext, useState } from "react";

interface UserContextProps {
  users: UserResponse[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  loading: boolean;
  handleGetUsers: (params: GetUsersParams) => Promise<void>;
}

interface GetUsersParams {
  page?: number;
  size?: number;
  name?: string;
  companyId?: string;
}

export const UserContext = createContext<UserContextProps>(
  {} as UserContextProps
);

interface UserProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProps> = ({ children }) => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  async function handleGetUsers(params: GetUsersParams = {}) {
    setLoading(true);

    // Define valores padrão para paginação se não forem fornecidos
    const { page = 0, size = 10, name, companyId } = params;

    try {
      // Agora, os parâmetros dinâmicos são passados para a chamada da API
      const usersResponse = await getUsers({
        page,
        size,
        companyId,
        name,
      });

      // Atualiza o estado com a resposta da API
      setUsers(usersResponse.content);
      setTotalElements(usersResponse.totalElements);
      setPageSize(usersResponse.size);
      setTotalPages(usersResponse.totalPages);
      setPage(usersResponse.page);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      // Opcional: Limpar estado em caso de erro
      setUsers([]);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  }

  return (
    <UserContext.Provider
      value={{
        users,
        page,
        pageSize,
        totalPages,
        totalElements,
        loading,
        handleGetUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
