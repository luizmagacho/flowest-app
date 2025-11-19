import { Page } from "@/shared";
import {
  ITransaction,
  ITransactionCreatePayload,
  ITransactionUpdatePayload,
} from "./type";
import http from "../http";

const baseUrl = process.env.NEXT_PUBLIC_API_URL + `/transactions`;

interface ITransactionsParams {
  page?: number | string;
  size?: number | string;
  sort?: string;
  userId?: string;
  type?: "BUY" | "SELL";
  ticker?: string;
}

export async function getTransactions(
  params: ITransactionsParams
): Promise<Page<ITransaction>> {
  console.log("Buscando transações da URL:", baseUrl);
  console.log(
    "Variável de ambiente NEXT_PUBLIC_API_URL:",
    process.env.NEXT_PUBLIC_API_URL
  );

  const res = await http.get<Page<ITransaction>>(`${baseUrl}`, { params });

  console.log("Resposta da API de transações:", res);
  return res.data;
}

export async function getTransactionById(id: string): Promise<ITransaction> {
  const url = `${baseUrl}/${id}`;
  console.log(`[TransactionService] GET_BY_ID from ${url}`);
  const res = await http.get<ITransaction>(url);
  return res.data;
}

export async function createTransaction(
  payload: ITransactionCreatePayload
): Promise<ITransaction> {
  console.log(`[TransactionService] CREATE with payload:`, payload);
  const res = await http.post<ITransaction>(baseUrl, payload);
  return res.data;
}

export async function updateTransaction(
  id: string,
  payload: ITransactionUpdatePayload
): Promise<ITransaction> {
  const url = `${baseUrl}/${id}`;
  console.log(`[TransactionService] UPDATE at ${url} with payload:`, payload);
  const res = await http.put<ITransaction>(url, payload);
  return res.data;
}

export async function deleteTransaction(id: string): Promise<void> {
  const url = `${baseUrl}/${id}`;
  console.log(`[TransactionService] DELETE at ${url}`);
  await http.delete(url);
}
