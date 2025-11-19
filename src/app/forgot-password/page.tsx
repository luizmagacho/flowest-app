"use client";

import { useState } from "react";
import NextLink from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import { Mail, ArrowLeft } from "lucide-react";
// Supondo que você criará esta função no seu serviço de autenticação
// import { postForgotPassword } from "@/services/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false); // Novo estado para sucesso
  const [loading, setLoading] = useState(false);

  // Mock da função da API (substitua pela sua chamada real)
  const postForgotPassword = async (data: { email: string }) => {
    console.log("Enviando solicitação para:", data.email);
    // Simula uma chamada de API
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (data.email === "erro@flowest.com") {
          reject(new Error("E-mail não encontrado"));
        } else {
          resolve();
        }
      }, 1500);
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await postForgotPassword({ email });
      setSuccess(true);
    } catch (err: unknown) {
      setError(
        "Não foi possível enviar o e-mail. Verifique o e-mail digitado."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        bgcolor: "grey.50",
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
        {/* Seção Esquerda (Branding) - Idêntica à de Login */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            width: "50%",
            bgcolor: "primary.main",
            p: 6,
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography
              variant="h4"
              component="h2"
              sx={{ color: "white", fontWeight: "bold" }}
            >
              Flowest
            </Typography>
            <Typography sx={{ color: "primary.light", mt: 1 }}>
              Inteligência e controle para seus investimentos.
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{ color: "primary.light", fontSize: "0.75rem" }}
          >
            © 2025 Flowest. Todos os direitos reservados.
          </Typography>
        </Box>

        {/* Seção Direita (Formulário) */}
        <Box sx={{ width: { xs: "100%", md: "50%" }, p: { xs: 4, sm: 6 } }}>
          {success ? (
            // --- TELA DE SUCESSO ---
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                height: "100%",
                justifyContent: "center",
                minHeight: "350px", // Garante altura mínima
              }}
            >
              <Alert
                severity="success"
                sx={{ width: "100%", justifyContent: "center", mb: 3 }}
              >
                Link enviado com sucesso!
              </Alert>
              <Typography
                variant="h5"
                component="h1"
                sx={{ fontWeight: "bold", color: "text.primary", mb: 2 }}
              >
                Verifique seu e-mail
              </Typography>
              <Typography sx={{ mb: 3, color: "text.secondary" }}>
                Enviamos um link de redefinição de senha para{" "}
                <Typography component="strong" sx={{ fontWeight: "bold" }}>
                  {email}
                </Typography>
                .
              </Typography>
              <Button
                component={NextLink}
                href="/login"
                variant="contained"
                startIcon={<ArrowLeft size={18} />}
              >
                Voltar para o Login
              </Button>
            </Box>
          ) : (
            // --- TELA DE FORMULÁRIO ---
            <>
              <Box sx={{ textAlign: { xs: "center", md: "left" }, mb: 4 }}>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{ fontWeight: "bold", color: "text.primary" }}
                >
                  Esqueceu sua senha?
                </Typography>
                <Typography sx={{ mt: 1, color: "text.secondary" }}>
                  Digite seu e-mail e enviaremos um link para você voltar a
                  acessar sua conta.
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="E-mail"
                  name="email"
                  autoComplete="email"
                  autoFocus
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

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    textTransform: "none",
                    fontSize: "1rem",
                    mt: 3,
                    mb: 2,
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Enviar link de recuperação"
                  )}
                </Button>

                <Typography sx={{ textAlign: "center", mt: 4 }}>
                  <Link
                    component={NextLink}
                    href="/login"
                    variant="body2"
                    sx={{
                      fontWeight: "medium",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <ArrowLeft size={16} /> Voltar para o Login
                  </Link>
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}
