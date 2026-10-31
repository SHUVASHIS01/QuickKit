"use client";

import React, { useState } from "react";
import { FileDropzone } from "@/components/tool/FileDropzone";
import { ToolSettings } from "@/components/tool/ToolSettings";
import { ErrorMessage } from "@/components/tool/ErrorMessage";
import { Download, Loader2, RefreshCw } from "lucide-react";

export function BackgroundRemover() {
  const [file, setFile] = useState<File | null>(null);
  const [tolerance, setTolerance] = useState<number>(30);
  const [bgMode, setBgMode] = useState<"transparent" | "white" | "color">("transparent");
  const [customBgColor, setCustomBgColor] = useState<string>("#2563EB");

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
    processBackgroundRemoval(selected, tolerance, bgMode, customBgColor);
  };

  const processBackgroundRemoval = (
    targetFile: File,
    tol: number,
    mode: "transparent" | "white" | "color",
    bgColor: string
  ) => {
    setIsProcessing(true);
    setError(null);

    const img = new Image();
    const objUrl = URL.createObjectURL(targetFile);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });

      if (!ctx) {
        setError("Canvas context failed to initialize.");
        setIsProcessing(false);
        return;
      }

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Sample border corners to detect background color
      const sampleCorners = [
        0, // top-left
        (canvas.width - 1) * 4, // top-right
        (canvas.height - 1) * canvas.width * 4, // bottom-left
        ((canvas.height - 1) * canvas.width + (canvas.width - 1)) * 4, // bottom-right
      ];

      // Average corner color
      let avgR = 0;
      let avgG = 0;
      let avgB = 0;
      sampleCorners.forEach((idx) => {
        avgR += data[idx];
        avgG += data[idx + 1];
        avgB += data[idx + 2];
      });
      avgR = Math.round(avgR / 4);
      avgG = Math.round(avgG / 4);
      avgB = Math.round(avgB / 4);

      const tolSq = Math.pow(tol * 2.5, 2);

      // Parse custom background color if needed
      let customR = 255;
      let customG = 255;
      let customB = 255;
      if (mode === "color") {
        const hex = bgColor.replace("#", "");
        customR = parseInt(hex.substring(0, 2), 16);
        customG = parseInt(hex.substring(2, 4), 16);
        customB = parseInt(hex.substring(4, 6), 16);
      }

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Euclidean distance from detected background
        const distSq =
          Math.pow(r - avgR, 2) + Math.pow(g - avgG, 2) + Math.pow(b - avgB, 2);

        if (distSq < tolSq) {
          if (mode === "transparent") {
            // Soft alpha edge feathering
            const alphaRatio = distSq / tolSq;
            data[i + 3] = Math.round(alphaRatio * 80);
          } else if (mode === "white") {
            data[i] = 255;
            data[i + 1] = 255;
            data[i + 2] = 255;
            data[i + 3] = 255;
          } else {
            data[i] = customR;
            data[i + 1] = customG;
            data[i + 2] = customB;
            data[i + 3] = 255;
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);

      canvas.toBlob((blob) => {
        URL.revokeObjectURL(objUrl);
        if (blob) {
          setResultBlob(blob);
          setResultUrl(URL.createObjectURL(blob));
        }
        setIsProcessing(false);
      }, "image/png");
    };

    img.onerror = () => {
      URL.revokeObjectURL(objUrl);
      setError("Failed to process image.");
      setIsProcessing(false);
    };

    img.src = objUrl;
  };

  const handleReset = () => {
    setFile(null);
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
          label="Drop an image here to remove background"
          hint="Isolates subject and generates transparent cutout PNG directly in your browser."
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
            </div>

            {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

            <ToolSettings title="Cutout & Background Settings">
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>Detection Sensitivity Tolerance ({tolerance})</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={tolerance}
                  onChange={(e) => {
                    const t = Number(e.target.value);
                    setTolerance(t);
                    processBackgroundRemoval(file, t, bgMode, customBgColor);
                  }}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Output Background
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setBgMode("transparent");
                      processBackgroundRemoval(file, tolerance, "transparent", customBgColor);
                    }}
                    className={`py-2 text-xs font-semibold rounded-xl border ${
                      bgMode === "transparent"
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    Transparent PNG
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBgMode("white");
                      processBackgroundRemoval(file, tolerance, "white", customBgColor);
                    }}
                    className={`py-2 text-xs font-semibold rounded-xl border ${
                      bgMode === "white"
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    Solid White
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBgMode("color");
                      processBackgroundRemoval(file, tolerance, "color", customBgColor);
                    }}
                    className={`py-2 text-xs font-semibold rounded-xl border ${
                      bgMode === "color"
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    Custom Color
                  </button>
                </div>
              </div>

              {bgMode === "color" && (
                <div className="flex items-center gap-3 pt-1">
                  <input
                    type="color"
                    value={customBgColor}
                    onChange={(e) => {
                      setCustomBgColor(e.target.value);
                      processBackgroundRemoval(file, tolerance, "color", e.target.value);
                    }}
                    className="h-8 w-12 cursor-pointer rounded border border-slate-200"
                  />
                  <span className="text-xs font-mono uppercase text-slate-600">
                    {customBgColor}
                  </span>
                </div>
              )}
            </ToolSettings>
          </div>

          <div className="lg:col-span-6">
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center p-12 rounded-2xl border border-slate-200 bg-slate-50/50 text-center space-y-3 h-72">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                <p className="text-sm font-semibold text-slate-800">Removing background...</p>
              </div>
            ) : resultUrl && resultBlob ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">Isolated Cutout</h4>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                    Ready
                  </span>
                </div>

                <div
                  className="flex justify-center p-4 rounded-xl border border-slate-200 max-h-72 overflow-hidden"
                  style={{
                    backgroundImage:
                      bgMode === "transparent"
                        ? "linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)"
                        : undefined,
                    backgroundSize: "16px 16px",
                    backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resultUrl}
                    alt="Cutout result"
                    className="max-h-60 object-contain rounded"
                  />
                </div>

                <a
                  href={resultUrl}
                  download={`cutout-${file.name.split(".")[0]}.png`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-xs hover:bg-blue-700"
                >
                  <Download className="h-4 w-4" /> Download Transparent PNG
                </a>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

