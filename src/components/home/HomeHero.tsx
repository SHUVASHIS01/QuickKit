"use client";

import React, { useState } from "react";
import { Search, Sparkles, Shield, Zap } from "lucide-react";
import { ToolItem } from "@/types";
import { ToolCard } from "@/components/tool/ToolCard";
import { CATEGORIES } from "@/config/tools";

interface HomeHeroProps {
  allTools: ToolItem[];
}

export function HomeHero({ allTools }: HomeHeroProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredTools = allTools.filter((tool) => {
    const matchesCategory =
      selectedCategory === "all" || tool.category === selectedCategory;
    const cleanSearch = search.trim().toLowerCase();
    if (!cleanSearch) return matchesCategory;

    const matchesSearch =
      tool.name.toLowerCase().includes(cleanSearch) ||
      tool.description.toLowerCase().includes(cleanSearch) ||
      tool.tags.some((tag) => tag.toLowerCase().includes(cleanSearch));

    return matchesCategory && matchesSearch;
  });

  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-slate-200/80 bg-gradient-to-b from-slate-50/70 via-white to-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Tagline & Headline */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/60 px-3.5 py-1 text-xs font-semibold text-blue-700 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Everything you need. Nothing you don&apos;t.</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Free, fast & minimal <br className="hidden sm:inline" />
            <span className="text-blue-600">online tools</span> platform.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Process images, PDFs, developer snippets, and media directly in your browser. No mandatory signups, no watermarks, and no servers reading your private data.
          </p>

          {/* Quick value badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-slate-500 font-medium">
            <span className="inline-flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-emerald-600" />
              100% Client-Side Privacy
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-amber-500" />
              Instant Processing
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-blue-600" />
              Forever Free
            </span>
          </div>
        </div>

        {/* Live Search Bar & Category Filters */}
        <div className="mt-10 max-w-2xl mx-auto space-y-4">
          <div className="relative rounded-2xl border border-slate-300/80 bg-white p-2 shadow-md transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
            <div className="flex items-center gap-3 px-3">
              <Search className="h-5 w-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tools (e.g. compress image, qr code, json, pdf)..."
                className="w-full bg-transparent text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-hidden py-1.5"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="rounded-lg px-2 py-1 text-xs text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none justify-start sm:justify-center">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`rounded-full px-3.5 py-1 text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === "all"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All Tools ({allTools.length})
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-full px-3.5 py-1 text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Live Search Results (if searching or filtering) */}
        {(search || selectedCategory !== "all") && (
          <div className="mt-10">
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-2">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Found {filteredTools.length} {filteredTools.length === 1 ? "tool" : "tools"}
              </h2>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("all");
                }}
                className="text-xs text-blue-600 hover:underline font-medium"
              >
                Reset filters
              </button>
            </div>

            {filteredTools.length === 0 ? (
              <div className="py-12 text-center rounded-2xl border border-dashed border-slate-200 bg-white">
                <p className="text-sm font-semibold text-slate-700">No tools match your search.</p>
                <p className="text-xs text-slate-400 mt-1">Try searching for keywords like &apos;image&apos;, &apos;pdf&apos;, &apos;qr&apos;, or &apos;json&apos;.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

