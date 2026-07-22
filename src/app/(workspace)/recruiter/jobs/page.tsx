"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Briefcase, 
  Plus, 
  Search, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  Activity, 
  FileText, 
  Lock, 
  Archive 
} from "lucide-react";

import { jobApi } from "@/services/api/jobs";
import { JobDetail, JobListItem, JobCreate, JobPatch } from "@/services/interface";
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

// Import reusable job components
import { JobForm } from "@/features/jobs/components/JobForm";
import { JobTable } from "@/features/jobs/components/JobTable";
import { JobDetailDialog } from "@/features/jobs/components/JobDetailDialog";

export default function Page() {
  // State for jobs
  const [jobs, setJobs] = useState<JobListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Filter/Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Selected entities and details
  const [selectedJob, setSelectedJob] = useState<JobListItem | null>(null);
  const [detailedJob, setDetailedJob] = useState<JobDetail | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  // Dialog open states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load jobs list
  const fetchJobs = async () => {
    setIsLoading(true);
    setError(false);
    try {
      const response = await jobApi.getAll({});
      setJobs(response.items || []);
    } catch (err) {
      console.error("Failed to fetch jobs list:", err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Fetch single job details (for Edit / Detail dialogs)
  const fetchJobDetail = async (jobId: string): Promise<JobDetail | null> => {
    setIsDetailLoading(true);
    try {
      const detail = await jobApi.getById(jobId);
      setDetailedJob(detail);
      return detail;
    } catch (err) {
      console.error(`Failed to fetch job detail for ID ${jobId}:`, err);
      showNotification("error", "Failed to retrieve job details. Please try again.");
      return null;
    } finally {
      setIsDetailLoading(false);
    }
  };

  // Helper to show temporary feedback banner
  const showNotification = (type: "success" | "error", text: string) => {
    setNotification({ type, text });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // CRUD handlers
  const handleCreateSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      await jobApi.create(values as JobCreate);
      showNotification("success", `Job "${values.title}" created successfully.`);
      setIsCreateOpen(false);
      fetchJobs();
    } catch (err: any) {
      console.error(err);
      throw err; // throw back to let form handle internal error displays
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (values: any) => {
    if (!selectedJob) return;
    setIsSubmitting(true);
    try {
      await jobApi.patch(selectedJob.id, values as JobPatch);
      showNotification("success", `Job "${values.title}" updated successfully.`);
      setIsEditOpen(false);
      setSelectedJob(null);
      setDetailedJob(null);
      fetchJobs();
    } catch (err: any) {
      console.error(err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedJob) return;
    setIsSubmitting(true);
    try {
      await jobApi.delete(selectedJob.id);
      showNotification("success", `Job "${selectedJob.title}" deleted successfully.`);
      setIsDeleteOpen(false);
      setSelectedJob(null);
      fetchJobs();
    } catch (err: any) {
      console.error(err);
      showNotification("error", "Failed to delete job. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Action triggers
  const handleViewDetails = async (job: JobListItem) => {
    setSelectedJob(job);
    setIsDetailOpen(true);
    await fetchJobDetail(job.id);
  };

  const handleEditTrigger = async (job: JobListItem) => {
    setSelectedJob(job);
    setIsEditOpen(true);
    await fetchJobDetail(job.id);
  };

  const handleDeleteTrigger = (job: JobListItem) => {
    setSelectedJob(job);
    setIsDeleteOpen(true);
  };

  // Client-side search and filtering
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus =
        statusFilter === "all" || job.status?.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [jobs, searchQuery, statusFilter]);

  // KPIs / Metrics summary
  const metrics = useMemo(() => {
    return {
      total: jobs.length,
      active: jobs.filter(j => j.status?.toLowerCase() === "active").length,
      draft: jobs.filter(j => j.status?.toLowerCase() === "draft").length,
      closedArchived: jobs.filter(j => ["closed", "archived"].includes(j.status?.toLowerCase())).length
    };
  }, [jobs]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      {/* Notifications */}
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
            <Briefcase className="w-8 h-8 text-primary" />
            Job Board
          </h1>
          <p className="text-slate-500 mt-1">
            Create, update, and manage job openings and automated matching settings.
          </p>
        </div>
        <Button 
          className="gap-2 shrink-0 h-10 shadow-sm" 
          onClick={() => setIsCreateOpen(true)}
        >
          <Plus className="w-4 h-4" />
          Create Job
        </Button>
      </div>

      {/* KPI Stats Summary Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Positions" 
          value={isLoading ? "..." : String(metrics.total)} 
          description="Configured job posts" 
          icon={<FileText className="w-4 h-4 text-slate-500" />} 
        />
        <StatsCard 
          title="Active Openings" 
          value={isLoading ? "..." : String(metrics.active)} 
          description="Sourcing candidates" 
          icon={<Activity className="w-4 h-4 text-emerald-600" />} 
        />
        <StatsCard 
          title="Draft Posts" 
          value={isLoading ? "..." : String(metrics.draft)} 
          description="Unpublished drafts" 
          icon={<Lock className="w-4 h-4 text-slate-400" />} 
        />
        <StatsCard 
          title="Closed / Archived" 
          value={isLoading ? "..." : String(metrics.closedArchived)} 
          description="Archived positions" 
          icon={<Archive className="w-4 h-4 text-amber-600" />} 
        />
      </div>

      {/* Search and Filters bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by title or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 w-full bg-slate-50 border-slate-200 focus-visible:bg-white"
          />
        </div>
        <div className="w-full sm:w-44">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm shadow-xs transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 outline-none text-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="draft">Drafts Only</option>
            <option value="closed">Closed Only</option>
            <option value="archived">Archived Only</option>
          </select>
        </div>
      </div>

      {/* Main Table area */}
      {isLoading ? (
        <div className="space-y-3 bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
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
          <h3 className="text-base font-semibold text-slate-900">Failed to load jobs</h3>
          <p className="text-sm text-slate-500 mt-1">There was an error communicating with the API.</p>
          <Button variant="outline" className="mt-4" onClick={fetchJobs}>
            Try Again
          </Button>
        </div>
      ) : (
        <JobTable
          jobs={filteredJobs}
          onView={handleViewDetails}
          onEdit={handleEditTrigger}
          onDelete={handleDeleteTrigger}
        />
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto bg-white p-6 rounded-lg shadow-lg">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-bold text-slate-900">Create New Job Post</DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              Fill in details about the new position and add target skills weighting.
            </DialogDescription>
          </DialogHeader>
          <JobForm 
            onSubmit={handleCreateSubmit} 
            onCancel={() => setIsCreateOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto bg-white p-6 rounded-lg shadow-lg">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-bold text-slate-900">Edit Job Post</DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              Update position requirements, details, or alignment criteria.
            </DialogDescription>
          </DialogHeader>
          
          {isDetailLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="text-sm">Fetching job settings...</span>
            </div>
          ) : (
            <JobForm
              initialData={detailedJob}
              onSubmit={handleEditSubmit}
              onCancel={() => {
                setIsEditOpen(false);
                setSelectedJob(null);
                setDetailedJob(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <JobDetailDialog
        job={detailedJob}
        open={isDetailOpen}
        onOpenChange={(open) => {
          setIsDetailOpen(open);
          if (!open) {
            setSelectedJob(null);
            setDetailedJob(null);
          }
        }}
      />

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-md bg-white p-6 rounded-lg shadow-lg">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              Are you sure you want to delete the job post <strong className="text-slate-900">"{selectedJob?.title}"</strong>?
              This action cannot be undone and will delete all candidate match records associated with this job.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
            <Button
              variant="outline"
              disabled={isSubmitting}
              onClick={() => {
                setIsDeleteOpen(false);
                setSelectedJob(null);
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
              Delete Job
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Sub-component for Stats Card
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
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <div className="h-10 w-10 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100 shrink-0">
        {icon}
      </div>
    </div>
  );
}