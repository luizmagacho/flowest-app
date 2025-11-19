"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    // Cor primária que substituirá o azul padrão
    primary: {
      main: "#4F46E5", // Nosso Roxo/Índigo
      contrastText: "#FFFFFF", // Cor do texto para usar em cima do primário
    },
    // Cor secundária
    secondary: {
      main: "#F97316", // Nosso Laranja Vibrante
      contrastText: "#FFFFFF",
    },
    // Cores de fundo
    background: {
      default: "#FFFFFF", // Fundo da página (modo claro)
      paper: "#FFFFFF", // Fundo de componentes como Cards
    },
    // Cores de texto
    text: {
      primary: "#111827", // Texto principal (quase preto)
      secondary: "#6B7280", // Texto secundário (cinza)
    },
    // Opcional: Cores de feedback
    error: {
      main: "#EF4444",
    },
    success: {
      main: "#22C55E",
    },
  },
  // Você pode customizar outros aspectos aqui também
  typography: {
    fontFamily: "Arial, Helvetica, sans-serif", // Garante a mesma fonte do seu CSS
  },
  components: {
    // Exemplo: Deixar os botões com cantos menos arredondados
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none", // Remove o uppercase dos botões
        },
      },
    },
  },
});

export default theme;
