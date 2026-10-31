"use client";

import React, { useState } from "react";
import { FileDropzone } from "@/components/tool/FileDropzone";
import { ToolSettings } from "@/components/tool/ToolSettings";
import { ResultPreview } from "@/components/tool/ResultPreview";
import { ErrorMessage } from "@/components/tool/ErrorMessage";
import { RefreshCw, Loader2 } from "lucide-react";

type Format = "image/jpeg" | "image/png" | "image/webp";

export function ImageConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<Format>("image/webp");
  const [quality, setQuality] = useState<number>(90);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const convertImage = (targetFile: File, fmt: Format, q: number) => {
    setIsProcessing(true);
    setError(null);

    const img = new Image();
    const objUrl = URL.createObjectURL(targetFile);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        setError("Canvas context unavailable.");
        setIsProcessing(false);
        return;
      }

      // If converting to JPEG, fill transparent background with white
      if (fmt === "image/jpeg") {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(objUrl);
          if (!blob) {
            setError("Conversion failed.");
            setIsProcessing(false);
            return;
          }
          setResultBlob(blob);
          setResultUrl(URL.createObjectURL(blob));
          setIsProcessing(false);
        },
        fmt,
        q / 100
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objUrl);
      setError("Unable to read this image file.");
      setIsProcessing(false);
    };

    img.src = objUrl;
  };

  const handleFiles = (files: File[]) => {
    if (files.length === 0) return;
    const f = files[0];
    setFile(f);
    convertImage(f, targetFormat, quality);
  };

  const getExt = (fmt: Format) => {
    if (fmt === "image/jpeg") return "jpg";
    if (fmt === "image/png") return "png";
    return "webp";
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {!file ? (
        <FileDropzone
          onFilesSelected={handleFiles}
          accept="image/*"
          label="Drop an image here to convert format"
          hint="Convert seamlessly between JPG, PNG, and WebP."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Source File
              </span>
              <button
                onClick={() => {
                  setFile(null);
                  setResultBlob(null);
                  setResultUrl(null);
                }}
                className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600"
              >
                <RefreshCw className="h-3 w-3" /> Change image
              </button>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-semibold text-slate-900 truncate">{file.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">Current Type: {file.type || "image"}</p>
            </div>

            {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

            <ToolSettings title="Conversion Settings">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Convert To Format
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["image/webp", "image/png", "image/jpeg"] as Format[]).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => {
                        setTargetFormat(fmt);
                        convertImage(file, fmt, quality);
                      }}
                      className={`py-2 text-xs font-semibold rounded-xl border transition-colors ${
                        targetFormat === fmt
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {fmt === "image/webp" && "WEBP"}
                      {fmt === "image/png" && "PNG"}
                      {fmt === "image/jpeg" && "JPG / JPEG"}
                    </button>
                  ))}
                </div>
              </div>

              {targetFormat !== "image/png" && (
                <div className="pt-2">
                  <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                    <span>Quality</span>
                    <span className="font-bold text-blue-600">{quality}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={quality}
                    onChange={(e) => {
                      const q = Number(e.target.value);
                      setQuality(q);
                      convertImage(file, targetFormat, q);
                    }}
                    className="w-full accent-blue-600"
                  />
                </div>
              )}
            </ToolSettings>
          </div>

          <div className="lg:col-span-6">
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center p-12 rounded-2xl border border-slate-200 bg-slate-50/50 text-center space-y-3 h-72">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                <p className="text-sm font-semibold text-slate-800">Converting format...</p>
              </div>
            ) : resultUrl && resultBlob ? (
              <ResultPreview
                title="Converted Successfully"
                originalSize={file.size}
                resultSize={resultBlob.size}
                previewUrl={resultUrl}
                downloadUrl={resultUrl}
                downloadFileName={`quickkit-${file.name.split(".")[0]}.${getExt(targetFormat)}`}
              />
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

