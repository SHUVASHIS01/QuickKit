"use client";

import React, { useState } from "react";
import QRCode from "qrcode";
import { Copy, Check, ExternalLink, Link2, QrCode as QrIcon } from "lucide-react";
import { ErrorMessage } from "@/components/tool/ErrorMessage";

interface ShortenedItem {
  id: string;
  originalUrl: string;
  shortUrl: string;
  code: string;
  createdAt: string;
}

export function UrlShortener() {
  const [url, setUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [currentResult, setCurrentResult] = useState<ShortenedItem | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [history, setHistory] = useState<ShortenedItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("quickkit_short_urls");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleShorten = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    let target = url.trim();
    if (!/^https?:\/\//i.test(target)) {
      target = `https://${target}`;
    }

    try {
      new URL(target);
    } catch {
      setError("Please enter a valid web URL.");
      return;
    }

    const code = customAlias.trim()
      ? customAlias.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "")
      : Math.random().toString(36).substring(2, 8);

    const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://quickkit.tools";
    const shortUrl = `${baseUrl}/s/${code}`;

    const newItem: ShortenedItem = {
      id: Math.random().toString(36).substring(2, 9),
      originalUrl: target,
      shortUrl,
      code,
      createdAt: new Date().toLocaleDateString(),
    };

    setCurrentResult(newItem);
    setError(null);

    // Generate QR
    QRCode.toDataURL(target, { width: 300, margin: 2 })
      .then((qr) => setQrDataUrl(qr))
      .catch(() => setQrDataUrl(""));

    const updated = [newItem, ...history.filter((h) => h.code !== code)].slice(0, 10);
    setHistory(updated);
    try {
      localStorage.setItem("quickkit_short_urls", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleCopy = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem("quickkit_short_urls");
    } catch {
      // ignore
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 space-y-8">
      {/* Shorten Form */}
      <form onSubmit={handleShorten} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-1">
            Destination URL
          </label>
          <div className="relative">
            <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/very-long-link-to-any-destination"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Custom Alias (Optional)
            </label>
            <div className="flex items-center">
              <span className="rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-400">
                /s/
              </span>
              <input
                type="text"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                placeholder="my-cool-link"
                className="w-full rounded-r-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Generate Short URL &amp; QR
            </button>
          </div>
        </div>

        {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}
      </form>

      {/* Current Result Card */}
      {currentResult && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50/30 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-100 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                Short URL Ready
              </p>
              <h3 className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                {currentResult.shortUrl}
              </h3>
              <p className="text-xs text-slate-500 truncate max-w-md mt-0.5">
                Target: {currentResult.originalUrl}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleCopy(currentResult.shortUrl)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer shadow-xs"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied Link" : "Copy Link"}
              </button>

              <a
                href={currentResult.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                title="Visit destination"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* QR preview */}
          {qrDataUrl && (
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrDataUrl}
                alt="QR Code"
                className="h-28 w-28 rounded-xl border border-slate-200 bg-white p-2 shadow-2xs"
              />
              <div className="space-y-1.5 text-center sm:text-left">
                <p className="text-xs font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-1">
                  <QrIcon className="h-3.5 w-3.5 text-blue-600" /> Paired High-Res QR Code
                </p>
                <p className="text-[11px] text-slate-500">
                  Scan with any camera to navigate directly to your link.
                </p>
                <a
                  href={qrDataUrl}
                  download={`qr-${currentResult.code}.png`}
                  className="inline-block text-xs font-semibold text-blue-600 hover:underline pt-1"
                >
                  Download QR Image (.PNG) →
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-sm font-bold text-slate-900">Recent Short Links</h4>
            <button
              onClick={clearHistory}
              className="text-xs text-slate-400 hover:text-red-600 transition-colors"
            >
              Clear History
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {history.map((item) => (
              <div
                key={item.id}
                className="py-3 flex items-center justify-between gap-4 text-xs"
              >
                <div className="truncate min-w-0">
                  <span className="font-mono font-bold text-slate-900 block truncate">
                    {item.shortUrl}
                  </span>
                  <span className="text-slate-400 truncate block mt-0.5">
                    {item.originalUrl}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleCopy(item.shortUrl)}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
                    title="Copy short link"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                  <a
                    href={item.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
                    title="Visit"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

