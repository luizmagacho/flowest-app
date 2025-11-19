"use client";

import { useState, useMemo, useEffect, useRef, useContext } from "react";
import { formatCurrency } from "@/lib/formatters";
import { format, addMonths } from "date-fns";
import { ptBR } from "date-fns/locale";

// Importações do Material-UI
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
  Grid,
  Autocomplete,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Slider,
  Stack,
} from "@mui/material";

// Ícones
import DeleteIcon from "@mui/icons-material/Delete";
import InsightsIcon from "@mui/icons-material/Insights";
import SavingsIcon from "@mui/icons-material/Savings";
import FlagIcon from "@mui/icons-material/Flag";
import EventIcon from "@mui/icons-material/Event";

// Importações do Chart.js
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  LineController,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";

// Contextos e Tipos
import { useTicker } from "@/contexts/TickerContext";
import { ITicker as ISimulationAsset } from "@/services/tickers/type"; // Tipo completo do Autocomplete
import { SimulatorsContext } from "@/contexts/SimulatorsContext";
import { ISimulation } from "@/services/simulator/type"; // ✅ Importa AssetType
import Cookies from "js-cookie";
import { AssetType } from "@/services/transactions/type";
import { useToast } from "@/contexts/ToastContext";
import { isApiError } from "@/lib/utils";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  LineController,
  annotationPlugin
);

interface ISimulationHoldingAsset {
  _id: string;
  ticker: string;
  companyName: string;
  assetType: AssetType | null; // Enum importado de @/services/simulator/type
  dividendYield?: number;
}

export interface IHolding {
  asset: ISimulationHoldingAsset; // <-- CORREÇÃO
  quantity: number;
  totalCost: number;
}

interface IProjectionDataPoint {
  monthLabel: string;
  patrimonio: number;
  rendaMensal: number;
}

