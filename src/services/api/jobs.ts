
import { apiClient } from "./client";
import URLS from "../URLs";
import {
  JobCreate,
  JobDetail,
  JobListItem,
  JobPatch,
  PaginatedResponse,
  UUID,
} from "../interface";

export const jobApi = {
  list: (params: { page?: number; size?: number; status?: string }) =>
    apiClient<PaginatedResponse<JobListItem>>(URLS.jobfetch, { params }),

  getById: (job_id: UUID) =>
    apiClient<JobDetail>(URLS.jobfetchbyid.replace("{job_id}", job_id)),

  create: (body: JobCreate) =>
    apiClient<JobDetail>(URLS.jobcreate, {
      method: "POST",
      body,
    }),

  patch: (job_id: UUID, body: JobPatch) =>
    apiClient<JobDetail>(URLS.jobupdate.replace("{job_id}", job_id), {
      method: "PATCH",
      body,
    }),

  delete: (job_id: UUID) =>
    apiClient<void>(URLS.jobdelete.replace("{job_id}", job_id), {
      method: "DELETE",
    }),
};
