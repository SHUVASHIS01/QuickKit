"use client";

import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import JSZip from "jszip";
import { FileDropzone } from "@/components/tool/FileDropzone";
import { ToolSettings } from "@/components/tool/ToolSettings";
import { ErrorMessage } from "@/components/tool/ErrorMessage";
import { formatBytes } from "@/lib/utils";
import { FileImage, Download, Loader2, RefreshCw, Archive, Sparkles } from "lucide-react";

// Configure worker
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
}

interface PageImage {
  pageNum: number;
  dataUrl: string;
  blob: Blob;
}

export function PdfToJpg() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [format, setFormat] = useState<"image/jpeg" | "image/png">("image/jpeg");
  const [quality, setQuality] = useState<number>(0.9);
  const [scale, setScale] = useState<number>(2.0); // 2x for sharp render

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pageImages, setPageImages] = useState<PageImage[]>([]);
  const [zipBlob, setZipBlob] = useState<Blob | null>(null);
  const [zipUrl, setZipUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    if (selected.type !== "application/pdf" && !selected.name.toLowerCase().endsWith(".pdf")) {
      setError("Please select a valid PDF file.");
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);
      const arrayBuffer = await selected.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      setFile(selected);
      setTotalPages(pdf.numPages);
      setPageImages([]);
      setZipBlob(null);
      setZipUrl(null);
      setIsProcessing(false);
    } catch {
      setError("Failed to open PDF. It may be password-protected or corrupted.");
      setIsProcessing(false);
    }
  };

  const handleConvert = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(0);
    setError(null);
    setPageImages([]);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      const results: PageImage[] = [];
      const zip = new JSZip();
      const ext = format === "image/png" ? "png" : "jpg";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        if (ctx) {
          if (format === "image/jpeg") {
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          await page.render({ canvasContext: ctx, viewport, canvas }).promise;

          const blob = await new Promise<Blob>((resolve) =>
            canvas.toBlob((b) => resolve(b!), format, quality)
          );
          const dataUrl = canvas.toDataURL(format, quality);

          results.push({ pageNum: i, dataUrl, blob });
          zip.file(`page-${i}.${ext}`, blob);
        }

        setProgress(Math.round((i / pdf.numPages) * 100));
      }

      const generatedZip = await zip.generateAsync({ type: "blob" });
      const generatedZipUrl = URL.createObjectURL(generatedZip);

      setPageImages(results);
      setZipBlob(generatedZip);
      setZipUrl(generatedZipUrl);
      setIsProcessing(false);
    } catch {
      setError("An error occurred during PDF rasterization.");
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setTotalPages(0);
    setPageImages([]);
    setZipBlob(null);
    setZipUrl(null);
    setError(null);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-6">
      {!file ? (
        <FileDropzone
          onFilesSelected={handleFileSelect}
          accept="application/pdf"
          label="Drop a PDF file here to convert to JPG/PNG"
          hint="Render every page as a high-resolution image with single-click ZIP download."
        />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                Ready to Convert
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">{file.name}</h3>
              <p className="text-xs text-slate-500">
                {totalPages} {totalPages === 1 ? "page" : "pages"} • {formatBytes(file.size)}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleConvert}
                disabled={isProcessing}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer shadow-xs"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Rendering ({progress}%)...
                  </>
                ) : (
                  <>
                    <FileImage className="h-4 w-4" /> Convert {totalPages} Pages to Images
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"
                title="Change PDF"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

          {/* Settings */}
          <ToolSettings title="Image Quality Settings">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Format
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as "image/jpeg" | "image/png")}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-800"
                >
                  <option value="image/jpeg">JPG / JPEG (Compact)</option>
                  <option value="image/png">PNG (Lossless)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Render Resolution
                </label>
                <select
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-800"
                >
                  <option value={1.5}>Standard Web (150 DPI)</option>
                  <option value={2.0}>High Quality 2x (300 DPI)</option>
                  <option value={3.0}>Ultra Sharp 3x</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  JPEG Quality ({Math.round(quality * 100)}%)
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="1.0"
                  step="0.05"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-blue-600 mt-2"
                />
              </div>
            </div>
          </ToolSettings>

          {/* Converted Results Grid */}
          {pageImages.length > 0 && zipUrl && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-xs text-emerald-800 font-semibold">
                  <Sparkles className="h-4 w-4 text-emerald-600" />
                  Successfully converted all {pageImages.length} pages to images!
                </div>

                <a
                  href={zipUrl}
                  download={`${file.name.replace(/\.pdf$/i, "")}-images.zip`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700"
                >
                  <Archive className="h-3.5 w-3.5" /> Download All as ZIP ({formatBytes(zipBlob?.size || 0)})
                </a>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {pageImages.map((p) => (
                  <div
                    key={p.pageNum}
                    className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs space-y-2 group"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.dataUrl}
                      alt={`Page ${p.pageNum}`}
                      className="w-full h-44 object-contain rounded border border-slate-100 bg-slate-50"
                    />
                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="font-semibold text-slate-700">Page {p.pageNum}</span>
                      <a
                        href={p.dataUrl}
                        download={`page-${p.pageNum}.${format === "image/png" ? "png" : "jpg"}`}
                        className="text-blue-600 hover:underline flex items-center gap-1 font-medium text-[11px]"
                      >
                        <Download className="h-3 w-3" /> Save
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

