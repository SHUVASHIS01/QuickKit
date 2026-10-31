"use client";

import React, { useState } from "react";
import { FileDropzone } from "@/components/tool/FileDropzone";
import { ToolSettings } from "@/components/tool/ToolSettings";
import { ResultPreview } from "@/components/tool/ResultPreview";
import { ErrorMessage } from "@/components/tool/ErrorMessage";
import { formatBytes } from "@/lib/utils";
import { Loader2, RefreshCw } from "lucide-react";

export function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<number>(80);
  const [maxWidth, setMaxWidth] = useState<number>(1920);

  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setResultBlob(null);
    setResultUrl(null);
    setError(null);
    compressImage(selected, quality, maxWidth);
  };

  const compressImage = async (
    targetFile: File,
    targetQuality: number,
    targetMaxWidth: number
  ) => {
    setIsProcessing(true);
    setError(null);

    try {
      const img = new Image();
      const objectUrl = URL.createObjectURL(targetFile);

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > targetMaxWidth) {
          height = Math.round((height * targetMaxWidth) / width);
          width = targetMaxWidth;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          setError("Could not initialize canvas context.");
          setIsProcessing(false);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        const mimeType = targetFile.type === "image/png" ? "image/jpeg" : targetFile.type;
        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(objectUrl);
            if (!blob) {
              setError("Failed to compress image.");
              setIsProcessing(false);
              return;
            }
            setResultBlob(blob);
            setResultUrl(URL.createObjectURL(blob));
            setIsProcessing(false);
          },
          mimeType,
          targetQuality / 100
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        setError("Failed to read image file. Please try another image.");
        setIsProcessing(false);
      };

      img.src = objectUrl;
    } catch {
      setError("An unexpected error occurred during client-side compression.");
      setIsProcessing(false);
    }
  };

  const handleQualityChange = (val: number) => {
    setQuality(val);
    if (file) {
      compressImage(file, val, maxWidth);
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
          accept="image/jpeg,image/png,image/webp"
          label="Drop an image here to compress"
          hint="JPG, PNG, and WebP formats supported up to 30MB."
          maxSizeMB={30}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Selected File
              </span>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 transition-colors"
              >
                <RefreshCw className="h-3 w-3" /> Choose another image
              </button>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 flex items-center justify-between shadow-2xs">
              <div className="truncate pr-3">
                <p className="text-sm font-semibold text-slate-900 truncate">{file.name}</p>
                <p className="text-xs text-slate-500">{formatBytes(file.size)}</p>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                Original
              </span>
            </div>

            {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

            <ToolSettings title="Compression Settings">
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5">
                  <span>Compression Quality</span>
                  <span className="font-bold text-blue-600">{quality}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="95"
                  step="5"
                  value={quality}
                  onChange={(e) => handleQualityChange(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Maximum Compression</span>
                  <span>Balanced</span>
                  <span>Highest Quality</span>
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Max Output Width
                </label>
                <select
                  value={maxWidth}
                  onChange={(e) => {
                    const w = Number(e.target.value);
                    setMaxWidth(w);
                    if (file) compressImage(file, quality, w);
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-800 focus:bg-white"
                >
                  <option value={3840}>Original / 4K (Up to 3840px)</option>
                  <option value={1920}>Full HD (1920px width)</option>
                  <option value={1280}>HD / Web (1280px width)</option>
                  <option value={800}>Compact (800px width)</option>
                </select>
              </div>
            </ToolSettings>
          </div>

          {/* Result Card */}
          <div className="lg:col-span-6">
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center p-12 rounded-2xl border border-slate-200 bg-slate-50/50 text-center space-y-3 h-72">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                <p className="text-sm font-semibold text-slate-800">Compressing locally...</p>
                <p className="text-xs text-slate-400">Processing in browser memory.</p>
              </div>
            ) : resultUrl && resultBlob ? (
              <ResultPreview
                title="Compressed Result Ready"
                originalSize={file.size}
                resultSize={resultBlob.size}
                previewUrl={resultUrl}
                downloadUrl={resultUrl}
                downloadFileName={`compressed-${file.name}`}
              />
            ) : (
              <div className="flex items-center justify-center p-12 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-400">
                Adjust the settings to compress.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

