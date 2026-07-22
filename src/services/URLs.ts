const URLS = {
  // Authentication superadmin & admin
  authlogin: "/api/v1/auth/login",
  authregister: "/api/v1/auth/register",
  authrefresh: "/api/v1/auth/refresh",
  authlogout: "/api/v1/auth/logout",
  authprofile: "/api/v1/auth/me",
  authregistertenant: "/api/v1/admin/tenants",

  // Candidates
  candidatefetch: "/api/v1/candidates",
  candidatefetchbyid: "/api/v1/candidates/{candidate_id}",
  candidateupdate: "/api/v1/candidates/{candidate_id}",
  candidatedelete: "/api/v1/candidates/{candidate_id}",

  // JOBS
  jobfetch: "/api/v1/jobs",
  jobfetchbyid: "/api/v1/jobs/{job_id}",
  jobcreate: "/api/v1/jobs",
  jobupdate: "/api/v1/jobs/{job_id}",
  jobdelete: "/api/v1/jobs/{job_id}",

  // MATCHING
  matchingcandidatesfetch: "/api/v1/matching/candidates/{candidate_id}/jobs",
  matchingrankjobsfetch: "/api/v1/matching/jobs/{job_id}/rank",

  // parser

  // resume
  fetchresume: "/api/v1/resumes",
  resumebyid: "/api/v1/resumes/{resume_id}",
  resumecreate: "/api/v1/resumes/upload",
  resumedelete: "/api/v1/resumes/{resume_id}",

  // user
  userfetch: "/api/v1/auth/users",
  usercreate: "/api/v1/auth/users",
  userupdate: "/api/v1/auth/users/{user_id}",
  userdelete: "/api/v1/auth/users/{user_id}",
};

export default URLS;