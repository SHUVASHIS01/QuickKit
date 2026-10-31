"use client";

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { FileDropzone } from "@/components/tool/FileDropzone";
import { ErrorMessage } from "@/components/tool/ErrorMessage";
import { formatBytes } from "@/lib/utils";
import { FileText, ArrowUp, ArrowDown, Trash2, Loader2, Download, Plus, CheckCircle2 } from "lucide-react";

interface PdfItem {
  id: string;
  file: File;
  name: string;
  size: number;
}

export function PdfMerger() {
  const [pdfFiles, setPdfFiles] = useState<PdfItem[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [mergedBlob, setMergedBlob] = useState<Blob | null>(null);
  const [mergedUrl, setMergedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = (files: File[]) => {
    const validPdfs = files.filter(
      (f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")
    );
    if (validPdfs.length === 0) {
      setError("Please select valid PDF documents.");
      return;
    }

    const items: PdfItem[] = validPdfs.map((f) => ({
      id: Math.random().toString(36).substring(2, 9),
      file: f,
      name: f.name,
      size: f.size,
    }));

    setPdfFiles((prev) => [...prev, ...items]);
    setMergedBlob(null);
    setMergedUrl(null);
    setError(null);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const copy = [...pdfFiles];
    const temp = copy[index - 1];
    copy[index - 1] = copy[index];
    copy[index] = temp;
    setPdfFiles(copy);
  };

  const moveDown = (index: number) => {
    if (index === pdfFiles.length - 1) return;
    const copy = [...pdfFiles];
    const temp = copy[index + 1];
    copy[index + 1] = copy[index];
    copy[index] = temp;
    setPdfFiles(copy);
  };

  const removeFile = (id: string) => {
    setPdfFiles((prev) => prev.filter((p) => p.id !== id));
    setMergedBlob(null);
    setMergedUrl(null);
  };

  const handleMerge = async () => {
    if (pdfFiles.length < 2) {
      setError("Please add at least 2 PDF files to merge.");
      return;
    }

    setIsMerging(true);
    setError(null);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const item of pdfFiles) {
        const arrayBuffer = await item.file.arrayBuffer();
        const loadedPdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(
          loadedPdf,
          loadedPdf.getPageIndices()
        );
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setMergedBlob(blob);
      setMergedUrl(url);
      setIsMerging(false);
    } catch {
      setError(
        "Failed to merge PDF files. One or more files might be encrypted or corrupted."
      );
      setIsMerging(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="space-y-6">
        {/* Dropzone */}
        <FileDropzone
          onFilesSelected={handleFiles}
          accept="application/pdf"
          multiple={true}
          label="Drop PDF files here or browse"
          hint="Add 2 or more PDF documents to combine into a single file."
        />

        {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

        {/* Selected PDF file list */}
        {pdfFiles.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Files to Merge ({pdfFiles.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Order determines sequence in the final merged document.
                </p>
              </div>

              <button
                onClick={() => setPdfFiles([])}
                className="text-xs text-slate-500 hover:text-red-600 transition-colors"
              >
                Clear all
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {pdfFiles.map((pdf, index) => (
                <div
                  key={pdf.id}
                  className="flex items-center justify-between py-3 gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-xs font-semibold text-slate-600 shrink-0">
                      {index + 1}
                    </span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {pdf.name}
                      </p>
                      <p className="text-xs text-slate-400">{formatBytes(pdf.size)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30"
                      title="Move up"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => moveDown(index)}
                      disabled={index === pdfFiles.length - 1}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30"
                      title="Move down"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => removeFile(pdf.id)}
                      className="p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50"
                      title="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Merge action trigger */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-500">
                Total size: {formatBytes(pdfFiles.reduce((acc, cur) => acc + cur.size, 0))}
              </span>

              <button
                onClick={handleMerge}
                disabled={isMerging || pdfFiles.length < 2}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isMerging ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Merging locally...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" /> Merge {pdfFiles.length} PDFs
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Merged Success & Download Card */}
        {mergedUrl && mergedBlob && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/30 p-6 text-center space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 mx-auto">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                PDFs Merged Successfully!
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Final merged document size: {formatBytes(mergedBlob.size)}
              </p>
            </div>

            <div className="pt-2">
              <a
                href={mergedUrl}
                download="quickkit-merged.pdf"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
              >
                <Download className="h-4 w-4" /> Download Merged PDF
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

