export interface ITransaction {
  _id: string;
  tickerId: string;
  ticker: string; // O código da ação, ex: "PETR4"
  companyName: string; // O nome da Empresa, ex: "Petrobras S.A."
  type: TransactionType; // Tipo da transação
  assetType: AssetType | null;
  date: string; // Data no formato ISO, ex: "2025-09-15T10:00:00Z"
  quantity: number; // Quantidade de ativos
  averagePrice: number; // Preço médio por ativo na transação
  brokerage: string; // Corretora utilizada
  userId: string;
}

// Interface para a resposta da API, que geralmente é paginada
export interface ITransactionsResponse {
  content: ITransaction[];
  totalPages: number;
  totalElements: number;
  // ... outras propriedades de paginação
}

export type TransactionPayload = {
  tickerId: string;
  ticker: string; // O código da ação, ex: "PETR4"
  companyName: string; // O nome da Empresa, ex: "Petrobras S.A."
  type: TransactionType; // Tipo da transação
  assetType: AssetType | null;
  date: string; // Data no formato ISO, ex: "2025-09-15T10:00:00Z"
  quantity: number; // Quantidade de ativos
  averagePrice: number; // Preço médio por ativo na transação
  brokerage: string; // Corretora utilizada
  userId: string;
};

export enum TransactionType {
  BUY = "BUY",
  SELL = "SELL",
  YIELD = "YIELD", // Para dividendos, JCP, etc.
}

export enum AssetType {
  ACAO = "Ação",
  FII = "FII",
  ETF = "ETF",
  BDR = "BDR",
  CRIPTO = "Cripto",
  STOCK = "Stock",
}

export type ITransactionCreatePayload = Omit<ITransaction, "_id">;

// Para atualizar, podemos enviar apenas os campos que mudaram (menos comum para transações, mas incluído)
export type ITransactionUpdatePayload = Partial<ITransactionCreatePayload>;
