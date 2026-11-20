import React from "react";
import { notFound } from "next/navigation";
import { getToolBySlug } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import { ToolPageHeader } from "@/components/tool/ToolPageHeader";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { RelatedTools } from "@/components/tool/RelatedTools";
import { TextRepeater } from "@/features/text-repeater/TextRepeater";

const tool = getToolBySlug("text-repeater");
export const metadata = tool ? generateToolMetadata(tool) : {};

export default function TextRepeaterPage() {
  if (!tool) notFound();
  return (
    <div className="flex flex-col min-h-screen">
      <ToolJsonLd tool={tool} />
      <ToolPageHeader tool={tool} badge="Up to 10,000x" />
      <TextRepeater />
      <RelatedTools currentToolId={tool.id} category={tool.category} />
    </div>
  );
}
