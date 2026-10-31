"use client";

import React, { useState } from "react";
import { Copy, Check, Download, RefreshCw, FileCode, CheckCircle, AlertCircle } from "lucide-react";

const SAMPLE_JSON = {
  app: "QuickKit",
  version: "1.0.0",
  tagline: "Everything you need. Nothing you don't.",
  privacyFirst: true,
  tools: [
    { name: "QR Generator", category: "developer", clientSide: true },
    { name: "JSON Formatter", category: "developer", clientSide: true },
    { name: "Image Compressor", category: "image", clientSide: true }
  ],
  stats: {
    free: true,
    limits: null,
    rating: 5.0
  }
};

export function JsonFormatter() {
  const [input, setInput] = useState(JSON.stringify(SAMPLE_JSON));
  const [indent, setIndent] = useState<2 | 4 | "tab">(2);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>("Valid JSON");
  const [copied, setCopied] = useState(false);

  const handleFormat = (indentType = indent) => {
    if (!input.trim()) {
      setError(null);
      setSuccessMsg(null);
      return;
    }
    try {
      const parsed = JSON.parse(input);
      const space = indentType === "tab" ? "\t" : indentType;
      const formatted = JSON.stringify(parsed, null, space);
      setInput(formatted);
      setError(null);
      setSuccessMsg("Formatted & Validated successfully!");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Invalid JSON format");
      }
      setSuccessMsg(null);
    }
  };

  const handleMinify = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed));
      setError(null);
      setSuccessMsg("Minified successfully (zero whitespace)!");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Invalid JSON format");
      }
      setSuccessMsg(null);
    }
  };

  const handleCopy = () => {
    if (!input) return;
    navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([input], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quickkit-formatted.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const lineCount = input.split("\n").length;
  const charCount = input.length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleFormat(indent)}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            <FileCode className="h-3.5 w-3.5" /> Prettify
          </button>

          <button
            onClick={handleMinify}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Minify
          </button>

          <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* Indent selector */}
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <span className="hidden sm:inline">Indent:</span>
            <select
              value={indent}
              onChange={(e) => {
                const val = e.target.value === "tab" ? "tab" : Number(e.target.value);
                setIndent(val as 2 | 4 | "tab");
                handleFormat(val as 2 | 4 | "tab");
              }}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-700"
            >
              <option value={2}>2 Spaces</option>
              <option value={4}>4 Spaces</option>
              <option value="tab">Tab</option>
            </select>
          </div>

          <button
            onClick={() => {
              setInput(JSON.stringify(SAMPLE_JSON, null, 2));
              setError(null);
              setSuccessMsg("Sample loaded");
            }}
            className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <RefreshCw className="h-3 w-3" /> Load Sample
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" /> Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" /> Copy
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Download className="h-3.5 w-3.5" /> Download
          </button>
        </div>
      </div>

      {/* Editor & Validation notification */}
      <div className="space-y-3">
        {error && (
          <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold">JSON Syntax Error: </strong>
              <span>{error}</span>
            </div>
          </div>
        )}

        {successMsg && !error && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/60 px-3.5 py-2 text-xs text-emerald-700">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="relative rounded-2xl border border-slate-200 bg-slate-900 text-slate-100 shadow-inner overflow-hidden font-mono text-xs sm:text-sm">
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-4 py-2 text-xs text-slate-400">
            <span>json-editor</span>
            <div className="flex items-center gap-3">
              <span>{lineCount} lines</span>
              <span>{charCount} chars</span>
            </div>
          </div>

          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              try {
                JSON.parse(e.target.value);
                setError(null);
                setSuccessMsg("Valid JSON");
              } catch (err: unknown) {
                if (err instanceof Error) {
                  setError(err.message);
                } else {
                  setError("Invalid JSON");
                }
                setSuccessMsg(null);
              }
            }}
            placeholder="Paste raw JSON here..."
            rows={18}
            className="w-full resize-y bg-transparent p-4 font-mono text-xs sm:text-sm text-emerald-300 placeholder:text-slate-600 focus:outline-hidden leading-relaxed"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}

