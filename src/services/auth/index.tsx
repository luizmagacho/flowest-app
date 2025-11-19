import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_API_URL + `/auth`;

interface ILoginParam {
  email: string;
  password: string;
}

interface ILoginResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  access_token: string;
  permissions: string[];
  isAdmin: boolean;
}

export async function postLogin(params: ILoginParam): Promise<ILoginResponse> {
  console.log("TEste: ", params);
  console.log(baseUrl);
  const response = await axios.post<ILoginResponse>(`${baseUrl}/login`, params);
  return response.data;
}
