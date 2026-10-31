import React from "react";
import Link from "next/link";
import { ToolItem } from "@/types";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";

interface ToolPageHeaderProps {
  tool: ToolItem;
  badge?: string;
}

export function ToolPageHeader({ tool, badge }: ToolPageHeaderProps) {
  return (
    <div className="w-full border-b border-slate-200/80 bg-white/50 py-6 sm:py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Breadcrumb / Back button */}
        <div className="mb-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to all tools
          </Link>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600 capitalize">
              {tool.category}
            </span>
            {badge && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-medium text-blue-700">
                <Sparkles className="h-3 w-3" /> {badge}
              </span>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 shadow-2xs">
            <DynamicIcon name={tool.icon} className="h-6 w-6 sm:h-7 sm:w-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {tool.name}
            </h1>
            <p className="mt-1 text-sm text-slate-600 max-w-2xl leading-relaxed">
              {tool.description}
            </p>
          </div>
        </div>

        {/* Privacy Callout */}
        {tool.privacyNotice && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200/70 px-3.5 py-2 text-xs text-slate-600">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>
              <strong className="font-semibold text-slate-800">Privacy First:</strong>{" "}
              {tool.privacyNotice}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

