export enum AssetType {
  ACAO = "Ação",
  FII = "FII",
  ETF = "ETF",
  BDR = "BDR",
  CRIPTO = "Cripto",
  STOCK = "Stock",
}

// Enum para os mercados
export enum Market {
  BRASIL = "Brasil",
  EUA = "EUA",
  GLOBAL = "Global",
}

// Enum para as bolsas de valores
export enum Exchange {
  B3 = "B3",
  NASDAQ = "NASDAQ",
  NYSE = "NYSE",
  BINANCE = "Binance",
}

export interface ITicker {
  _id: string;
  ticker: string; // O símbolo do ativo, ex: "PETR4". Deve ser único.
  companyName: string; // Nome da empresa/fundo, ex: "Petrobras"
  assetType: AssetType | null; // Tipo do ativo (Ação, FII, etc.)
  market?: Market; // Mercado (Brasil, EUA, etc.)
  exchange?: Exchange; // Bolsa (B3, NASDAQ, etc.)
  currentPrice?: number; // Preço atual do ativo
  fiftyTwoWeekHigh?: number; // Maior valor nas últimas 52 semanas
  fiftyTwoWeekLow?: number; // Menor valor nas últimas 52 semanas
  logoUrl?: string; // URL para o logo da empresa/ativo
  sector?: string; // Setor da empresa (ex: "Petróleo e Gás", "Financeiro")
  dividendYield?: number; // Dividend Yield em porcentagem
  currency?: string; // Moeda do preço (ex: "BRL", "USD")
}
