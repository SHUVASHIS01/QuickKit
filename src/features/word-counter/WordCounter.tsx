"use client";

import React, { useState, useMemo } from "react";
import { Copy, Check, Trash2, Clock, Mic } from "lucide-react";

export function WordCounter() {
  const [text, setText] = useState(
    "QuickKit is a free, minimal, and privacy-first online tools platform. Process your files, images, PDFs, and code directly inside your web browser without uploading anything to remote servers. Everything you need. Nothing you don't."
  );
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const raw = text.trim();
    if (!raw) {
      return {
        words: 0,
        characters: 0,
        charactersNoSpaces: 0,
        sentences: 0,
        paragraphs: 0,
        readingTimeMinutes: 0,
        speakingTimeMinutes: 0,
      };
    }

    const words = raw.split(/\s+/).filter(Boolean).length;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s+/g, "").length;
    const sentences = raw.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
    const paragraphs = raw.split(/\n+/).filter((p) => p.trim().length > 0).length;

    // Average reading speed: 200 words/min; speaking speed: 130 words/min
    const readingTimeMinutes = Math.max(0.1, Number((words / 200).toFixed(1)));
    const speakingTimeMinutes = Math.max(0.1, Number((words / 130).toFixed(1)));

    return {
      words,
      characters,
      charactersNoSpaces,
      sentences,
      paragraphs,
      readingTimeMinutes,
      speakingTimeMinutes,
    };
  }, [text]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const transformCase = (type: "upper" | "lower" | "title" | "sentence" | "clean") => {
    if (!text) return;
    if (type === "upper") {
      setText(text.toUpperCase());
    } else if (type === "lower") {
      setText(text.toLowerCase());
    } else if (type === "title") {
      setText(
        text.replace(
          /\w\S*/g,
          (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
        )
      );
    } else if (type === "sentence") {
      setText(
        text
          .toLowerCase()
          .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase())
      );
    } else if (type === "clean") {
      setText(text.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim());
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-6">
      {/* Real-time Stat Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 text-center shadow-2xs">
          <p className="text-2xl font-bold text-blue-600">{stats.words}</p>
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
            Words
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 text-center shadow-2xs">
          <p className="text-2xl font-bold text-slate-900">{stats.characters}</p>
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
            Characters
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 text-center shadow-2xs">
          <p className="text-2xl font-bold text-slate-900">{stats.charactersNoSpaces}</p>
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
            No Spaces
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 text-center shadow-2xs">
          <p className="text-2xl font-bold text-slate-900">{stats.sentences}</p>
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
            Sentences
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 text-center shadow-2xs">
          <p className="text-2xl font-bold text-slate-900">{stats.paragraphs}</p>
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
            Paragraphs
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 text-center shadow-2xs">
          <p className="text-xl font-bold text-emerald-600 flex items-center justify-center gap-1">
            <Clock className="h-4 w-4" /> {stats.readingTimeMinutes}m
          </p>
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
            Reading Time
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 text-center shadow-2xs">
          <p className="text-xl font-bold text-purple-600 flex items-center justify-center gap-1">
            <Mic className="h-4 w-4" /> {stats.speakingTimeMinutes}m
          </p>
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
            Speaking
          </p>
        </div>
      </div>

      {/* Editor & Actions */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-100 bg-slate-50/70 p-3 gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => transformCase("upper")}
              className="rounded-lg bg-white border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              UPPERCASE
            </button>
            <button
              onClick={() => transformCase("lower")}
              className="rounded-lg bg-white border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              lowercase
            </button>
            <button
              onClick={() => transformCase("title")}
              className="rounded-lg bg-white border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Title Case
            </button>
            <button
              onClick={() => transformCase("sentence")}
              className="rounded-lg bg-white border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Sentence case
            </button>
            <button
              onClick={() => transformCase("clean")}
              className="rounded-lg bg-white border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Clean Spaces
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy Text"}
            </button>

            <button
              onClick={() => setText("")}
              className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="Clear text"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Textarea */}
        <textarea
          rows={14}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or paste your content here..."
          className="w-full resize-y p-5 text-sm sm:text-base text-slate-800 placeholder:text-slate-400 focus:outline-hidden leading-relaxed"
        />
      </div>
    </div>
  );
}

