"use client";

import React from "react";
import {
  Box,
  Container,
  Typography,
} from "@mui/material";

// --- Tipos de Exemplo ---
type PlanId = "leve" | "medio" | "pro";
type BillingCycle = "monthly" | "annual";

interface SubscriptionFlowProps {
  planId: PlanId;
  billingCycle: BillingCycle;
}

// --- Componente Simplificado ---

export default function SubscriptionFlow({
  planId,
  billingCycle,
}: SubscriptionFlowProps) {
  // A CHAVE PUBLICA REAL DO STRIPE SERIA CARREGADA AQUI
  // const stripePromise = loadStripe("pk_test_..."); 
  // const clientSecret = "SEGREDO_GERADO_PELO_BACKEND"; // Segredo de pagamento gerado após a conta

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, md: 8 }, textAlign: 'center' }}>
      
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 4 }}>
        💳 Etapa 2: Pagamento da Assinatura
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        Você está assinando o plano **{planId.toUpperCase()}** ({billingCycle === 'annual' ? 'Anual' : 'Mensal'}).
      </Typography>

      {/* =========================================================
        ESTE BOX REPRESENTA O CONTAINER DO STRIPE PAYMENT ELEMENT
        =========================================================
      */}
      <Box
        sx={{
          border: "2px solid #635bff", /* Cor de destaque para simular o Stripe */
          borderRadius: 2,
          p: { xs: 3, md: 5 },
          textAlign: "center",
          bgcolor: "#f7f7ff", /* Cor de fundo suave */
          minHeight: 250,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <Typography variant="h6" color="#635bff" fontWeight="bold" sx={{ mb: 1 }}>
          Formulário de Pagamento Seguro
        </Typography>
        <Typography color="text.secondary">
          O componente **Elements** do Stripe (e o **PaymentElement**) será renderizado aqui, usando o `clientSecret` obtido do backend.
        </Typography>
        <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
          (Funcionalidade de Checkout Ativação Pendente)
        </Typography>
      </Box>
      {/* =========================================================
        FIM DO CONTAINER DO STRIPE
        =========================================================
      */}

      {/* Na implementação real, os botões e lógica do checkout ficariam aqui. */}
    </Container>
  );
}