import React from "react";
import { notFound } from "next/navigation";
import { getToolBySlug } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import { ToolPageHeader } from "@/components/tool/ToolPageHeader";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { RelatedTools } from "@/components/tool/RelatedTools";
import { PdfMerger } from "@/features/pdf-merger/PdfMerger";

const tool = getToolBySlug("pdf-merger");
export const metadata = tool ? generateToolMetadata(tool) : {};

export default function PdfMergerPage() {
  if (!tool) notFound();
  return (
    <div className="flex flex-col min-h-screen">
      <ToolJsonLd tool={tool} />
      <ToolPageHeader tool={tool} badge="Drag & Reorder" />
      <PdfMerger />
      <RelatedTools currentToolId={tool.id} category={tool.category} />
    </div>
  );
}
