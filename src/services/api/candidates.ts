
import { apiClient } from "./client";
import URLS from "../URLs";
import {
  CandidateDetail,
  CandidateListItem,
  CandidatePatch,
  PaginatedResponse,
  ResumeListItem,
  UUID,
} from "../interface";

export const candidateApi = {
  list: (params: {
    page?: number;
    size?: number;
    q?: string;
    location?: string;
    skills?: string[];
    dedup_status?: string;
    include_duplicates?: boolean;
  }) =>
    apiClient<PaginatedResponse<CandidateListItem>>(URLS.candidatefetch, {
      params,
    }),

  getById: (candidate_id: UUID) =>
    apiClient<CandidateDetail>(
      URLS.candidatefetchbyid.replace("{candidate_id}", candidate_id)
    ),

  patch: (candidate_id: UUID, body: CandidatePatch) =>
    apiClient<CandidateDetail>(
      URLS.candidateupdate.replace("{candidate_id}", candidate_id),
      {
        method: "PATCH",
        body,
      }
    ),

  delete: (candidate_id: UUID) =>
    apiClient<void>(
      URLS.candidatedelete.replace("{candidate_id}", candidate_id),
      {
        method: "DELETE",
      }
    ),

  getResumes: (candidate_id: UUID) =>
    apiClient<ResumeListItem[]>(
      `${URLS.candidatefetchbyid.replace("{candidate_id}", candidate_id)}/resumes`
    ),
};
