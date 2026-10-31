"use client";

import React, { useState } from "react";
import { FileDropzone } from "@/components/tool/FileDropzone";
import { ToolSettings } from "@/components/tool/ToolSettings";
import { ResultPreview } from "@/components/tool/ResultPreview";
import { RefreshCw, Lock, Unlock, Loader2 } from "lucide-react";

export function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [originalDim, setOriginalDim] = useState<{ width: number; height: number } | null>(null);
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(600);
  const [lockAspect, setLockAspect] = useState<boolean>(true);

  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const resizeImage = (targetFile: File, targetW: number, targetH: number) => {
    setIsProcessing(true);
    const img = new Image();
    const objUrl = URL.createObjectURL(targetFile);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(img, 0, 0, targetW, targetH);
        canvas.toBlob((blob) => {
          URL.revokeObjectURL(objUrl);
          if (blob) {
            setResultBlob(blob);
            setResultUrl(URL.createObjectURL(blob));
          }
          setIsProcessing(false);
        }, targetFile.type || "image/jpeg", 0.92);
      } else {
        setIsProcessing(false);
      }
    };

    img.src = objUrl;
  };

  const handleFiles = (files: File[]) => {
    if (files.length === 0) return;
    const f = files[0];
    setFile(f);
    const img = new Image();
    const url = URL.createObjectURL(f);
    img.onload = () => {
      setOriginalDim({ width: img.width, height: img.height });
      setWidth(img.width);
      setHeight(img.height);
      URL.revokeObjectURL(url);
      resizeImage(f, img.width, img.height);
    };
    img.src = url;
  };

  const handleWidthChange = (newW: number) => {
    setWidth(newW);
    if (lockAspect && originalDim && originalDim.width > 0) {
      const newH = Math.round((newW * originalDim.height) / originalDim.width);
      setHeight(newH);
      if (file) resizeImage(file, newW, newH);
    } else if (file) {
      resizeImage(file, newW, height);
    }
  };

  const handleHeightChange = (newH: number) => {
    setHeight(newH);
    if (lockAspect && originalDim && originalDim.height > 0) {
      const newW = Math.round((newH * originalDim.width) / originalDim.height);
      setWidth(newW);
      if (file) resizeImage(file, newW, newH);
    } else if (file) {
      resizeImage(file, width, newH);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {!file ? (
        <FileDropzone
          onFilesSelected={handleFiles}
          accept="image/*"
          label="Drop an image here to resize"
          hint="Scale to custom pixel dimensions or preset ratios."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Image Dimensions
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
              {originalDim && (
                <p className="text-xs text-slate-500 mt-0.5">
                  Original: {originalDim.width} × {originalDim.height} px
                </p>
              )}
            </div>

            <ToolSettings title="Resize Dimensions">
              <div className="grid grid-cols-2 gap-4 items-end">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Width (px)
                  </label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => handleWidthChange(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Height (px)
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => handleHeightChange(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setLockAspect(!lockAspect)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium border transition-colors ${
                    lockAspect
                      ? "bg-blue-50 border-blue-200 text-blue-700"
                      : "bg-slate-50 border-slate-200 text-slate-600"
                  }`}
                >
                  {lockAspect ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
                  Maintain Aspect Ratio
                </button>
              </div>

              {/* Presets */}
              <div className="pt-3 border-t border-slate-100">
                <label className="block text-xs font-medium text-slate-600 mb-2">
                  Quick Presets
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: "1080p", w: 1920, h: 1080 },
                    { label: "720p", w: 1280, h: 720 },
                    { label: "Square (1:1)", w: 1080, h: 1080 },
                    { label: "Avatar", w: 400, h: 400 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setWidth(preset.w);
                        setHeight(preset.h);
                        if (file) resizeImage(file, preset.w, preset.h);
                      }}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700 hover:bg-slate-100"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </ToolSettings>
          </div>

          <div className="lg:col-span-6">
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center p-12 rounded-2xl border border-slate-200 bg-slate-50/50 text-center space-y-3 h-72">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                <p className="text-sm font-semibold text-slate-800">Resizing image...</p>
              </div>
            ) : resultUrl && resultBlob ? (
              <ResultPreview
                title={`Resized (${width} × ${height} px)`}
                resultSize={resultBlob.size}
                previewUrl={resultUrl}
                downloadUrl={resultUrl}
                downloadFileName={`resized-${width}x${height}-${file.name}`}
              />
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

