"use client";

import { useState } from "react";
import NextLink from "next/link";

// Importações do Material-UI
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputAdornment from "@mui/material/InputAdornment";

// Ícones
import { Mail, Lock, EyeOff, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { postLogin } from "@/services/auth";
import Cookies from "js-cookie";
import { IconButton } from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";
import { isApiError } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log(email);
      console.log(password);
      const userData = await postLogin({ email, password });

      Cookies.set("flowest-token", userData.access_token, {
        expires: 1, // dias
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      Cookies.set("flowest_user_id", userData.id);
      Cookies.set(
        "flowest_user_permissions",
        userData.permissions.toLocaleString()
      );

      login({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        permissions: userData.permissions,
        isAdmin: userData.isAdmin,
      });

      console.log("Login bem-sucedido. Token salvo no cookie.");
      // Aqui você guardaria o token (ex: num Contexto Global ou Cookies)
      // Ex: authContext.login(data.access_token);

      // Adiciona um pequeno delay para o usuário ver a mensagem de sucesso
      setTimeout(() => {
        router.push("/portfolio"); // Redireciona para a página principal
      }, 500);
    } catch (e: unknown) {
      if(isApiError(e)){
        if (e.response && e.response.status === 401) { 
              setError("Sessão expirada. Por favor, faça login novamente."); 
            } else if (e instanceof Error) {
              setError("Erro ao salvar: " + e.message);
            } else {
              setError("Erro ao salvar: Tente novamente.");
            }
      }
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
          <Box sx={{ textAlign: { xs: "center", md: "left" }, mb: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: "bold", color: "text.primary" }}
            >
              Bem-vindo de volta!
            </Typography>
            <Typography sx={{ mt: 1, color: "text.secondary" }}>
              Faça login para acessar sua conta Flowest.
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin} noValidate>
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
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              // Altera o tipo do input com base no estado
              type={showPassword ? "text" : "password"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock size={20} color="grey" />
                  </InputAdornment>
                ),
                // Adiciona o ícone no final do campo
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword((show) => !show)}
                      onMouseDown={(e) => e.preventDefault()} // Evita que o campo perca o foco
                      edge="end"
                    >
                      {/* Alterna o ícone com base no estado */}
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

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                my: 2,
              }}
            >
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Lembrar-me"
              />
              <Link
                component={NextLink}
                href="/recuperar-senha"
                variant="body2"
              >
                Esqueceu a senha?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ py: 1.5, textTransform: "none", fontSize: "1rem" }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Entrar"
              )}
            </Button>

            <Typography
              sx={{ textAlign: "center", mt: 4, color: "text.secondary" }}
            >
              Não tem uma conta?{" "}
              <Link
                component={NextLink}
                href="/criar-conta"
                variant="body2"
                sx={{ fontWeight: "medium" }}
              >
                Crie uma agora
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
