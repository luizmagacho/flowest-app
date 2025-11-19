"use client";

import { useState, useEffect, useContext } from "react";
import { formatCurrency, formatDate } from "@/lib/formatters";
import {
  ITransaction,
  ITransactionCreatePayload,
} from "@/services/transactions/type";
import { TransactionsContext } from "@/contexts/TransactionsContext";

// Importações do Material-UI
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
  Tooltip,
  IconButton,
  Button,
  Alert,
  Snackbar,
} from "@mui/material";

// Ícones
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useAuth } from "@/contexts/AuthContext";
import DeleteConfirmationDialog from "./components/DeleteConfirmationDialog";
import TransactionModal from "./components/TransactionModal";

export default function TransactionsPage() {
  // Acessando todas as novas funções e estados do contexto aprimorado
  const {
    transactions,
    loading,
    error,
    handleGetTransactions,
    handleCreateTransaction,
    handleUpdateTransaction,
    handleDeleteTransaction,
    clearError,
  } = useContext(TransactionsContext);

  const { user } = useAuth();

  // Estados para controlar os modais e a transação selecionada
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<ITransaction | null>(null);

  useEffect(() => {
    console.log("USER-> ", user);
    if (user?.id) {
      handleGetTransactions(user.id);
    }
  }, [user]);

  // Funções para gerenciar a abertura e fechamento dos modais
  const handleOpenAdd = () => {
    setSelectedTransaction(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (tx: ITransaction) => {
    setSelectedTransaction(tx);
    setModalOpen(true);
  };

  const handleOpenDelete = (tx: ITransaction) => {
    setSelectedTransaction(tx);
    setConfirmOpen(true);
  };

  const handleCloseModals = () => {
    setModalOpen(false);
    setConfirmOpen(false);
    setSelectedTransaction(null);
  };

  // Função chamada pelo modal para salvar (criar ou editar)
  const handleSaveTransaction = async (
    payload: ITransactionCreatePayload,
    id?: string
  ) => {
    console.log("UserId: ", user);
    if (!user?.id) return;

    const transactionData = { ...payload, userId: user.id };

    if (id) {
      await handleUpdateTransaction(id, transactionData);
    } else {
      await handleCreateTransaction(transactionData);
    }
    handleCloseModals();
  };

  // Função chamada pelo diálogo de confirmação para deletar
  const handleDeleteConfirm = async () => {
    if (selectedTransaction) {
      await handleDeleteTransaction(selectedTransaction._id);
    }
    handleCloseModals();
  };

  useEffect(() => {
    if (transactions.length > 0) {
      const ids = transactions.map((t) => t._id);
      const uniqueIds = new Set(ids);
      if (ids.length !== uniqueIds.size) {
        console.warn(
          "ALERTA: IDs duplicados foram encontrados no array de transações!",
          transactions
        );
        // Opcional: Encontrar exatamente quais IDs estão duplicados
        const duplicateIds = ids.filter(
          (id, index) => ids.indexOf(id) !== index
        );
        console.log("Os IDs duplicados são:", duplicateIds);
      }
    }
  }, [transactions]);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Histórico de Transações
          </Typography>
          <Typography color="text.secondary">
            Acompanhe todas as suas operações de compra e venda.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
        >
          Adicionar Transação
        </Button>
      </Box>

      <Paper sx={{ width: "100%", overflow: "hidden" }} variant="outlined">
        {loading && <LinearProgress />}
        <TableContainer sx={{ maxHeight: "calc(100vh - 250px)" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Data</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Tipo</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Ativo</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  Quantidade
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  Preço Médio
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  Custo Total
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Ações
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!loading && transactions.length > 0
                ? transactions.map((tx) => (
                    <TableRow key={tx._id} hover>
                      <TableCell>{formatDate(tx.date)}</TableCell>
                      <TableCell>
                        <Chip
                          label={tx.type === "BUY" ? "Compra" : "Venda"}
                          color={tx.type === "BUY" ? "success" : "error"}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {tx.ticker}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        {tx.quantity.toLocaleString("pt-BR")}
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(tx.averagePrice)}
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(tx.averagePrice * tx.quantity)}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Editar Transação">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenEdit(tx)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Deletar Transação">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDelete(tx)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                : !loading && (
                    <TableRow key="empty-row-placeholder">
                      <TableCell colSpan={7} align="center">
                        <Typography color="text.secondary" sx={{ p: 4 }}>
                          Nenhuma transação encontrada.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Snackbar para exibir mensagens de erro */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={clearError}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={clearError} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>

      {/* Modais controlados pelo estado da página */}
      <TransactionModal
        open={modalOpen}
        onClose={handleCloseModals}
        onSave={handleSaveTransaction}
        transaction={selectedTransaction}
      />
      <DeleteConfirmationDialog
        open={confirmOpen}
        onClose={handleCloseModals}
        onConfirm={handleDeleteConfirm}
        itemName="transação"
      />
    </Box>
  );
}
