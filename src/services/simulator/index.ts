// services/simulator/index.ts

import http from "../http";
import {
  ISimulation,
  ISimulationCreatePayload,
  ISimulationUpdatePayload,
} from "./type";

const baseUrl = process.env.NEXT_PUBLIC_API_URL + `/simulators`;

interface ISimulatorParams {
  query?: string;
  page?: number;
  size?: number;
}

// ✅ Busca todas as simulações salvas do usuário
export async function getSimulators(
  params: ISimulatorParams
): Promise<ISimulation[]> {
  const res = await http.get<ISimulation[]>(`${baseUrl}`, { params });
  console.log("data: ", res.data);
  return res.data;
}

// ✅ Cria uma nova simulação
export async function createSimulator(
  payload: ISimulationCreatePayload
): Promise<ISimulation> {
  const res = await http.post<ISimulation>(baseUrl, payload);
  return res.data;
}

// ✅ Atualiza uma simulação existente
export async function updateSimulator(
  id: string,
  payload: ISimulationUpdatePayload
): Promise<ISimulation> {
  const res = await http.patch<ISimulation>(`${baseUrl}/${id}`, payload);
  return res.data;
}

// ✅ Deleta uma simulação
export async function deleteSimulator(id: string): Promise<void> {
  await http.delete(`${baseUrl}/${id}`);
}
