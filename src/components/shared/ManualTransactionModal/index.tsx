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
  ITransactionCreatePayload,
  TransactionType,
} from "@/services/transactions/type";
import Cookies from "js-cookie";
import { ITicker } from "@/services/tickers/type";
import { TickerContext } from "@/contexts/TickerContext";

interface ManualTransactionModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (transactionData: ITransactionCreatePayload) => void;
}

export default function ManualTransactionModal({
  open,
  onClose,
  onSave,
}: ManualTransactionModalProps) {
  const [type, setType] = useState<TransactionType>(TransactionType.BUY);
  const [ticker, setTicker] = useState<ITicker | null>(null);
  const [quantity, setQuantity] = useState("");
  const [averagePrice, setAveragePrice] = useState("");

  const { tickers, loading, handleSearchTickers } = useContext(TickerContext);
  const [inputValue, setInputValue] = useState("");

  const [optionsOpen, setOptionsOpen] = useState(false);

  useEffect(() => {
    // Cria um timer
    const delayDebounceFn = setTimeout(() => {
      // Executa a busca somente se o usuário digitou algo
      if (inputValue) {
        console.log("InputValue: ", inputValue);
        handleSearchTickers(inputValue);
      }
    }, 500); // Aguarda 500ms após o usuário parar de digitar

    // Limpa o timer se o usuário digitar novamente
    return () => clearTimeout(delayDebounceFn);
  }, [handleSearchTickers, inputValue]);

  const handleSave = async () => {
    console.log("Ticker:", ticker);
    if (ticker && quantity && averagePrice) {
      const payload: ITransactionCreatePayload = {
        tickerId: ticker._id,
        ticker: ticker.ticker,
        companyName: ticker.companyName,
        type: type,
        assetType: ticker.assetType,
        userId: Cookies.get("flowest_user_id") || "",
        quantity: parseFloat(quantity),
        averagePrice: parseFloat(averagePrice),
        date: new Date().toISOString(), // Usando a data atual como padrão
        brokerage: "",
      };
      try {
        // 3. Chama a função que salva a transação na API
        await onSave(payload);

        // 5. Fecha o modal
        onClose();
      } catch (error) {
        console.error("Falha ao salvar a transação:", error);
        // Adicione um feedback de erro para o usuário aqui (ex: um toast/snackbar)
      } finally {
        // Limpa o formulário em ambos os casos (sucesso ou erro)
        setType(TransactionType.BUY);
        setTicker(null);
        setQuantity("");
        setAveragePrice("");
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Adicionar Transação Manual</DialogTitle>
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
              options={tickers} // Opções vêm do contexto
              getOptionLabel={(option) =>
                `${option.ticker} - ${option.companyName}`
              }
              open={optionsOpen}
              noOptionsText={
                loading ? "Buscando..." : "Nenhum ativo encontrado"
              }
              onOpen={() => {
                // Só permite abrir se o usuário já tiver digitado algo
                if (inputValue.length > 0) {
                  setOptionsOpen(true);
                }
              }}
              // 3. Chamado quando o usuário fecha (ex: clica fora)
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
              loading={loading} // Mostra o indicador de progresso
              filterOptions={(x) => x} // Desabilita o filtro do lado do cliente
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
          <Grid size={{ xs: 6 }}>
            <TextField
              label="Quantidade"
              type="number"
              fullWidth
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
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
        <Button onClick={handleSave} variant="contained">
          Salvar Transação
        </Button>
      </DialogActions>
    </Dialog>
  );
}
