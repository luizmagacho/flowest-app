"use client";

import { useMemo } from "react";
import { IPortfolio } from "@/services/portfolio/type";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  ChartOptions,
  TooltipItem, // Importação do tipo
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Box, Paper, Typography, Grid, DialogTitle } from "@mui/material";
// Certifique-se de que 'formatPercent' exista ou remova-o do tooltip
import { formatCurrency, formatPercent } from "@/lib/formatters";

// Registra os elementos necessários do Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, Title);

// --- Paleta de Cores Genérica ---
const CHART_COLORS = [
  "#4E79A7",
  "#F28E2B",
  "#E15759",
  "#76B7B2",
  "#59A14F",
  "#EDC948",
  "#B07AA1",
  "#FF9DA7",
  "#9C755F",
  "#BAB0AC",
];
const CHART_BORDER_COLORS = CHART_COLORS.map((color) => `${color}B3`);

// --- Props do Componente ---
interface PortfolioChartsProps {
  portfolio: IPortfolio[];
}

// --- Função Helper para Opções do Gráfico ---
const getChartOptions = (
  title: string,
  totalValue: number
): ChartOptions<"doughnut"> => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        padding: 15,
        font: {
          size: 11,
        },
      },
    },
    title: {
      display: true,
      text: title,
      font: {
        size: 16,
        weight: "bold",
      },
      padding: {
        bottom: 15,
      },
    },
    tooltip: {
      callbacks: {
        label: function (context: TooltipItem<'doughnut'>) { // <-- CORREÇÃO AQUI
          let label = context.label || "";
          if (label) {
            label += ": ";
          }
          // O tipo 'context.parsed' é 'number' para gráficos Doughnut/Pie
          if (context.parsed !== null) {
            const value = context.parsed; 
            
            // O cálculo da porcentagem deve usar o valor do gráfico (context.parsed) 
            // e dividir pelo TOTAL DO PORTFÓLIO (totalValue), que é passado como argumento.
            const percentage = value / totalValue;

            const formattedPercent =
              typeof formatPercent === "function"
                ? formatPercent(percentage)
                : `${(percentage * 100).toFixed(2)}%`;

            label += `${formatCurrency(value)} (${formattedPercent})`;
          }
          return label;
        },
      },
    },
  },
});

// --- Componente Principal ---
export default function PortfolioCharts({ portfolio }: PortfolioChartsProps) {
  // 1. Calcula o valor total do portfólio
  //TODO: Mudar pra valor real e não de compra depois
  const totalPortfolioValue = useMemo(() => {
    if (!portfolio) return 0;
    return portfolio.reduce(
      (acc, asset) =>
        acc + asset.quantity * (asset.currentPrice || asset.averageBuyPrice),
      0
    );
  }, [portfolio]);

  console.log("PORTFOLIO DATA:", portfolio);
  console.log("TOTAL VALUE:", totalPortfolioValue);

  // 2. Processamento de Dados por TIPO
  const typeChartData = useMemo(() => {
    const totals = portfolio.reduce((acc, asset) => {
      const totalValue =
        asset.quantity * (asset.currentPrice || asset.averageBuyPrice);
      acc[asset.type] = (acc[asset.type] || 0) + totalValue;
      return acc;
    }, {} as Record<string, number>);

    return {
      labels: Object.keys(totals),
      datasets: [
        {
          label: "Valor por Tipo",
          data: Object.values(totals),
          backgroundColor: CHART_COLORS,
          borderColor: CHART_BORDER_COLORS,
          borderWidth: 1,
        },
      ],
    };
  }, [portfolio]);

  // 3. Processamento de Dados por SETOR
  const sectorChartData = useMemo(() => {
    const totals = portfolio.reduce((acc, asset) => {
      const sector = asset.sector || "Não Classificado";
      const totalValue =
        asset.quantity * (asset.currentPrice || asset.averageBuyPrice);
      acc[sector] = (acc[sector] || 0) + totalValue;
      return acc;
    }, {} as Record<string, number>);

    return {
      labels: Object.keys(totals),
      datasets: [
        {
          label: "Valor por Setor",
          data: Object.values(totals),
          backgroundColor: CHART_COLORS,
          borderColor: CHART_BORDER_COLORS,
          borderWidth: 1,
        },
      ],
    };
  }, [portfolio]);

  // 4. Processamento de Dados por ATIVO
  const assetChartData = useMemo(() => {
    const sortedAssets = [...portfolio].sort(
      (a, b) =>
        b.quantity * (b.currentPrice || b.averageBuyPrice) -
        a.quantity * (a.currentPrice || a.averageBuyPrice)
    );

    const topAssets = sortedAssets.slice(0, 10);
    const otherAssetsValue = sortedAssets
      .slice(10)
      .reduce(
        (acc, asset) =>
          acc + asset.quantity * (asset.currentPrice || asset.averageBuyPrice),
        0
      );

    const labels = topAssets.map((asset) => asset.ticker);
    const data = topAssets.map(
      (asset) => asset.quantity * (asset.currentPrice || asset.averageBuyPrice)
    );

    if (otherAssetsValue > 0) {
      labels.push("Outros");
      data.push(otherAssetsValue);
    }

    return {
      labels,
      datasets: [
        {
          label: "Valor por Ativo",
          data,
          backgroundColor: CHART_COLORS,
          borderColor: CHART_BORDER_COLORS,
          borderWidth: 1,
        },
      ],
    };
  }, [portfolio]);

  // 5. Gera as opções dinamicamente
  const typeOptions = getChartOptions("Alocação por Tipo", totalPortfolioValue);
  const sectorOptions = getChartOptions(
    "Alocação por Setor",
    totalPortfolioValue
  );
  const assetOptions = getChartOptions(
    "Alocação por Ativo",
    totalPortfolioValue
  );

  // Não renderiza nada se não houver dados
  if (!portfolio || portfolio.length === 0 || totalPortfolioValue === 0) {
    return null;
  }

  // 6. Renderização d
  return (
    <Box sx={{ mb: 4 }}>
      {/* O "container" define o layout de grade.
        O "spacing={3}" adiciona espaço entre os itens.
      */}
      <Grid container spacing={3}>
        {/* O "item" define um item da grade.
          "xs={12}" significa: em telas pequenas (extra-small), ocupe 12 de 12 colunas (largura total).
          "md={4}" significa: em telas médias (medium) e maiores, ocupe 4 de 12 colunas (um terço).
        */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper variant="outlined" sx={{ p: 2, height: "450px" }}>
            <Doughnut options={typeOptions} data={typeChartData} />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper variant="outlined" sx={{ p: 2, height: "450px" }}>
            <Doughnut options={sectorOptions} data={sectorChartData} />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper variant="outlined" sx={{ p: 2, height: "450px" }}>
            <Doughnut options={assetOptions} data={assetChartData} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
