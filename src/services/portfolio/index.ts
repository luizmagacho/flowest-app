import { Page } from "@/shared";
import { IPortfolio } from "./type";
import http from "../http";

const baseUrl = process.env.NEXT_PUBLIC_API_URL + `/portfolios`;

interface IPortfoliosParams {
  page?: number | string;
  size?: number | string;
  sort?: string;
  userId?: string;
  type?: string;
}

export async function getPortfolio(
  params: IPortfoliosParams
): Promise<Page<IPortfolio>> {
  console.log(baseUrl);
  const res = await http.get<Page<IPortfolio>>(`${baseUrl}/users`);
  console.log(res);
  return res.data;
}
