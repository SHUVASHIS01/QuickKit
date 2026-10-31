"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, FileUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  label?: string;
  hint?: string;
  disabled?: boolean;
}

export function FileDropzone({
  onFilesSelected,
  accept,
  multiple = false,
  maxSizeMB = 50,
  label = "Click to browse or drag and drop files here",
  hint = "Files are processed safely in your local browser.",
  disabled = false,
}: FileDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const selected: File[] = [];
    const maxBytes = maxSizeMB * 1024 * 1024;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.size <= maxBytes) {
        selected.push(file);
      }
    }
    if (selected.length > 0) {
      onFilesSelected(selected);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      onClick={() => {
        if (!disabled && inputRef.current) {
          inputRef.current.click();
        }
      }}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center cursor-pointer transition-all duration-200",
        isDragOver
          ? "border-blue-500 bg-blue-50/60 scale-[1.005]"
          : "border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
        disabled={disabled}
      />

      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-200/80 mb-4 text-blue-600">
        {isDragOver ? (
          <FileUp className="h-7 w-7 animate-bounce" />
        ) : (
          <UploadCloud className="h-7 w-7" />
        )}
      </div>

      <p className="text-sm font-semibold text-slate-900">{label}</p>
      <p className="mt-1 text-xs text-slate-500 max-w-sm">{hint}</p>

      <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-400">
        <span>Max file size: {maxSizeMB}MB</span>
        {multiple && <span>• Multi-file upload supported</span>}
      </div>
    </div>
  );
}

