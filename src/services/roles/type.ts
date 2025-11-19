export enum Feature {
  PORTFOLIO = "PORTFOLIO",
  DIVIDENS = "DIVIDENS",
  NONE = "NONE",
}

export enum Permission {
  READ = "READ",
  WRITE = "WRITE",
  NONE = "NONE",
}

export interface IRole {
  feature: Feature;
  permission: Permission;
}
