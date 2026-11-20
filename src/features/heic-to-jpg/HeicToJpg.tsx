"use client";

import React, { useState } from "react";
import JSZip from "jszip";
import {
  Upload,
  Download,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Loader2,
  Trash2,
  Sparkles,
  Archive,
  ArrowRight
} from "lucide-react";

interface ConvertedItem {
  id: string;
  originalFile: File;
  originalSize: number;
  resultBlob: Blob | null;
  resultUrl: string | null;
  resultSize: number | null;
  status: "idle" | "converting" | "done" | "error";
  errorMessage?: string;
}

export function HeicToJpg() {
  const [items, setItems] = useState<ConvertedItem[]>([]);
  const [targetFormat, setTargetFormat] = useState<"image/jpeg" | "image/png">("image/jpeg");
  const [quality, setQuality] = useState<number>(0.92);
  const [isConvertingAll, setIsConvertingAll] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const handleFiles = (files: FileList | File[]) => {
    const newItems: ConvertedItem[] = [];
    Array.from(files).forEach((file) => {
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (ext === "heic" || ext === "heif" || file.type.includes("heic") || file.type.includes("heif")) {
        newItems.push({
          id: Math.random().toString(36).substring(7),
          originalFile: file,
          originalSize: file.size,
          resultBlob: null,
          resultUrl: null,
          resultSize: null,
          status: "idle",
        });
      }
    });

    if (newItems.length > 0) {
      setItems((prev) => [...prev, ...newItems]);
    }
  };

  const convertItem = async (item: ConvertedItem): Promise<ConvertedItem> => {
    try {
      const heic2any = (await import("heic2any")).default;
      const res = await heic2any({
        blob: item.originalFile,
        toType: targetFormat,
        quality: targetFormat === "image/jpeg" ? quality : undefined,
      });

      const singleBlob = Array.isArray(res) ? res[0] : res;
      const url = URL.createObjectURL(singleBlob);

      return {
        ...item,
        status: "done",
        resultBlob: singleBlob,
        resultUrl: url,
        resultSize: singleBlob.size,
      };
    } catch (err: unknown) {
      return {
        ...item,
        status: "error",
        errorMessage: err instanceof Error ? err.message : "Conversion failed",
      };
    }
  };

  const handleConvertAll = async () => {
    if (items.length === 0 || isConvertingAll) return;
    setIsConvertingAll(true);

    const updated = [...items];
    for (let i = 0; i < updated.length; i++) {
      if (updated[i].status !== "done") {
        updated[i] = { ...updated[i], status: "converting" };
        setItems([...updated]);
        const res = await convertItem(updated[i]);
        updated[i] = res;
        setItems([...updated]);
      }
    }

    setIsConvertingAll(false);
  };

  const handleDownloadSingle = (item: ConvertedItem) => {
    if (!item.resultUrl || !item.resultBlob) return;
    const ext = targetFormat === "image/png" ? "png" : "jpg";
    const baseName = item.originalFile.name.replace(/\.[^/.]+$/, "");
    const a = document.createElement("a");
    a.href = item.resultUrl;
    a.download = `${baseName}.${ext}`;
    a.click();
  };

  const handleDownloadZip = async () => {
    const doneItems = items.filter((i) => i.status === "done" && i.resultBlob);
    if (doneItems.length === 0 || isZipping) return;

    setIsZipping(true);
    try {
      const zip = new JSZip();
      const ext = targetFormat === "image/png" ? "png" : "jpg";

      doneItems.forEach((item, index) => {
        const baseName = item.originalFile.name.replace(/\.[^/.]+$/, "") || `converted-${index + 1}`;
        zip.file(`${baseName}.${ext}`, item.resultBlob!);
      });

      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = "quickkit-converted-images.zip";
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsZipping(false);
    }
  };

  const handleRemove = (id: string) => {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target?.resultUrl) {
        URL.revokeObjectURL(target.resultUrl);
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  const handleClearAll = () => {
    items.forEach((item) => {
      if (item.resultUrl) URL.revokeObjectURL(item.resultUrl);
    });
    setItems([]);
  };

  const doneCount = items.filter((i) => i.status === "done").length;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      {/* Settings bar */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
              Target Format
            </label>
            <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200/80">
              <button
                onClick={() => setTargetFormat("image/jpeg")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  targetFormat === "image/jpeg"
                    ? "bg-white text-blue-700 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                JPG / JPEG
              </button>
              <button
                onClick={() => setTargetFormat("image/png")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  targetFormat === "image/png"
                    ? "bg-white text-blue-700 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                PNG (Lossless)
              </button>
            </div>
          </div>

          {targetFormat === "image/jpeg" && (
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                Quality: {Math.round(quality * 100)}%
              </label>
              <input
                type="range"
                min="0.5"
                max="1"
                step="0.05"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-32 accent-blue-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
              />
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleClearAll}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1"
            >
              <Trash2 className="h-3.5 w-3.5" /> Clear All
            </button>
            <button
              onClick={handleConvertAll}
              disabled={isConvertingAll}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              {isConvertingAll ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Converting...
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" /> Convert {items.length} Files
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Dropzone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
        }}
        onClick={() => document.getElementById("heic-file-input")?.click()}
        className="rounded-3xl border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50/60 hover:bg-blue-50/20 p-8 sm:p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3"
      >
        <input
          id="heic-file-input"
          type="file"
          accept=".heic,.heif"
          multiple
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />
        <div className="h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-2xs">
          <Upload className="h-6 w-6" />
        </div>
        <div>
          <p className="text-base font-semibold text-slate-800">
            Click to upload or drag & drop Apple HEIC/HEIF photos
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Batch conversion supported • 100% Client-side processing • No files uploaded to servers
          </p>
        </div>
      </div>

      {/* Files List */}
      {items.length > 0 && (
        <div className="mt-8 space-y-3">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Selected Files ({items.length})
            </span>
            {doneCount > 1 && (
              <button
                onClick={handleDownloadZip}
                disabled={isZipping}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold transition-colors"
              >
                {isZipping ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Zipping...
                  </>
                ) : (
                  <>
                    <Archive className="h-3.5 w-3.5" /> Download All ({doneCount}) as ZIP
                  </>
                )}
              </button>
            )}
          </div>

          <div className="space-y-2.5">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {item.resultUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.resultUrl}
                      alt="Preview"
                      className="h-12 w-12 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                      <ImageIcon className="h-5 w-5" />
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate max-w-xs sm:max-w-md">
                      {item.originalFile.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span>{formatFileSize(item.originalSize)}</span>
                      {item.resultSize && (
                        <>
                          <ArrowRight className="h-3 w-3 text-slate-300" />
                          <span className="font-semibold text-emerald-600">
                            {formatFileSize(item.resultSize)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {item.status === "converting" && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-blue-600">
                      <Loader2 className="h-4 w-4 animate-spin" /> Converting...
                    </span>
                  )}

                  {item.status === "error" && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-rose-600">
                      <AlertCircle className="h-4 w-4" /> {item.errorMessage || "Failed"}
                    </span>
                  )}

                  {item.status === "done" && (
                    <button
                      onClick={() => handleDownloadSingle(item)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold transition-colors"
                    >
                      <Download className="h-3.5 w-3.5" /> Download
                    </button>
                  )}

                  <button
                    onClick={() => handleRemove(item.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-slate-50"
                    title="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
