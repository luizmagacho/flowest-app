"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Grid,
  Divider,
} from "@mui/material";
import {
  Mail,
  Lock,
  EyeOff,
  Eye,
  User,
  CreditCard,
  Calendar,
  HelpCircle,
} from "lucide-react";
import { Google, Apple, Facebook } from "@mui/icons-material";

// --- Definição de Tipos Seguros ---

// Define uma interface para o erro, focando apenas na 'message'
interface ErrorWithMessage {
  message: string;
}

// Type guard para verificar se um objeto 'unknown' tem uma propriedade 'message'
const isErrorWithMessage = (error: unknown): error is ErrorWithMessage => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as ErrorWithMessage).message === 'string'
  );
};

// Define os tipos para a função mockada (mais seguro que 'any')
type ApiPayload = Record<string, unknown>;
type ApiResponse = Record<string, unknown>;


// --- Definição de Preços (para carregar dinamicamente) ---
const planDetails: { [key: string]: { monthly: number; annual: number } } = {
  leve: { monthly: 19.9, annual: 199.0 },
  medio: { monthly: 39.9, annual: 399.0 },
  pro: { monthly: 79.9, annual: 799.0 },
  default: { monthly: 29.9, annual: 299.0 },
};

export default function SubscribePage() {
  // --- Estados do Formulário ---
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // --- Estados do Plano (controlados pela URL) ---
  const [planId, setPlanId] = useState<string>("medio");
  const [billingCycle, setBillingCycle] = useState("mensal");

  // Estados do "Stripe" (simulação)
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  // Estados de controle
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // --- Lógica para ler os Parâmetros da URL ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlPlan = params.get("plan");
      const urlCycle = params.get("cycle");

      if (urlPlan && planDetails[urlPlan]) {
        setPlanId(urlPlan);
      }

      if (urlCycle === "annual") {
        setBillingCycle("anual");
      } else {
        setBillingCycle("mensal");
      }
    }
  }, []);

  const currentPrices = planDetails[planId] || planDetails.default;

  const handlePlanChange = (
    event: React.MouseEvent<HTMLElement>,
    newCycle: string
  ) => {
    if (newCycle !== null) {
      setBillingCycle(newCycle);
    }
  };

  // ✅ CORREÇÃO 1: Tipagem segura na função mock (substituindo 'any')
  const postCreateUserAndSubscribe = async (
    payload: ApiPayload
  ): Promise<ApiResponse> => {
    console.log("Enviando payload para API e Stripe:", payload);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Usa asserção para acessar 'email' no mock, pois sabemos que existe no payload
        if ((payload.email as string) === "admin@flowest.com") {
          reject(new Error("Este e-mail já está em uso."));
        } else {
          resolve({ id: "12345", ...payload });
        }
      }, 1500);
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (
      !name ||
      !email ||
      !password ||
      !cardNumber ||
      !cardExpiry ||
      !cardCvc
    ) {
      setError("Todos os campos são obrigatórios.");
      setLoading(false);
      return;
    }

    const payload: ApiPayload = {
      name,
      email,
      password,
      planId: planId,
      billingCycle: billingCycle,
      paymentData: {
        cardNumber,
        cardExpiry,
        cardCvc,
      },
    };

    try {
      await postCreateUserAndSubscribe(payload);
      setSuccess("Conta criada e assinatura ativada com sucesso!");

      setTimeout(() => {
        window.location.href = "/carteira";
      }, 2000);
    } catch (err: unknown) { // ✅ CORREÇÃO 2: Substituído 'any' por 'unknown'
      
      // ✅ CORREÇÃO 3: Uso de type guard para acessar 'message' com segurança
      if (isErrorWithMessage(err)) {
        setError(err.message || "Ocorreu um erro inesperado.");
      } else {
        setError("Ocorreu um erro inesperado.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSsoClick = (provider: string) => {
    setLoading(true);
    console.log(`Iniciando SSO com ${provider}...`);
    setTimeout(() => {
      setError(
        "SSO ainda não implementado. Use o formulário manual por enquanto."
      );
      setLoading(false);
    }, 1000);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        bgcolor: "grey.50",
        p: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "100%",
          maxWidth: "64rem",
          margin: 2,
          bgcolor: "white",
          borderRadius: "16px",
          boxShadow: 24,
          overflow: "hidden",
        }}
      >
        {/* Seção Esquerda (Branding) */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            width: "50%",
            bgcolor: "primary.main",
            p: 6,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h3"
            component="h2"
            sx={{ color: "white", fontWeight: "bold" }}
          >
            Flowest
          </Typography>
          <Typography variant="h5" sx={{ color: "primary.light", mt: 1 }}>
            Abra sua conta e controle tudo.
          </Typography>
        </Box>

        {/* Seção Direita (Formulário) */}
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            p: { xs: 4, sm: 6 },
            overflowY: "auto",
            maxHeight: "90vh",
          }}
        >
          <Box sx={{ textAlign: { xs: "center", md: "left" }, mb: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: "bold", color: "text.primary" }}
            >
              Crie sua Conta
            </Typography>
            <Typography sx={{ mt: 1, color: "text.secondary" }}>
              Comece sua jornada financeira hoje mesmo.
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2, width: "100%" }}>
              {success}
            </Alert>
          )}

          {/* --- INÍCIO: Botões de SSO --- */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, md: 4 }}> {/* ✅ CORREÇÃO DE GRID */}
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Google />}
                onClick={() => handleSsoClick("google")}
                disabled={loading}
                sx={{ textTransform: "none", color: "text.primary" }}
              >
                Google
              </Button>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}> {/* ✅ CORREÇÃO DE GRID */}
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Apple />}
                onClick={() => handleSsoClick("apple")}
                disabled={loading}
                sx={{ textTransform: "none", color: "text.primary" }}
              >
                Apple
              </Button>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}> {/* ✅ CORREÇÃO DE GRID */}
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Facebook />}
                onClick={() => handleSsoClick("facebook")}
                disabled={loading}
                sx={{ textTransform: "none", color: "text.primary" }}
              >
                Facebook
              </Button>
            </Grid>
          </Grid>
          <Divider sx={{ mb: 2 }}>OU CRIE COM SEU E-MAIL</Divider>
          {/* --- FIM: Botões de SSO --- */}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            {/* --- Dados Pessoais --- */}
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
              Seus Dados
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Nome Completo"
              name="name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <User size={20} color="grey" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="E-mail"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail size={20} color="grey" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock size={20} color="grey" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword((show) => !show)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      {showPassword ? (
                        <EyeOff size={20} color="grey" />
                      ) : (
                        <Eye size={20} color="grey" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* --- Seleção de Plano --- */}
            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
              Plano Escolhido: {planId}
            </Typography>
            <ToggleButtonGroup
              value={billingCycle}
              exclusive
              onChange={handlePlanChange}
              fullWidth
            >
              <ToggleButton value="mensal" color="primary">
                <Box sx={{ textAlign: "left", p: 1 }}>
                  <Typography variant="body1" fontWeight="bold">
                    Mensal
                  </Typography>
                  <Typography variant="body2">
                    R${" "}
                    {currentPrices.monthly.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    / mês
                  </Typography>
                </Box>
              </ToggleButton>
              <ToggleButton value="anual" color="primary">
                <Box sx={{ textAlign: "left", p: 1 }}>
                  <Typography variant="body1" fontWeight="bold">
                    Anual
                  </Typography>
                  <Typography variant="body2">
                    R${" "}
                    {currentPrices.annual.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    / ano
                  </Typography>
                </Box>
              </ToggleButton>
            </ToggleButtonGroup>

            {/* --- Dados de Pagamento (Stripe Simulado) --- */}
            <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
              Pagamento
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              id="cardNumber"
              label="Número do Cartão"
              name="cardNumber"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CreditCard size={20} color="grey" />
                  </InputAdornment>
                ),
              }}
            />
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}> {/* ✅ CORREÇÃO DE GRID */}
                <TextField
                  margin="none"
                  required
                  fullWidth
                  id="cardExpiry"
                  label="Validade (MM/AA)"
                  name="cardExpiry"
                  placeholder="MM/AA"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Calendar size={20} color="grey" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid size={{ xs: 6 }}> {/* ✅ CORREÇÃO DE GRID */}
                <TextField
                  margin="none"
                  required
                  fullWidth
                  id="cardCvc"
                  label="CVC"
                  name="cardCvc"
                  placeholder="123"
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <HelpCircle size={20} color="grey" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            {/* --- Ações --- */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ py: 1.5, textTransform: "none", fontSize: "1rem", mt: 4 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Assinar e Criar Conta"
              )}
            </Button>

            <Typography
              sx={{ textAlign: "center", mt: 3, color: "text.secondary" }}
            >
              Já tem uma conta?{" "}
              <Link
                href="/login"
                variant="body2"
                sx={{ fontWeight: "medium" }}
              >
                Faça login
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}