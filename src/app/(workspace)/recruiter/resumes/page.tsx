"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  FileText, 
  Upload, 
  Search, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  Activity, 
  Database,
  Trash2,
  RefreshCw,
  FolderOpen
} from "lucide-react";

import { resumeApi } from "@/services/api/resumes";
import { ResumeListItem, ResumeDetail, ResumeUploadResponse } from "@/services/interface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// Import reusable resume components
import { ResumeUpload } from "@/features/resumes/components/ResumeUpload";
import { ResumeTable } from "@/features/resumes/components/ResumeTable";
import { ResumeDetailDialog } from "@/features/resumes/components/ResumeDetailDialog";

export default function ResumesPage() {
  const [resumes, setResumes] = useState<ResumeListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Selected entities & detail states
  const [selectedResume, setSelectedResume] = useState<ResumeListItem | null>(null);
  const [detailedResume, setDetailedResume] = useState<ResumeDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Modal open states
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper to show temporary notification banner
  const showNotification = (type: "success" | "error", text: string) => {
    setNotification({ type, text });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Fetch resumes list
  const fetchResumes = async (showSilently = false) => {
    if (!showSilently) setLoading(true);
    setError(false);
    try {
      const response = await resumeApi.list({});
      setResumes(response.items || []);
    } catch (err) {
      console.error("Failed to fetch resumes:", err);
      setError(true);
    } finally {
      if (!showSilently) setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  // Fetch full details of a resume (including ocr text and candidate profile status)
  const fetchResumeDetail = async (resumeId: string): Promise<ResumeDetail | null> => {
    setDetailLoading(true);
    try {
      const detail = await resumeApi.getById(resumeId);
      setDetailedResume(detail);
      return detail;
    } catch (err) {
      console.error(`Failed to fetch resume details for ID ${resumeId}:`, err);
      showNotification("error", "Failed to retrieve full resume details.");
      return null;
    } finally {
      setDetailLoading(false);
    }
  };

  // Active status Polling
  // Automatically updates resume processing statuses every 5 seconds if there are active items in pending/processing
  useEffect(() => {
    const hasActiveProcessing = resumes.some(
      (r) =>
        ["pending", "processing"].includes(r.ocr_status?.toLowerCase()) ||
        ["pending", "processing"].includes(r.parse_status?.toLowerCase())
    );

    if (!hasActiveProcessing) return;

    const interval = setInterval(async () => {
      try {
        const response = await resumeApi.list({});
        setResumes(response.items || []);
      } catch (err) {
        console.error("Error during polling updates:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [resumes]);

  // Actions
  const handleUploadSuccess = (response: ResumeUploadResponse) => {
    showNotification("success", `File "${response.original_filename}" uploaded successfully.`);
    setIsUploadOpen(false);
    fetchResumes(true); // reload silently
  };

  const handleViewTrigger = async (resume: ResumeListItem) => {
    setSelectedResume(resume);
    setIsDetailOpen(true);
    await fetchResumeDetail(resume.id);
  };

  const handleDeleteTrigger = (resume: ResumeListItem) => {
    setSelectedResume(resume);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedResume) return;
    setIsSubmitting(true);
    try {
      await resumeApi.delete(selectedResume.id);
      showNotification("success", `Resume file deleted successfully.`);
      setIsDeleteOpen(false);
      setSelectedResume(null);
      fetchResumes(true);
    } catch (err) {
      console.error("Failed to delete resume:", err);
      showNotification("error", "Failed to delete resume. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Client-side filtering
  const filteredResumes = useMemo(() => {
    return resumes.filter((resume) => {
      const matchesSearch = resume.original_filename
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

      const status = statusFilter.toLowerCase();
      let matchesStatus = true;
      if (status !== "all") {
        if (status === "done") {
          matchesStatus = resume.parse_status?.toLowerCase() === "done";
        } else if (status === "processing") {
          matchesStatus =
            ["processing", "pending"].includes(resume.ocr_status?.toLowerCase()) ||
            ["processing", "pending"].includes(resume.parse_status?.toLowerCase());
        } else if (status === "failed") {
          matchesStatus =
            resume.ocr_status?.toLowerCase() === "failed" ||
            resume.parse_status?.toLowerCase() === "failed";
        }
      }

      return matchesSearch && matchesStatus;
    });
  }, [resumes, searchQuery, statusFilter]);

  // Summary Metrics
  const metrics = useMemo(() => {
    const total = resumes.length;
    const parsed = resumes.filter(r => r.parse_status?.toLowerCase() === "done").length;
    const processing = resumes.filter(
      r =>
        (r.ocr_status?.toLowerCase() === "processing" || r.ocr_status?.toLowerCase() === "pending" ||
         r.parse_status?.toLowerCase() === "processing" || r.parse_status?.toLowerCase() === "pending") &&
        r.parse_status?.toLowerCase() !== "done" && r.ocr_status?.toLowerCase() !== "failed" && r.parse_status?.toLowerCase() !== "failed"
    ).length;
    const failed = resumes.filter(r => r.ocr_status?.toLowerCase() === "failed" || r.parse_status?.toLowerCase() === "failed").length;

    return { total, parsed, processing, failed };
  }, [resumes]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 md:p-6 lg:p-8 animate-in fade-in duration-300">
      {/* Notifications overlay */}
      {notification && (
        <div 
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg border shadow-lg animate-in fade-in slide-in-from-top-4 duration-300 ${
            notification.type === "success" 
              ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600" />
          )}
          <span className="text-sm font-semibold">{notification.text}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <FolderOpen className="w-8 h-8 text-primary" />
            Resume Processing Board
          </h1>
          <p className="text-slate-500 mt-1">
            Upload candidate resumes, monitor OCR extraction, and review fully parsed profiles.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="h-10 text-slate-600 font-semibold gap-1.5"
            onClick={() => fetchResumes(false)}
            disabled={loading}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button 
            className="gap-2 h-10 shadow-sm" 
            onClick={() => setIsUploadOpen(true)}
          >
            <Upload className="w-4 h-4" />
            Upload Resumes
          </Button>
        </div>
      </div>

      {/* KPI Stats Summary Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Resumes" 
          value={loading ? "..." : String(metrics.total)} 
          description="Uploaded archives" 
          icon={<FileText className="w-4 h-4 text-slate-500" />} 
        />
        <StatsCard 
          title="Fully Parsed" 
          value={loading ? "..." : String(metrics.parsed)} 
          description="Structured candidate files" 
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />} 
        />
        <StatsCard 
          title="In Queue / Parsing" 
          value={loading ? "..." : String(metrics.processing)} 
          description="Active OCR pipelines" 
          icon={<Activity className="w-4 h-4 text-blue-600" />} 
        />
        <StatsCard 
          title="Parse Failures" 
          value={loading ? "..." : String(metrics.failed)} 
          description="Review error logs" 
          icon={<AlertCircle className="w-4 h-4 text-red-500" />} 
        />
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by file name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 w-full bg-slate-50 border-slate-200 focus-visible:bg-white"
          />
        </div>
        <div className="w-full sm:w-44">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm shadow-xs transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 outline-none text-slate-700 font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="done">Done</option>
            <option value="processing">Processing</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Resumes Table */}
      {loading ? (
        <div className="space-y-3 bg-white border border-slate-200 rounded-xl p-6 shadow-xs animate-pulse">
          <Skeleton className="h-6 w-1/4" />
          <div className="space-y-2 pt-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-12 border border-dashed border-red-200 bg-red-50/30 rounded-xl max-w-lg mx-auto">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-900">Failed to load resumes</h3>
          <p className="text-sm text-slate-500 mt-1">Check database connection or try again.</p>
          <Button variant="outline" className="mt-4 animate-in duration-200" onClick={() => fetchResumes(false)}>
            Try Again
          </Button>
        </div>
      ) : (
        <ResumeTable
          resumes={filteredResumes}
          onView={handleViewTrigger}
          onDelete={handleDeleteTrigger}
        />
      )}

      {/* Upload Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="sm:max-w-md bg-white p-6 rounded-lg shadow-lg">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-lg font-bold text-slate-900">Upload Applicant Resume</DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              Select or drop PDF/Word resume files. The system will automatically run OCR and parse the text content.
            </DialogDescription>
          </DialogHeader>
          <ResumeUpload 
            onUploadSuccess={handleUploadSuccess} 
            onUploadError={(msg) => showNotification("error", msg)}
          />
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <ResumeDetailDialog
        resume={detailedResume}
        open={isDetailOpen}
        onOpenChange={(open) => {
          setIsDetailOpen(open);
          if (!open) {
            setSelectedResume(null);
            setDetailedResume(null);
          }
        }}
      />

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-md bg-white p-6 rounded-lg shadow-lg">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 animate-bounce" />
              Confirm Resume Deletion
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              Are you sure you want to delete this resume file?
              This action cannot be undone and will delete the associated parsed candidate profile and skills extraction files.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
            <Button
              variant="outline"
              disabled={isSubmitting}
              onClick={() => {
                setIsDeleteOpen(false);
                setSelectedResume(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              disabled={isSubmitting}
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white hover:text-white border-transparent gap-1.5"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Stats Card Sub-component
function StatsCard({ 
  title, 
  value, 
  description, 
  icon 
}: { 
  title: string; 
  value: string; 
  description: string; 
  icon: React.ReactNode 
}) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
      <div className="space-y-1.5">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
        <div className="text-2xl font-bold text-slate-900 tracking-tight">{value}</div>
        <p className="text-xs text-slate-550">{description}</p>
      </div>
      <div className="h-10 w-10 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100 shrink-0">
        {icon}
      </div>
    </div>
  );
}