"use client";

import React, { useState, useEffect, useContext } from "react";

// Importações do Material-UI
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  ToggleButtonGroup,
  ToggleButton,
  InputAdornment,
  Grid,
  CircularProgress,
} from "@mui/material";
import {
  ITransaction,
  ITransactionCreatePayload,
  TransactionType,
} from "@/services/transactions/type";
import { TickerContext } from "@/contexts/TickerContext";
import { ITicker } from "@/services/tickers/type";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useAuth } from "@/contexts/AuthContext";
import dayjs, { Dayjs } from "dayjs";

// 1. Interface de Props ATUALIZADA
interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
  // Assinatura de 'onSave' atualizada para suportar criação e edição
  onSave: (payload: ITransactionCreatePayload, id?: string) => Promise<void>;
  // Nova prop para receber a transação (ou null para modo de adição)
  transaction: ITransaction | null;
}

export default function TransactionModal({
  open,
  onClose,
  onSave,
  transaction, // 4. Recebe a nova prop
}: TransactionModalProps) {
  // Estado interno do formulário
  const [type, setType] = useState<TransactionType>(TransactionType.BUY);
  const [ticker, setTicker] = useState<ITicker | null>(null);
  const [quantity, setQuantity] = useState("");
  const [averagePrice, setAveragePrice] = useState("");
  const [date, setDate] = useState<Dayjs | null>(dayjs());

  // Estado para o Autocomplete de Ticker
  const { tickers, loading, handleSearchTickers } = useContext(TickerContext);
  const [inputValue, setInputValue] = useState("");
  const [optionsOpen, setOptionsOpen] = useState(false);

  const { user } = useAuth();

  // 2. useEffect para POPULAR ou LIMPAR o formulário
  // Roda sempre que o modal abre ou a transação selecionada muda
  useEffect(() => {
    if (open) {
      if (transaction) {
        // --- MODO DE EDIÇÃO ---
        // Preenche o formulário com os dados da transação
        setType(transaction.type);
        setQuantity(String(transaction.quantity));
        setAveragePrice(String(transaction.averagePrice));
        setDate(dayjs(transaction.date)); // Converte string ISO para Date

        // Recria o objeto ITicker para o Autocomplete
        const existingTicker: ITicker = {
          _id: transaction.tickerId,
          ticker: transaction.ticker,
          companyName: transaction.companyName,
          assetType: transaction.assetType,
        };
        setTicker(existingTicker);
        // Atualiza o texto do Autocomplete também
        setInputValue(
          `${existingTicker.ticker} - ${existingTicker.companyName}`
        );
      } else {
        // --- MODO DE ADIÇÃO ---
        // Limpa o formulário para padrões
        setType(TransactionType.BUY);
        setTicker(null);
        setQuantity("");
        setAveragePrice("");
        setDate(dayjs());
        setInputValue("");
      }
    }
  }, [open, transaction]);

  // useEffect para buscar tickers (debounce) - Sem alteração
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (inputValue) {
        handleSearchTickers(inputValue);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [inputValue, handleSearchTickers]);

  // 3. handleSave ATUALIZADO
  const handleSave = async () => {
    // Validação
    if (
      ticker &&
      ticker.assetType &&
      quantity &&
      averagePrice &&
      date &&
      user?.id
    ) {
      // Cria o payload. Note que o 'userId' foi REMOVIDO.
      // A 'TransactionsPage' é quem deve adicionar o userId.
      const payload: ITransactionCreatePayload = {
        tickerId: ticker._id,
        ticker: ticker.ticker,
        companyName: ticker.companyName,
        type: type,
        assetType: ticker.assetType,
        quantity: parseFloat(quantity),
        averagePrice: parseFloat(averagePrice),
        date: date.toISOString(),
        brokerage: "", // Você pode adicionar este campo no formulário se quiser
        userId: user.id,
      };

      try {
        if (transaction) {
          // MODO EDIÇÃO: Chama o onSave com payload E id
          await onSave(payload, transaction._id);
        } else {
          // MODO ADIÇÃO: Chama o onSave SÓ com o payload
          await onSave(payload);
        }
        // O onSave (handleSaveTransaction) na página já cuida de fechar o modal
      } catch (error) {
        console.error("Falha ao salvar a transação:", error);
        // Aqui você pode adicionar um Snackbar de erro
      }
    }
  };

  // Determina se o formulário é válido
  const isFormValid =
    ticker &&
    quantity &&
    parseFloat(quantity) > 0 &&
    averagePrice &&
    parseFloat(averagePrice) > 0 &&
    date;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      {/* 5. Título dinâmico */}
      <DialogTitle>
        {transaction ? "Editar Transação" : "Adicionar Transação"}
      </DialogTitle>

      <DialogContent sx={{ pt: "20px !important" }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <ToggleButtonGroup
              color={type === "BUY" ? "success" : "error"}
              value={type}
              exclusive
              onChange={(_, newType) => newType && setType(newType)}
              fullWidth
            >
              <ToggleButton value="BUY">Compra</ToggleButton>
              <ToggleButton value="SELL">Venda</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Autocomplete
              options={tickers}
              getOptionLabel={(option) =>
                `${option.ticker} - ${option.companyName}`
              }
              open={optionsOpen}
              noOptionsText={
                loading ? "Buscando..." : "Nenhum ativo encontrado"
              }
              onOpen={() => {
                if (inputValue.length > 0) {
                  setOptionsOpen(true);
                }
              }}
              onClose={() => {
                setOptionsOpen(false);
              }}
              value={ticker}
              onChange={(_, newValue) => {
                setTicker(newValue);
              }}
              inputValue={inputValue}
              onInputChange={(_, newInputValue) => {
                setInputValue(newInputValue);
                setOptionsOpen(newInputValue.length > 0);
              }}
              loading={loading}
              filterOptions={(x) => x}
              // Desabilita a busca se estiver editando (não deve trocar o ticker)
              disabled={!!transaction}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Digite o nome do ativo..."
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <DatePicker
              label="Data da Operação"
              value={date}
              onChange={(newValue) => {
                // 'newValue' é Dayjs | null
                // 'setDate' espera Date | null
                // Convertemos 'Dayjs' para 'Date'
                setDate(newValue);
              }}
              sx={{ width: "100%" }}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Quantidade"
              type="number"
              fullWidth
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Preço Médio"
              type="number"
              fullWidth
              value={averagePrice}
              onChange={(e) => setAveragePrice(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">R$</InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!isFormValid || loading} // Desabilita se inválido ou carregando
        >
          {/* 6. Texto do botão dinâmico */}
          {transaction ? "Salvar Alterações" : "Adicionar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
