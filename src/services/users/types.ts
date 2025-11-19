import { IRole } from "../roles/type";

export interface UserResponse {
  _id: number | string;
  firstName: string;
  lastName: string;
  roles: IRole[];
  email: string;
  companyId: string;
  jobId: string;
  jobName: string;
  departmentName?: string;
  departmentId?: string;
  hasPlatformAccess: boolean;
  isCompanyAdmin: boolean;
}
