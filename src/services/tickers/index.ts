import { Page } from "@/shared";
import { AssetType, ITicker } from "./type";
import http from "../http";

const baseUrl = process.env.NEXT_PUBLIC_API_URL + `/tickers`;

interface ITickersParams {
  page?: number | string;
  size?: number | string;
  sort?: string; // Ex: "date,desc" para ordenar pela data mais recente
  assetType?: AssetType; // Para filtrar por tipo de transação
  ticker?: string;
}

/**
 * Busca uma página de ativos da API.
 * @param params Parâmetros de paginação e filtro.
 * @returns Uma promessa com a página de ativos.
 */
export async function getTickers(
  params: ITickersParams
): Promise<Page<ITicker>> {
  const res = await http.get<Page<ITicker>>(`${baseUrl}`, { params });

  return res.data;
}

/**
 * Busca tickers com base em uma query para o autocomplete.
 * @param query O texto a ser buscado (ex: "PETR").
 * @returns Uma lista (array) de tickers que correspondem à busca.
 */
export async function searchTickers(query: string): Promise<ITicker[]> {
  const res = await http.get<ITicker[]>(`${baseUrl}/search`, {
    params: { q: query }, // Envia o texto da busca como o parâmetro 'q'
  });
  return res.data;
}
