"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ResumeDetail, CandidateDetail } from "@/services/interface";
import { candidateApi } from "@/services/api/candidates";
import { 
  FileText, 
  User, 
  AlertTriangle, 
  Download, 
  MapPin, 
  Mail, 
  Phone, 
  GraduationCap, 
  Briefcase, 
  Terminal, 
  Loader2 
} from "lucide-react";

interface ResumeDetailDialogProps {
  resume: ResumeDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ResumeDetailDialog({ resume, open, onOpenChange }: ResumeDetailDialogProps) {
  const [activeTab, setActiveTab] = useState<"ocr" | "profile" | "errors">("ocr");
  const [candidate, setCandidate] = useState<CandidateDetail | null>(null);
  const [candidateLoading, setCandidateLoading] = useState(false);
  const [candidateError, setCandidateError] = useState(false);

  // Reset tabs and state on open/close changes
  useEffect(() => {
    if (!open) {
      setCandidate(null);
      setActiveTab("ocr");
      setCandidateError(false);
    }
  }, [open]);

  // Load candidate profile if selected
  useEffect(() => {
    if (open && resume?.candidate_id && activeTab === "profile" && !candidate) {
      const fetchCandidate = async () => {
        setCandidateLoading(true);
        setCandidateError(false);
        try {
          const detail = await candidateApi.getById(resume.candidate_id!);
          setCandidate(detail);
        } catch (err) {
          console.error("Failed to load parsed candidate profile:", err);
          setCandidateError(true);
        } finally {
          setCandidateLoading(false);
        }
      };
      fetchCandidate();
    }
  }, [open, resume?.candidate_id, activeTab, candidate]);

  if (!resume) return null;

  const hasErrors = !!(resume.ocr_error || resume.parse_error);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "done":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "processing":
        return "bg-blue-50 text-blue-700 border-blue-200 animate-pulse";
      case "pending":
        return "bg-slate-50 text-slate-600 border-slate-200";
      case "failed":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const formatSize = (bytes: number) => {
    if (!bytes || bytes <= 0) return "0 KB";
    return (bytes / 1024).toFixed(1) + " KB";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto bg-white p-6 rounded-lg shadow-lg flex flex-col">
        <DialogHeader className="border-b border-slate-100 pb-4 shrink-0">
          <div className="flex flex-wrap items-center gap-3">
            <DialogTitle className="text-xl font-bold text-slate-900 flex-1 truncate" title={resume.original_filename}>
              {resume.original_filename}
            </DialogTitle>
            <div className="flex gap-2">
              <Badge className={`${getStatusColor(resume.ocr_status)} hover:bg-transparent border h-5`}>
                OCR: {resume.ocr_status}
              </Badge>
              <Badge className={`${getStatusColor(resume.parse_status)} hover:bg-transparent border h-5`}>
                Parse: {resume.parse_status}
              </Badge>
            </div>
          </div>
          <DialogDescription className="text-xs text-slate-400 mt-1 flex flex-wrap gap-x-4 gap-y-1">
            <span>Size: <strong className="text-slate-600 font-medium">{formatSize(resume.size_bytes)}</strong></span>
            <span>Mime: <strong className="text-slate-600 font-medium">{resume.mime_type}</strong></span>
            {resume.parse_confidence !== null && (
              <span>Confidence: <strong className="text-slate-600 font-medium">{(resume.parse_confidence * 100).toFixed(0)}%</strong></span>
            )}
          </DialogDescription>
        </DialogHeader>

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-200 mt-4 shrink-0">
          <button
            onClick={() => setActiveTab("ocr")}
            className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === "ocr"
                ? "border-primary text-primary"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-350"
            }`}
          >
            <FileText className="w-4 h-4" />
            Resume File & OCR
          </button>
          {resume.candidate_id && (
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === "profile"
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-350"
              }`}
            >
              <User className="w-4 h-4" />
              Parsed Profile
            </button>
          )}
          {hasErrors && (
            <button
              onClick={() => setActiveTab("errors")}
              className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === "errors"
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-350"
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-red-500" />
              Errors & Logs
            </button>
          )}
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto pt-4 min-h-[300px]">
          {activeTab === "ocr" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Raw Extracted OCR Text</span>
                {resume.download_url && (
                  <a href={resume.download_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs text-slate-700">
                      <Download className="w-3.5 h-3.5" /> Download Original File
                    </Button>
                  </a>
                )}
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-xs text-slate-700 whitespace-pre-wrap max-h-[400px] overflow-y-auto leading-relaxed select-all">
                {resume.ocr_text || "No OCR text extracted yet or extraction is in progress."}
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="space-y-6">
              {candidateLoading ? (
                <div className="space-y-4">
                  <div className="flex gap-4 items-center">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                  </div>
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ) : candidateError ? (
                <div className="text-center py-12 text-slate-500">
                  <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <p className="text-sm">Failed to retrieve candidate profile details.</p>
                </div>
              ) : candidate ? (
                <div className="space-y-6 animate-in fade-in duration-250">
                  {/* Contact Info Header */}
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{candidate.name || "Unnamed Candidate"}</h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2 text-sm text-slate-600">
                        {candidate.email && (
                          <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-slate-400" /> {candidate.email}</span>
                        )}
                        {candidate.phone && (
                          <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-slate-400" /> {candidate.phone}</span>
                        )}
                        {candidate.location && (
                          <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400" /> {candidate.location}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Skills Section */}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Parsed Skills</h4>
                    {candidate.skills && candidate.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {candidate.skills.map((skill) => (
                          <Badge key={skill.id} variant="outline" className="text-xs py-0.5 px-2 bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-50 font-medium">
                            {skill.skill_name}
                            {skill.years_of_experience && (
                              <span className="ml-1 text-[10px] text-slate-400">({skill.years_of_experience} yrs)</span>
                            )}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400 italic">No skills extracted.</p>
                    )}
                  </div>

                  {/* Experience Section */}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Work History</h4>
                    {candidate.experience && candidate.experience.length > 0 ? (
                      <div className="space-y-4">
                        {candidate.experience.map((exp) => (
                          <div key={exp.id} className="border-l-2 border-slate-200 pl-4 space-y-1.5">
                            <div className="flex justify-between items-start">
                              <h5 className="font-semibold text-sm text-slate-900">{exp.job_title}</h5>
                              <span className="text-xs text-slate-400 font-mono">
                                {exp.start_date || "?"} - {exp.end_date || "Present"}
                              </span>
                            </div>
                            <p className="text-xs text-primary font-medium">{exp.company_name}</p>
                            {exp.description && (
                              <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed">{exp.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400 italic">No experience record extracted.</p>
                    )}
                  </div>

                  {/* Education Section */}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Education</h4>
                    {candidate.education && candidate.education.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {candidate.education.map((edu) => (
                          <div key={edu.id} className="p-3 border border-slate-100 bg-slate-50/50 rounded-lg space-y-1">
                            <div className="flex items-start gap-1.5">
                              <GraduationCap className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                              <div>
                                <h5 className="font-semibold text-xs text-slate-900">
                                  {edu.degree ? `${edu.degree} in ` : ""}{edu.field_of_study || "Degree"}
                                </h5>
                                <p className="text-[11px] text-slate-600">{edu.institution_name}</p>
                                {edu.graduation_year && (
                                  <p className="text-[10px] text-slate-400 font-mono">Class of {edu.graduation_year}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400 italic">No education records extracted.</p>
                    )}
                  </div>

                  {/* Projects Section */}
                  {candidate.projects && candidate.projects.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Projects</h4>
                      <div className="space-y-3">
                        {candidate.projects.map((proj) => (
                          <div key={proj.id} className="p-3 border border-slate-200 rounded-lg space-y-1">
                            <div className="flex justify-between items-start">
                              <h5 className="font-semibold text-xs text-slate-950">{proj.project_name}</h5>
                              {proj.url && (
                                <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary hover:underline font-medium">
                                  Link
                                </a>
                              )}
                            </div>
                            {proj.description && (
                              <p className="text-[11px] text-slate-600">{proj.description}</p>
                            )}
                            {proj.technologies && proj.technologies.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {proj.technologies.map((t, idx) => (
                                  <span key={idx} className="bg-slate-100 text-[10px] px-1.5 py-0.5 rounded text-slate-500">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}

          {activeTab === "errors" && (
            <div className="space-y-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-slate-400" />
                Error Logs
              </span>
              <div className="space-y-3">
                {resume.ocr_error && (
                  <div className="p-3 border border-red-200 bg-red-50/50 rounded-lg">
                    <h5 className="text-xs font-bold text-red-800">OCR Extraction Error</h5>
                    <p className="font-mono text-xs text-red-700 mt-1 select-all">{resume.ocr_error}</p>
                  </div>
                )}
                {resume.parse_error && (
                  <div className="p-3 border border-red-200 bg-red-50/50 rounded-lg">
                    <h5 className="text-xs font-bold text-red-800">AI Parsing Model Error</h5>
                    <p className="font-mono text-xs text-red-700 mt-1 select-all">{resume.parse_error}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="mt-6 border-t border-slate-100 pt-4 shrink-0" showCloseButton={true} />
      </DialogContent>
    </Dialog>
  );
}
