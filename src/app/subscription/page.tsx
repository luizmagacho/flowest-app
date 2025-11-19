"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Stepper,
  Step,
  StepLabel,
  Typography,
  TextField,
  Grid,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";
import {
  Apple,
  Facebook,
  Chrome, // Usando Chrome como ícone do Google
} from "lucide-react";

// --- Importações do Stripe (Comentadas para corrigir o erro de compilação) ---
// O ambiente de preview não consegue resolver estes pacotes NPM.
// O código abaixo simula o fluxo sem eles.

// import { loadStripe, Stripe } from "@stripe/stripe-js";
// import {
//   Elements,
//   PaymentElement,
//   useStripe,
//   useElements,
// } from "@stripe/react-stripe-js";

// --- Props do Componente ---
type PlanId = "leve" | "medio" | "pro";
type BillingCycle = "monthly" | "annual";

interface SubscriptionFlowProps {
  planId: PlanId;
  billingCycle: BillingCycle;
}

// --- Configuração do Stripe (Comentada) ---
// const stripePromise = loadStripe(
//   "pk_test_51...SUA_CHAVE_PUBLICA_AQUI" // Chave de teste de exemplo
// );

const steps = ["Criação da Conta", "Pagamento", "Concluído"];

interface AccountStepProps {
  isLoading: boolean;
  onSsoLogin: (provider: "google" | "apple" | "facebook") => Promise<void>;
  onManualSignUp: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

function AccountStep({
  isLoading,
  onSsoLogin,
  onManualSignUp,
}: AccountStepProps) {
  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
        Crie sua conta para continuar
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<Chrome />}
            onClick={() => onSsoLogin("google")}
            disabled={isLoading}
            sx={{ py: 1.5 }}
          >
            Continuar com Google
          </Button>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<Apple />}
            onClick={() => onSsoLogin("apple")}
            disabled={isLoading}
            sx={{ py: 1.5 }}
          >
            Continuar com Apple
          </Button>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<Facebook />}
            onClick={() => onSsoLogin("facebook")}
            disabled={isLoading}
            sx={{ py: 1.5 }}
          >
            Continuar com Facebook
          </Button>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }}>OU</Divider>

      <Box component="form" onSubmit={onManualSignUp}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <TextField
              name="name"
              label="Nome Completo"
              fullWidth
              required
              disabled={isLoading}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              name="email"
              type="email"
              label="E-mail"
              fullWidth
              required
              disabled={isLoading}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              name="password"
              type="password"
              label="Senha"
              fullWidth
              required
              disabled={isLoading}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              name="confirmPassword"
              type="password"
              label="Confirmar Senha"
              fullWidth
              required
              disabled={isLoading}
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isLoading}
          sx={{ mt: 3, py: 1.5, fontSize: "1rem" }}
        >
          {isLoading ? (
            <CircularProgress size={24} />
          ) : (
            "Criar Conta e Ir para Pagamento"
          )}
        </Button>
      </Box>
    </Box>
  );
}

interface CheckoutFormProps {
  onSuccess: () => void;
}

function CheckoutForm({ onSuccess }: CheckoutFormProps) {
  // Hooks do Stripe removidos, pois a importação está comentada
  // const stripe = useStripe();
  // const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);
    setMessage(null);

    // --- LÓGICA DO STRIPE REMOVIDA ---
    // if (!stripe || !elements) {
    //   return;
    // }
    // const { error, paymentIntent } = await stripe.confirmPayment({ ... });

    // --- SIMULAÇÃO DE PAGAMENTO ---
    console.log("Simulando processamento de pagamento...");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Simulação de pagamento concluída com sucesso!");

    setMessage("Pagamento Concluído com Sucesso!");
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
        Detalhes do Pagamento
      </Typography>

      <Box
        sx={{
          border: "1px dashed #ccc",
          borderRadius: 1,
          p: 3,
          textAlign: "center",
          bgcolor: "grey.50",
        }}
      >
        <Typography color="text.secondary">
          O formulário seguro (Stripe PaymentElement) apareceria aqui.
        </Typography>
        <Typography color="text.secondary" variant="body2">
          (A funcionalidade real do Stripe foi removida temporariamente para
          corrigir o erro de compilação neste ambiente.)
        </Typography>
      </Box>

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={isProcessing} // Lógica do Stripe removida
        sx={{ mt: 3, py: 1.5, fontSize: "1rem" }}
      >
        {isProcessing ? (
          <CircularProgress size={24} />
        ) : (
          "Pagar e Ativar Assinatura"
        )}
      </Button>

      {message && (
        <Alert
          severity={message.includes("Sucesso") ? "success" : "error"}
          sx={{ mt: 2 }}
        >
          {message}
        </Alert>
      )}
    </form>
  );
}

export default function SubscriptionFlow({
  planId,
  billingCycle,
}: SubscriptionFlowProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Estado para o Stripe (Comentado) ---
  // const [clientSecret, setClientSecret] = useState<string | null>(null);

  // Função simulada para buscar permissões baseadas no plano
  const getPermissionsForPlan = (plan: PlanId) => {
    if (plan === "pro") {
      return ["read:ia_analysis", "write:whatsapp", "read:reports"];
    }
    if (plan === "medio") {
      return ["read:reports"];
    }
    return [];
  };

  // --- ADICIONADO ---
  // Função simulada para buscar a role baseada no plano
  const getRoleForPlan = (plan: PlanId): string => {
    switch (plan) {
      case "leve":
        return "role_begginer";
      case "medio":
        return "role_middle";
      case "pro":
        return "role_pro";
      default:
        return "role_begginer"; // Fallback seguro
    }
  };

  const fetchClientSecret = async () => {
    console.log(
      "Backend (Simulado): Ignorando 'fetchClientSecret' na simulação."
    );
  };

  const goToPaymentStep = async () => {
    // await fetchClientSecret();
    setActiveStep(1);
  };

  const handleSsoLogin = async (provider: "google" | "apple" | "facebook") => {
    setIsLoading(true);
    setError(null);
    console.log(`Backend (Simulado): Iniciando login com ${provider}`);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const user = {
      name: `Usuário ${provider}`,
      email: `${provider}@example.com`,
    };

    await goToPaymentStep();
    setIsLoading(false);
  };

  const handleManualSignUp = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      setIsLoading(false);
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newUser = { name, email };
    const permissions = getPermissionsForPlan(planId);
    const role = getRoleForPlan(planId);

    await goToPaymentStep();
    setIsLoading(false);
  };

  // Renderiza o conteúdo da etapa atual
  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <AccountStep
            isLoading={isLoading}
            onSsoLogin={handleSsoLogin}
            onManualSignUp={handleManualSignUp}
          />
        );
      case 1:
        // A Etapa de Pagamento precisa do provider Elements
        if (isLoading) return <CircularProgress />;
        if (error) return <Alert severity="error">{error}</Alert>;
        // if (!clientSecret)
        //   return <Alert severity="error">Erro ao carregar o pagamento.</Alert>;

        // Wrapper <Elements> do Stripe removido
        return <CheckoutForm onSuccess={() => setActiveStep(2)} />;
      case 2:
        return (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
              Pagamento Concluído!
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              Sua assinatura do plano {planId} está ativa.
            </Typography>
            <Button
              variant="contained"
              size="large"
              // href="/dashboard" (Em um app Next.js, usaríamos o <Link> ou router)
              onClick={() => (window.location.href = "/dashboard")}
            >
              Ir para o Dashboard
            </Button>
          </Box>
        );
      default:
        return <Typography>Etapa desconhecida</Typography>;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box>{renderStepContent(activeStep)}</Box>
    </Container>
  );
}
