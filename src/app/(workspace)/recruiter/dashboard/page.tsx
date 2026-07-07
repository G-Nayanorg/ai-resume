"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Upload,
  Users,
  Briefcase,
  Clock,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import { jobApi } from "@/services/api/jobs";
import { candidateApi } from "@/services/api/candidates";
import { resumeApi } from "@/services/api/resumes";
import { JobListItem, CandidateListItem, ResumeListItem } from "@/services/interface";

export default function WorkspaceDashboardPage() {
  const [jobs, setJobs] = useState<JobListItem[]>([]);
  const [candidates, setCandidates] = useState<CandidateListItem[]>([]);
  const [resumes, setResumes] = useState<ResumeListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [jobsRes, candidatesRes, resumesRes] = await Promise.all([
        jobApi.getAll({}),
        candidateApi.list({ include_duplicates: true }),
        resumeApi.list({}),
      ]);

      setJobs(jobsRes.items || []);
      setCandidates(candidatesRes.items || []);
      setResumes(resumesRes.items || []);
    } catch (err) {
      console.error("Failed to load dashboard metrics:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Compute active processing resumes count
  const processingResumes = React.useMemo(() => {
    return resumes.filter(
      (r) =>
        ["pending", "processing"].includes(r.ocr_status?.toLowerCase() || "") ||
        ["pending", "processing"].includes(r.parse_status?.toLowerCase() || "")
    );
  }, [resumes]);

  const activeJobsCount = React.useMemo(() => {
    return jobs.filter((j) => j.status?.toLowerCase() === "active").length;
  }, [jobs]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-slate-500">Overview of your active hiring pipelines and recent activity.</p>
        </div>
        {/* <div className="flex items-center gap-3">
          <Link href="/recruiter/resumes">
            <Button variant="outline" className="gap-2 font-semibold">
              <Upload className="w-4 h-4" />
              Upload Resumes
            </Button>
          </Link>
          <Link href="/recruiter/createjob">
            <Button className="gap-2 font-semibold">
              <Plus className="w-4 h-4" />
              Create Job
            </Button>
          </Link>
        </div> */}
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Active Jobs"
          value={isLoading ? "..." : String(activeJobsCount)}
          description="Sourcing candidates"
          icon={<Briefcase className="w-4 h-4 text-primary" />}
        />
        <StatsCard
          title="Total Candidates"
          value={isLoading ? "..." : String(candidates.length)}
          description="Parsed profiles"
          icon={<Users className="w-4 h-4 text-primary" />}
        />
        <StatsCard
          title="Needs Review"
          value={isLoading ? "..." : String(processingResumes.length)}
          description="Pending parsing queue"
          icon={<Clock className="w-4 h-4 text-warning" />}
        />
        <StatsCard
          title="Interviews Today"
          value="6"
          description="Next at 2:30 PM"
          icon={<ArrowUpRight className="w-4 h-4 text-success" />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Table */}
        <Card className="lg:col-span-2 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Recent Candidate Matches</CardTitle>
            <CardDescription>Top ranked candidates for your active job postings.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Email Address</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Profile State</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-400">
                      Loading candidate profiles...
                    </TableCell>
                  </TableRow>
                ) : candidates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-400">
                      No candidate profiles found.
                    </TableCell>
                  </TableRow>
                ) : (
                  candidates.slice(0, 5).map((candidate) => (
                    <TableRow key={candidate.id} className="hover:bg-slate-50 transition-colors">
                      <TableCell className="font-semibold text-slate-900">
                        {candidate.name || "Unnamed Candidate"}
                      </TableCell>
                      <TableCell className="text-slate-650 text-xs">
                        {candidate.email}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {candidate.location || "Not specified"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={candidate.duplicate_of ? "text-amber-600 bg-amber-50 border-amber-200" : "text-emerald-600 bg-emerald-50 border-emerald-200"}
                        >
                          {candidate.duplicate_of ? "Duplicate" : "Primary"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href="/recruiter/candidates">
                          <Button variant="ghost" size="sm">View</Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          <Card className="shadow-sm border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="text-lg">Parsing Queue</CardTitle>
              <CardDescription>
                {isLoading
                  ? "Checking system..."
                  : `System is processing ${processingResumes.length} files.`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                </div>
              ) : processingResumes.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400 italic">
                  No files currently in processing queue.
                </div>
              ) : (
                processingResumes.slice(0, 4).map((resume) => {
                  const isOcrProcessing = ["pending", "processing"].includes(resume.ocr_status?.toLowerCase() || "");
                  const statusLabel = isOcrProcessing ? "OCR Extraction" : "AI Parsing";
                  const progressPct = isOcrProcessing ? 40 : 80;
                  return (
                    <QueueItem
                      key={resume.id}
                      name={resume.original_filename}
                      status={statusLabel}
                      progress={progressPct}
                    />
                  );
                })
              )}
              <Link href="/recruiter/resumes" className="block w-full">
                <Button variant="ghost" className="w-full text-xs text-slate-500 mt-2 hover:bg-slate-50">
                  View All Processing
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, description, icon }: { title: string; value: string; description: string; icon: React.ReactNode }) {
  return (
    <Card className="shadow-sm border-slate-200 bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-500">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-slate-450 mt-1">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

function QueueItem({ name, status, progress }: { name: string; status: string; progress: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs">
        <span className="font-medium text-slate-700 truncate max-w-[150px]" title={name}>{name}</span>
        <span className="text-slate-500 inline-flex items-center gap-1">
          <Loader2 className="w-3 h-3 animate-spin text-primary" /> {status}
        </span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full bg-primary transition-all duration-500 ${status === 'Queued' ? 'opacity-30' : ''}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
