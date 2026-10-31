"use client";

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { FileDropzone } from "@/components/tool/FileDropzone";
import { ToolSettings } from "@/components/tool/ToolSettings";
import { ErrorMessage } from "@/components/tool/ErrorMessage";
import { formatBytes } from "@/lib/utils";
import { ArrowUp, ArrowDown, Trash2, Loader2, Download, Plus, CheckCircle2 } from "lucide-react";

interface ImageItem {
  id: string;
  file: File;
  name: string;
  size: number;
  previewUrl: string;
}

export function ImageToPdf() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<"A4" | "Letter" | "Fit">("A4");
  const [orientation, setOrientation] = useState<"portrait" | "landscape" | "auto">("auto");
  const [margin, setMargin] = useState<number>(20);

  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = (files: File[]) => {
    const valid = files.filter((f) => f.type.startsWith("image/"));
    if (valid.length === 0) {
      setError("Please select valid image files (JPG, PNG, WebP).");
      return;
    }

    const items: ImageItem[] = valid.map((f) => ({
      id: Math.random().toString(36).substring(2, 9),
      file: f,
      name: f.name,
      size: f.size,
      previewUrl: URL.createObjectURL(f),
    }));

    setImages((prev) => [...prev, ...items]);
    setPdfBlob(null);
    setPdfUrl(null);
    setError(null);
  };

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const copy = [...images];
    const temp = copy[idx - 1];
    copy[idx - 1] = copy[idx];
    copy[idx] = temp;
    setImages(copy);
  };

  const moveDown = (idx: number) => {
    if (idx === images.length - 1) return;
    const copy = [...images];
    const temp = copy[idx + 1];
    copy[idx + 1] = copy[idx];
    copy[idx] = temp;
    setImages(copy);
  };

  const removeImg = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    setPdfBlob(null);
    setPdfUrl(null);
  };

  const handleConvertToPdf = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);
    setError(null);

    try {
      const pdfDoc = await PDFDocument.create();

      for (const item of images) {
        // Read file as arrayBuffer
        const arrayBuffer = await item.file.arrayBuffer();

        // Canvas convert to standard JPG buffer if webp or to ensure compatible mime
        let imageBytes: Uint8Array;
        let isPng = item.file.type === "image/png";

        if (item.file.type === "image/webp" || (!isPng && item.file.type !== "image/jpeg")) {
          // Convert to JPEG blob using canvas
          const imgEl = new Image();
          const objUrl = URL.createObjectURL(item.file);
          await new Promise<void>((resolve) => {
            imgEl.onload = () => resolve();
            imgEl.src = objUrl;
          });
          const canvas = document.createElement("canvas");
          canvas.width = imgEl.width;
          canvas.height = imgEl.height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(imgEl, 0, 0);
          const blob = await new Promise<Blob>((resolve) =>
            canvas.toBlob((b) => resolve(b!), "image/jpeg", 0.92)
          );
          URL.revokeObjectURL(objUrl);
          imageBytes = new Uint8Array(await blob.arrayBuffer());
          isPng = false;
        } else {
          imageBytes = new Uint8Array(arrayBuffer);
        }

        const embeddedImage = isPng
          ? await pdfDoc.embedPng(imageBytes)
          : await pdfDoc.embedJpg(imageBytes);

        const imgWidth = embeddedImage.width;
        const imgHeight = embeddedImage.height;

        let pageWidth = 595.28; // Standard A4 points
        let pageHeight = 841.89;

        if (pageSize === "Letter") {
          pageWidth = 612;
          pageHeight = 792;
        } else if (pageSize === "Fit") {
          pageWidth = imgWidth + margin * 2;
          pageHeight = imgHeight + margin * 2;
        }

        if (orientation === "landscape" || (orientation === "auto" && imgWidth > imgHeight && pageSize !== "Fit")) {
          const temp = pageWidth;
          pageWidth = pageHeight;
          pageHeight = temp;
        }

        const page = pdfDoc.addPage([pageWidth, pageHeight]);

        // Calculate scaled dimensions fitting within margins
        const maxW = pageWidth - margin * 2;
        const maxH = pageHeight - margin * 2;
        const scale = Math.min(maxW / imgWidth, maxH / imgHeight, 1);

        const scaledW = imgWidth * scale;
        const scaledH = imgHeight * scale;

        const posX = (pageWidth - scaledW) / 2;
        const posY = (pageHeight - scaledH) / 2;

        page.drawImage(embeddedImage, {
          x: posX,
          y: posY,
          width: scaledW,
          height: scaledH,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setPdfBlob(blob);
      setPdfUrl(url);
      setIsProcessing(false);
    } catch {
      setError("Failed to generate PDF from images. Please check file integrity.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-6">
      <FileDropzone
        onFilesSelected={handleFiles}
        accept="image/jpeg,image/png,image/webp"
        multiple={true}
        label="Drop images here to convert to PDF"
        hint="Combine JPG, PNG, and WebP photos into a clean single PDF."
      />

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      {images.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Images List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Selected Photos ({images.length})
              </h3>
              <button
                onClick={() => setImages([])}
                className="text-xs text-slate-400 hover:text-red-600"
              >
                Clear all
              </button>
            </div>

            <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
              {images.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 gap-3 hover:bg-slate-50/60"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-xs font-semibold text-slate-500">
                      {idx + 1}
                    </span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.previewUrl}
                      alt={item.name}
                      className="h-10 w-10 rounded-lg object-cover border border-slate-200 shrink-0"
                    />
                    <div className="truncate min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-slate-400">{formatBytes(item.size)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => moveUp(idx)}
                      disabled={idx === 0}
                      className="p-1 rounded text-slate-400 hover:bg-slate-100 disabled:opacity-30"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => moveDown(idx)}
                      disabled={idx === images.length - 1}
                      className="p-1 rounded text-slate-400 hover:bg-slate-100 disabled:opacity-30"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => removeImg(item.id)}
                      className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Settings & Output */}
          <div className="lg:col-span-5 space-y-4">
            <ToolSettings title="PDF Layout Settings">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Page Size
                </label>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value as "A4" | "Letter" | "Fit")}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-800 focus:bg-white"
                >
                  <option value="A4">Standard A4</option>
                  <option value="Letter">US Letter</option>
                  <option value="Fit">Fit to Image Size</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Orientation
                </label>
                <select
                  value={orientation}
                  onChange={(e) => setOrientation(e.target.value as "auto" | "portrait" | "landscape")}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-800 focus:bg-white"
                >
                  <option value="auto">Auto (Match Image)</option>
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Margin ({margin}px)
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={margin}
                  onChange={(e) => setMargin(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleConvertToPdf}
                  disabled={isProcessing}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Compiling PDF...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" /> Generate PDF ({images.length} Pages)
                    </>
                  )}
                </button>
              </div>
            </ToolSettings>

            {pdfUrl && pdfBlob && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/30 p-5 text-center space-y-3">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 mx-auto" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">PDF Ready!</h4>
                  <p className="text-xs text-slate-500">Size: {formatBytes(pdfBlob.size)}</p>
                </div>
                <a
                  href={pdfUrl}
                  download="quickkit-photos.pdf"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700"
                >
                  <Download className="h-4 w-4" /> Download Created PDF
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

