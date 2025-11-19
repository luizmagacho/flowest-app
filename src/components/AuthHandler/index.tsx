// src/components/AuthHandler/index.tsx

"use client";

import { useEffect, useState } from "react"; // 1. Importe useState
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";

const publicPaths = [
  "/",
  "/login",
  "/criar-conta",
  "/recuperar-senha",
  "/redefinir-senha",
  "/inscricao",
];

export default function AuthHandler({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // ✅ 2. Adicione um estado para verificar se o componente já montou no cliente
  const [isMounted, setIsMounted] = useState(false);

  // ✅ 3. Use useEffect para atualizar o estado após a primeira renderização no cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isPublicPath = publicPaths.includes(pathname);

  useEffect(() => {
    if (!loading && !user && !isPublicPath) {
      router.push("/");
    }
  }, [user, loading, router, isPublicPath]);

  // ✅ 4. Atualize a lógica de renderização
  // Se o componente ainda não montou no cliente OU a autenticação está carregando,
  // mostre o spinner. Isso garante que o servidor e o primeiro render do cliente
  // sejam idênticos.
  if (!isMounted || loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isPublicPath || user) {
    return <>{children}</>;
  }

  return null;
}
