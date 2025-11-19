"use client";

// Adicionando useState para o toggle de planos
import React, { useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";

// Adicionando ToggleButton para o seletor de preço
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

// Ícones para destacar as funcionalidades
import {
  Wallet,
  BarChart,
  LineChart,
  FileScan,
  TrendingUp,
  Target,
  Zap,
  ShieldCheck,
  BellRing,
  Check, // Ícone para features dos planos
} from "lucide-react";

const features = [
  {
    icon: <Wallet size={32} className="text-primary-main" />,
    title: "Consolide sua Carteira",
    description:
      "Acompanhe todos os seus ativos — Ações, FIIs, ETFs e Cripto — em um único lugar e veja a evolução do seu patrimônio.",
  },
  {
    icon: <BarChart size={32} className="text-primary-main" />,
    title: "Monitore seus Dividendos",
    description:
      "Registre e visualize todos os proventos recebidos mês a mês. Entenda a performance da sua estratégia de renda passiva.",
  },
  {
    icon: <FileScan size={32} className="text-primary-main" />,
    title: "Importação Automática (Em Breve)",
    description:
      "Envie suas notas de corretagem e deixe nossa IA extrair e cadastrar suas transações automaticamente, economizando seu tempo.",
  },
  {
    icon: <TrendingUp size={32} className="text-primary-main" />,
    title: "Análise de Ativos",
    description:
      "Acesse indicadores, gráficos e informações essenciais para tomar decisões de investimento mais bem fundamentadas.",
  },
  {
    icon: <Target size={32} className="text-primary-main" />,
    title: "Metas e Projeções",
    description:
      "Defina seus objetivos financeiros e simule o futuro da sua carteira para entender o caminho até a independência financeira.",
  },
  {
    icon: <LineChart size={32} className="text-primary-main" />,
    title: "Relatórios de Performance",
    description:
      "Compare a rentabilidade da sua carteira com os principais benchmarks do mercado, como o Ibovespa e o CDI.",
  },
];

// --- INÍCIO: Definição dos dados dos planos ---
const plans = [
  {
    id: "leve",
    title: "Investidor",
    priceMonthly: 19.9,
    public: "Para quem está começando a organizar seus investimentos.",
    features: [
      "Consolidação de Carteira (Ações, FIIs, Cripto, Renda Fixa)",
      "Simulador de Investimentos",
      "Gráfico de Alocação por Setor",
      "Rebalanceamento de Carteira (com % ideal, mín. e máx.)",
      "Projeção de Dividendos e Aportes (Plano de Renda Passiva)",
    ],
    highlight: false,
  },
  {
    id: "medio",
    title: "Estrategista",
    priceMonthly: 39.9,
    public: "Para o investidor que busca controle total e otimização.",
    features: [
      "Tudo do Plano Investidor",
      "Controle de Despesas Pessoais (Fluxo de Caixa)",
      "Gráficos de Gastos vs. Investimentos por Setor",
      "Relatórios de Performance (comparação com benchmarks)",
      "Análise de Ativos (indicadores e gráficos)",
    ],
    highlight: true,
  },
  {
    id: "pro",
    title: "Flow Pro",
    priceMonthly: 79.9,
    public: "A solução definitiva com IA para máxima performance.",
    features: [
      "Tudo do Plano Estrategista",
      "Importação Automática de Notas de Corretagem (via IA)",
      "Lançamento de investimentos via WhatsApp (Integração)",
      "Análise de Investimentos com IA (Insights e recomendações)",
      "Análise de Gastos com IA (Oportunidades de economia customizadas)",
      "Alertas de Mercado (Rebalanceamento, Preço-Alvo, Proventos)",
      "Análise de Risco da Carteira (VaR, Sharpe)",
      "Suporte Prioritário (WhatsApp/Chat)",
    ],
    highlight: false,
  },
];
// --- FIM: Definição dos dados dos planos ---

export default function LandingPage() {
  // --- INÍCIO: Estado para o toggle de planos ---
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "monthly"
  );

  const handleBillingToggle = (
    event: React.MouseEvent<HTMLElement>,
    newBillingCycle: "monthly" | "annual" | null
  ) => {
    if (newBillingCycle !== null) {
      setBillingCycle(newBillingCycle);
    }
  };
  // --- FIM: Estado para o toggle de planos ---

  return (
    <Box sx={{ bgcolor: "white" }}>
      {/* Seção Hero */}
      <Container
        maxWidth="lg"
        sx={{ textAlign: "center", py: { xs: 8, md: 16 } }}
      >
        <Typography
          variant="h2"
          component="h1"
          fontWeight="bold"
          sx={{
            mb: 2,
            background: "linear-gradient(to right, #1976d2, #38b2ac)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Inteligência e Controle para seus Investimentos
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: "750px", mx: "auto", mb: 4 }}
        >
          Com a Flowest, você organiza seus ativos, acompanha dividendos, mantém
          sua carteira equilibrada e enxerga o futuro financeiro com clareza.
          Tome decisões inteligentes com dados completos ao seu alcance.
        </Typography>
        <Link href="/login" passHref>
          <Button
            variant="contained"
            size="large"
            sx={{ py: 1.5, px: 4, fontSize: "1rem" }}
          >
            Acessar à Plataforma
          </Button>
        </Link>
      </Container>

      {/* Seção de Funcionalidades */}
      <Box sx={{ bgcolor: "grey.50", py: { xs: 8, md: 16 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography variant="h3" component="h2" fontWeight="bold">
              Tudo que você precisa em um só lugar
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mt: 1, maxWidth: "600px", mx: "auto" }}
            >
              Deixe as planilhas para trás. Nossa plataforma oferece as
              ferramentas certas para cada etapa da sua jornada como investidor.
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {features.map((feature) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={feature.title}>
                <Card
                  sx={{
                    p: 3,
                    textAlign: "left",
                    height: "100%",
                    transition:
                      "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    {feature.icon}
                    <Typography
                      variant="h6"
                      component="h3"
                      fontWeight="bold"
                      sx={{ ml: 2 }}
                    >
                      {feature.title}
                    </Typography>
                  </Box>
                  <CardContent sx={{ p: "0 !important" }}>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Seção "Como Funciona" */}
      <Box sx={{ py: { xs: 8, md: 16 } }}>
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Typography
            variant="h3"
            component="h2"
            fontWeight="bold"
            sx={{ mb: 8 }}
          >
            Comece em 3 Passos Simples
          </Typography>
          <Grid container spacing={5}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="h1" fontWeight="bold" color="primary.light">
                01
              </Typography>
              <Typography variant="h6" fontWeight="bold" sx={{ my: 1 }}>
                Crie sua Conta
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Leva menos de um minuto. Seus dados estão seguros conosco.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="h1" fontWeight="bold" color="primary.light">
                02
              </Typography>
              <Typography variant="h6" fontWeight="bold" sx={{ my: 1 }}>
                Importe seus Ativos
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Adicione suas transações manualmente ou, em breve, envie suas
                notas de corretagem.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="h1" fontWeight="bold" color="primary.light">
                03
              </Typography>
              <Typography variant="h6" fontWeight="bold" sx={{ my: 1 }}>
                Visualize e Decida
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Com os dashboards intuitivos, analise sua performance e planeje
                seus próximos passos.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* --- INÍCIO: NOVA SEÇÃO DE PLANOS E PREÇOS --- */}
      <Box sx={{ bgcolor: "white", py: { xs: 8, md: 16 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            fontWeight="bold"
            sx={{ textAlign: "center", mb: 4 }}
          >
            Escolha o plano ideal para você
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 4,
            }}
          >
            <ToggleButtonGroup
              value={billingCycle}
              exclusive
              onChange={handleBillingToggle}
              aria-label="ciclo de cobrança"
              sx={{ mb: 2 }}
            >
              <ToggleButton value="monthly" aria-label="mensal">
                Mensal
              </ToggleButton>
              <ToggleButton value="annual" aria-label="anual">
                Anual
              </ToggleButton>
            </ToggleButtonGroup>

            <Box sx={{ height: "24px" }}>
              {billingCycle === "annual" && (
                <Chip
                  label="Economize 2 meses!"
                  color="success"
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>

          <Grid container spacing={4} justifyContent="center">
            {plans.map((plan) => {
              const price =
                billingCycle === "annual"
                  ? plan.priceMonthly * 10
                  : plan.priceMonthly;
              const period = billingCycle === "annual" ? "/ano" : "/mês";

              return (
                <Grid size={{ xs: 12, md: 4 }} key={plan.id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      p: 3,
                      border: plan.highlight ? "2px solid" : "1px solid",
                      borderColor: plan.highlight ? "primary.main" : "grey.200",
                      position: "relative",
                      overflow: "visible",
                      transition:
                        "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: 6,
                      },
                    }}
                  >
                    {plan.highlight && (
                      <Chip
                        label="Mais Popular"
                        color="primary"
                        sx={{
                          position: "absolute",
                          top: -14,
                          left: "50%",
                          transform: "translateX(-50%)",
                          fontWeight: "bold",
                        }}
                      />
                    )}
                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        flexGrow: 1,
                        p: "0 !important",
                      }}
                    >
                      <Typography
                        variant="h5"
                        component="h3"
                        fontWeight="bold"
                        sx={{ mb: 1 }}
                      >
                        {plan.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ minHeight: "40px", mb: 2 }}
                      >
                        {plan.public}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "baseline",
                          mb: 2,
                        }}
                      >
                        <Typography variant="h4" fontWeight="bold">
                          R${" "}
                          {price.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          color="text.secondary"
                          sx={{ ml: 0.5 }}
                        >
                          {period}
                        </Typography>
                      </Box>

                      <Divider sx={{ mb: 3 }} />

                      <Box sx={{ mb: 3 }}>
                        {plan.features.map((feature, index) => (
                          <Box
                            key={index}
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              mb: 1.5,
                            }}
                          >
                            <Check
                              size={18}
                              color="#4caf50" // Verde
                              style={{ marginTop: 3, minWidth: 18 }}
                            />
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ ml: 1.5 }}
                            >
                              {feature}
                            </Typography>
                          </Box>
                        ))}
                      </Box>

                      {/* Botão de Ação */}
                      <Link
                        href={`/inscricao?plan=${plan.id}&cycle=${billingCycle}`}
                        passHref
                        style={{ textDecoration: "none", width: "100%" }}
                      >
                        <Button
                          variant={plan.highlight ? "contained" : "outlined"}
                          fullWidth
                          sx={{ mt: "auto", py: 1.5 }} // mt: 'auto' empurra o botão para o final
                        >
                          Escolher Plano
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>
      {/* --- FIM: NOVA SEÇÃO DE PLANOS E PREÇOS --- */}

      {/* Seção de Próximos Passos */}
      <Box sx={{ bgcolor: "grey.50", py: { xs: 8, md: 16 } }}>
        <Container maxWidth="lg" sx={{ textAlign: "center" }}>
          <Typography
            variant="h3"
            component="h2"
            fontWeight="bold"
            sx={{ mb: 2 }}
          >
            Sempre Evoluindo
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 8, maxWidth: "600px", mx: "auto" }}
          >
            Estamos constantemente trabalhando para trazer as melhores
            ferramentas para você.
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Card variant="outlined" sx={{ p: 2, height: "100%" }}>
                <Zap size={24} />
                <Typography fontWeight="bold" sx={{ my: 1 }}>
                  Integração com Corretoras
                </Typography>
                <Chip label="Em Breve" color="primary" size="small" />
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Card variant="outlined" sx={{ p: 2, height: "100%" }}>
                <ShieldCheck size={24} />
                <Typography fontWeight="bold" sx={{ my: 1 }}>
                  Análise de Risco
                </Typography>
                <Chip label="Em Breve" color="primary" size="small" />
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Card variant="outlined" sx={{ p: 2, height: "100%" }}>
                <BellRing size={24} />
                <Typography fontWeight="bold" sx={{ my: 1 }}>
                  Alertas de Mercado
                </Typography>
                <Chip label="Em Breve" color="primary" size="small" />
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Seção Final de CTA */}
      <Box sx={{ py: { xs: 8, md: 16 } }}>
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Typography
            variant="h3"
            component="h2"
            fontWeight="bold"
            sx={{ mb: 2 }}
          >
            Pronto para ter o controle da sua carteira?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Junte-se a investidores que tomam decisões baseadas em dados.
          </Typography>
          <Link href="/login" passHref>
            <Button
              variant="contained"
              size="large"
              sx={{ py: 1.5, px: 4, fontSize: "1rem" }}
            >
              Começar Agora
            </Button>
          </Link>
        </Container>
      </Box>

      {/* Rodapé */}
      <Box component="footer" sx={{ bgcolor: "white", py: 4 }}>
        <Container maxWidth="lg">
          <Divider />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "center", mt: 4 }}
          >
            © {new Date().getFullYear()} Flowest. Todos os direitos reservados.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
