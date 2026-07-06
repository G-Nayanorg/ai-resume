"use client";

import React from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JobListItem } from "@/services/interface";

interface JobTableProps {
  jobs: JobListItem[];
  onView: (job: JobListItem) => void;
  onEdit: (job: JobListItem) => void;
  onDelete: (job: JobListItem) => void;
}

export function JobTable({ jobs, onView, onEdit, onDelete }: JobTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50 h-5 px-2 font-semibold">
            Active
          </Badge>
        );
      case "draft":
        return (
          <Badge className="bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-50 h-5 px-2 font-medium">
            Draft
          </Badge>
        );
      case "closed":
        return (
          <Badge className="bg-red-50 text-red-700 border border-red-200 hover:bg-red-50 h-5 px-2 font-medium">
            Closed
          </Badge>
        );
      case "archived":
        return (
          <Badge className="bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-50 h-5 px-2 font-medium">
            Archived
          </Badge>
        );
      default:
        return (
          <Badge className="bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-100 h-5 px-2 font-medium">
            {status}
          </Badge>
        );
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-slate-200 bg-white rounded-xl">
        <p className="text-slate-400 text-sm">No jobs found matching your filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50 border-b border-slate-200">
            <TableRow>
              <TableHead className="font-semibold text-slate-700 h-10 px-6">Job Title</TableHead>
              <TableHead className="font-semibold text-slate-700 h-10 px-6">Location</TableHead>
              <TableHead className="font-semibold text-slate-700 h-10 px-6">Experience</TableHead>
              <TableHead className="font-semibold text-slate-700 h-10 px-6">Status</TableHead>
              <FormHeadPlaceholder label="Target Skills" />
              <FormHeadPlaceholder label="Created" />
              <TableHead className="font-semibold text-slate-700 h-10 px-6 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-slate-200">
            {jobs.map((job) => (
              <TableRow key={job.id} className="hover:bg-slate-50 transition-colors">
                <TableCell className="px-6 py-4 font-semibold text-slate-900">
                  {job.title}
                </TableCell>
                <TableCell className="px-6 py-4 text-slate-600">
                  {job.location || "Remote"}
                </TableCell>
                <TableCell className="px-6 py-4 text-slate-600">
                  {job.min_experience !== null && job.max_experience !== null
                    ? `${job.min_experience} - ${job.max_experience} yrs`
                    : job.min_experience !== null
                    ? `${job.min_experience}+ yrs`
                    : "Not specified"}
                </TableCell>
                <TableCell className="px-6 py-4">
                  {getStatusBadge(job.status)}
                </TableCell>
                <TableCell className="px-6 py-4 text-slate-600">
                  <Badge variant="outline" className="font-medium text-slate-500 h-5">
                    {job.skill_count || 0} skills
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4 text-slate-500 text-xs">
                  {formatDate(job.created_at)}
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1.5">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onView(job)}
                      className="text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onEdit(job)}
                      className="text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                      title="Edit Job"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onDelete(job)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      title="Delete Job"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function FormHeadPlaceholder({ label }: { label: string }) {
  return <TableHead className="font-semibold text-slate-700 h-10 px-6">{label}</TableHead>;
}
