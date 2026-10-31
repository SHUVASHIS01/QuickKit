import React from "react";
import { Loader2 } from "lucide-react";

interface ProcessingProgressProps {
  progress?: number;
  message?: string;
}

export function ProcessingProgress({
  progress,
  message = "Processing your files...",
}: ProcessingProgressProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-xl border border-blue-100 bg-blue-50/40 text-center space-y-3">
      <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
      <div className="space-y-1">
        <p className="text-sm font-semibold text-slate-800">{message}</p>
        {typeof progress === "number" && (
          <p className="text-xs text-slate-500">{Math.round(progress)}% completed</p>
        )}
      </div>

      {typeof progress === "number" && (
        <div className="w-full max-w-xs bg-slate-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-blue-600 h-2 transition-all duration-200"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}
    </div>
  );
}

