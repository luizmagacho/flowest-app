// Define a estrutura de um único ativo na sua carteira.
export interface Asset {
  id: string; // Identificador único para cada ativo
  ticker: string; // O código do ativo, ex: MXRF11, ITSA4
  type: "Ação" | "FII" | "ETF"; // O tipo do ativo
  quantity: number; // Quantidade de cotas/ações que você possui
  averagePrice: number; // O preço médio de compra
}

// NOVO: Define a estrutura detalhada para a tabela de tickers
export interface TickerAsset {
  id: string;
  ticker: string;
  name: string;
  type: "Ação" | "BDR" | "Cripto" | "ETF" | "FII";
  currentPrice: number;
  low52w: number;
  high52w: number;
  quantity: number;
  acquisitionCost: number; // Custo total de compra (quantidade * preço médio de compra)
  totalYields: number; // Total de proventos recebidos
}

export interface IPortfolio {
  _id: string;
  userId: string;
  ticker: string;
  sector: string;
  name: string;
  type: string;
  currentPrice: number;
  averageBuyPrice: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  quantity: number;
  acquisitionCost: number; // Custo total de compra (quantidade * preço médio de compra)
  totalYields: number;
}
