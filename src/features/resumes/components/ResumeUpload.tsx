"use client";

import React, { useState, useRef } from "react";
import { Upload, FileText, AlertCircle, CheckCircle2, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { resumeApi } from "@/services/api/resumes";
import { ResumeUploadResponse } from "@/services/interface";

interface ResumeUploadProps {
  onUploadSuccess: (response: ResumeUploadResponse) => void;
  onUploadError?: (message: string) => void;
}

export function ResumeUpload({ onUploadSuccess, onUploadError }: ResumeUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    setError(null);
    setSuccess(false);
    if (!allowedTypes.includes(file.type) && !file.name.endsWith(".pdf") && !file.name.endsWith(".docx") && !file.name.endsWith(".doc")) {
      setError("Only PDF and Word (.doc, .docx) files are supported.");
      return false;
    }
    // Limit file size to 10MB
    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit.");
      return false;
    }
    return true;
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  const removeFile = () => {
    setSelectedFile(null);
    setError(null);
    setSuccess(false);
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError(null);
    try {
      // Direct API upload call
      const response = await resumeApi.upload(selectedFile);
      setSuccess(true);
      setSelectedFile(null);
      onUploadSuccess(response);
    } catch (err: unknown) {
      console.error("Upload error:", err);
      const apiError = err as { detail?: string; message?: string };
      const errMsg = apiError?.detail || apiError?.message || "Failed to upload file. Please try again.";
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
      {/* Upload Zone */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center transition-all ${
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
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleChange}
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
              <div className="flex items-center justify-center gap-2 pt-2">
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
                  onClick={handleUploadSubmit}
                >
                  Upload & Parse
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
                Drag and drop resume here, or{" "}
                <button
                  type="button"
                  onClick={onButtonClick}
                  className="text-primary hover:underline font-semibold focus:outline-none bg-transparent border-none cursor-pointer"
                  disabled={uploading}
                >
                  browse
                </button>
              </p>
              <p className="text-xs text-slate-400">PDF, DOCX, DOC files up to 10MB</p>
            </div>
          </div>
        )}

        {/* Uploading Overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xs rounded-xl flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-800">Uploading Resume</p>
              <p className="text-xs text-slate-500 mt-1">Starting OCR & Parsing engine...</p>
            </div>
          </div>
        )}
      </div>

      {/* Success / Error feedbacks */}
      {error && (
        <div className="p-3 text-xs text-red-800 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">File uploaded and queued for processing!</span>
        </div>
      )}
    </div>
  );
}
