"use client";

import { useState, useMemo } from "react";
import { formatCurrency } from "@/lib/formatters";

// Importações do Material-UI
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableFooter from "@mui/material/TableFooter";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

// Importações de Ícones do Material-UI
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";

// Define a estrutura de cada linha da simulação
interface SimulationRow {
  id: string;
  ticker: string;
  investmentValue: number;
  dividendYield: number;
}

export default function DividendSimulatorPage() {
  // Estado para armazenar as linhas da simulação
  const [rows, setRows] = useState<SimulationRow[]>([
    { id: "1", ticker: "MXRF11", investmentValue: 10000, dividendYield: 12.5 },
    { id: "2", ticker: "ITSA4", investmentValue: 25000, dividendYield: 8.2 },
  ]);

  // Função para adicionar uma nova linha à tabela
  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        id: (rows.length + 1).toString(),
        ticker: "",
        investmentValue: 0,
        dividendYield: 0,
      },
    ]);
  };

  // Função para remover uma linha da tabela
  const handleRemoveRow = (id: string) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  // Função para atualizar o valor de um campo em uma linha específica
  const handleUpdateRow = (
    id: string,
    field: keyof SimulationRow,
    value: string | number
  ) => {
    setRows(
      rows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  // Calcula os totais usando useMemo para otimização
  const totals = useMemo(() => {
    const totalInvestment = rows.reduce(
      (acc, row) => acc + row.investmentValue,
      0
    );
    const totalAnnualIncome = rows.reduce(
      (acc, row) => acc + row.investmentValue * (row.dividendYield / 100),
      0
    );
    const totalMonthlyIncome = totalAnnualIncome / 12;

    return { totalInvestment, totalAnnualIncome, totalMonthlyIncome };
  }, [rows]);

  return (
    <Box>
      <Box className="mb-6">
        <Typography variant="h4" component="h1" fontWeight="bold">
          Simulador de Renda Passiva
        </Typography>
        <Typography color="text.secondary">
          Projete seus ganhos mensais e anuais com base no valor investido e no
          Dividend Yield.
        </Typography>
      </Box>

      <Paper sx={{ width: "100%", overflow: "hidden" }} variant="outlined">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Ativo (Ticker)
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Valor Investido (R$)
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Dividend Yield (%)
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">
                  Renda Mensal (Est.)
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">
                  Renda Anual (Est.)
                </TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                const annualIncome =
                  row.investmentValue * (row.dividendYield / 100);
                const monthlyIncome = annualIncome / 12;

                return (
                  <TableRow key={row.id} hover>
                    <TableCell sx={{ minWidth: 150 }}>
                      <TextField
                        variant="outlined"
                        size="small"
                        placeholder="Ex: PETR4"
                        value={row.ticker}
                        onChange={(e) =>
                          handleUpdateRow(row.id, "ticker", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell sx={{ minWidth: 200 }}>
                      <TextField
                        variant="outlined"
                        size="small"
                        type="number"
                        placeholder="10000"
                        value={row.investmentValue || ""}
                        onChange={(e) =>
                          handleUpdateRow(
                            row.id,
                            "investmentValue",
                            Number(e.target.value)
                          )
                        }
                      />
                    </TableCell>
                    <TableCell sx={{ minWidth: 200 }}>
                      <TextField
                        variant="outlined"
                        size="small"
                        type="number"
                        placeholder="12.5"
                        value={row.dividendYield || ""}
                        onChange={(e) =>
                          handleUpdateRow(
                            row.id,
                            "dividendYield",
                            Number(e.target.value)
                          )
                        }
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body1">
                        {formatCurrency(monthlyIncome)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body1" fontWeight="bold">
                        {formatCurrency(annualIncome)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        aria-label="delete"
                        size="small"
                        onClick={() => handleRemoveRow(row.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow sx={{ backgroundColor: "action.hover" }}>
                <TableCell sx={{ fontWeight: "bold" }}>TOTAIS</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  {formatCurrency(totals.totalInvestment)}
                </TableCell>
                <TableCell />
                <TableCell sx={{ fontWeight: "bold" }} align="right">
                  {formatCurrency(totals.totalMonthlyIncome)}
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">
                  {formatCurrency(totals.totalAnnualIncome)}
                </TableCell>
                <TableCell />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>

        <Box sx={{ p: 2, display: "flex", justifyContent: "flex-start" }}>
          <Button
            variant="text"
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleAddRow}
          >
            Adicionar Linha
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
