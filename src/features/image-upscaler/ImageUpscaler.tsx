"use client";

import React, { useState } from "react";
import { FileDropzone } from "@/components/tool/FileDropzone";
import { ToolSettings } from "@/components/tool/ToolSettings";
import { ErrorMessage } from "@/components/tool/ErrorMessage";
import { ResultPreview } from "@/components/tool/ResultPreview";
import { formatBytes } from "@/lib/utils";
import { Loader2, RefreshCw } from "lucide-react";

export function ImageUpscaler() {
  const [file, setFile] = useState<File | null>(null);
  const [scaleFactor, setScaleFactor] = useState<2 | 4>(2);
  const [enhanceSharpness, setEnhanceSharpness] = useState<boolean>(true);
  const [originalDim, setOriginalDim] = useState<{ width: number; height: number } | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    if (!selected.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    setFile(selected);
    setResultBlob(null);
    setResultUrl(null);
    setError(null);

    const img = new Image();
    const objUrl = URL.createObjectURL(selected);
    img.onload = () => {
      setOriginalDim({ width: img.width, height: img.height });
      URL.revokeObjectURL(objUrl);
      upscaleImage(selected, scaleFactor, enhanceSharpness, img.width, img.height);
    };
    img.src = objUrl;
  };

  const upscaleImage = (
    targetFile: File,
    scale: 2 | 4,
    sharpen: boolean,
    srcW: number,
    srcH: number
  ) => {
    setIsProcessing(true);
    setError(null);

    const img = new Image();
    const objUrl = URL.createObjectURL(targetFile);

    img.onload = () => {
      const targetW = srcW * scale;
      const targetH = srcH * scale;

      const canvas = document.createElement("canvas");
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });

      if (!ctx) {
        setError("Canvas context failed to initialize.");
        setIsProcessing(false);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, targetW, targetH);

      // Unsharp masking filter for edge enhancement
      if (sharpen) {
        try {
          const imgData = ctx.getImageData(0, 0, targetW, targetH);
          const data = imgData.data;
          const w = targetW;
          const h = targetH;

          // Simple 3x3 sharpening convolution kernel
          // [ 0, -1,  0 ]
          // [-1,  5, -1 ]
          // [ 0, -1,  0 ]
          const buff = new Uint8ClampedArray(data);
          for (let y = 1; y < h - 1; y++) {
            for (let x = 1; x < w - 1; x++) {
              const idx = (y * w + x) * 4;
              for (let c = 0; c < 3; c++) {
                const val =
                  5 * buff[idx + c] -
                  buff[((y - 1) * w + x) * 4 + c] -
                  buff[((y + 1) * w + x) * 4 + c] -
                  buff[(y * w + (x - 1)) * 4 + c] -
                  buff[(y * w + (x + 1)) * 4 + c];
                data[idx + c] = Math.min(255, Math.max(0, val));
              }
            }
          }
          ctx.putImageData(imgData, 0, 0);
        } catch {
          // ignore convolution error if too large
        }
      }

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(objUrl);
          if (blob) {
            setResultBlob(blob);
            setResultUrl(URL.createObjectURL(blob));
          }
          setIsProcessing(false);
        },
        targetFile.type || "image/png",
        0.95
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objUrl);
      setError("Failed to upscale image.");
      setIsProcessing(false);
    };

    img.src = objUrl;
  };

  const handleReset = () => {
    setFile(null);
    setOriginalDim(null);
    setResultBlob(null);
    setResultUrl(null);
    setError(null);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-6">
      {!file ? (
        <FileDropzone
          onFilesSelected={handleFiles}
          accept="image/*"
          label="Drop an image here to upscale resolution"
          hint="Enlarge photos 2x or 4x with bicubic edge sharpening directly in browser."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Source Image
              </span>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600"
              >
                <RefreshCw className="h-3 w-3" /> Change image
              </button>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
              <p className="text-sm font-semibold text-slate-900 truncate">{file.name}</p>
              {originalDim && (
                <p className="text-xs text-slate-500 mt-0.5">
                  Original: {originalDim.width} × {originalDim.height} px • {formatBytes(file.size)}
                </p>
              )}
            </div>

            {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

            <ToolSettings title="Upscale Multiplier">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Resolution Scale
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setScaleFactor(2);
                      if (originalDim) {
                        upscaleImage(file, 2, enhanceSharpness, originalDim.width, originalDim.height);
                      }
                    }}
                    className={`py-3 px-4 rounded-xl border text-center font-bold text-sm transition-colors ${
                      scaleFactor === 2
                        ? "border-blue-600 bg-blue-50 text-blue-700 shadow-2xs"
                        : "border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    2X Scale
                    <span className="block text-[11px] font-normal text-slate-500 mt-0.5">
                      {originalDim ? `${originalDim.width * 2} × ${originalDim.height * 2} px` : "Double resolution"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setScaleFactor(4);
                      if (originalDim) {
                        upscaleImage(file, 4, enhanceSharpness, originalDim.width, originalDim.height);
                      }
                    }}
                    className={`py-3 px-4 rounded-xl border text-center font-bold text-sm transition-colors ${
                      scaleFactor === 4
                        ? "border-blue-600 bg-blue-50 text-blue-700 shadow-2xs"
                        : "border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    4X Scale
                    <span className="block text-[11px] font-normal text-slate-500 mt-0.5">
                      {originalDim ? `${originalDim.width * 4} × ${originalDim.height * 4} px` : "4x resolution"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={enhanceSharpness}
                    onChange={(e) => {
                      setEnhanceSharpness(e.target.checked);
                      if (originalDim) {
                        upscaleImage(file, scaleFactor, e.target.checked, originalDim.width, originalDim.height);
                      }
                    }}
                    className="rounded accent-blue-600"
                  />
                  <span>Apply Edge Sharpening &amp; Contrast Enhancement</span>
                </label>
              </div>
            </ToolSettings>
          </div>

          <div className="lg:col-span-6">
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center p-12 rounded-2xl border border-slate-200 bg-slate-50/50 text-center space-y-3 h-72">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                <p className="text-sm font-semibold text-slate-800">Upscaling resolution...</p>
                <p className="text-xs text-slate-400">Rendering high-density pixels.</p>
              </div>
            ) : resultUrl && resultBlob ? (
              <ResultPreview
                title={`Upscaled ${scaleFactor}X Ready`}
                originalSize={file.size}
                resultSize={resultBlob.size}
                previewUrl={resultUrl}
                downloadUrl={resultUrl}
                downloadFileName={`upscaled-${scaleFactor}x-${file.name}`}
              />
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

