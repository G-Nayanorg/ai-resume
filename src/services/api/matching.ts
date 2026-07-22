
import { apiClient } from "./client";
import URLS from "../URLs";
import { RankResponse, ReverseSearchResponse, UUID } from "../interface";

export const matchingApi = {
  rank: (job_id: UUID, top: number = 50) =>
    apiClient<RankResponse>(
      URLS.matchingrankjobsfetch.replace("{job_id}", job_id),
      {
        method: "POST",
        params: { top },
      }
    ),

  reverseSearch: (candidate_id: UUID) =>
    apiClient<ReverseSearchResponse>(
      URLS.matchingcandidatesfetch.replace("{candidate_id}", candidate_id)
    ),
};
