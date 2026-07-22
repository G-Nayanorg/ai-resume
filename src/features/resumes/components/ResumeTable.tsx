"use client";

import React from "react";
import { Eye, Trash2, FileText, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
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
import { ResumeListItem } from "@/services/interface";

interface ResumeTableProps {
  resumes: ResumeListItem[];
  onView: (resume: ResumeListItem) => void;
  onDelete: (resume: ResumeListItem) => void;
}

export function ResumeTable({ resumes, onView, onDelete }: ResumeTableProps) {
  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase() || "pending";
    switch (s) {
      case "done":
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50 h-5 px-2 font-semibold">
            Done
          </Badge>
        );
      case "processing":
        return (
          <Badge className="bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-50 h-5 px-2 font-medium animate-pulse inline-flex items-center gap-1">
            <Loader2 className="w-3 h-3 animate-spin" /> Processing
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-50 h-5 px-2 font-medium animate-pulse">
            Queued
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-50 text-red-700 border border-red-200 hover:bg-red-50 h-5 px-2 font-medium inline-flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-red-500" /> Failed
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

  const formatSize = (bytes: number) => {
    if (!bytes || bytes <= 0) return "0 KB";
    const k = 1024;
    const dm = 2;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  if (resumes.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-slate-200 bg-white rounded-xl">
        <p className="text-slate-400 text-sm">No resumes uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50 border-b border-slate-200">
            <TableRow>
              <TableHead className="font-semibold text-slate-700 h-10 px-6">File Name</TableHead>
              <TableHead className="font-semibold text-slate-700 h-10 px-6">File Size</TableHead>
              <TableHead className="font-semibold text-slate-700 h-10 px-6">Uploaded At</TableHead>
              <TableHead className="font-semibold text-slate-700 h-10 px-6">OCR Status</TableHead>
              <TableHead className="font-semibold text-slate-700 h-10 px-6">Parsing Status</TableHead>
              <TableHead className="font-semibold text-slate-700 h-10 px-6 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-slate-200">
            {resumes.map((resume) => (
              <TableRow key={resume.id} className="hover:bg-slate-50 transition-colors">
                <TableCell className="px-6 py-4 font-semibold text-slate-900 max-w-xs truncate">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate" title={resume.original_filename}>
                      {resume.original_filename}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-slate-600 text-sm">
                  {formatSize(resume.size_bytes)}
                </TableCell>
                <TableCell className="px-6 py-4 text-slate-500 text-xs">
                  {formatDate(resume.created_at)}
                </TableCell>
                <TableCell className="px-6 py-4">
                  {getStatusBadge(resume.ocr_status)}
                </TableCell>
                <TableCell className="px-6 py-4">
                  {getStatusBadge(resume.parse_status)}
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1.5">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onView(resume)}
                      className="text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                      title="View Parse Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onDelete(resume)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      title="Delete Resume"
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
