"use client";

import React, { useState } from "react";
import { DownloadCloud, ExternalLink, Loader2, Play, Image as ImageIcon, Check } from "lucide-react";
import { ErrorMessage } from "@/components/tool/ErrorMessage";

interface ExtractedMedia {
  title: string;
  mediaType: "image" | "video";
  mediaUrl: string;
  thumbnail: string;
}

export function PinterestDownloader() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ExtractedMedia | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const getCleanFilename = (item: ExtractedMedia) => {
    const ext = item.mediaType === "video" ? "mp4" : "jpg";
    const cleanTitle =
      item.title
        .replace(/[^a-zA-Z0-9_\-\s]/g, "")
        .trim()
        .replace(/\s+/g, "_")
        .substring(0, 32) || "pinterest_media";
    return `${cleanTitle}.${ext}`;
  };

  const handleDownload = async () => {
    if (!result) return;
    setIsDownloading(true);

    try {
      const filename = getCleanFilename(result);
      const downloadEndpoint = `/api/pinterest/download?url=${encodeURIComponent(
        result.mediaUrl
      )}&filename=${encodeURIComponent(filename)}`;

      const res = await fetch(downloadEndpoint);
      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      // Direct anchor click fallback
      const filename = getCleanFilename(result);
      const fallbackUrl = `/api/pinterest/download?url=${encodeURIComponent(
        result.mediaUrl
      )}&filename=${encodeURIComponent(filename)}`;
      const link = document.createElement("a");
      link.href = fallbackUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleExtract = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!url.trim()) {
      setError("Please paste a Pinterest URL first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/pinterest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to download media from this pin.");
        setIsLoading(false);
        return;
      }

      setResult({
        title: data.title,
        mediaType: data.mediaType,
        mediaUrl: data.mediaUrl,
        thumbnail: data.thumbnail,
      });
      setIsLoading(false);
    } catch {
      setError("Network error while trying to fetch Pinterest media.");
      setIsLoading(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
      }
    } catch {
      // ignore clipboard error
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="space-y-6">
        {/* URL Input Form */}
        <form onSubmit={handleExtract} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
          <label className="block text-sm font-semibold text-slate-900">
            Paste Pinterest Pin Link
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://pinterest.com/pin/... or https://pin.it/..."
                className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handlePaste}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Paste
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading || !url.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 transition-colors shrink-0"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Fetching...
                </>
              ) : (
                <>
                  <DownloadCloud className="h-4 w-4" /> Fetch Media
                </>
              )}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span>Examples:</span>
            <button
              type="button"
              onClick={() => {
                setUrl("https://www.pinterest.com/pin/180144053835687522/");
              }}
              className="text-blue-600 hover:underline"
            >
              Sample Pin
            </button>
          </div>
        </form>

        {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center p-12 rounded-2xl border border-slate-200 bg-slate-50/50 text-center space-y-3">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            <p className="text-sm font-semibold text-slate-800">
              Analyzing Pinterest metadata...
            </p>
            <p className="text-xs text-slate-400">
              Resolving highest resolution image and direct video stream.
            </p>
          </div>
        )}

        {/* Extracted Result */}
        {result && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                {result.mediaType === "video" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-700 border border-purple-200">
                    <Play className="h-3 w-3" /> Video Asset
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
                    <ImageIcon className="h-3 w-3" /> High-Res Image
                  </span>
                )}
                <span className="text-xs text-slate-400">• Ready for download</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(result.mediaUrl);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="text-xs font-medium text-slate-500 hover:text-blue-600 flex items-center gap-1"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <ExternalLink className="h-3.5 w-3.5" />}
                {copied ? "Link Copied" : "Copy Direct CDN Link"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Media Preview */}
              <div className="md:col-span-5 flex justify-center bg-slate-50 rounded-xl p-3 border border-slate-100">
                {result.mediaType === "video" ? (
                  <video
                    src={result.mediaUrl}
                    controls
                    className="max-h-72 w-full rounded-lg object-contain shadow-2xs"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={result.thumbnail}
                    alt={result.title}
                    className="max-h-72 w-full rounded-lg object-contain shadow-2xs"
                  />
                )}
              </div>

              {/* Media Info & Actions */}
              <div className="md:col-span-7 space-y-4">
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {result.title}
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed">
                  Extracted from official Pinterest CDN. Click below to download or view the original file.
                </p>

                <div className="pt-2 space-y-2.5">
                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    {isDownloading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Saving to Downloads...
                      </>
                    ) : (
                      <>
                        <DownloadCloud className="h-4 w-4" /> Download {result.mediaType === "video" ? "Video (MP4)" : "Original Image"}
                      </>
                    )}
                  </button>

                  <a
                    href={result.mediaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> Open in New Tab
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

