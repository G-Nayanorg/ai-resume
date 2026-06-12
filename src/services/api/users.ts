

import { apiClient } from "./client";
import URLS from "../URLs";
import {
  PaginatedResponse,
  UUID,
  UserCreate,
  UserOut,
  UserPublic,
} from "../interface";

export const userApi = {
  list: (params: { page?: number; size?: number }) =>
    apiClient<PaginatedResponse<UserOut | UserPublic>>(URLS.userfetch, {
      params,
    }),

  create: (body: UserCreate) =>
    apiClient<UserOut>(URLS.usercreate, {
      method: "POST",
      body,
    }),

  patch: (user_id: UUID, body: Partial<UserCreate>) =>
    apiClient<UserOut>(URLS.userupdate.replace("{user_id}", user_id), {
      method: "PATCH",
      body,
    }),

  delete: (user_id: UUID) =>
    apiClient<void>(URLS.userdelete.replace("{user_id}", user_id), {
      method: "DELETE",
    }),
};
