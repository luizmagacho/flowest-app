// src/components/shared/SideBarMenu/index.tsx

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Importações do Material-UI
import {
  styled,
  Theme,
  CSSObject,
  Box,
  Drawer as MuiDrawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  Divider,
  IconButton,
  Badge,
} from "@mui/material";

// Ícones
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogOutIcon from "@mui/icons-material/Logout";

// --- Interfaces de Props ---
export interface MenuItem {
  label: string;
  icon: React.ReactNode;
  url: string;
}

interface SidebarMenuProps {
  items: MenuItem[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  logo: string;
  logoIcon: string;
  unreadNotificationsCount?: number;
  onSignOut?: () => void;
}

// --- Estilização (sem alterações) ---
const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

// ### AJUSTE AQUI ###
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  // Alinha os itens à esquerda e centraliza quando fechado
  justifyContent: "flex-start",
  padding: theme.spacing(0, 2),
  ...theme.mixins.toolbar,
}));

const StyledDrawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

// --- Componente Principal ---
export default function SidebarMenuMui({
  items,
  isOpen,
  setIsOpen,
  logo,
  logoIcon, // logoIcon não é mais necessário no header, mas pode ser útil em outro lugar
  unreadNotificationsCount = 0,
  onSignOut,
}: SidebarMenuProps) {
  const pathname = usePathname();
  const theme = useTheme();

  const handleToggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <StyledDrawer variant="permanent" open={isOpen}>
      {/* ### AJUSTE AQUI ### */}
      <DrawerHeader>
        {/* O botão de toggle agora vem primeiro */}
        <IconButton onClick={handleToggleDrawer}>
          {isOpen ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
        {/* O logo só aparece quando o menu está aberto para não poluir a visão fechada */}
        {isOpen && (
          <img
            src={logo}
            alt="Logo"
            style={{ height: "32px", marginLeft: theme.spacing(2) }}
          />
        )}
      </DrawerHeader>

      <Divider />

      {/* Lista Principal de Itens de Menu (sem alterações) */}
      <List sx={{ padding: "8px 4px" }}>
        {items.map((item) => {
          const isActive = pathname === item.url;
          return (
            <ListItem key={item.label} disablePadding sx={{ display: "block" }}>
              <Link
                href={item.url}
                passHref
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItemButton
                  selected={isActive}
                  sx={{
                    minHeight: 48,
                    justifyContent: isOpen ? "initial" : "center",
                    px: 2.5,
                    borderRadius: "8px",
                    margin: "4px 8px",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: isOpen ? 3 : "auto",
                      justifyContent: "center",
                      color: isActive ? theme.palette.primary.main : "inherit",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    sx={{ opacity: isOpen ? 1 : 0 }}
                  />
                </ListItemButton>
              </Link>
            </ListItem>
          );
        })}
      </List>

      {/* Rodapé (sem alterações) */}
      <Box sx={{ marginTop: "auto" }}>
        <Divider />
        <List sx={{ padding: "8px 4px" }}>
          {unreadNotificationsCount > 0 && (
            <ListItem disablePadding>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: isOpen ? "initial" : "center",
                  px: 2.5,
                  borderRadius: "8px",
                  margin: "4px 8px",
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: isOpen ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <Badge badgeContent={unreadNotificationsCount} color="error">
                    <NotificationsIcon />
                  </Badge>
                </ListItemIcon>
                <ListItemText
                  primary="Notificações"
                  sx={{ opacity: isOpen ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          )}

          {onSignOut && (
            <ListItem disablePadding onClick={onSignOut}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: isOpen ? "initial" : "center",
                  px: 2.5,
                  borderRadius: "8px",
                  margin: "4px 8px",
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: isOpen ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <LogOutIcon />
                </ListItemIcon>
                <ListItemText primary="Sair" sx={{ opacity: isOpen ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </Box>
    </StyledDrawer>
  );
}