export default function SimulatorPage() {
  // --- ESTADOS LOCAIS ---
  const [holdings, setHoldings] = useState<IHolding[]>([]); // Usa a IHolding corrigida
  const [formAsset, setFormAsset] = useState<ISimulationAsset | null>(null); // Continua usando o tipo completo
  const [formQuantity, setFormQuantity] = useState<string>("");
  const [formPrice, setFormPrice] = useState<string>("");

  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(500);
  const [incomeGoal, setIncomeGoal] = useState<number>(5000);
  const [simulationYears, setSimulationYears] = useState<number>(10);

  const [projection, setProjection] = useState<IProjectionDataPoint[]>([]);
  const [simulationResult, setSimulationResult] = useState<string>("");

  const {
    tickers: searchableAssets,
    loading: assetsLoading,
    handleSearchTickers,
  } = useTicker();

  const chartCanvasRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  // --- ESTADOS DE SALVAR/CARREGAR ---
  const [simulationTitle, setSimulationTitle] = useState<string>("");
  const [currentSimId, setCurrentSimId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // --- CONTEXTO ---
  const {
    simulators,
    loading: simsLoading,
    error: simsError,
    handleGetSimulators,
    handleCreateSimulator,
    handleUpdateSimulator,
  } = useContext(SimulatorsContext);

  // --- LÓGICA (useMemo) ---
  const { totalInvested, weightedAvgYield } = useMemo(() => {
    const total = holdings.reduce((acc, h) => acc + h.totalCost, 0);
    if (total === 0) return { totalInvested: 0, weightedAvgYield: 0 };

    const weightedYield = holdings.reduce((acc, h) => {
      const yieldValue = h.asset.dividendYield || 0;
      return acc + (h.totalCost / total) * yieldValue;
    }, 0);

    return { totalInvested: total, weightedAvgYield: weightedYield };
  }, [holdings]);

  const { showSuccess, showError } = useToast();

  // ✅ 4. Adicionar useEffect para monitorar erros do SimulatorsContext
  useEffect(() => {
    if (simsError) {
      showError(simsError);
    }
  }, [simsError, showError]);

  // --- FUNÇÕES DO SIMULADOR ---

  const handleAddHolding = () => {
    // setError(null); // Removido
    if (!formAsset || !formQuantity || !formPrice) {
      showError("Preencha todos os campos do ativo."); // ✅ Substituído
      return;
    }

    // ✅ CORREÇÃO: Cria o 'asset' limpo (ISimulationHoldingAsset)
    const cleanAsset: ISimulationHoldingAsset = {
      _id: formAsset._id,
      ticker: formAsset.ticker,
      companyName: formAsset.companyName,
      assetType: formAsset.assetType,
      dividendYield: formAsset.dividendYield || 0,
    };

    const newHolding: IHolding = {
      asset: cleanAsset, // <-- Agora bate com a interface IHolding
      quantity: parseFloat(formQuantity),
      totalCost: parseFloat(formQuantity) * parseFloat(formPrice),
    };

    // O resto da função continua igual
    const existingIndex = holdings.findIndex(
      (h) => h.asset._id === formAsset._id
    );
    if (existingIndex !== -1) {
      const updatedHoldings = [...holdings];
      updatedHoldings[existingIndex].quantity += newHolding.quantity;
      updatedHoldings[existingIndex].totalCost += newHolding.totalCost;
      setHoldings(updatedHoldings);
    } else {
      setHoldings([...holdings, newHolding]);
    }
    setFormAsset(null);
    setFormQuantity("");
    setFormPrice("");
  };

  const handleRemoveHolding = (assetId: string) => {
    setHoldings(holdings.filter((h) => h.asset._id !== assetId));
  };

  const handleRunSimulation = () => {
    if (weightedAvgYield === 0) {
      showError(
        // ✅ Substituído
        "Adicione ao menos um ativo com dividend yield maior que zero para simular."
      );
      return;
    }
    const projectionData: IProjectionDataPoint[] = [];
    let currentPatrimonio = totalInvested;
    const monthlyYield = weightedAvgYield / 100 / 12;

    for (let i = 0; i < simulationYears * 12; i++) {
      const monthDate = addMonths(new Date(), i);
      const monthLabel = format(monthDate, "MMM/yyyy", { locale: ptBR });
      const rendaMensal = currentPatrimonio * monthlyYield;
      currentPatrimonio += rendaMensal + monthlyInvestment;
      projectionData.push({
        monthLabel,
        patrimonio: currentPatrimonio,
        rendaMensal,
      });
    }
    setProjection(projectionData);
    const goalMonth = projectionData.find((p) => p.rendaMensal >= incomeGoal);
    if (goalMonth) {
      setSimulationResult(
        `Sua meta de ${formatCurrency(incomeGoal)}/mês será atingida em ${
          goalMonth.monthLabel
        }.`
      );
    } else {
      const finalIncome =
        projectionData[projectionData.length - 1]?.rendaMensal || 0;
      setSimulationResult(
        `Após ${simulationYears} anos, sua renda mensal estimada será de ${formatCurrency(
          finalIncome
        )}.`
      );
    }
  };

  // useEffect do Gráfico (Sem mudanças)
  useEffect(() => {
    if (!chartCanvasRef.current || projection.length === 0) {
      // Se não houver projeção, destrói qualquer gráfico existente
      chartInstanceRef.current?.destroy();
      return;
    }

    // Destrói o gráfico anterior antes de desenhar um novo
    chartInstanceRef.current?.destroy();

    const ctx = chartCanvasRef.current.getContext("2d");
    if (!ctx) return;

    chartInstanceRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: projection.map((p) => p.monthLabel),
        datasets: [
          {
            label: "Renda Mensal Projetada",
            data: projection.map((p) => p.rendaMensal),
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            yAxisID: "yRenda",
            fill: true,
          },
          {
            label: "Patrimônio Projetado",
            data: projection.map((p) => p.patrimonio),
            borderColor: "rgb(54, 162, 235)",
            yAxisID: "yPatrimonio",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yPatrimonio: {
            type: "linear",
            display: true,
            position: "left",
            title: { display: true, text: "Patrimônio (R$)" },
          },
          yRenda: {
            type: "linear",
            display: true,
            position: "right",
            title: { display: true, text: "Renda Mensal (R$)" },
            grid: { drawOnChartArea: false },
          },
        },
        plugins: {
          legend: { position: "top" as const },
          annotation: {
            annotations: {
              goalLine: {
                type: "line",
                yMin: incomeGoal,
                yMax: incomeGoal,
                borderColor: "rgb(255, 99, 132)",
                borderWidth: 2,
                yScaleID: "yRenda",
                label: { content: "Meta", display: true, position: "end" },
              },
            },
          },
        },
      },
    });
  }, [projection, incomeGoal]);

  // --- FUNÇÕES DE SALVAR/CARREGAR ---

  useEffect(() => {
    const id = Cookies.get("flowest_user_id");
    if (id) setUserId(id);
  }, []);

  useEffect(() => {
    if (userId) {
      handleGetSimulators();
    }
  }, [userId, handleGetSimulators]);

  const handleClearState = () => {
    setHoldings([]);
    setMonthlyInvestment(500);
    setIncomeGoal(5000);
    setSimulationYears(10);
    setSimulationTitle("");
    setCurrentSimId(null);
    setProjection([]);
    setSimulationResult("");
  };

  const handleLoadSimulation = (sim: ISimulation | null) => {
    if (!sim) {
      handleClearState();
      return;
    }
    console.log("sim: ", sim);
    setHoldings(sim.holdings); // Certo, pois 'sim.holdings' agora bate com 'IHolding'
    setMonthlyInvestment(sim.monthlyInvestment);
    setIncomeGoal(sim.incomeGoal);
    setSimulationYears(sim.simulationYears);
    setSimulationTitle(sim.title);
    setCurrentSimId(sim._id);
    setProjection([]);
    setSimulationResult("");

    console.log("SIm: ", sim.holdings);
  };

  const buildPayload = () => {
    if (!userId) {
      showError("Usuário não encontrado. Faça login para salvar."); // ✅ Substituído
      return null;
    }
    if (!simulationTitle) {
      showError("Por favor, dê um título para sua simulação."); // ✅ Substituído
      return null;
    }

    return {
      userId,
      title: simulationTitle,
      holdings, // 'holdings' agora está "limpo" e pronto para o backend
      monthlyInvestment,
      incomeGoal,
      simulationYears,
    };
  };

  const handleSaveNew = async () => {
    const payload = buildPayload();
    if (!payload) return;

    try {
      const newSim = await handleCreateSimulator(payload);
      if (newSim) {
        setCurrentSimId(newSim._id);
        showSuccess("Simulação salva com sucesso!"); // ✅ Substituído
      }
    } catch (e: unknown) { 
      
      if (isApiError(e)) { 
        showError(e.response.data.message);
      } else if (e instanceof Error) {
        showError("Erro ao salvar: " + e.message);
      } else {
        showError("Erro ao salvar: Tente novamente.");
      }
    }
  };

  const handleSaveUpdate = async () => {
    const payload = buildPayload();
    if (!payload || !currentSimId) {
      showError("Nenhuma simulação carregada para atualizar."); // ✅ Substituído
      return;
    }

    try {
      await handleUpdateSimulator(currentSimId, payload);
      showSuccess("Alterações salvas com sucesso!"); // ✅ Substituído
    } catch (e) {
      showError("Erro ao salvar: " + (e as Error).message); // ✅ Substituído
    }
  };

  console.log("DEBUG: Dados de simulação no componente:", {
    simulators,
    simsLoading,
    simsError,
    userId,
  });

  // --- RENDERIZAÇÃO (JSX) ---
  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography variant="h3" component="h1" fontWeight="700">
          Simulador de Independência Financeira
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
          Planeje seu futuro, visualize seus objetivos e entenda o poder dos
          juros compostos.
        </Typography>
      </Box>

      {/* PAINEL DE CONTROLE DE SIMULAÇÃO */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Minhas Simulações
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 4 }}>
            <Autocomplete
              options={Array.isArray(simulators) ? simulators : []}
              loading={simsLoading}
              getOptionLabel={(option) => option.title || ""}
              // ✅ CORRETO: Compara os objetos pelo ID
              isOptionEqualToValue={(option, value) => option._id === value._id}
              // ✅ CORRETO: Dispara QUANDO UM ITEM É SELECIONADO
              onChange={(_, value: ISimulation | null) => {
                console.log("--- SIMULAÇÃO SELECIONADA ---", value);
                handleLoadSimulation(value);
              }}
              renderInput={(params) => (
                <TextField {...params} label="Carregar Simulação Salva" />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label="Nome da Simulação"
              value={simulationTitle}
              onChange={(e) => setSimulationTitle(e.target.value)}
              fullWidth
              placeholder="Ex: Aposentadoria 10 anos"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack direction="row" spacing={1} sx={{ height: "100%" }}>
              <Button
                variant="outlined"
                onClick={handleSaveUpdate}
                disabled={!currentSimId || simsLoading}
              >
                Salvar Alterações
              </Button>
              <Button
                variant="contained"
                onClick={handleSaveNew}
                disabled={!simulationTitle || simsLoading}
              >
                Salvar como Nova
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* --- CÓDIGO JSX ORIGINAL DO SIMULADOR --- */}
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              sx={{ display: "flex", alignItems: "center" }}
            >
              <SavingsIcon sx={{ mr: 1 }} /> 1. Ponto de Partida
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Adicione os ativos que compõem sua carteira hoje.
            </Typography>

            <Autocomplete
              options={searchableAssets}
              getOptionLabel={(o) => `${o.ticker} - ${o.companyName}`}
              value={formAsset}
              onChange={(_, v) => setFormAsset(v)}
              onInputChange={(_, newInputValue) =>
                handleSearchTickers(newInputValue)
              }
              loading={assetsLoading}
              renderInput={(params) => (
                <TextField {...params} label="Buscar Ativo..." />
              )}
              sx={{ mb: 2 }}
            />
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Quantidade"
                  type="number"
                  fullWidth
                  value={formQuantity}
                  onChange={(e) => setFormQuantity(e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Preço Médio (R$)"
                  type="number"
                  fullWidth
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                />
              </Grid>
            </Grid>
            <Button variant="contained" onClick={handleAddHolding} fullWidth>
              Adicionar Ativo
            </Button>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6">
              Carteira Atual ({formatCurrency(totalInvested)})
            </Typography>
            <List dense>
              {holdings.map((h) => (
                <ListItem
                  key={h.asset._id}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      onClick={() => handleRemoveHolding(h.asset._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={`${h.quantity} x ${h.asset.ticker}`}
                    secondary={`Total: ${formatCurrency(h.totalCost)}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              sx={{ display: "flex", alignItems: "center" }}
            >
              <FlagIcon sx={{ mr: 1 }} /> 2. Seus Objetivos
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Defina suas metas para projetar o futuro.
            </Typography>

            <Box sx={{ px: 1 }}>
              <Typography
                gutterBottom
                sx={{ display: "flex", alignItems: "center" }}
              >
                <EventIcon fontSize="small" sx={{ mr: 1 }} /> Aporte Mensal
              </Typography>
              <Slider
                value={monthlyInvestment}
                onChange={(_, v) => setMonthlyInvestment(v as number)}
                step={50}
                min={0}
                max={5000}
                valueLabelDisplay="auto"
                valueLabelFormat={formatCurrency}
              />

              <Typography
                gutterBottom
                sx={{ display: "flex", alignItems: "center", mt: 2 }}
              >
                <InsightsIcon fontSize="small" sx={{ mr: 1 }} /> Meta de Renda
                Passiva Mensal
              </Typography>
              <Slider
                value={incomeGoal}
                onChange={(_, v) => setIncomeGoal(v as number)}
                step={250}
                min={0}
                max={20000}
                valueLabelDisplay="auto"
                valueLabelFormat={formatCurrency}
              />

              <TextField
                label="Prazo da Simulação (anos)"
                type="number"
                value={simulationYears}
                onChange={(e) => setSimulationYears(Number(e.target.value))}
                fullWidth
                sx={{ mt: 3 }}
              />
            </Box>

            <Button
              variant="contained"
              color="success"
              onClick={handleRunSimulation}
              fullWidth
              sx={{ mt: 4, py: 1.5 }}
            >
              Simular Futuro
            </Button>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h5" component="h2" gutterBottom>
              3. Projeção de Crescimento
            </Typography>
            {projection.length > 0 ? (
              <>
                <Alert severity="info" sx={{ mb: 2 }}>
                  {simulationResult}
                </Alert>
                <Box
                  sx={{ position: "relative", height: { xs: 300, sm: 500 } }}
                >
                  <canvas ref={chartCanvasRef}></canvas>
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  textAlign: "center",
                  p: 3,
                  border: "2px dashed",
                  borderColor: "divider",
                  borderRadius: 2,
                }}
              >
                <InsightsIcon sx={{ fontSize: 60, color: "text.secondary" }} />
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Seus resultados aparecerão aqui.
                </Typography>
                <Typography color="text.secondary">
                  Preencha seus dados e clique em &quot;Simular Futuro&quot; para ver a
                  mágica acontecer.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
