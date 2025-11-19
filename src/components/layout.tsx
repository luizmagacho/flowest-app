// src/components/layout.tsx
"use client";

import React, { Suspense, useState, useMemo, ReactNode } from "react";
import { Box, CssBaseline, CircularProgress } from "@mui/material";
import SidebarMenuMui, { MenuItem } from "./shared/SideBarMenu";
// Importamos o hook

// Ícones
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import CalculateIcon from "@mui/icons-material/Calculate";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import { useAuth } from "@/contexts/AuthContext";
import TopBarMenu from "./shared/TopBarMenu";
import Cookies from "js-cookie";

interface CustomMenuItem extends MenuItem {
  permission?: string;
  adminOnly?: boolean;
}

const allMenuItems: CustomMenuItem[] = [
  {
    label: "Portfolio",
    icon: <AccountBalanceWalletIcon />,
    url: "/portfolio",
    permission: "view_portfolio",
  },
  {
    label: "Transações",
    icon: <ReceiptLongIcon />,
    url: "/transacoes",
    permission: "view_transactions",
  },
  {
    label: "Dividendos",
    icon: <MonetizationOnIcon />,
    url: "/dividendos",
    permission: "view_dividends",
  },
  { label: "Calculadora", icon: <CalculateIcon />, url: "/calculadora" },
  {
    label: "Simulador",
    icon: <QueryStatsIcon />,
    url: "/simulador",
    permission: "view_simulador",
  },
];

export default function Layout({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [notificationCount, setNotificationCount] = useState(5);

  const visibleMenuItems = useMemo(() => {
    if (!user) {
      return [];
    }

    const permissionsString = Cookies.get("flowest_user_permissions") || "";
    const userPermissions = permissionsString
      ? permissionsString.split(",")
      : [];

    return allMenuItems.filter((item) => {
      if (item.adminOnly && !user.isAdmin) {
        return false;
      }

      if (item.permission && !userPermissions.includes(item.permission)) {
        return false;
      }

      return true;
    });
  }, [user]);

  const logoUrl = "https://placehold.co/150x40/f59e0c/white?text=Logo";
  const logoIconUrl = "https://placehold.co/40x40/f59e0c/white?text=L";

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "grey.50" }}>
      <CssBaseline />
      <SidebarMenuMui
        items={visibleMenuItems}
        isOpen={isSidebarOpen}
        setIsOpen={setSidebarOpen}
        logo={logoUrl}
        logoIcon={logoIconUrl}
        unreadNotificationsCount={notificationCount}
        onSignOut={signOut}
      />
      {/* 2. Nova estrutura para o conteúdo principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          height: "100vh", // Garante que o container ocupe a altura toda
        }}
      >
        <TopBarMenu /> {/* 3. Adicione o TopBarMenu aqui */}
        {/* 4. Crie um novo Box para o conteúdo da página com padding e scroll */}
        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            overflow: "auto", // Permite scroll se o conteúdo for maior que a tela
          }}
        >
          <Suspense
            fallback={
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "80vh",
                }}
              >
                <CircularProgress />
              </Box>
            }
          >
            {children}
          </Suspense>
        </Box>
      </Box>
    </Box>
  );
}
