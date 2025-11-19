"use client";

import Layout from "@/components/layout";
import { PortfolioProvider } from "@/contexts/PortfolioContext";
import { QuoteProvider } from "@/contexts/QuoteContext";
import { SimulatorsProvider } from "@/contexts/SimulatorsContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { TransactionsProvider } from "@/contexts/TransactionsContext";

// Importações para o Date Picker
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/pt-br"; // Importa a localidade brasileira para o dayjs

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Envolve todos os providers com o LocalizationProvider
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <ToastProvider>
        <PortfolioProvider>
          <TransactionsProvider>
            <SimulatorsProvider>
              <QuoteProvider>
                <Layout>
                  <section>{children}</section>
                </Layout>
              </QuoteProvider>
            </SimulatorsProvider>
          </TransactionsProvider>
        </PortfolioProvider>
      </ToastProvider>
    </LocalizationProvider>
  );
}
