import AuthHandler from "@/components/AuthHandler";
import { AuthProvider } from "@/contexts/AuthContext";
import { PortfolioProvider } from "@/contexts/PortfolioContext";
import { TickerProvider } from "@/contexts/TickerContext";
import { TransactionsProvider } from "@/contexts/TransactionsContext";
import ThemeRegistry from "@/theme/ThemeRegistry";
import theme from "@/theme/theme";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Flowest App",
  description: "Controle seus investimentos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={inter.className} suppressHydrationWarning>
        <ThemeRegistry options={{ key: "mui" }} theme={theme}>
          <AuthProvider>
            <TickerProvider>
              <TransactionsProvider>
                <PortfolioProvider>
                  <TickerProvider>
                    <AuthHandler>{children}</AuthHandler>
                  </TickerProvider>
                </PortfolioProvider>
              </TransactionsProvider>
            </TickerProvider>
          </AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
