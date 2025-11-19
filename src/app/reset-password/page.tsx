"use client";

import { useState, useEffect, Suspense } from "react";
import NextLink from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

// Importações do Material-UI
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

// Ícones
import { Lock, EyeOff, Eye, ArrowLeft } from "lucide-react";

// --- Definição de Tipos Seguros ---
interface ErrorWithMessage {
  message: string;
}

const isErrorWithMessage = (error: unknown): error is ErrorWithMessage => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as ErrorWithMessage).message === 'string'
  );
};
// --- FIM Definição de Tipos Seguros ---


// --- Componente Interno para usar Suspense com useSearchParams ---
function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [tokenError, setTokenError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock da função da API
  const postResetPassword = async (data: {
    token: string;
    password: string;
  }) => {
    console.log("Redefinindo senha com token:", data.token);
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (data.token === "token-invalido") {
          reject(new Error("Token inválido ou expirado"));
        } else {
          resolve();
        }
      }, 1500);
    });
  };

  // Validação do Token da URL na montagem do componente
  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (!tokenFromUrl) {
      setTokenError(
        "Token de redefinição não encontrado. Verifique o link ou tente novamente."
      );
    } else {
      setToken(tokenFromUrl);
      // Opcional: Você pode fazer uma chamada de API aqui
      // para validar o token antes de mostrar o formulário.
    }
  }, [searchParams]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }
    if (!token) {
      setError("Token de redefinição inválido.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await postResetPassword({ token, password });
      setSuccess(true);
    } catch (err: unknown) { // ✅ CORREÇÃO 1: Substituído 'any' por 'unknown'
      
      // ✅ CORREÇÃO 2: Uso do type guard para obter a mensagem
      let errorMessage = "Não foi possível redefinir a senha. O link pode ter expirado.";
      
      if (isErrorWithMessage(err)) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    // 1. Se o token for inválido (erro na URL)
    if (tokenError) {
      return (
        <Box
          sx={{
            textAlign: "center",
            minHeight: "350px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Alert severity="error" sx={{ mb: 3 }}>
            {tokenError}
          </Alert>
          <Button
            component={NextLink}
            href="/recuperar-senha"
            variant="contained"
          >
            Pedir novo link
          </Button>
        </Box>
      );
    }

    // 2. Se a senha foi redefinida com sucesso
    if (success) {
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            height: "100%",
            justifyContent: "center",
            minHeight: "350px",
          }}
        >
          <Alert
            severity="success"
            sx={{ width: "100%", justifyContent: "center", mb: 3 }}
          >
            Senha redefinida com sucesso!
          </Alert>
          <Typography
            variant="h5"
            component="h1"
            sx={{ fontWeight: "bold", color: "text.primary", mb: 3 }}
          >
            Tudo pronto!
          </Typography>
          <Button
            component={NextLink}
            href="/login"
            variant="contained"
            size="large"
          >
            Ir para o Login
          </Button>
        </Box>
      );
    }

    // 3. Formulário de redefinição (padrão)
    return (
      <>
        <Box sx={{ textAlign: { xs: "center", md: "left" }, mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: "bold", color: "text.primary" }}
          >
            Crie sua nova senha
          </Typography>
          <Typography sx={{ mt: 1, color: "text.secondary" }}>
            Digite e confirme sua nova senha de acesso.
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
            name="password"
            label="Nova Senha"
            id="password"
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
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirmar Nova Senha"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type={showPassword ? "text" : "password"}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock size={20} color="grey" />
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
              "Salvar nova senha"
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
    );
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
        {/* Seção Esquerda (Branding) */}
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
          {renderContent()}
        </Box>
      </Box>
    </Box>
  );
}

// --- Componente de Página (Wrapper com Suspense) ---
export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}