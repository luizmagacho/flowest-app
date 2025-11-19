import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      // Mapeia a URL em português para a pasta em inglês
      { source: "/inscricao", destination: "/subscribe" },
      { source: "/recuperar-senha", destination: "/forgot-password" },
      { source: "/redefinir-senha", destination: "/reset-password" },
      {
        source: "/portfolio",
        destination: "/portfolio",
      },
      {
        source: "/simulador",
        destination: "/simulators",
      },
      {
        source: "/dividendos",
        destination: "/dividends",
      },
      { source: "/transacoes", destination: "/transactions" },
    ];
  },
};

export default nextConfig;
