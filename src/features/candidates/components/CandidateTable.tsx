"use client";

import React from "react";
import { Eye, Pencil, Trash2, User } from "lucide-react";
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
import { CandidateListItem } from "@/services/interface";

interface CandidateTableProps {
  candidates: CandidateListItem[];
  onView: (candidate: CandidateListItem) => void;
  onEdit: (candidate: CandidateListItem) => void;
  onDelete: (candidate: CandidateListItem) => void;
}

export function CandidateTable({ candidates, onView, onEdit, onDelete }: CandidateTableProps) {
  const getDedupBadge = (candidate: CandidateListItem) => {
    const isDuplicate = !!candidate.duplicate_of || candidate.dedup_status?.toLowerCase() === "duplicate";
    if (isDuplicate) {
      return (
        <Badge className="bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-50 h-5 px-2 font-medium">
          Duplicate
        </Badge>
      );
    }
    return (
      <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50 h-5 px-2 font-semibold">
        Primary
      </Badge>
    );
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

  if (candidates.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-slate-200 bg-white rounded-xl">
        <p className="text-slate-400 text-sm">No candidates found matching your filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50 border-b border-slate-200">
            <TableRow>
              <TableHead className="font-semibold text-slate-700 h-10 px-6">Name</TableHead>
              <TableHead className="font-semibold text-slate-700 h-10 px-6">Email Address</TableHead>
              <TableHead className="font-semibold text-slate-700 h-10 px-6">Location</TableHead>
              <TableHead className="font-semibold text-slate-700 h-10 px-6">Profile Type</TableHead>
              <TableHead className="font-semibold text-slate-700 h-10 px-6">Added Date</TableHead>
              <TableHead className="font-semibold text-slate-700 h-10 px-6 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-slate-200">
            {candidates.map((candidate) => (
              <TableRow key={candidate.id} className="hover:bg-slate-50 transition-colors">
                <TableCell className="px-6 py-4 font-semibold text-slate-900">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{candidate.name || "Unnamed"}</span>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-slate-600 text-sm">
                  {candidate.email}
                </TableCell>
                <TableCell className="px-6 py-4 text-slate-600">
                  {candidate.location || "Not specified"}
                </TableCell>
                <TableCell className="px-6 py-4">
                  {getDedupBadge(candidate)}
                </TableCell>
                <TableCell className="px-6 py-4 text-slate-500 text-xs">
                  {formatDate(candidate.created_at)}
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1.5">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onView(candidate)}
                      className="text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                      title="View Profile Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onEdit(candidate)}
                      className="text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                      title="Edit Candidate"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onDelete(candidate)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      title="Delete Candidate"
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
