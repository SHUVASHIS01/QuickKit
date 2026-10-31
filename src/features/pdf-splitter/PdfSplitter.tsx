"use client";

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";
import { FileDropzone } from "@/components/tool/FileDropzone";
import { ToolSettings } from "@/components/tool/ToolSettings";
import { ErrorMessage } from "@/components/tool/ErrorMessage";
import { DownloadButton } from "@/components/tool/DownloadButton";
import { formatBytes } from "@/lib/utils";
import { FileText, Scissors, Loader2, RefreshCw, CheckCircle2, Archive } from "lucide-react";

export function PdfSplitter() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [splitMode, setSplitMode] = useState<"range" | "all">("range");
  const [pageRange, setPageRange] = useState<string>("1");
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultType, setResultType] = useState<"pdf" | "zip">("pdf");
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    if (selected.type !== "application/pdf" && !selected.name.toLowerCase().endsWith(".pdf")) {
      setError("Please select a valid PDF file.");
      return;
    }

    try {
      const buffer = await selected.arrayBuffer();
      const doc = await PDFDocument.load(buffer);
      const count = doc.getPageCount();

      setFile(selected);
      setTotalPages(count);
      setPageRange(count > 1 ? `1-${Math.min(count, 3)}` : "1");
      setResultBlob(null);
      setResultUrl(null);
      setError(null);
    } catch {
      setError("Could not load PDF. It might be password-protected or corrupted.");
    }
  };

  const parsePageNumbers = (str: string, max: number): number[] => {
    const pages = new Set<number>();
    const parts = str.split(",");

    for (const part of parts) {
      const clean = part.trim();
      if (!clean) continue;

      if (clean.includes("-")) {
        const [startStr, endStr] = clean.split("-");
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end)) {
          const min = Math.max(1, Math.min(start, end));
          const maxP = Math.min(max, Math.max(start, end));
          for (let i = min; i <= maxP; i++) {
            pages.add(i);
          }
        }
      } else {
        const page = parseInt(clean, 10);
        if (!isNaN(page) && page >= 1 && page <= max) {
          pages.add(page);
        }
      }
    }

    return Array.from(pages).sort((a, b) => a - b);
  };

  const handleSplit = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);

    try {
      const buffer = await file.arrayBuffer();
      const sourceDoc = await PDFDocument.load(buffer);

      if (splitMode === "range") {
        const pageNumbers = parsePageNumbers(pageRange, totalPages);
        if (pageNumbers.length === 0) {
          setError(`Invalid page range. Please choose pages between 1 and ${totalPages}.`);
          setIsProcessing(false);
          return;
        }

        const newDoc = await PDFDocument.create();
        const indices = pageNumbers.map((p) => p - 1);
        const copied = await newDoc.copyPages(sourceDoc, indices);
        copied.forEach((p) => newDoc.addPage(p));

        const pdfBytes = await newDoc.save();
        const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);

        setResultBlob(blob);
        setResultUrl(url);
        setResultType("pdf");
      } else {
        // Split each page into separate PDF, then zip
        const zip = new JSZip();
        const baseName = file.name.replace(/\.pdf$/i, "");

        for (let i = 0; i < totalPages; i++) {
          const pageDoc = await PDFDocument.create();
          const [copiedPage] = await pageDoc.copyPages(sourceDoc, [i]);
          pageDoc.addPage(copiedPage);
          const bytes = await pageDoc.save();
          zip.file(`${baseName}-page-${i + 1}.pdf`, bytes);
        }

        const zipBlob = await zip.generateAsync({ type: "blob" });
        const zipUrl = URL.createObjectURL(zipBlob);

        setResultBlob(zipBlob);
        setResultUrl(zipUrl);
        setResultType("zip");
      }

      setIsProcessing(false);
    } catch {
      setError("An error occurred while splitting the document.");
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setTotalPages(0);
    setResultBlob(null);
    setResultUrl(null);
    setError(null);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {!file ? (
        <FileDropzone
          onFilesSelected={handleFileSelect}
          accept="application/pdf"
          label="Drop a PDF file here to split"
          hint="Extract pages or split into individual single-page documents securely."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Loaded Document
              </span>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 transition-colors"
              >
                <RefreshCw className="h-3 w-3" /> Choose another PDF
              </button>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-3 truncate">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="truncate">
                  <p className="text-sm font-semibold text-slate-900 truncate">{file.name}</p>
                  <p className="text-xs text-slate-500">
                    {totalPages} {totalPages === 1 ? "page" : "pages"} • {formatBytes(file.size)}
                  </p>
                </div>
              </div>
            </div>

            {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

            <ToolSettings title="Split Options">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-2">
                  Select Split Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSplitMode("range")}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-colors ${
                      splitMode === "range"
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    Extract Specific Pages
                  </button>
                  <button
                    type="button"
                    onClick={() => setSplitMode("all")}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-colors ${
                      splitMode === "all"
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    Split All into ZIP
                  </button>
                </div>
              </div>

              {splitMode === "range" && (
                <div className="pt-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Page Numbers or Range
                  </label>
                  <input
                    type="text"
                    value={pageRange}
                    onChange={(e) => setPageRange(e.target.value)}
                    placeholder={`e.g. 1-2, 4 (1 to ${totalPages})`}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Use commas and hyphens (e.g. 1-3, 5). Total pages available: {totalPages}.
                  </p>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSplit}
                  disabled={isProcessing}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Splitting in browser...
                    </>
                  ) : (
                    <>
                      <Scissors className="h-4 w-4" />{" "}
                      {splitMode === "range" ? "Extract Pages to PDF" : "Split All Pages to ZIP"}
                    </>
                  )}
                </button>
              </div>
            </ToolSettings>
          </div>

          {/* Result Card */}
          <div className="lg:col-span-6">
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center p-12 rounded-2xl border border-slate-200 bg-slate-50/50 text-center space-y-3 h-72">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                <p className="text-sm font-semibold text-slate-800">Processing pages...</p>
                <p className="text-xs text-slate-400">Zero data sent to servers.</p>
              </div>
            ) : resultUrl && resultBlob ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/20 p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <h3 className="text-base font-semibold text-slate-900">Split Complete!</h3>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {resultType === "zip" ? (
                      <Archive className="h-6 w-6 text-amber-500" />
                    ) : (
                      <FileText className="h-6 w-6 text-emerald-600" />
                    )}
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {resultType === "zip"
                          ? `${file.name.replace(/\.pdf$/i, "")}-pages.zip`
                          : `extracted-${file.name}`}
                      </p>
                      <p className="text-xs text-slate-500">Size: {formatBytes(resultBlob.size)}</p>
                    </div>
                  </div>
                </div>

                <DownloadButton
                  href={resultUrl}
                  download={
                    resultType === "zip"
                      ? `${file.name.replace(/\.pdf$/i, "")}-pages.zip`
                      : `extracted-${file.name}`
                  }
                  label={resultType === "zip" ? "Download All as ZIP" : "Download Extracted PDF"}
                  className="w-full"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center p-12 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-400 h-72 text-center">
                Configure your split settings on the left and click Extract.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

