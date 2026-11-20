"use client";

import React, { useState } from "react";
import {
  Repeat,
  Copy,
  Check,
  Download,
  Trash2,
  Sparkles,
  Sliders,
  CheckCircle2,
  ListOrdered
} from "lucide-react";

export function TextRepeater() {
  const [inputText, setInputText] = useState("Sorry 🥺");
  const [repeatCount, setRepeatCount] = useState<number>(100);
  const [separator, setSeparator] = useState<"newline" | "space" | "comma" | "custom">("newline");
  const [customSeparator, setCustomSeparator] = useState(" | ");
  const [addNumbering, setAddNumbering] = useState(false);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const PRESETS = [
    "Sorry 🥺",
    "I am truly sorry 🙏",
    "I love you ❤️",
    "Happy Birthday! 🎉",
    "Thank you so much! ✨",
    "Reminder: Drink Water 💧",
  ];

  const handleGenerate = () => {
    if (!inputText) {
      setOutput("");
      return;
    }

    const count = Math.min(Math.max(1, repeatCount), 10000);
    let sep = "\n";
    if (separator === "space") sep = " ";
    if (separator === "comma") sep = ", ";
    if (separator === "custom") sep = customSeparator;

    const items: string[] = [];
    for (let i = 1; i <= count; i++) {
      if (addNumbering) {
        items.push(`${i}. ${inputText}`);
      } else {
        items.push(inputText);
      }
    }

    setOutput(items.join(sep));
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `repeated-text-${repeatCount}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalChars = output.length;
  const totalLines = output ? output.split("\n").length : 0;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Configuration Panel (Left side) */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-5">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">
                1. Text to Repeat
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text (e.g. Sorry, I love you)..."
                rows={3}
                className="w-full rounded-2xl border border-slate-200 p-3 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all resize-none"
              />
              {/* Quick Preset Pills */}
              <div className="mt-2 flex flex-wrap gap-1.5">
                {PRESETS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setInputText(p)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-[11px] text-slate-600 transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  2. Repetition Count
                </label>
                <span className="text-xs font-bold font-mono text-blue-600">
                  {repeatCount} times
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={10000}
                  value={repeatCount}
                  onChange={(e) => setRepeatCount(Math.min(10000, Math.max(1, Number(e.target.value))))}
                  className="w-28 px-3 py-2 border border-slate-200 rounded-xl text-center font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <div className="flex gap-1.5">
                  {[10, 50, 100, 500, 1000].map((num) => (
                    <button
                      key={num}
                      onClick={() => setRepeatCount(num)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        repeatCount === num
                          ? "bg-blue-600 text-white shadow-2xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">
                3. Separator
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSeparator("newline")}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all ${
                    separator === "newline"
                      ? "border-blue-500 bg-blue-50/50 text-blue-700 font-semibold"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  ↵ New line
                </button>
                <button
                  onClick={() => setSeparator("space")}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all ${
                    separator === "space"
                      ? "border-blue-500 bg-blue-50/50 text-blue-700 font-semibold"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  ␣ Space
                </button>
                <button
                  onClick={() => setSeparator("comma")}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all ${
                    separator === "comma"
                      ? "border-blue-500 bg-blue-50/50 text-blue-700 font-semibold"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  , Comma & Space
                </button>
                <button
                  onClick={() => setSeparator("custom")}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all ${
                    separator === "custom"
                      ? "border-blue-500 bg-blue-50/50 text-blue-700 font-semibold"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  ⚙️ Custom
                </button>
              </div>

              {separator === "custom" && (
                <div className="mt-2.5">
                  <input
                    type="text"
                    value={customSeparator}
                    onChange={(e) => setCustomSeparator(e.target.value)}
                    placeholder="Enter custom separator (e.g. - or |)"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={addNumbering}
                  onChange={(e) => setAddNumbering(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                  <ListOrdered className="h-4 w-4 text-slate-500" />
                  Add Numbering (e.g. 1. text, 2. text)
                </span>
              </label>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={handleGenerate}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm hover:shadow transition-all"
            >
              <Repeat className="h-4 w-4" /> Generate {repeatCount} Times
            </button>
          </div>
        </div>

        {/* Output Display Panel (Right side) */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-emerald-600" /> Generated Result
              </span>
              {output && (
                <button
                  onClick={() => setOutput("")}
                  className="text-xs text-rose-600 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="h-3 w-3" /> Clear
                </button>
              )}
            </div>

            <div className="mt-4">
              <textarea
                value={output}
                readOnly
                placeholder="Click 'Generate' to see your repeated text here..."
                rows={14}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-4 font-mono text-xs sm:text-sm leading-relaxed text-slate-800 placeholder-slate-400 focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Action footer */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500 font-medium">
              {output ? (
                <span>
                  <strong className="text-slate-800">{totalChars.toLocaleString()}</strong> characters •{" "}
                  <strong className="text-slate-800">{totalLines.toLocaleString()}</strong> lines
                </span>
              ) : (
                <span>Ready to generate</span>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleCopy}
                disabled={!output}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  !output
                    ? "opacity-50 cursor-not-allowed bg-slate-100 text-slate-400"
                    : copied
                    ? "bg-emerald-600 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                }`}
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" /> Copied {repeatCount} items!
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" /> Copy All
                  </>
                )}
              </button>
              <button
                onClick={handleDownload}
                disabled={!output}
                className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-2xs transition-all ${
                  !output ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-50"
                }`}
              >
                <Download className="h-3.5 w-3.5" /> Download .txt
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
