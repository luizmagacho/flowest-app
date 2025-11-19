// src/services/http.ts

import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

// Cria a instância do Axios
const http: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Usa um interceptor para adicionar o token dinamicamente a cada requisição
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get("flowest-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Lida com erros globais, como a expiração do token
http.interceptors.response.use(
  (response) => {
    // Se a resposta for bem-sucedida (status 2xx), apenas a retorna
    return response;
  },
  (error) => {
    // Verifica se o erro é da API e se o status é 401
    if (error.response && error.response.status === 401) {
      console.log("Token expirado ou inválido. Deslogando...");

      // 1. Remove o token dos cookies
      Cookies.remove("flowest-token");
      // Opcional: Remova também outros dados do usuário, se houver
      Cookies.remove("flowest_user_id");

      // 2. Redireciona o usuário para a página de login
      // Usamos `window.location.href` para forçar um refresh completo da página,
      // o que ajuda a limpar qualquer estado antigo da aplicação.
      window.location.href = "/login";
    }

    // Para qualquer outro erro, apenas o rejeita para que possa ser tratado localmente
    return Promise.reject(error);
  }
);

export default http;
