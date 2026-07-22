"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Users, 
  Search, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  RefreshCw, 
  UserCheck, 
  Copy,
  SlidersHorizontal
} from "lucide-react";

import { candidateApi } from "@/services/api/candidates";
import { CandidateListItem, CandidateDetail, CandidatePatch } from "@/services/interface";
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

// Import custom candidates components
import { CandidateTable } from "@/features/candidates/components/CandidateTable";
import { CandidateForm } from "@/features/candidates/components/CandidateForm";
import { CandidateDetailDialog } from "@/features/candidates/components/CandidateDetailDialog";

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<CandidateListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Search/Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [includeDuplicates, setIncludeDuplicates] = useState(true);

  // Selected candidate state for dialogs
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateListItem | null>(null);
  
  // Dialog controls
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Show temporary toast feedback
  const showNotification = (type: "success" | "error", text: string) => {
    setNotification({ type, text });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Fetch candidates from API
  const fetchCandidates = async (silent = false) => {
    if (!silent) setLoading(true);
    setError(false);
    try {
      const response = await candidateApi.list({
        q: searchQuery || undefined,
        location: locationFilter || undefined,
        include_duplicates: includeDuplicates,
      });
      setCandidates(response.items || []);
    } catch (err) {
      console.error("Failed to load candidate entries:", err);
      setError(true);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Trigger query refetches on changes
  useEffect(() => {
    fetchCandidates();
  }, [searchQuery, locationFilter, includeDuplicates]);

  // CRUD Actions
  const handleEditSubmit = async (values: CandidatePatch) => {
    if (!selectedCandidate) return;
    setIsSubmitting(true);
    try {
      await candidateApi.patch(selectedCandidate.id, values);
      showNotification("success", `Candidate "${values.name}" updated successfully.`);
      setIsEditOpen(false);
      setSelectedCandidate(null);
      fetchCandidates(true);
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCandidate) return;
    setIsSubmitting(true);
    try {
      await candidateApi.delete(selectedCandidate.id);
      showNotification("success", "Candidate profile deleted successfully.");
      setIsDeleteOpen(false);
      setSelectedCandidate(null);
      fetchCandidates(true);
    } catch (err) {
      console.error(err);
      showNotification("error", "Failed to delete candidate profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Triggers
  const handleViewDetails = (candidate: CandidateListItem) => {
    setSelectedCandidate(candidate);
    setIsDetailOpen(true);
  };

  const handleEditTrigger = (candidate: CandidateListItem) => {
    setSelectedCandidate(candidate);
    setIsEditOpen(true);
  };

  const handleDeleteTrigger = (candidate: CandidateListItem) => {
    setSelectedCandidate(candidate);
    setIsDeleteOpen(true);
  };

  // Metric computations
  const metrics = useMemo(() => {
    const total = candidates.length;
    const duplicates = candidates.filter(
      c => c.dedup_status?.toLowerCase() === "duplicate" || !!c.duplicate_of
    ).length;
    const primary = total - duplicates;

    // Count unique locations
    const uniqueLocs = new Set(
      candidates.map(c => c.location?.toLowerCase().trim()).filter(Boolean)
    ).size;

    return { total, primary, duplicates, uniqueLocs };
  }, [candidates]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 md:p-6 lg:p-8 animate-in fade-in duration-300">
      {/* Toast Notification */}
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

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <Users className="w-8 h-8 text-primary" />
            Parsed Candidates
          </h1>
          <p className="text-slate-500 mt-1">
            Browse candidate profiles parsed from resume submissions, manage details, and resolve duplicate listings.
          </p>
        </div>
        <Button
          variant="outline"
          className="h-10 text-slate-600 font-semibold gap-1.5 self-start md:self-auto"
          onClick={() => fetchCandidates(false)}
          disabled={loading}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Metric Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Profiles" 
          value={loading ? "..." : String(metrics.total)} 
          description="Total records tracked" 
          icon={<Users className="w-4 h-4 text-slate-500" />} 
        />
        <StatsCard 
          title="Unique Candidates" 
          value={loading ? "..." : String(metrics.primary)} 
          description="Primary profile listings" 
          icon={<UserCheck className="w-4 h-4 text-emerald-600" />} 
        />
        <StatsCard 
          title="Duplicate Profiles" 
          value={loading ? "..." : String(metrics.duplicates)} 
          description="Deduplicated profiles" 
          icon={<Copy className="w-4 h-4 text-amber-600" />} 
        />
        <StatsCard 
          title="Active Locations" 
          value={loading ? "..." : String(metrics.uniqueLocs)} 
          description="Sourced locations" 
          icon={<MapPin className="w-4 h-4 text-blue-600" />} 
        />
      </div>

      {/* Filters Control bar */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by name, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 w-full bg-slate-50 border-slate-200 focus-visible:bg-white"
          />
        </div>
        <div className="relative w-full md:w-60">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Filter by location..."
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="pl-9 h-9 w-full bg-slate-50 border-slate-200 focus-visible:bg-white"
          />
        </div>
        <div className="flex items-center gap-2 select-none shrink-0 h-9 px-3 rounded-lg border border-slate-250 bg-slate-50/50">
          <input
            type="checkbox"
            id="include-duplicates"
            checked={includeDuplicates}
            onChange={(e) => setIncludeDuplicates(e.target.checked)}
            className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer"
          />
          <label htmlFor="include-duplicates" className="text-xs font-semibold text-slate-650 cursor-pointer">
            Include Duplicate Profiles
          </label>
        </div>
      </div>

      {/* Candidates List Table */}
      {loading ? (
        <div className="space-y-3 bg-white border border-slate-200 rounded-xl p-6 shadow-xs animate-pulse">
          <Skeleton className="h-6 w-1/4" />
          <div className="space-y-2 pt-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-12 border border-dashed border-red-200 bg-red-50/30 rounded-xl max-w-lg mx-auto">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-900">Failed to load candidates</h3>
          <p className="text-sm text-slate-500 mt-1">There was an error communicating with the API.</p>
          <Button variant="outline" className="mt-4" onClick={() => fetchCandidates(false)}>
            Try Again
          </Button>
        </div>
      ) : (
        <CandidateTable
          candidates={candidates}
          onView={handleViewDetails}
          onEdit={handleEditTrigger}
          onDelete={handleDeleteTrigger}
        />
      )}

      {/* Detail Dialog */}
      <CandidateDetailDialog
        candidateId={selectedCandidate?.id || null}
        open={isDetailOpen}
        onOpenChange={(open) => {
          setIsDetailOpen(open);
          if (!open) setSelectedCandidate(null);
        }}
      />

      {/* Edit Form Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md bg-white p-6 rounded-lg shadow-lg">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-lg font-bold text-slate-900">Edit Candidate Details</DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              Update candidate's name and primary contact location properties.
            </DialogDescription>
          </DialogHeader>

          {selectedCandidate && (
            <CandidateForm
              initialData={selectedCandidate}
              onSubmit={handleEditSubmit}
              onCancel={() => {
                setIsEditOpen(false);
                setSelectedCandidate(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-md bg-white p-6 rounded-lg shadow-lg">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 animate-bounce" />
              Confirm Candidate Deletion
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              Are you sure you want to delete <strong className="text-slate-900">"{selectedCandidate?.name || "this candidate"}"</strong>?
              This will permanently delete candidate matches, history, and uploaded resume relations.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
            <Button
              variant="outline"
              disabled={isSubmitting}
              onClick={() => {
                setIsDeleteOpen(false);
                setSelectedCandidate(null);
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
