import { TickerAsset } from "@/services/portfolio/type";

export const mockTickerTableAssets: TickerAsset[] = [
  // Ações
  {
    id: "a1",
    ticker: "PETR4",
    name: "Petrobras PN",
    type: "Ação",
    currentPrice: 38.5,
    low52w: 25.0,
    high52w: 42.0,
    quantity: 200,
    acquisitionCost: 6000.0, // Preço Médio: 30.00
    totalYields: 450.0,
  },
  {
    id: "a2",
    ticker: "VALE3",
    name: "Vale ON",
    type: "Ação",
    currentPrice: 61.2,
    low52w: 60.0,
    high52w: 85.0,
    quantity: 100,
    acquisitionCost: 7200.0, // Preço Médio: 72.00
    totalYields: 550.0,
  },
  {
    id: "a3",
    ticker: "ITUB4",
    name: "Itaú Unibanco PN",
    type: "Ação",
    currentPrice: 32.8,
    low52w: 27.5,
    high52w: 35.0,
    quantity: 300,
    acquisitionCost: 8400.0, // Preço Médio: 28.00
    totalYields: 720.0,
  },
  {
    id: "a4",
    ticker: "WEGE3",
    name: "WEG ON",
    type: "Ação",
    currentPrice: 35.5,
    low52w: 30.0,
    high52w: 44.0,
    quantity: 150,
    acquisitionCost: 4800.0, // Preço Médio: 32.00
    totalYields: 150.0,
  },
  // FIIs
  {
    id: "f1",
    ticker: "MXRF11",
    name: "Maxi Renda FII",
    type: "FII",
    currentPrice: 10.45,
    low52w: 9.8,
    high52w: 11.0,
    quantity: 500,
    acquisitionCost: 5100.0, // Preço Médio: 10.20
    totalYields: 600.0,
  },
  {
    id: "f2",
    ticker: "HGLG11",
    name: "CSHG Logística FII",
    type: "FII",
    currentPrice: 165.3,
    low52w: 155.0,
    high52w: 172.0,
    quantity: 50,
    acquisitionCost: 8150.0, // Preço Médio: 163.00
    totalYields: 880.0,
  },
  {
    id: "f3",
    ticker: "KNCR11",
    name: "Kinea Rendimentos Imobiliários",
    type: "FII",
    currentPrice: 102.5,
    low52w: 98.0,
    high52w: 105.0,
    quantity: 100,
    acquisitionCost: 10100.0, // Preço Médio: 101.00
    totalYields: 1250.0,
  },
  // ETFs
  {
    id: "e1",
    ticker: "BOVA11",
    name: "iShares Ibovespa Fundo de Índice",
    type: "ETF",
    currentPrice: 125.5,
    low52w: 110.0,
    high52w: 135.0,
    quantity: 30,
    acquisitionCost: 3600.0, // Preço Médio: 120.00
    totalYields: 120.0,
  },
  {
    id: "e2",
    ticker: "IVVB11",
    name: "iShares S&P 500 Fundo de Investimento",
    type: "ETF",
    currentPrice: 280.0,
    low52w: 240.0,
    high52w: 300.0,
    quantity: 20,
    acquisitionCost: 5000.0, // Preço Médio: 250.00
    totalYields: 100.0,
  },
  // BDRs
  {
    id: "b1",
    ticker: "MGLU34",
    name: "MercadoLibre Inc",
    type: "BDR",
    currentPrice: 50.1,
    low52w: 40.0,
    high52w: 65.0,
    quantity: 100,
    acquisitionCost: 4500.0, // Preço Médio: 45.00
    totalYields: 50.0,
  },
  {
    id: "b2",
    ticker: "ROXO34",
    name: "Nu Holdings Ltd",
    type: "BDR",
    currentPrice: 8.2,
    low52w: 5.0,
    high52w: 9.0,
    quantity: 1000,
    acquisitionCost: 6000.0, // Preço Médio: 6.00
    totalYields: 0,
  },
  // Cripto
  {
    id: "c1",
    ticker: "BTC",
    name: "Bitcoin",
    type: "Cripto",
    currentPrice: 350000.0,
    low52w: 150000.0,
    high52w: 400000.0,
    quantity: 0.1,
    acquisitionCost: 25000.0, // Preço Médio: 250,000.00
    totalYields: 0,
  },
  {
    id: "c2",
    ticker: "ETH",
    name: "Ethereum",
    type: "Cripto",
    currentPrice: 18000.0,
    low52w: 8000.0,
    high52w: 22000.0,
    quantity: 2.5,
    acquisitionCost: 30000.0, // Preço Médio: 12,000.00
    totalYields: 0,
  },
];
