"use client";

import React, { useState, useMemo } from "react";
import { Search, Sparkles, Shield, Zap, Lock, ChevronDown, CheckCircle2 } from "lucide-react";
import { ToolItem, CategoryInfo } from "@/types";
import { ToolCard } from "@/components/tool/ToolCard";
import { SITE_CONFIG } from "@/config/site";

interface MinimalHomeProps {
  allTools: ToolItem[];
  categories: CategoryInfo[];
}

export function MinimalHome({ allTools, categories }: MinimalHomeProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filteredTools = useMemo(() => {
    const cleanSearch = search.trim().toLowerCase();

    return allTools.filter((tool) => {
      let matchesCat = true;
      if (selectedCategory === "popular") {
        matchesCat = Boolean(tool.popular);
      } else if (selectedCategory !== "all") {
        matchesCat = tool.category === selectedCategory;
      }

      if (!matchesCat) return false;
      if (!cleanSearch) return true;

      return (
        tool.name.toLowerCase().includes(cleanSearch) ||
        tool.shortDescription.toLowerCase().includes(cleanSearch) ||
        tool.tags.some((tag) => tag.toLowerCase().includes(cleanSearch))
      );
    });
  }, [allTools, search, selectedCategory]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* 1. COMPACT TOP HEADER & SEARCH ZONE (Above the fold) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700 mb-1.5 border border-blue-100">
              <span className="flex h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
              100% Free • In-Browser Processing • Zero Signups
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Fast, minimal <span className="text-blue-600">online tools</span>.
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Everything you need. Nothing you don&apos;t.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-4 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <Shield className="h-3.5 w-3.5 text-emerald-600" /> Private
            </span>
            <span className="inline-flex items-center gap-1">
              <Zap className="h-3.5 w-3.5 text-amber-500" /> Instant
            </span>
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" /> {allTools.length} Live Tools
            </span>
          </div>
        </div>

        {/* COMPACT SEARCH & CATEGORY CHIPS */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by tool name or function (e.g. compress, qr, json, pdf)..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-12 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:border-blue-500 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-slate-400 hover:text-slate-700 bg-slate-200/60 rounded px-1.5 py-0.5"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none shrink-0">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All ({allTools.length})
            </button>

            <button
              onClick={() => setSelectedCategory("popular")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer ${
                selectedCategory === "popular"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Sparkles className="h-3 w-3" /> Popular
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat.name.replace(" Tools", "").replace(" Suite", "")}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. IMMEDIATE TOOLS GRID (Visible right away) */}
      <section id="tools">
        <div className="flex items-center justify-between mb-3 text-xs text-slate-500 font-medium">
          <span>
            {selectedCategory === "all"
              ? "All Utilities"
              : selectedCategory === "popular"
              ? "Popular Utilities"
              : `${categories.find((c) => c.id === selectedCategory)?.name || "Tools"}`}
            {" "}({filteredTools.length})
          </span>
          {(search || selectedCategory !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("all");
              }}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Show all tools
            </button>
          )}
        </div>

        {filteredTools.length === 0 ? (
          <div className="py-12 text-center rounded-2xl border border-dashed border-slate-200 bg-white">
            <p className="text-sm font-semibold text-slate-700">No tools found matching &quot;{search}&quot;</p>
            <p className="text-xs text-slate-400 mt-1">Try another keyword or reset filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}
      </section>

      {/* 3. MINIMAL 4-PILLAR VALUE STRIP */}
      <section className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 shrink-0 border border-emerald-100">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">100% Client-Side</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                Files stay in your device memory. Zero cloud storage.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 shrink-0 border border-amber-100">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Instant Execution</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                Powered by modern Canvas, WebAssembly &amp; Workers.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 shrink-0 border border-blue-100">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Forever Free</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                No credit cards, limits, or surprise paywalls.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600 shrink-0 border border-purple-100">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Zero Signup Friction</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                No accounts or emails required. Open and work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. COMPACT FAQ ACCORDION */}
      <section id="faq" className="pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900">Frequently Asked Questions</h3>
          <span className="text-xs text-slate-400">Everything you need to know</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SITE_CONFIG.faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="rounded-xl border border-slate-200/80 bg-white p-3.5 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="flex w-full items-center justify-between text-left text-xs font-semibold text-slate-900 hover:text-blue-600 cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-slate-400 transition-transform ${
                      isOpen ? "rotate-180 text-blue-600" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-2">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
