"use client";

import React, { useState } from "react";
import {
  Copy,
  Check,
  Download,
  Trash2,
  Sparkles,
  AlignLeft,
  ArrowUpDown,
  FileText
} from "lucide-react";

export function CaseConverter() {
  const [text, setText] = useState<string>(
    "QuickKit is a fast, free, and privacy-first toolkit. Transform your text formats effortlessly!"
  );
  const [copied, setCopied] = useState(false);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;
  const lineCount = text ? text.split("\n").length : 0;

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!text) return;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted-text.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setText("");
  };

  // Transformation functions
  const toUpperCase = () => setText(text.toUpperCase());
  const toLowerCase = () => setText(text.toLowerCase());

  const toSentenceCase = () => {
    const res = text
      .toLowerCase()
      .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
    setText(res);
  };

  const toTitleCase = () => {
    const res = text
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    setText(res);
  };

  const toCamelCase = () => {
    const res = text
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
    setText(res);
  };

  const toPascalCase = () => {
    const camel = text
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
    setText(camel.charAt(0).toUpperCase() + camel.slice(1));
  };

  const toSnakeCase = () => {
    const res = text
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_]/g, "");
    setText(res);
  };

  const toKebabCase = () => {
    const res = text
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9-]/g, "");
    setText(res);
  };

  const toConstantCase = () => {
    const res = text
      .trim()
      .toUpperCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_]/g, "");
    setText(res);
  };

  const toAlternatingCase = () => {
    let res = "";
    for (let i = 0; i < text.length; i++) {
      res += i % 2 === 0 ? text[i].toLowerCase() : text[i].toUpperCase();
    }
    setText(res);
  };

  const toInverseCase = () => {
    let res = "";
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      res += c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase();
    }
    setText(res);
  };

  const toReverseText = () => {
    setText(text.split("").reverse().join(""));
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      {/* Transformation action pills */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-blue-600" /> Choose Case Transformation
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setText("The quick brown fox jumps over the lazy dog.")}
              className="text-xs text-blue-600 hover:underline"
            >
              Load Sample
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={handleClear}
              className="text-xs text-rose-600 hover:underline flex items-center gap-1"
            >
              <Trash2 className="h-3 w-3" /> Clear
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={toSentenceCase}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all"
          >
            Sentence case
          </button>
          <button
            onClick={toLowerCase}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all"
          >
            lower case
          </button>
          <button
            onClick={toUpperCase}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all"
          >
            UPPER CASE
          </button>
          <button
            onClick={toTitleCase}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all"
          >
            Title Case
          </button>
          <button
            onClick={toCamelCase}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all font-mono"
          >
            camelCase
          </button>
          <button
            onClick={toPascalCase}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all font-mono"
          >
            PascalCase
          </button>
          <button
            onClick={toSnakeCase}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all font-mono"
          >
            snake_case
          </button>
          <button
            onClick={toKebabCase}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all font-mono"
          >
            kebab-case
          </button>
          <button
            onClick={toConstantCase}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all font-mono"
          >
            CONSTANT_CASE
          </button>
          <button
            onClick={toAlternatingCase}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all"
          >
            aLtErNaTiNg
          </button>
          <button
            onClick={toInverseCase}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all"
          >
            iNVERSE cASE
          </button>
          <button
            onClick={toReverseText}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all"
          >
            Reverse Text
          </button>
        </div>

        {/* Text Area */}
        <div className="mt-5 relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
            placeholder="Type or paste your text here to convert..."
            className="w-full rounded-2xl border border-slate-200 p-4 font-mono text-sm leading-relaxed text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all resize-y"
          />
        </div>

        {/* Live Statistics & Export Action Bar */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
            <span>
              Characters: <strong className="text-slate-800">{charCount}</strong>
            </span>
            <span>•</span>
            <span>
              Words: <strong className="text-slate-800">{wordCount}</strong>
            </span>
            <span>•</span>
            <span>
              Lines: <strong className="text-slate-800">{lineCount}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopy}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                copied
                  ? "bg-emerald-600 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
              }`}
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" /> Copy Text
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition-all"
              title="Download as .txt"
            >
              <Download className="h-3.5 w-3.5" /> Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
