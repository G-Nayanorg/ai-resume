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
import { Skeleton } from "@/components/ui/skeleton";
import { CandidateDetail } from "@/services/interface";
import { candidateApi } from "@/services/api/candidates";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  AlertTriangle,
  FolderOpen,
  Calendar
} from "lucide-react";

interface CandidateDetailDialogProps {
  candidateId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CandidateDetailDialog({ candidateId, open, onOpenChange }: CandidateDetailDialogProps) {
  const [candidate, setCandidate] = useState<CandidateDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (open && candidateId) {
      const fetchDetails = async () => {
        setLoading(true);
        setError(false);
        try {
          const detail = await candidateApi.getById(candidateId);
          setCandidate(detail);
        } catch (err) {
          console.error("Failed to fetch candidate profile details:", err);
          setError(true);
        } finally {
          setLoading(false);
        }
      };
      fetchDetails();
    } else {
      setCandidate(null);
    }
  }, [open, candidateId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto bg-white p-6 rounded-lg shadow-lg">
        {loading ? (
          <div className="space-y-4 pt-4">
            <div className="flex gap-4 items-center">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-slate-500">
            <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-sm">Failed to retrieve candidate profile details.</p>
          </div>
        ) : candidate ? (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header / Profile Contact Details */}
            <DialogHeader className="border-b border-slate-100 pb-4">
              <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <User className="w-5.5 h-5.5 text-primary shrink-0" />
                {candidate.name || "Unnamed Candidate"}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400 mt-1">
                Candidate ID: <span className="font-mono text-slate-600 select-all">{candidate.id}</span>
              </DialogDescription>

              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-sm text-slate-600 font-medium">
                {candidate.email && (
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    {candidate.email}
                  </span>
                )}
                {candidate.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    {candidate.phone}
                  </span>
                )}
                {candidate.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    {candidate.location}
                  </span>
                )}
              </div>
            </DialogHeader>

            {/* Skills Segment */}
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Technical Skills</h4>
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
                <p className="text-sm text-slate-400 italic">No technical skills recorded.</p>
              )}
            </div>

            {/* Work History Timeline */}
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Work History</h4>
              {candidate.experience && candidate.experience.length > 0 ? (
                <div className="space-y-4">
                  {candidate.experience.map((exp) => (
                    <div key={exp.id} className="border-l-2 border-slate-200 pl-4 space-y-1.5">
                      <div className="flex justify-between items-start">
                        <h5 className="font-semibold text-sm text-slate-900">{exp.job_title}</h5>
                        <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
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
                <p className="text-sm text-slate-400 italic">No experience history found.</p>
              )}
            </div>

            {/* Education milestones */}
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
                            <p className="text-[10px] text-slate-400 font-mono">Graduation: {edu.graduation_year}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400 italic">No education records found.</p>
              )}
            </div>

            {/* Projects list */}
            {candidate.projects && candidate.projects.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Personal & Pro Projects</h4>
                <div className="space-y-3">
                  {candidate.projects.map((proj) => (
                    <div key={proj.id} className="p-3 border border-slate-200 rounded-lg space-y-1">
                      <div className="flex justify-between items-start">
                        <h5 className="font-semibold text-xs text-slate-950 flex items-center gap-1.5">
                          <FolderOpen className="w-3.5 h-3.5 text-slate-400" />
                          {proj.project_name}
                        </h5>
                        {proj.url && (
                          <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary hover:underline font-semibold">
                            View URL
                          </a>
                        )}
                      </div>
                      {proj.description && (
                        <p className="text-[11px] text-slate-650">{proj.description}</p>
                      )}
                      {proj.technologies && proj.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {proj.technologies.map((t, idx) => (
                            <span key={idx} className="bg-slate-100 text-[10px] px-1.5 py-0.5 rounded text-slate-500 font-medium">
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

        <DialogFooter className="mt-8 border-t border-slate-100 pt-4" showCloseButton={true} />
      </DialogContent>
    </Dialog>
  );
}
