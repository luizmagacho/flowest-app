"use client";

import React, { useContext, useState } from "react";

// Importações do Material-UI
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";

// Ícones
import AddIcon from "@mui/icons-material/Add";
import UploadFileIcon from "@mui/icons-material/UploadFile";

// Importe os modais que criaremos a seguir
import {
  ITransactionCreatePayload,
  TransactionPayload,
} from "@/services/transactions/type";
import UploadNoteModal from "../UploadNoteModal";
import ManualTransactionModal from "../ManualTransactionModal";
import { TransactionsContext } from "@/contexts/TransactionsContext";
import Cookies from "js-cookie";
import { PortfolioContext } from "@/contexts/PortfolioContext";
import { isApiValidationError } from "@/lib/utils";

type FormErrors = {
  [key in keyof TransactionPayload]?: string;
};

export default function TopBarMenu() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [manualModalOpen, setManualModalOpen] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});

  const { handleCreateTransaction, handleGetTransactions } =
    useContext(TransactionsContext);

  const { handleGetPortfolio } = useContext(PortfolioContext);

  // Função para lidar com o envio do arquivo da nota de corretagem
  const handleFileUpload = (file: File) => {
    console.log("Arquivo para enviar:", file);
    // TODO: Adicionar lógica para chamar o serviço de upload para o backend
    // A inteligência artificial para ler a nota será acionada no backend
    setUploadModalOpen(false);
  };

  // Função para lidar com o salvamento da transação manual
  const handleSaveTransaction = async (
    transactionData: ITransactionCreatePayload
  ) => {
    console.log("Dados da transação para salvar:", transactionData);
    // TODO: Adicionar lógica para chamar o serviço que cria a transação no backend
    try {
      console.log("Vai enviar");
      await handleCreateTransaction(transactionData);
      await handleGetPortfolio(Cookies.get("flowest_user_id") || "");
      await handleGetTransactions(Cookies.get("flowest_user_id") || "");
    }catch (error: unknown) { // ✅ CORREÇÃO 1: Use 'unknown'
      
      // ✅ CORREÇÃO 2: Use o Type Guard
      if (isApiValidationError(error)) { 
        // Agora o TS sabe que error.response.data.message é string[]
        const messages: string[] = error.response.data.message; 
        const newErrors: FormErrors = {};

        // Mapeia as mensagens de erro para os campos correspondentes
        messages.forEach((msg) => {
          if (msg.toLowerCase().includes("ticker")) {
            newErrors.ticker = msg;
          } else if (msg.toLowerCase().includes("quantidade")) {
            newErrors.quantity = msg;
          } else if (msg.toLowerCase().includes("preço médio")) {
            newErrors.averagePrice = msg;
          } else if (msg.toLowerCase().includes("data")) {
            newErrors.date = msg;
          }
          // ...
        });

        console.log("Erros mapeados:", newErrors);
        setErrors(newErrors);
      } else {
        // Trata erros de JavaScript (ex: Network Error, Error instance)
        const errorMessage = (error as Error)?.message || "Erro inesperado ao salvar.";
        console.error("Ocorreu um erro inesperado:", errorMessage);
        setErrors({}); // Opcional: Limpar erros anteriores
      }
    }
    if (!!errors) {
      setManualModalOpen(false);
    }
  };

  return (
    <>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Flowest
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<UploadFileIcon />}
              onClick={() => setUploadModalOpen(true)}
            >
              Enviar Nota
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setManualModalOpen(true)}
            >
              Adicionar Transação
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Modais controlados por este componente */}
      <UploadNoteModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onFileUpload={handleFileUpload}
      />
      <ManualTransactionModal
        open={manualModalOpen}
        onClose={() => setManualModalOpen(false)}
        onSave={handleSaveTransaction}
      />
    </>
  );
}
