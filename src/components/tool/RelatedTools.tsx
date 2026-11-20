import React from "react";
import Link from "next/link";
import { TOOLS } from "@/config/tools";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { ArrowRight } from "lucide-react";

interface RelatedToolsProps {
  currentToolId: string;
  category: string;
}

/**
 * Shows up to 4 related tools: same-category tools first, then popular cross-category tools.
 * Excludes the current tool.
 */
export function RelatedTools({ currentToolId, category }: RelatedToolsProps) {
  // Same-category tools (excluding current)
  const sameCategory = TOOLS.filter(
    (t) => t.category === category && t.id !== currentToolId
  );

  // Popular cross-category tools
  const crossCategory = TOOLS.filter(
    (t) => t.category !== category && t.popular && t.id !== currentToolId
  );

  // Take up to 3 from same category, fill remainder from cross-category
  const related = [
    ...sameCategory.slice(0, 3),
    ...crossCategory.slice(0, Math.max(0, 4 - sameCategory.slice(0, 3).length)),
  ].slice(0, 4);

  if (related.length === 0) return null;

  return (
    <section className="w-full border-t border-slate-200/80 bg-slate-50/60 py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <h2 className="mb-5 text-base font-semibold text-slate-700 tracking-tight">
          Related Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {related.map((tool) => (
            <Link
              key={tool.id}
              href={`/${tool.slug}`}
              className="group flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-xs hover:border-blue-200 hover:shadow-sm transition-all"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <DynamicIcon name={tool.icon} className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-800 group-hover:text-blue-700 leading-snug transition-colors">
                  {tool.name}
                </p>
                <p className="mt-0.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {tool.shortDescription}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 group-hover:text-blue-500 mt-0.5 transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
