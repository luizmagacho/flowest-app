"use client";

import { useMemo, useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  ArcElement, // Necessário para Pie/Doughnut
  Tooltip,
  Legend,
  type TooltipItem,
} from "chart.js";
import { Paper, Typography, Box } from "@mui/material";
// Certifique-se de que o caminho para seu tipo IPortfolio está correto
import { IPortfolio } from "@/services/portfolio/type";

// Registra os componentes do Chart.js que o gráfico de rosca utiliza
ChartJS.register(ArcElement, Tooltip, Legend);

// Cores para as fatias do gráfico (paleta amigável)
const COLORS = [
  "#3b82f6", // Azul
  "#10b981", // Verde
  "#f97316", // Laranja
  "#a855f7", // Roxo
  "#f43f5e", // Rosa
  "#eab308", // Amarelo
];

interface AssetAllocationChartProps {
  portfolio: IPortfolio[];
}

// Helper para formatar moeda (usado no Tooltip)
const formatCurrencyForTooltip = (value: number) => {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export default function AssetAllocationChart({
  portfolio,
}: AssetAllocationChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<ChartJS | null>(null);

  const allocationData = useMemo(() => {
    // LOG 1: Veja o que está entrando
    console.log("PORTFOLIO PROP (RAW):", JSON.stringify(portfolio, null, 2));

    const allocationMap = new Map<string, number>();
    let totalValue = 0;

    portfolio.forEach((asset) => {
      // ---- CORREÇÃO DEFENSIVA ----
      // Garante que os valores são numéricos antes de multiplicar
      const price = typeof asset.currentPrice === 'number' ? asset.currentPrice : 0;
      const qty = typeof asset.quantity === 'number' ? asset.quantity : 0;
      const value = price * qty;
      // --------------------------

      // Só processa se o valor for real
      if (value > 0) {
        totalValue += value;
        const type = asset.type;
        allocationMap.set(type, (allocationMap.get(type) || 0) + value);
      }
    });

    if (totalValue === 0) {
      // LOG 2: Veja por que ele pode estar parando
      console.warn("CÁLCULO PAROU: totalValue é 0. Gráfico ficará em branco.");
      return [];
    }

    const data = Array.from(allocationMap.entries()).map(([name, value]) => ({
      name,
      value: parseFloat(((value / totalValue) * 100).toFixed(2)), // Valor em percentual
      totalValue: value, // Valor monetário (para o tooltip)
    }));

    // LOG 3: Veja os dados finais que vão para o gráfico
    console.log("ALLOCATION DATA (FINAL):", data);

    return data;
  }, [portfolio]);

  useEffect(() => {
    if (!canvasRef.current) return; // Espera o canvas estar pronto

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    // Destrói qualquer gráfico anterior para evitar duplicatas
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Se não houver dados (carteira vazia), não desenha o gráfico
    if (allocationData.length === 0) {
      return;
    }

    // Configuração do Gráfico de Rosca
    const chartConfig = {
      type: "doughnut" as const,
      data: {
        labels: allocationData.map((d) => d.name), // Nomes (Ação, FII...)
        datasets: [
          {
            label: "Alocação",
            data: allocationData.map((d) => d.value), // Percentuais
            backgroundColor: COLORS,
            borderColor: "#fff", // Adiciona uma borda branca entre as fatias
            borderWidth: 2,
            hoverOffset: 4, // Efeito ao passar o mouse
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // Permite que o gráfico preencha o contêiner
        plugins: {
          legend: {
            position: "right" as const, // Legenda à direita
            labels: {
              boxWidth: 12,
              padding: 15,
            },
          },
          tooltip: {
            callbacks: {
              // Tooltip customizado para mostrar % e Valor R$
              label: (context: TooltipItem<'doughnut'>) => { // <-- TIPO CORRIGIDO
                const index = context.dataIndex;
                const data = allocationData[index];
                if (!data) return "";

                const percent = `${data.value.toFixed(2)}%`;
                const total = formatCurrencyForTooltip(data.totalValue);

                // Ex: "Ação: 45.10% (R$ 10.500,00)"
                return `${data.name}: ${percent} (${total})`;
              },
            },
          },
        },
      },
    };

    // Cria a nova instância do gráfico
    chartRef.current = new ChartJS(ctx, chartConfig);

    // Função de cleanup do useEffect: destrói o gráfico ao desmontar
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [allocationData]); // Redesenha o gráfico se os dados processados mudarem

  // 3. Renderização do componente
  return (
    <Paper sx={{ p: 3, height: "400px" }} variant="outlined">
      <Typography variant="h6" component="h3" fontWeight="bold" gutterBottom>
        Alocação por Tipo de Ativo
      </Typography>
      {/* O Box define a área onde o <canvas> será desenhado.
        É crucial para o 'maintainAspectRatio: false' funcionar.
      */}
      <Box sx={{ height: "100%", maxHeight: 300, position: "relative" }}>
        {portfolio.length > 0 ? (
          // O Canvas onde o Chart.js desenha
          <canvas ref={canvasRef}></canvas>
        ) : (
          // Mensagem de fallback se a carteira estiver vazia
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <Typography color="text.secondary">
              Adicione ativos à sua carteira para ver a alocação.
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
}
