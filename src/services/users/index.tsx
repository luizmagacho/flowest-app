import { Page } from "@/shared";
import { UserResponse } from "./types";
import http from "../http";

const baseUrl = process.env.NEXT_PUBLIC_API_URL + `/users`;

interface IUsersParams {
  page?: number | string;
  size?: number | string;
  sort?: string;
  name?: string;
  companyId?: string;
}

export async function getUsers(
  params: IUsersParams
): Promise<Page<UserResponse>> {
  const res = await http.get<Page<UserResponse>>(`${baseUrl}`, {
    params,
  });
  return res.data;
}
