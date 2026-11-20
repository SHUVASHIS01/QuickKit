"use client";

import React, { useState } from "react";
import { Percent, ArrowRight, Copy, Check, RotateCcw, Calculator, Sparkles } from "lucide-react";

export function PercentageCalculator() {
  // Mode 1: What is X% of Y?
  const [val1A, setVal1A] = useState<string>("15");
  const [val1B, setVal1B] = useState<string>("240");

  // Mode 2: X is what percent of Y?
  const [val2A, setVal2A] = useState<string>("45");
  const [val2B, setVal2B] = useState<string>("180");

  // Mode 3: Percentage Change from X to Y
  const [val3A, setVal3A] = useState<string>("120");
  const [val3B, setVal3B] = useState<string>("150");

  // Mode 4: Discount (Price minus discount %)
  const [price, setPrice] = useState<string>("80");
  const [discountPercent, setDiscountPercent] = useState<string>("25");

  // Mode 5: Tax / Markup (Price + Tax %)
  const [basePrice, setBasePrice] = useState<string>("100");
  const [taxPercent, setTaxPercent] = useState<string>("15");

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Calculations
  const res1 = (() => {
    const p = parseFloat(val1A);
    const v = parseFloat(val1B);
    if (isNaN(p) || isNaN(v)) return null;
    return ((p / 100) * v).toFixed(2).replace(/\.00$/, "");
  })();

  const res2 = (() => {
    const a = parseFloat(val2A);
    const b = parseFloat(val2B);
    if (isNaN(a) || isNaN(b) || b === 0) return null;
    return ((a / b) * 100).toFixed(2).replace(/\.00$/, "");
  })();

  const res3 = (() => {
    const from = parseFloat(val3A);
    const to = parseFloat(val3B);
    if (isNaN(from) || isNaN(to) || from === 0) return null;
    const diff = to - from;
    const pct = ((diff / from) * 100).toFixed(2).replace(/\.00$/, "");
    const isIncrease = diff >= 0;
    return { pct, isIncrease, diff: diff.toFixed(2).replace(/\.00$/, "") };
  })();

  const resDiscount = (() => {
    const p = parseFloat(price);
    const d = parseFloat(discountPercent);
    if (isNaN(p) || isNaN(d)) return null;
    const saved = (p * (d / 100));
    const final = (p - saved);
    return {
      final: final.toFixed(2).replace(/\.00$/, ""),
      saved: saved.toFixed(2).replace(/\.00$/, "")
    };
  })();

  const resTax = (() => {
    const p = parseFloat(basePrice);
    const t = parseFloat(taxPercent);
    if (isNaN(p) || isNaN(t)) return null;
    const added = (p * (t / 100));
    const final = (p + added);
    return {
      final: final.toFixed(2).replace(/\.00$/, ""),
      added: added.toFixed(2).replace(/\.00$/, "")
    };
  })();

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: What is X% of Y? */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                <Percent className="h-4 w-4 text-blue-600" /> What is X% of Y?
              </h3>
              <span className="text-[11px] font-mono text-slate-400">Basic %</span>
            </div>
            <div className="mt-4 flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
              <span className="text-sm font-medium text-slate-500">What is</span>
              <input
                type="number"
                value={val1A}
                onChange={(e) => setVal1A(e.target.value)}
                placeholder="15"
                className="w-20 px-3 py-2 border border-slate-200 rounded-xl text-center font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <span className="text-sm font-medium text-slate-500">% of</span>
              <input
                type="number"
                value={val1B}
                onChange={(e) => setVal1B(e.target.value)}
                placeholder="240"
                className="w-28 px-3 py-2 border border-slate-200 rounded-xl text-center font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between bg-blue-50/50 rounded-2xl p-4">
            <div>
              <span className="text-xs text-slate-500 block">Result</span>
              <span className="text-2xl font-bold font-mono text-blue-700">
                {res1 !== null ? res1 : "—"}
              </span>
            </div>
            {res1 !== null && (
              <button
                onClick={() => handleCopy(res1, "c1")}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 shadow-2xs transition-all"
                title="Copy Result"
              >
                {copiedKey === "c1" ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Card 2: X is what % of Y? */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                <Calculator className="h-4 w-4 text-indigo-600" /> X is what % of Y?
              </h3>
              <span className="text-[11px] font-mono text-slate-400">Ratio</span>
            </div>
            <div className="mt-4 flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
              <input
                type="number"
                value={val2A}
                onChange={(e) => setVal2A(e.target.value)}
                placeholder="45"
                className="w-24 px-3 py-2 border border-slate-200 rounded-xl text-center font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              <span className="text-sm font-medium text-slate-500">is what % of</span>
              <input
                type="number"
                value={val2B}
                onChange={(e) => setVal2B(e.target.value)}
                placeholder="180"
                className="w-28 px-3 py-2 border border-slate-200 rounded-xl text-center font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between bg-indigo-50/50 rounded-2xl p-4">
            <div>
              <span className="text-xs text-slate-500 block">Result</span>
              <span className="text-2xl font-bold font-mono text-indigo-700">
                {res2 !== null ? `${res2}%` : "—"}
              </span>
            </div>
            {res2 !== null && (
              <button
                onClick={() => handleCopy(`${res2}%`, "c2")}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 shadow-2xs transition-all"
                title="Copy Result"
              >
                {copiedKey === "c2" ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Card 3: Percentage Change (Increase / Decrease) */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-emerald-600" /> Percentage Increase / Decrease
              </h3>
              <span className="text-[11px] font-mono text-slate-400">Change</span>
            </div>
            <div className="mt-4 flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
              <span className="text-sm font-medium text-slate-500">From</span>
              <input
                type="number"
                value={val3A}
                onChange={(e) => setVal3A(e.target.value)}
                placeholder="120"
                className="w-24 px-3 py-2 border border-slate-200 rounded-xl text-center font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              <span className="text-sm font-medium text-slate-500">to</span>
              <input
                type="number"
                value={val3B}
                onChange={(e) => setVal3B(e.target.value)}
                placeholder="150"
                className="w-24 px-3 py-2 border border-slate-200 rounded-xl text-center font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between bg-emerald-50/50 rounded-2xl p-4">
            <div>
              <span className="text-xs text-slate-500 block">
                {res3 ? (res3.isIncrease ? "Increase" : "Decrease") : "Result"}
              </span>
              <span className={`text-2xl font-bold font-mono ${res3?.isIncrease ? "text-emerald-700" : "text-rose-700"}`}>
                {res3 !== null ? `${res3.isIncrease ? "+" : ""}${res3.pct}%` : "—"}
              </span>
            </div>
            {res3 !== null && (
              <button
                onClick={() => handleCopy(`${res3.isIncrease ? "+" : ""}${res3.pct}%`, "c3")}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-emerald-600 hover:border-emerald-200 shadow-2xs transition-all"
                title="Copy Result"
              >
                {copiedKey === "c3" ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Card 4: Discount Calculator */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-600" /> Discount Calculator
              </h3>
              <span className="text-[11px] font-mono text-slate-400">Sale</span>
            </div>
            <div className="mt-4 flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
              <span className="text-sm font-medium text-slate-500">Price</span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="80"
                className="w-24 px-3 py-2 border border-slate-200 rounded-xl text-center font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
              <span className="text-sm font-medium text-slate-500">with</span>
              <input
                type="number"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
                placeholder="25"
                className="w-20 px-3 py-2 border border-slate-200 rounded-xl text-center font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
              <span className="text-sm font-medium text-slate-500">% off</span>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between bg-purple-50/50 rounded-2xl p-4">
            <div>
              <span className="text-xs text-slate-500 block">Final Price (You save ${resDiscount?.saved ?? 0})</span>
              <span className="text-2xl font-bold font-mono text-purple-700">
                {resDiscount !== null ? `$${resDiscount.final}` : "—"}
              </span>
            </div>
            {resDiscount !== null && (
              <button
                onClick={() => handleCopy(resDiscount.final, "c4")}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-purple-600 hover:border-purple-200 shadow-2xs transition-all"
                title="Copy Result"
              >
                {copiedKey === "c4" ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Card 5: Tax / Markup Calculator (Full width) */}
      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
            <Calculator className="h-4 w-4 text-amber-600" /> Sales Tax / VAT / Markup Calculator
          </h3>
          <span className="text-[11px] font-mono text-slate-400">Total Price</span>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-500 shrink-0">Original Amount:</span>
            <input
              type="number"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              placeholder="100"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-center font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-500 shrink-0">+ Tax / VAT %:</span>
            <input
              type="number"
              value={taxPercent}
              onChange={(e) => setTaxPercent(e.target.value)}
              placeholder="15"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-center font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>
          <div className="flex items-center justify-between bg-amber-50/60 rounded-2xl p-3 border border-amber-100">
            <div>
              <span className="text-[11px] text-slate-500 block">Total (+ ${resTax?.added ?? 0})</span>
              <span className="text-xl font-bold font-mono text-amber-800">
                {resTax !== null ? `$${resTax.final}` : "—"}
              </span>
            </div>
            {resTax !== null && (
              <button
                onClick={() => handleCopy(resTax.final, "c5")}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-amber-600 shadow-2xs transition-all"
                title="Copy Result"
              >
                {copiedKey === "c5" ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
