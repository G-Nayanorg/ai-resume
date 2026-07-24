


export type Role = "SUPER_ADMIN" | "TENANT_ADMIN" | "RECRUITER" | "VIEWER" | "CANDIDATE";

export type UUID = string;

// --- Common ---

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  size: number;
  total: number;
}

// --- Auth & User ---

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user_id: UUID;
  tenant_id: UUID | null;
  role: string;
}

export interface RegisterTenantRequest {
  tenant_name: string;
  tenant_slug: string;
  admin_email: string;
  admin_full_name: string;
  password?: string;
}

export interface RegisterTenantResponse {
  tenant_id: UUID;
  user_id: UUID;
  tokens: LoginResponse;
}

export interface UserOut {
  id: UUID;
  tenant_id: UUID | null;
  email: string;
  full_name: string | null;
  role: string;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserPublic {
  id: UUID;
  tenant_id: UUID | null;
  email_masked: string;
  full_name: string | null;
  role: string;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserCreate {
  email: string;
  password?: string;
  full_name?: string | null;
  role: string;
}

// --- Candidates ---

export interface SkillOut {
  id: UUID;
  skill_name: string;
  proficiency: string | null;
  years_of_experience: number | null;
}

export interface ExperienceOut {
  id: UUID;
  company_name: string;
  job_title: string;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
}

export interface EducationOut {
  id: UUID;
  institution_name: string;
  degree: string | null;
  field_of_study: string | null;
  graduation_year: number | null;
}

export interface ProjectOut {
  id: UUID;
  project_name: string;
  description: string | null;
  technologies: string[];
  url: string | null;
}

export interface CandidateListItem {
  id: UUID;
  tenant_id: UUID;
  name: string | null;
  email: string;
  location: string | null;
  dedup_status: string;
  duplicate_of: UUID | null;
  created_at: string;
  updated_at: string;
}

export interface CandidateDetail extends CandidateListItem {
  phone: string | null;
  skills: SkillOut[];
  experience: ExperienceOut[];
  education: EducationOut[];
  projects: ProjectOut[];
}

export interface CandidatePatch {
  name?: string | null;
  location?: string | null;
}

// --- Jobs ---

export interface JobSkillOut {
  id: UUID;
  skill: string;
  weight: number;
  required: boolean;
}

export interface JobSkillIn {
  skill: string;
  weight: number;
  required: boolean;
}

export interface JobListItem {
  id: UUID;
  title: string;
  location: string | null;
  min_experience: number | null;
  max_experience: number | null;
  education_required: string | null;
  status: string;
  skill_count: number;
  created_at: string;
}

export interface JobDetail {
  id: UUID;
  title: string;
  description: string | null;
  location: string | null;
  min_experience: number | null;
  max_experience: number | null;
  education_required: string | null;
  status: string;
  skills: JobSkillOut[];
  created_at: string;
  updated_at: string;
}

export interface JobCreate {
  title?: string;
  description?: string | null;
  location?: string | null;
  min_experience?: number | null;
  max_experience?: number | null;
  education_required?: string | null;
  status?: "draft" | "active" | "closed" | "archived";
  skills?: JobSkillIn[];
}

export interface JobUploadResponse {
  id: UUID;
  status: string;
  parse_status: ParseStatus;
  jd_source: string | null;
  created_at: string;
}

export type JobPatch = Partial<JobCreate>;

// --- Resumes ---

export type OCRStatus = "pending" | "processing" | "done" | "failed";
export type ParseStatus = "pending" | "processing" | "done" | "failed";

export interface ResumeListItem {
  id: UUID;
  candidate_id: UUID | null;
  original_filename: string;
  mime_type: string;
  size_bytes: number;
  ocr_status: OCRStatus;
  parse_status: ParseStatus;
  created_at: string;
  updated_at: string;
}

export interface ResumeDetail extends ResumeListItem {
  uploaded_by_user_id: UUID | null;
  ocr_text: string | null;
  ocr_error: string | null;
  parse_error: string | null;
  parse_confidence: number | null;
  prompt_version: string | null;
  download_url: string;
}

export interface ResumeUploadResponse {
  id: UUID;
  ocr_status: OCRStatus;
  parse_status: ParseStatus;
  original_filename: string;
  mime_type: string;
  size_bytes: number;
  created_at: string;
}

// --- Matching ---

export interface MatchScore {
  candidate_id: UUID;
  job_id: UUID;
  final_score: number;
  skills_score: number;
  experience_score: number;
  semantic_score: number;
  education_score: number;
  missing_skills: string[];
  computed_at: string;
}

export interface RankedCandidate {
  candidate: CandidateListItem;
  score: MatchScore;
}

export interface RankResponse {
  job_id: UUID;
  candidates: RankedCandidate[];
  total_candidates: number;
}

export interface ReverseSearchResponse {
  candidate_id: UUID;
  matches: {
    job: JobListItem;
    score: MatchScore;
  }[];
}
