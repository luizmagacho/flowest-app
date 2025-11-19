// src/contexts/AuthContext.tsx

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import Cookies from "js-cookie";

// Supondo que você tenha um tipo User
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User) => void; // ✅ Adicione a função de login
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const token = Cookies.get("flowest-token");
    if (token) {
      // Simulação de busca de dados do usuário a partir do cookie/token
      // Em um app real, você decodificaria o token ou faria uma chamada a /me
      setUser({
        id: Cookies.get("flowest_user_id") || "",
        name: "Usuário Carregado", // Você pode querer guardar isso no cookie também
        email: "email@carregado.com",
        role: "user",
        permissions: [],
        isAdmin: false,
      });
    }
    setLoading(false);
  }, []);

  const login = (userData: User) => {
    // Esta função simplesmente atualiza o estado
    setUser(userData);
  };

  const signOut = () => {
    Cookies.remove("flowest-token");
    Cookies.remove("flowest_user_id");
    setUser(null);
  };

  const value = {
    user,
    loading,
    login, // ✅ Exponha a função no provedor
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
