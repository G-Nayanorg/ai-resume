"use client";

import React, { useRef, useState } from "react";
import { Upload, FileText, AlertCircle, CheckCircle2, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { jobApi } from "@/services/api/jobs";
import { JobUploadResponse } from "@/services/interface";

interface JobUploadProps {
  onUploadSuccess: (response: JobUploadResponse) => void;
  onUploadError?: (message: string) => void;
}

const allowedTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
  "text/plain",
];

const extensionWhitelist = [".pdf", ".doc", ".docx", ".png", ".jpg", ".jpeg", ".txt"];

export function JobUpload({ onUploadSuccess, onUploadError }: JobUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    setError(null);
    setSuccess(false);
    const normalizedName = file.name.toLowerCase();
    const hasValidType = allowedTypes.includes(file.type) || extensionWhitelist.some((ext) => normalizedName.endsWith(ext));
    if (!hasValidType) {
      setError("Only PDF, DOC, DOCX, PNG, JPEG, and TXT files are supported.");
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds the 10MB limit.");
      return false;
    }
    return true;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setError(null);
    setSuccess(false);
  };

  const handleUpload = async () => {
    if (!selectedFile && !text.trim()) {
      setError("Select a file or paste job description text before uploading.");
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append("file", selectedFile);
      }
      if (text.trim()) {
        formData.append("text", text.trim());
      }

      const response = await jobApi.upload(formData);
      setSuccess(true);
      setSelectedFile(null);
      setText("");
      onUploadSuccess(response);
    } catch (err: unknown) {
      console.error("Job upload error:", err);
      const apiError = err as { detail?: string; message?: string };
      const errMsg = apiError?.detail || apiError?.message || "Failed to upload job description. Please try again.";
      setError(errMsg);
      if (onUploadError) {
        onUploadError(errMsg);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 text-center flex flex-col items-center justify-center transition-all ${
          dragActive
            ? "border-primary bg-primary/5"
            : selectedFile
            ? "border-emerald-300 bg-emerald-50/10"
            : "border-slate-300 hover:border-primary bg-slate-50/50"
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx,.png,.jpeg,.jpg,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/png,image/jpeg,text/plain"
          onChange={handleFileChange}
          disabled={uploading}
        />

        {selectedFile ? (
          <div className="space-y-3">
            <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 truncate max-w-xs">{selectedFile.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            {!uploading && (
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs text-slate-600 h-8"
                  onClick={removeFile}
                >
                  <X className="w-3.5 h-3.5 mr-1" /> Remove
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="text-xs h-8"
                  onClick={() => inputRef.current?.click()}
                >
                  Choose Different File
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="h-12 w-12 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mx-auto">
              <Upload className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-800">
                Drag & drop a job description file here, or
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="text-primary hover:underline font-semibold focus:outline-none ml-1"
                  disabled={uploading}
                >
                  browse
                </button>
              </p>
              <p className="text-xs text-slate-400">PDF, DOC, DOCX, PNG, JPEG, or TXT files up to 10MB</p>
            </div>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xs rounded-xl flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-800">Uploading Job Description</p>
              <p className="text-xs text-slate-500 mt-1">Sending the job description to the parser...</p>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">Or paste job description text</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none resize-y"
          placeholder="Paste the job description here if you do not want to upload a file."
          disabled={uploading}
        />
      </div>

      {error && (
        <div className="p-3 text-xs text-red-800 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">Job description uploaded successfully.</span>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          disabled={uploading || (!selectedFile && !text.trim())}
          className="h-9"
          onClick={handleUpload}
        >
          Upload Job Description
        </Button>
      </div>
    </div>
  );
}
