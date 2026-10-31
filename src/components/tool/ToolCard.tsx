import React from "react";
import Link from "next/link";
import { ToolItem } from "@/types";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { ArrowUpRight, Lock } from "lucide-react";

interface ToolCardProps {
  tool: ToolItem;
}

export function ToolCard({ tool }: ToolCardProps) {
  const isComingSoon = tool.status === "coming-soon";

  return (
    <Link
      href={`/${tool.slug}`}
      className="group relative flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
    >
      <div>
        <div className="flex items-center justify-between gap-3 mb-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 text-slate-700 border border-slate-100 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-colors">
            <DynamicIcon name={tool.icon} className="h-5 w-5" />
          </div>

          <div className="flex items-center gap-1.5">
            {isComingSoon ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 border border-amber-200/60">
                Coming Soon
              </span>
            ) : tool.popular ? (
              <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700 border border-blue-200/60">
                Popular
              </span>
            ) : null}

            <span className="text-slate-300 group-hover:text-blue-600 transition-colors">
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </div>

        <h3 className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
          {tool.name}
        </h3>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-500 line-clamp-2">
          {tool.shortDescription}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-400">
        <span className="capitalize font-medium text-slate-500">
          {tool.category}
        </span>
        <span className="inline-flex items-center gap-1">
          <Lock className="h-3 w-3 text-slate-400" /> Private
        </span>
      </div>
    </Link>
  );
}

