"use client";

import { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
  type TooltipItem, // <-- CORREÇÃO: Importa o tipo
} from "chart.js";
import { Paper, Typography, Box } from "@mui/material";

// Registra os componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale
);

// --- DADOS DE EXEMPLO (MOCK DATA) ---
const mockData = [
  { month: "Jan", patrimonio: 10000, cdi: 10000, ibov: 10000 },
  { month: "Fev", patrimonio: 10250, cdi: 10110, ibov: 10150 },
  { month: "Mar", patrimonio: 10500, cdi: 10220, ibov: 10300 },
  { month: "Abr", patrimonio: 10450, cdi: 10330, ibov: 10250 },
  { month: "Mai", patrimonio: 10800, cdi: 10440, ibov: 10500 },
  { month: "Jun", patrimonio: 11200, cdi: 10550, ibov: 10800 },
  { month: "Jul", patrimonio: 11300, cdi: 10660, ibov: 11000 },
  { month: "Ago", patrimonio: 11600, cdi: 10770, ibov: 10900 },
  { month: "Set", patrimonio: 11500, cdi: 10880, ibov: 10750 },
  { month: "Out", patrimonio: 11800, cdi: 10990, ibov: 11100 },
  { month: "Nov", patrimonio: 12200, cdi: 11100, ibov: 11400 },
  { month: "Dez", patrimonio: 12500, cdi: 11210, ibov: 11700 },
];

// Formata números para o Tooltip (ex: R$ 10.250,00)
const formatCurrencyForTooltip = (value: number) => {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export default function PatrimonialEvolutionChart() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<ChartJS | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const chartConfig = {
      type: "line" as const,
      data: {
        labels: mockData.map((d) => d.month),
        datasets: [
          {
            label: "Minha Carteira",
            data: mockData.map((d) => d.patrimonio),
            borderColor: "#3b82f6", // Azul
            borderWidth: 3,
            tension: 0.1,
            pointRadius: 0,
          },
          {
            label: "CDI",
            data: mockData.map((d) => d.cdi),
            borderColor: "#f43f5e", // Rosa
            borderWidth: 2,
            borderDash: [5, 5],
            tension: 0.1,
            pointRadius: 0,
          },
          {
            label: "Ibovespa",
            data: mockData.map((d) => d.ibov),
            borderColor: "#10b981", // Verde
            borderWidth: 2,
            borderDash: [5, 5],
            tension: 0.1,
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top" as const,
          },
          tooltip: {
            callbacks: {
              label: (context: TooltipItem<'line'>) => { // ✅ CORREÇÃO APLICADA
                const label = context.dataset.label || "";
                const value = context.parsed.y;
                return `${label}: ${formatCurrencyForTooltip(value ?? 0)}`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            grid: {
              borderDash: [3, 3],
              color: "#e0e0e0",
            },
            ticks: {
              // Garante que o valor é um número antes de dividir
              callback: (value: number | string) => 
                typeof value === 'number' ? `R$${value / 1000}k` : '',
            },
          },
        },
      },
    };

    chartRef.current = new ChartJS(ctx, chartConfig);

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  return (
    <Paper sx={{ p: 3, height: "400px" }} variant="outlined">
      <Typography variant="h6" component="h3" fontWeight="bold" gutterBottom>
        Evolução Patrimonial vs. Benchmarks
      </Typography>
      <Box sx={{ height: "100%", maxHeight: 300 }}>
        <canvas ref={canvasRef}></canvas>
      </Box>
    </Paper>
  );
}