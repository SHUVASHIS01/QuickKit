"use client";

import React, { useState, useRef } from "react";
import { GIFEncoder, quantize, applyPalette } from "gifenc";
import { FileDropzone } from "@/components/tool/FileDropzone";
import { ToolSettings } from "@/components/tool/ToolSettings";
import { ErrorMessage } from "@/components/tool/ErrorMessage";
import { ResultPreview } from "@/components/tool/ResultPreview";
import { formatBytes } from "@/lib/utils";
import { Film, Play, RefreshCw, Loader2 } from "lucide-react";

export function VideoToGif() {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);

  const [startTime, setStartTime] = useState<number>(0);
  const [clipDuration, setClipDuration] = useState<number>(3);
  const [fps, setFps] = useState<number>(10);
  const [scaleWidth, setScaleWidth] = useState<number>(480);

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileSelect = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    const url = URL.createObjectURL(selected);

    setFile(selected);
    setVideoUrl(url);
    setResultBlob(null);
    setResultUrl(null);
    setError(null);
    setProgress(0);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration;
      setDuration(dur);
      setClipDuration(Math.min(dur, 4));
    }
  };

  const convertToGif = async () => {
    if (!videoRef.current || !file) return;

    setIsProcessing(true);
    setProgress(0);
    setError(null);

    const video = videoRef.current;
    const totalFrames = Math.max(1, Math.floor(clipDuration * fps));
    const interval = 1 / fps;

    const originalW = video.videoWidth || 640;
    const originalH = video.videoHeight || 360;
    const width = scaleWidth;
    const height = Math.round((originalH * scaleWidth) / originalW);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    if (!ctx) {
      setError("Unable to initialize canvas context.");
      setIsProcessing(false);
      return;
    }

    try {
      const gif = GIFEncoder();

      for (let i = 0; i < totalFrames; i++) {
        const currentTime = startTime + i * interval;
        if (currentTime > video.duration) break;

        // Seek video
        await new Promise<void>((resolve) => {
          const onSeeked = () => {
            video.removeEventListener("seeked", onSeeked);
            resolve();
          };
          video.addEventListener("seeked", onSeeked);
          video.currentTime = currentTime;
        });

        // Draw frame to canvas
        ctx.drawImage(video, 0, 0, width, height);
        const { data } = ctx.getImageData(0, 0, width, height);

        // Quantize colors and encode frame
        const palette = quantize(data, 256);
        const index = applyPalette(data, palette);
        gif.writeFrame(index, width, height, {
          palette,
          delay: Math.round(1000 / fps),
        });

        setProgress(Math.round(((i + 1) / totalFrames) * 100));
      }

      gif.finish();
      const bytes = gif.bytes();
      const blob = new Blob([bytes as unknown as BlobPart], { type: "image/gif" });
      const url = URL.createObjectURL(blob);

      setResultBlob(blob);
      setResultUrl(url);
      setIsProcessing(false);
    } catch {
      setError("Failed to generate GIF. Please try a shorter duration or lower resolution.");
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setFile(null);
    setVideoUrl(null);
    setResultBlob(null);
    setResultUrl(null);
    setError(null);
    setProgress(0);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {!file ? (
        <FileDropzone
          onFilesSelected={handleFileSelect}
          accept="video/mp4,video/webm,video/quicktime"
          label="Drop a video clip here to convert to GIF"
          hint="Supports MP4, WebM, and MOV formats up to 50MB."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls & Video Player */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Source Video
              </span>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 transition-colors"
              >
                <RefreshCw className="h-3 w-3" /> Change video
              </button>
            </div>

            {/* Video Preview */}
            <div className="rounded-2xl border border-slate-200 bg-black overflow-hidden shadow-2xs">
              <video
                ref={videoRef}
                src={videoUrl || undefined}
                controls
                onLoadedMetadata={handleLoadedMetadata}
                className="w-full max-h-64 object-contain"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>{file.name}</span>
              <span>{formatBytes(file.size)}</span>
            </div>

            {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

            {/* Settings */}
            <ToolSettings title="GIF Settings">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Start Offset (sec)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={Math.max(0, duration - 1)}
                    step="0.5"
                    value={startTime}
                    onChange={(e) => setStartTime(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Clip Duration (sec)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    step="0.5"
                    value={clipDuration}
                    onChange={(e) => setClipDuration(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Frame Rate (FPS)
                  </label>
                  <select
                    value={fps}
                    onChange={(e) => setFps(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-800 focus:bg-white"
                  >
                    <option value={5}>5 FPS (Compact Size)</option>
                    <option value={10}>10 FPS (Standard)</option>
                    <option value={15}>15 FPS (Smooth)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Output Width
                  </label>
                  <select
                    value={scaleWidth}
                    onChange={(e) => setScaleWidth(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-800 focus:bg-white"
                  >
                    <option value={320}>320px (Small)</option>
                    <option value={480}>480px (Medium)</option>
                    <option value={640}>640px (High Quality)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={convertToGif}
                  disabled={isProcessing}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Rendering GIF ({progress}%)...
                    </>
                  ) : (
                    <>
                      <Film className="h-4 w-4" /> Convert to GIF
                    </>
                  )}
                </button>
              </div>
            </ToolSettings>
          </div>

          {/* Result Card */}
          <div className="lg:col-span-6">
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center p-12 rounded-2xl border border-slate-200 bg-slate-50/50 text-center space-y-4 h-80">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-800">
                    Capturing & Quantizing Frames...
                  </p>
                  <p className="text-xs text-slate-500">{progress}% completed</p>
                </div>
                <div className="w-full max-w-xs bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2 transition-all duration-150"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : resultUrl && resultBlob ? (
              <ResultPreview
                title="GIF Rendered Successfully"
                originalSize={file.size}
                resultSize={resultBlob.size}
                previewUrl={resultUrl}
                downloadUrl={resultUrl}
                downloadFileName={`quickkit-${file.name.split(".")[0]}.gif`}
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-12 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-400 h-80 text-center space-y-2">
                <Play className="h-8 w-8 text-slate-300" />
                <p>Choose your duration and click Convert to GIF.</p>
                <p className="text-[11px] text-slate-400">Processed locally inside your browser.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

