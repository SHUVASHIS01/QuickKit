"use client";

import React from "react";
import { FileItem } from "@/types";
import { formatBytes } from "@/lib/utils";
import { Trash2, CheckCircle2, AlertCircle, Loader2, File as FileIcon } from "lucide-react";

interface FileListProps {
  files: FileItem[];
  onRemove: (id: string) => void;
  onClearAll?: () => void;
}

export function FileList({ files, onRemove, onClearAll }: FileListProps) {
  if (files.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>Files ({files.length})</span>
        {onClearAll && (
          <button
            onClick={onClearAll}
            className="text-slate-500 hover:text-red-600 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
        {files.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3.5 gap-3 hover:bg-slate-50/50 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              {item.previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.previewUrl}
                  alt={item.name}
                  className="h-10 w-10 rounded-lg object-cover border border-slate-200 shrink-0"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500 border border-slate-200 shrink-0">
                  <FileIcon className="h-5 w-5" />
                </div>
              )}

              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {item.name}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>{formatBytes(item.size)}</span>
                  {item.resultSize && (
                    <>
                      <span>→</span>
                      <span className="font-semibold text-emerald-600">
                        {formatBytes(item.resultSize)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {item.status === "processing" && (
                <span className="inline-flex items-center gap-1 text-xs text-blue-600">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Processing
                </span>
              )}
              {item.status === "completed" && (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                  <CheckCircle2 className="h-4 w-4" /> Done
                </span>
              )}
              {item.status === "error" && (
                <span className="inline-flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle className="h-4 w-4" /> Error
                </span>
              )}

              <button
                onClick={() => onRemove(item.id)}
                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Remove file"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

