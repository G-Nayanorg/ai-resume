"use client";

import React from "react";
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
import { JobDetail } from "@/services/interface";
import { MapPin, Briefcase, GraduationCap, Calendar, CheckCircle2, AlertCircle } from "lucide-react";

interface JobDetailDialogProps {
  job: JobDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JobDetailDialog({ job, open, onOpenChange }: JobDetailDialogProps) {
  if (!job) return null;

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50">
            Active
          </Badge>
        );
      case "draft":
        return (
          <Badge className="bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-50">
            Draft
          </Badge>
        );
      case "closed":
        return (
          <Badge className="bg-red-50 text-red-700 border border-red-200 hover:bg-red-50">
            Closed
          </Badge>
        );
      case "archived":
        return (
          <Badge className="bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-50">
            Archived
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto bg-white p-6 rounded-lg shadow-lg">
        <DialogHeader className="border-b border-slate-100 pb-4 mb-4">
          <div className="flex flex-wrap items-center gap-3">
            <DialogTitle className="text-xl font-bold text-slate-900 flex-1">
              {job.title}
            </DialogTitle>
            <div className="flex-shrink-0">{getStatusBadge(job.status)}</div>
          </div>
          <DialogDescription className="text-slate-400 text-xs mt-1">
            Job ID: <span className="font-mono text-slate-600 select-all">{job.id}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2.5 text-slate-700">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="text-sm">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Location</p>
                <p className="font-medium text-slate-900">{job.location || "Remote"}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-slate-700">
              <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="text-sm">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Experience</p>
                <p className="font-medium text-slate-900">
                  {job.min_experience !== null && job.max_experience !== null
                    ? `${job.min_experience} - ${job.max_experience} years`
                    : job.min_experience !== null
                    ? `${job.min_experience}+ years`
                    : "Not specified"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-slate-700">
              <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="text-sm">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Education Required</p>
                <p className="font-medium text-slate-900">{job.education_required || "Not specified"}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-slate-700">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="text-sm">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Last Updated</p>
                <p className="font-medium text-slate-900">{formatDate(job.updated_at || job.created_at)}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-2">Description</h3>
            {job.description ? (
              <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed bg-white border border-slate-100 p-3 rounded-lg">
                {job.description}
              </p>
            ) : (
              <p className="text-sm text-slate-400 italic">No description provided for this job.</p>
            )}
          </div>

          {/* Skills Required */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-2">Target Skills & Alignment</h3>
            {job.skills && job.skills.length > 0 ? (
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-200 px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <div>Skill</div>
                  <div className="text-center">Weight</div>
                  <div className="text-right">Requirement</div>
                </div>
                <div className="divide-y divide-slate-100">
                  {job.skills.map((skill) => (
                    <div key={skill.id} className="grid grid-cols-3 px-4 py-3 text-sm items-center hover:bg-slate-50/50">
                      <div className="font-medium text-slate-900">{skill.skill}</div>
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-semibold">
                          {skill.weight}
                        </div>
                      </div>
                      <div className="text-right">
                        {skill.required ? (
                          <span className="inline-flex items-center gap-1 text-xs text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded font-medium">
                            <AlertCircle className="w-3.5 h-3.5" /> Mandatory
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-slate-600 bg-slate-50 border border-slate-150 px-2 py-0.5 rounded font-medium">
                            Preferred
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic">No target skills configured for this job.</p>
            )}
          </div>
        </div>

        <DialogFooter className="mt-8 border-t border-slate-100 pt-4" showCloseButton={true} />
      </DialogContent>
    </Dialog>
  );
}
