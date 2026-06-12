
import { apiClient } from "./client";
import URLS from "../URLs";
import {
  PaginatedResponse,
  ResumeDetail,
  ResumeListItem,
  ResumeUploadResponse,
  UUID,
} from "../interface";

export const resumeApi = {
  list: (params: {
    page?: number;
    size?: number;
    ocr_status?: string;
    parse_status?: string;
  }) => apiClient<PaginatedResponse<ResumeListItem>>(URLS.fetchresume, { params }),

  getById: (resume_id: UUID) =>
    apiClient<ResumeDetail>(URLS.resumebyid.replace("{resume_id}", resume_id)),

  upload: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient<ResumeUploadResponse>(URLS.resumecreate, {
      method: "POST",
      body: formData,
    });
  },

  delete: (resume_id: UUID) =>
    apiClient<void>(URLS.resumedelete.replace("{resume_id}", resume_id), {
      method: "DELETE",
    }),
};
