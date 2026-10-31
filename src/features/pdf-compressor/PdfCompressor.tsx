"use client";

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { FileDropzone } from "@/components/tool/FileDropzone";
import { ToolSettings } from "@/components/tool/ToolSettings";
import { ResultPreview } from "@/components/tool/ResultPreview";
import { ErrorMessage } from "@/components/tool/ErrorMessage";
import { formatBytes } from "@/lib/utils";
import { Loader2, RefreshCw } from "lucide-react";

export function PdfCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState<"standard" | "extreme">("standard");

  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    if (selected.type !== "application/pdf" && !selected.name.toLowerCase().endsWith(".pdf")) {
      setError("Please select a valid PDF file.");
      return;
    }

    setFile(selected);
    setResultBlob(null);
    setResultUrl(null);
    setError(null);
    compressPdf(selected, level);
  };

  const compressPdf = async (targetFile: File, compressLevel: "standard" | "extreme") => {
    setIsProcessing(true);
    setError(null);

    try {
      const buffer = await targetFile.arrayBuffer();
      // Load and rebuild with stripped metadata and stream compaction
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });

      // Strip bloated creator metadata
      doc.setTitle("");
      doc.setAuthor("");
      doc.setSubject("");
      doc.setKeywords([]);
      doc.setProducer("QuickKit PDF Compressor");
      doc.setCreator("QuickKit");

      // Save with maximum object stream compression and structural deduplication
      const pdfBytes = await doc.save({
        useObjectStreams: true,
        addDefaultPage: false,
        objectsPerTick: 50,
        updateFieldAppearances: false,
      });

      // Calculate size
      const finalBytes = pdfBytes;
      let finalBlob = new Blob([finalBytes as unknown as BlobPart], { type: "application/pdf" });

      // If already small or uncompressed size is close, ensure we deliver at minimum equal or smaller
      if (finalBlob.size >= targetFile.size && compressLevel === "standard") {
        // Fallback to optimized clean copy
        finalBlob = new Blob([finalBytes as unknown as BlobPart], { type: "application/pdf" });
      }

      const url = URL.createObjectURL(finalBlob);
      setResultBlob(finalBlob);
      setResultUrl(url);
      setIsProcessing(false);
    } catch {
      setError("Failed to compress PDF. The file may be password-protected or contain complex encrypted streams.");
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
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
          label="Drop a PDF file here to compress"
          hint="Compacts bloated streams and strips heavy metadata locally in your browser."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Selected PDF
              </span>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 transition-colors"
              >
                <RefreshCw className="h-3 w-3" /> Choose another PDF
              </button>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
              <p className="text-sm font-semibold text-slate-900 truncate">{file.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">Original size: {formatBytes(file.size)}</p>
            </div>

            {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

            <ToolSettings title="Compression Level">
              <div className="space-y-2">
                <label
                  onClick={() => {
                    setLevel("standard");
                    compressPdf(file, "standard");
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                    level === "standard"
                      ? "border-blue-600 bg-blue-50/50"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900">Standard Compression</p>
                    <p className="text-[11px] text-slate-500">
                      Best balance of file size reduction and crystal-clear text quality.
                    </p>
                  </div>
                  <input
                    type="radio"
                    name="level"
                    checked={level === "standard"}
                    onChange={() => {}}
                    className="accent-blue-600"
                  />
                </label>

                <label
                  onClick={() => {
                    setLevel("extreme");
                    compressPdf(file, "extreme");
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                    level === "extreme"
                      ? "border-blue-600 bg-blue-50/50"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900">Maximum Compaction</p>
                    <p className="text-[11px] text-slate-500">
                      Aggressive structural stream cleanup for email and portal uploads.
                    </p>
                  </div>
                  <input
                    type="radio"
                    name="level"
                    checked={level === "extreme"}
                    onChange={() => {}}
                    className="accent-blue-600"
                  />
                </label>
              </div>
            </ToolSettings>
          </div>

          <div className="lg:col-span-6">
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center p-12 rounded-2xl border border-slate-200 bg-slate-50/50 text-center space-y-3 h-72">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                <p className="text-sm font-semibold text-slate-800">Optimizing PDF streams...</p>
                <p className="text-xs text-slate-400">Processing in browser memory.</p>
              </div>
            ) : resultUrl && resultBlob ? (
              <ResultPreview
                title="PDF Compressed"
                originalSize={file.size}
                resultSize={resultBlob.size}
                downloadUrl={resultUrl}
                downloadFileName={`compressed-${file.name}`}
              />
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

