"use client";

import React, { useState, useRef } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";
import { FileDropzone } from "@/components/tool/FileDropzone";
import { ToolSettings } from "@/components/tool/ToolSettings";
import { ErrorMessage } from "@/components/tool/ErrorMessage";
import { formatBytes } from "@/lib/utils";
import { Download, Loader2, RefreshCw, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
}

interface TextAnnotation {
  id: string;
  page: number; // 1-indexed
  text: string;
  xRatio: number; // 0 to 1 relative to page width
  yRatio: number; // 0 to 1 relative to page height
  fontSize: number;
  color: string;
}

export function PdfTextEditor() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pagePreviewUrl, setPagePreviewUrl] = useState<string | null>(null);

  // Annotations
  const [annotations, setAnnotations] = useState<TextAnnotation[]>([]);
  const [currentText, setCurrentText] = useState("Approved");
  const [fontSize, setFontSize] = useState<number>(14);
  const [textColor, setTextColor] = useState<string>("#2563EB");

  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const previewContainerRef = useRef<HTMLDivElement>(null);

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    if (selected.type !== "application/pdf" && !selected.name.toLowerCase().endsWith(".pdf")) {
      setError("Please select a valid PDF file.");
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);
      const buffer = await selected.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

      setFile(selected);
      setTotalPages(pdf.numPages);
      setCurrentPage(1);
      setAnnotations([]);
      setResultBlob(null);
      setResultUrl(null);
      setIsProcessing(false);
      renderPagePreview(pdf, 1);
    } catch {
      setError("Failed to open PDF. It may be encrypted or corrupted.");
      setIsProcessing(false);
    }
  };

  const renderPagePreview = async (pdfDoc: pdfjsLib.PDFDocumentProxy, pageNum: number) => {
    try {
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
        setPagePreviewUrl(canvas.toDataURL("image/jpeg", 0.9));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const changePage = async (delta: number) => {
    if (!file) return;
    const next = currentPage + delta;
    if (next < 1 || next > totalPages) return;
    setCurrentPage(next);

    const buffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    renderPagePreview(pdf, next);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!previewContainerRef.current) return;
    const rect = previewContainerRef.current.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width;
    const yRatio = (e.clientY - rect.top) / rect.height;

    const newAnno: TextAnnotation = {
      id: Math.random().toString(36).substring(2, 9),
      page: currentPage,
      text: currentText,
      xRatio,
      yRatio,
      fontSize,
      color: textColor,
    };

    setAnnotations((prev) => [...prev, newAnno]);
  };

  const handleApplyAndDownload = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);

    try {
      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer);
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const hexToRgb = (hex: string) => {
        const clean = hex.replace("#", "");
        const r = parseInt(clean.substring(0, 2), 16) / 255;
        const g = parseInt(clean.substring(2, 4), 16) / 255;
        const b = parseInt(clean.substring(4, 6), 16) / 255;
        return rgb(r, g, b);
      };

      for (const anno of annotations) {
        const page = pdfDoc.getPage(anno.page - 1);
        const { width, height } = page.getSize();

        // In PDF coordinate space, (0,0) is bottom-left
        const x = anno.xRatio * width;
        const y = (1 - anno.yRatio) * height;

        page.drawText(anno.text, {
          x,
          y: y - anno.fontSize / 2,
          size: anno.fontSize,
          font,
          color: hexToRgb(anno.color),
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setResultBlob(blob);
      setResultUrl(url);
      setIsProcessing(false);
    } catch {
      setError("Failed to generate updated PDF document.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-6">
      {!file ? (
        <FileDropzone
          onFilesSelected={handleFiles}
          accept="application/pdf"
          label="Drop a PDF file here to edit text and annotate"
          hint="Click anywhere to add text, stamps, signatures, or notes."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                PDF Editor Tools
              </span>
              <button
                onClick={() => {
                  setFile(null);
                  setPagePreviewUrl(null);
                  setAnnotations([]);
                }}
                className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600"
              >
                <RefreshCw className="h-3 w-3" /> Change PDF
              </button>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
              <p className="text-sm font-semibold text-slate-900 truncate">{file.name}</p>
              <p className="text-xs text-slate-500">
                Page {currentPage} of {totalPages} • {annotations.length} annotations added
              </p>
            </div>

            {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

            <ToolSettings title="Add Text Overlay">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Text to Insert
                </label>
                <input
                  type="text"
                  value={currentText}
                  onChange={(e) => setCurrentText(e.target.value)}
                  placeholder="Enter text..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 focus:bg-white"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {["Approved", "Confidential", "Signed", new Date().toLocaleDateString()].map(
                    (preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setCurrentText(preset)}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-600 hover:bg-slate-100"
                      >
                        {preset}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Font Size ({fontSize}pt)
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="36"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Text Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="h-8 w-10 cursor-pointer rounded border border-slate-200 bg-transparent p-0"
                    />
                    <span className="text-xs font-mono uppercase text-slate-600">
                      {textColor}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <p className="text-[11px] text-slate-500 mb-3">
                  👉 Click anywhere on the preview on the right to place this text.
                </p>

                <button
                  type="button"
                  onClick={handleApplyAndDownload}
                  disabled={isProcessing || annotations.length === 0}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 cursor-pointer transition-colors"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Saving Changes...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" /> Save &amp; Download Edited PDF
                    </>
                  )}
                </button>
              </div>
            </ToolSettings>
          </div>

          {/* Interactive Page View */}
          <div className="lg:col-span-7 space-y-3">
            {/* Page navigation */}
            <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-2">
              <button
                type="button"
                onClick={() => changePage(-1)}
                disabled={currentPage <= 1}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </button>
              <span className="text-xs font-bold text-slate-800">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => changePage(1)}
                disabled={currentPage >= totalPages}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 disabled:opacity-30"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Clickable Page Canvas Container */}
            <div
              ref={previewContainerRef}
              onClick={handleCanvasClick}
              className="relative rounded-2xl border border-slate-300 bg-slate-100 p-2 overflow-hidden shadow-inner cursor-crosshair flex justify-center"
            >
              {pagePreviewUrl ? (
                <div className="relative inline-block max-w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pagePreviewUrl}
                    alt={`Page ${currentPage}`}
                    className="max-h-[560px] object-contain rounded shadow-md bg-white pointer-events-none select-none"
                  />
                  {/* Placed text badges */}
                  {annotations
                    .filter((a) => a.page === currentPage)
                    .map((a) => (
                      <div
                        key={a.id}
                        style={{
                          left: `${a.xRatio * 100}%`,
                          top: `${a.yRatio * 100}%`,
                          color: a.color,
                          fontSize: `${a.fontSize}px`,
                        }}
                        className="absolute -translate-y-1/2 font-bold pointer-events-none select-none drop-shadow-xs whitespace-nowrap"
                      >
                        {a.text}
                      </div>
                    ))}
                </div>
              ) : (
                <div className="h-96 flex items-center justify-center text-xs text-slate-400">
                  Loading page preview...
                </div>
              )}
            </div>

            {resultUrl && resultBlob && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Edited PDF Ready</h4>
                    <p className="text-[11px] text-slate-500">Size: {formatBytes(resultBlob.size)}</p>
                  </div>
                </div>

                <a
                  href={resultUrl}
                  download={`edited-${file.name}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  <Download className="h-3.5 w-3.5" /> Download
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

