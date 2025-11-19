import React, { createContext, useState, useContext } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert, { AlertColor } from "@mui/material/Alert";

// 1. Definição da INTERFACE para o contexto com as funções tipadas
interface ToastContextData {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarn: (message: string) => void;
  showInfo: (message: string) => void;
}

// O contexto agora usa a interface, e o valor default é um objeto vazio
// forçado para o tipo correto para evitar erros.
const ToastContext = createContext<ToastContextData>({} as ToastContextData);

// Tipagem para as props do Provider
interface ToastProviderProps {
  children: React.ReactNode;
}

// 2. Criação do Provider com a tipagem correta nas props
export function ToastProvider({ children }: ToastProviderProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<AlertColor>("success"); // Estado tipado com AlertColor

  // Função interna com parâmetros tipados
  const showToast = (newMessage: string, newSeverity: AlertColor) => {
    setMessage(newMessage);
    setSeverity(newSeverity);
    setOpen(true);
  };

  // Funções "atalho" com parâmetros tipados
  const showSuccess = (message: string) => showToast(message, "success");
  const showError = (message: string) => showToast(message, "error");
  const showWarn = (message: string) => showToast(message, "warning");
  const showInfo = (message: string) => showToast(message, "info");

  // Tipagem para os parâmetros do evento onClose do Snackbar
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  // O valor do provider agora corresponde à interface ToastContextData
  const contextValue: ToastContextData = {
    showSuccess,
    showError,
    showWarn,
    showInfo,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={4000} // Duração um pouco menor para uma melhor UX
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
}

// 3. O Hook customizado agora retorna o contexto devidamente tipado
export const useToast = (): ToastContextData => {
  return useContext(ToastContext);
};
