import React from "react";
import { notFound } from "next/navigation";
import { getToolBySlug } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import { ToolPageHeader } from "@/components/tool/ToolPageHeader";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { RelatedTools } from "@/components/tool/RelatedTools";
import { WordCounter } from "@/features/word-counter/WordCounter";

const tool = getToolBySlug("word-counter");
export const metadata = tool ? generateToolMetadata(tool) : {};

export default function WordCounterPage() {
  if (!tool) notFound();
  return (
    <div className="flex flex-col min-h-screen">
      <ToolJsonLd tool={tool} />
      <ToolPageHeader tool={tool} badge="Real-time" />
      <WordCounter />
      <RelatedTools currentToolId={tool.id} category={tool.category} />
    </div>
  );
}
