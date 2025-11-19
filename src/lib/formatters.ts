export const formatCurrency = (value: number): string => {
  if (isNaN(value)) {
    return "R$ 0,00";
  }
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

/**
 * Formata uma string de data (ISO) para o formato de data brasileiro (dd/mm/aaaa).
 * @param dateString A string de data a ser formatada.
 * @returns A data formatada como "15/09/2025".
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    // locale 'pt-BR' formata a data para o padrão dd/mm/yyyy
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "UTC", // Adicionado para evitar problemas com fuso horário
    });
  } catch (error) {
    console.error("Falha ao formatar a data:", dateString, error);
    return dateString; // Retorna a string original se a formatação falhar
  }
};

export const formatPercent = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};
