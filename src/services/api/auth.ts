
import { apiClient } from "./client";
import URLS from "../URLs";
import {
  LoginRequest,
  LoginResponse,
  RegisterTenantRequest,
  RegisterTenantResponse,
  UserOut,
} from "../interface";

export const authApi = {
  login: (body: LoginRequest) =>
    apiClient<LoginResponse>(URLS.authlogin, {
      method: "POST",
      body,
    }),

  registerTenant: (body: RegisterTenantRequest, bootstrapToken?: string) =>
    apiClient<RegisterTenantResponse>(URLS.authregistertenant, {
      method: "POST",
      body,
      // headers: bootstrapToken ? { "X-Bootstrap-Token": bootstrapToken } : {},
    }),

  me: () => apiClient<UserOut>(URLS.authprofile),

  logout: () =>
    apiClient<void>(URLS.authlogout, {
      method: "POST",
    }),

  refresh: () =>
    apiClient<LoginResponse>(URLS.authrefresh, {
      method: "POST",
    }),
};
