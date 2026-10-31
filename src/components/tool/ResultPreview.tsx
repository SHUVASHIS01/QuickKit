import React from "react";
import { Download, Sparkles, CheckCircle2 } from "lucide-react";
import { formatBytes } from "@/lib/utils";

interface ResultPreviewProps {
  title?: string;
  originalSize?: number;
  resultSize?: number;
  previewUrl?: string;
  downloadUrl?: string;
  downloadFileName?: string;
  children?: React.ReactNode;
}

export function ResultPreview({
  title = "Ready for Download",
  originalSize,
  resultSize,
  previewUrl,
  downloadUrl,
  downloadFileName = "quickkit-result",
  children,
}: ResultPreviewProps) {
  const savingsPercent =
    originalSize && resultSize && originalSize > resultSize
      ? Math.round(((originalSize - resultSize) / originalSize) * 100)
      : null;

  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50/20 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        </div>
        {savingsPercent !== null && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
            <Sparkles className="h-3 w-3" /> Saved {savingsPercent}%
          </span>
        )}
      </div>

      {(originalSize || resultSize) && (
        <div className="flex items-center gap-4 text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-200/80">
          {originalSize && (
            <div>
              <span className="text-slate-400">Original: </span>
              <span className="font-medium text-slate-700">{formatBytes(originalSize)}</span>
            </div>
          )}
          {resultSize && (
            <div>
              <span className="text-slate-400">Result: </span>
              <span className="font-semibold text-emerald-600">{formatBytes(resultSize)}</span>
            </div>
          )}
        </div>
      )}

      {previewUrl && (
        <div className="flex justify-center bg-white p-4 rounded-lg border border-slate-200/80 max-h-72 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Processed result"
            className="max-h-64 object-contain rounded-md"
          />
        </div>
      )}

      {children}

      {downloadUrl && (
        <div className="pt-2">
          <a
            href={downloadUrl}
            download={downloadFileName}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4" /> Download File
          </a>
        </div>
      )}
    </div>
  );
}

