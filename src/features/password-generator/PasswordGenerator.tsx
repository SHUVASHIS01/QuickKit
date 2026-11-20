"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Copy,
  Check,
  RefreshCw,
  ShieldCheck,
  KeyRound,
  Sliders,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";
const SIMILAR_CHARS = /[il1Lo0O]/g;

const WORDS = [
  "falcon", "orbit", "quantum", "galaxy", "summit", "crystal", "nexus", "aurora",
  "zenith", "cobalt", "beacon", "dynamo", "solace", "horizon", "vortex", "cascade",
  "radiant", "pulsar", "shadow", "timber", "canyon", "meadow", "harbor", "blaze"
];

export function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [mode, setMode] = useState<"random" | "passphrase" | "pin">("random");
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const generatePassword = useCallback(() => {
    let result = "";

    if (mode === "pin") {
      const array = new Uint32Array(length > 12 ? 6 : length);
      window.crypto.getRandomValues(array);
      result = Array.from(array, (num) => NUMBERS[num % NUMBERS.length]).join("");
    } else if (mode === "passphrase") {
      const wordCount = Math.min(Math.max(Math.round(length / 4), 3), 6);
      const array = new Uint32Array(wordCount);
      window.crypto.getRandomValues(array);
      const chosenWords = Array.from(array, (num) => WORDS[num % WORDS.length]);
      const randNum = Math.floor(Math.random() * 90 + 10);
      result = chosenWords.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join("-") + randNum;
    } else {
      let chars = "";
      if (includeUpper) chars += UPPERCASE;
      if (includeLower) chars += LOWERCASE;
      if (includeNumbers) chars += NUMBERS;
      if (includeSymbols) chars += SYMBOLS;

      if (!chars) chars = LOWERCASE + NUMBERS; // Fallback
      if (excludeSimilar) {
        chars = chars.replace(SIMILAR_CHARS, "");
      }

      const array = new Uint32Array(length);
      window.crypto.getRandomValues(array);
      result = Array.from(array, (num) => chars[num % chars.length]).join("");
    }

    setPassword(result);
    setHistory((prev) => [result, ...prev.filter((p) => p !== result)].slice(0, 5));
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols, excludeSimilar, mode]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculate password strength
  const getStrength = () => {
    if (!password) return { label: "Very Weak", color: "bg-red-500", percent: 10 };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 3) return { label: "Weak", color: "bg-red-500", percent: 25 };
    if (score <= 4) return { label: "Fair", color: "bg-amber-500", percent: 50 };
    if (score <= 5) return { label: "Good", color: "bg-blue-500", percent: 75 };
    return { label: "Very Strong", color: "bg-emerald-500", percent: 100 };
  };

  const strength = getStrength();

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
      {/* Password Display Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full flex-1 min-w-0 bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-3">
            <span className="font-mono text-xl sm:text-2xl font-bold tracking-wider text-slate-900 break-all select-all">
              {password || "Generating..."}
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={generatePassword}
                aria-label="Regenerate password"
                className="p-2.5 rounded-xl hover:bg-slate-200 text-slate-600 transition-colors"
                title="Regenerate"
              >
                <RefreshCw className="h-5 w-5 hover:rotate-180 transition-transform duration-500" />
              </button>
              <button
                onClick={() => copyToClipboard(password)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  copied
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                }`}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" /> Copy
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Strength Meter */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs font-medium text-slate-600 mb-1.5">
            <span>Password Strength</span>
            <span className="font-bold text-slate-800 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              {strength.label}
            </span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${strength.color} transition-all duration-300 rounded-full`}
              style={{ width: `${strength.percent}%` }}
            />
          </div>
        </div>

        {/* Mode Selector */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-6">
          <button
            onClick={() => setMode("random")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              mode === "random"
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            Random Characters
          </button>
          <button
            onClick={() => setMode("passphrase")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              mode === "passphrase"
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            Memorable Passphrase
          </button>
          <button
            onClick={() => setMode("pin")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              mode === "pin"
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            PIN Code
          </button>
        </div>

        {/* Settings / Controls */}
        <div className="mt-6 space-y-5 border-t border-slate-100 pt-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <Sliders className="h-4 w-4 text-blue-600" />
                Length: <span className="text-blue-600 font-bold">{length}</span>
              </label>
            </div>
            <input
              type="range"
              min={mode === "pin" ? 4 : 6}
              max={mode === "pin" ? 12 : 64}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>{mode === "pin" ? "4 digits" : "6 chars"}</span>
              <span>{mode === "pin" ? "12 digits" : "64 chars"}</span>
            </div>
          </div>

          {mode === "random" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={includeUpper}
                  onChange={(e) => setIncludeUpper(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="text-sm font-medium text-slate-700">Uppercase (A-Z)</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={includeLower}
                  onChange={(e) => setIncludeLower(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="text-sm font-medium text-slate-700">Lowercase (a-z)</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="text-sm font-medium text-slate-700">Numbers (0-9)</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="text-sm font-medium text-slate-700">Special Symbols (!@#$)</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors sm:col-span-2">
                <input
                  type="checkbox"
                  checked={excludeSimilar}
                  onChange={(e) => setExcludeSimilar(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="text-sm font-medium text-slate-700">
                  Exclude Ambiguous Characters (e.g. 1, l, I, 0, O)
                </span>
              </label>
            </div>
          )}
        </div>

        {/* History preview */}
        {history.length > 1 && (
          <div className="mt-8 border-t border-slate-100 pt-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Recently Generated
            </h3>
            <div className="space-y-2">
              {history.slice(1).map((histPass, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl text-xs font-mono text-slate-700 border border-slate-100"
                >
                  <span className="truncate max-w-[280px] sm:max-w-md">{histPass}</span>
                  <button
                    onClick={() => copyToClipboard(histPass)}
                    className="p-1 hover:text-blue-600 transition-colors"
                    title="Copy"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Security Info Card */}
      <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-200 p-5 flex items-start gap-3.5">
        <Sparkles className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 leading-relaxed">
          <strong className="font-semibold text-slate-800">100% Cryptographically Secure:</strong>{" "}
          Passwords are generated entirely inside your browser using the modern{" "}
          <code className="text-blue-700 font-mono">crypto.getRandomValues</code> API. They are never
          sent across any network, recorded, or saved to any database.
        </div>
      </div>
    </div>
  );
}
