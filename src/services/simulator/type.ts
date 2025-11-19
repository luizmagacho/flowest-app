import { IHolding } from "@/app/(dashboard)/simulators/page";

export interface ISimulation {
  _id: string;
  userId: string;
  title: string;

  holdings: IHolding[];
  monthlyInvestment: number;
  incomeGoal: number;
  simulationYears: number;

  createdAt?: string;
  updatedAt?: string;
}

export type ISimulationCreatePayload = Omit<
  ISimulation,
  "_id" | "createdAt" | "updatedAt"
>;

export type ISimulationUpdatePayload = Partial<
  Omit<ISimulation, "_id" | "createdAt" | "updatedAt" | "userId">
>;

export interface ISimulatorParams {
  query?: string;
  page?: number;
  size?: number;
}
