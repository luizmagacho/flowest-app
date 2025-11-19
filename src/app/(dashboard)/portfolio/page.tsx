"use client";

import { useState, useMemo, useEffect, useContext } from "react";
import { formatCurrency } from "@/lib/formatters";
import { IPortfolio } from "@/services/portfolio/type";

// Importações do Material-UI
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import LinearProgress from "@mui/material/LinearProgress";
import Tooltip from "@mui/material/Tooltip";
import { PortfolioContext } from "@/contexts/PortfolioContext";
import Cookies from "js-cookie";
import PortfolioCharts from "@/components/PortfolioChart/PortfolioCharts";
import TickerTape from "@/components/TickerTape/TickerTape";
import { QuoteContext } from "@/contexts/QuoteContext";
import AssetAllocationChart from "@/components/AssetAllocationChart/AssetAllocationChart";
import PatrimonialEvolutionChart from "@/components/PatrimonialEvolutionChart/PatrimonialEvolutionChart";

import {
  Chart as ChartJS,
  CategoryScale, // Eixo X (Categorias)
  LinearScale, // Eixo Y (Valores)
  PointElement,
  LineElement, // <-- ESSENCIAL PARA O GRÁFICO DE LINHA
  Title,
  Legend,
  ArcElement, // Para Doughnut/Pie, se você estiver usando
} from 'chart.js';

// Registre todos os componentes usados na sua aplicação
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement, // <-- ADICIONE ESTE
  Title,
  Legend,
  ArcElement // Mantenha se você usa o gráfico de rosca
  // Adicione qualquer outro controlador necessário, como BarController, etc.
);

// Os tipos de abas estão corretos e correspondem ao JSON
type TabType = IPortfolio["type"] | "Todos";
const TABS: TabType[] = ["Todos", "Ação", "BDR", "Cripto", "ETF", "FII"];

// Componente PriceRangeBar (sem alterações)
const PriceRangeBar = ({
  value,
  min,
  max,
}: {
  value: number;
  min: number;
  max: number;
}) => {
  // Garante que a divisão não seja por zero se min === max
  const range = max - min;
  const normalizedValue = range > 0 ? ((value - min) / range) * 100 : 50; // 50% se min=max

  // Atualizei o Tooltip para incluir o valor ATUAL
  const tooltipTitle = `Atual: ${formatCurrency(
    value
  )} | Min 52s: ${formatCurrency(min)} | Max 52s: ${formatCurrency(max)}`;

  return (
    <Box sx={{ width: "100%" }}>
      <Tooltip title={tooltipTitle}>
        {/* A barra de progresso */}
        <LinearProgress
          variant="determinate"
          value={normalizedValue}
          sx={{
            height: 8, // Um pouco mais grossa para visualização
            borderRadius: 4,
          }}
        />
      </Tooltip>

      {/* Rótulos de Min e Max abaixo */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 0.5, // Pequena margem superior
        }}
      >
        <Typography variant="caption" sx={{ fontWeight: "bold" }}>
          {formatCurrency(min)}
        </Typography>
        <Typography variant="caption" sx={{ fontWeight: "bold" }}>
          {formatCurrency(max)}
        </Typography>
      </Box>
    </Box>
  );
};

export default function PortfolioPage() {
  const userId = Cookies.get("flowest_user_id") as string;
  const [activeTab, setActiveTab] = useState<TabType>("Todos");
  const { portfolio, loading, handleGetPortfolio } =
    useContext(PortfolioContext);

  const { tickerTapeItems, fetchTickerTapeData, loadingQuote } =
    useContext(QuoteContext);

  const handleTabChange = (
    event: React.SyntheticEvent,
    newValue: IPortfolio["type"]
  ) => {
    setActiveTab(newValue);
  };

  const filteredAssets = useMemo(() => {
    if (!portfolio) return [];

    // Se a aba for "Todos", retorna o portfólio completo
    if (activeTab === "Todos") {
      return portfolio;
    }

    // Caso contrário, filtra os ativos pelo tipo da aba selecionada
    return portfolio.filter((asset) => asset.type === activeTab);
  }, [portfolio, activeTab]);

  useEffect(() => {
    handleGetPortfolio(userId);
    fetchTickerTapeData();
  }, [fetchTickerTapeData, handleGetPortfolio, userId]);

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1, // Faz este Box crescer e ocupar todo o espaço restante
        width: "100%", // Base para o flexGrow funcionar bem
        overflow: "auto", // Adiciona scroll SÓ para o conteúdo, se necessário
      }}
    >
      <Paper
        sx={{
          width: "100%", // Isso está correto
          overflow: "hidden", // <-- Esta é a correção
          textAlign: "center",
        }}
        variant="outlined"
      >
        <TickerTape tickerTapeItems={tickerTapeItems} loading={loadingQuote} />
      </Paper>
      <Box className="mb-6">
        <Typography variant="h4" component="h1" fontWeight="bold">
          Portfólio
        </Typography>
        <Typography color="text.secondary">
          Visualize seus ativos com detalhes de custo, proventos e performance
          de preço.
        </Typography>
      </Box>

      <Paper sx={{ width: "100%" }} variant="outlined">
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          {TABS.map((tabName) => (
            <Tab label={tabName} value={tabName} key={tabName} />
          ))}
        </Tabs>
        {loading && <LinearProgress />}
        <TableContainer sx={{ maxHeight: "calc(100vh - 250px)" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>#</TableCell>
                <TableCell sx={{ fontWeight: "bold", minWidth: 170 }}>
                  Ativo
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", minWidth: 200 }}>
                  Preço (52 Semanas)
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Minha Posição</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Meu Custo</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Proventos</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!loading && filteredAssets.length > 0
                ? filteredAssets.map((asset, index) => {
                    const averagePrice = asset.acquisitionCost / asset.quantity;
                    const averagePriceWithYields =
                      (asset.acquisitionCost - asset.totalYields) /
                      asset.quantity;
                    const totalValue = asset.quantity * asset.currentPrice;

                    return (
                      <TableRow key={asset._id} hover>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <Typography variant="body1" fontWeight="bold">
                            {asset.ticker}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {asset.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1" fontWeight="bold">
                            {formatCurrency(asset.currentPrice)}
                          </Typography>
                          <PriceRangeBar
                            value={asset.currentPrice}
                            min={asset.fiftyTwoWeekLow}
                            max={asset.fiftyTwoWeekHigh}
                          />
                        </TableCell>
                        <TableCell>
                          {/* << CORREÇÃO: Usando userQuantity >> */}
                          <Typography variant="body1">
                            {asset.quantity.toLocaleString("pt-BR")}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatCurrency(totalValue)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {/* << CORREÇÃO: Usando userAcquisitionCost >> */}
                          <Typography variant="body1">
                            {formatCurrency(asset.acquisitionCost)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            PM: {formatCurrency(averagePrice)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {/* << CORREÇÃO: Usando userTotalYields >> */}
                          <Typography variant="body1" color="success.main">
                            {formatCurrency(asset.totalYields)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            PM c/ Prov: {formatCurrency(averagePriceWithYields)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })
                : !loading && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography color="text.secondary" sx={{ p: 4 }}>
                          Nenhum ativo encontrado para a categoria 
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
            </TableBody>
          </Table>
        </TableContainer>
        <PortfolioCharts portfolio={portfolio || []} />
        <AssetAllocationChart portfolio={portfolio || []} />
        <PatrimonialEvolutionChart  />
      </Paper>
    </Box>
  );
}
