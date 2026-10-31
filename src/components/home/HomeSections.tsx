"use client";

import React, { useState } from "react";
import { ToolItem, CategoryInfo } from "@/types";
import { ToolCard } from "@/components/tool/ToolCard";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { SITE_CONFIG } from "@/config/site";
import { ChevronDown, ArrowRight, Sparkles, LayoutGrid } from "lucide-react";

interface HomeSectionsProps {
  popularTools: ToolItem[];
  recentTools: ToolItem[];
  categories: CategoryInfo[];
  allTools: ToolItem[];
}

export function HomeSections({
  popularTools,
  recentTools,
  categories,
  allTools,
}: HomeSectionsProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="space-y-20 sm:space-y-24 py-16">
      {/* 1. POPULAR TOOLS */}
      <section id="popular" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">
              <Sparkles className="h-3.5 w-3.5" /> Handpicked Essentials
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Popular Tools
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              The most loved, high-frequency utilities on QuickKit.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {popularTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* 2. BROWSE BY CATEGORY */}
      <section id="categories" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            <LayoutGrid className="h-3.5 w-3.5" /> Organized Library
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Browse by Category
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Find the exact tool you need organized by media type and function.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => {
            const count = allTools.filter((t) => t.category === cat.id).length;
            return (
              <div
                key={cat.id}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl border ${cat.accentColor}`}
                  >
                    <DynamicIcon name={cat.icon} className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                    {count} {count === 1 ? "tool" : "tools"}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  {cat.description}
                </p>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                  <span>Explore tools</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. WHY QUICKKIT (VALUE PROPOSITIONS) */}
      <section id="why-us" className="border-y border-slate-200/80 bg-slate-50/70 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              The QuickKit Difference
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
              Why use QuickKit?
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Built on uncompromising standards of speed, privacy, and simplicity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SITE_CONFIG.valueProps.map((prop, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs space-y-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                  <DynamicIcon name={prop.icon} className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">{prop.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {prop.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. RECENTLY ADDED TOOLS */}
      <section id="recent" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Fresh Releases
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
            Recently Added Tools
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            New tools and utilities continuously deployed to QuickKit.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {recentTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* 5. FAQ ACCORDION */}
      <section id="faq" className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Everything you need to know about our privacy, tools, and platform.
          </p>
        </div>

        <div className="space-y-3">
          {SITE_CONFIG.faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs transition-colors"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between p-4 sm:p-5 text-left font-semibold text-slate-900 hover:text-blue-600 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base">{faq.question}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${
                      isOpen ? "rotate-180 text-blue-600" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

