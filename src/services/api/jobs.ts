
import { apiClient } from "./client";
import URLS from "../URLs";
import {
  JobCreate,
  JobDetail,
  JobListItem,
  JobPatch,
<<<<<<< HEAD
  JobUploadResponse,
=======
>>>>>>> 5b748b2badc66457323db053944e2e133d77601f
  PaginatedResponse,
  UUID,
} from "../interface";

export const jobApi = {
  getAll: (params: { page?: number; size?: number; status?: string }) =>
    apiClient<PaginatedResponse<JobListItem>>(URLS.jobfetch, { params }),

  getById: (job_id: UUID) =>
    apiClient<JobDetail>(URLS.jobfetchbyid.replace("{job_id}", job_id)),

  create: (body: JobCreate) =>
    apiClient<JobDetail>(URLS.jobcreate, {
      method: "POST",
      body,
    }),

<<<<<<< HEAD
  upload: (formData: FormData) =>
    apiClient<JobUploadResponse>(URLS.jobUpload, {
      method: "POST",
      body: formData,
    }),

=======
>>>>>>> 5b748b2badc66457323db053944e2e133d77601f
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
