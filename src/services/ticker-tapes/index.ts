import http from "../http";
import { ITickerTapeItem } from "./type";

// URL base da sua API. Coloque no .env do frontend
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

/**
 * Busca os dados para o carrossel (ticker tape).
 * @returns {Promise<Array<ITickerTapeItem>>}
 */
export async function getTickerTapeData(): Promise<ITickerTapeItem[]> {
  const response = await http.get<ITickerTapeItem[]>(
    `${API_URL}/quotes/ticker-tape`
  );

  return response.data;
}
