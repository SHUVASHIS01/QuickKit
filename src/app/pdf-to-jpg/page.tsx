import React from "react";
import { notFound } from "next/navigation";
import { getToolBySlug } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import { ToolPageHeader } from "@/components/tool/ToolPageHeader";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { RelatedTools } from "@/components/tool/RelatedTools";
import { PdfToJpg } from "@/features/pdf-to-jpg/PdfToJpg";

const tool = getToolBySlug("pdf-to-jpg");
export const metadata = tool ? generateToolMetadata(tool) : {};

export default function PdfToJpgPage() {
  if (!tool) notFound();
  return (
    <div className="flex flex-col min-h-screen">
      <ToolJsonLd tool={tool} />
      <ToolPageHeader tool={tool} badge="High Resolution" />
      <PdfToJpg />
      <RelatedTools currentToolId={tool.id} category={tool.category} />
    </div>
  );
}
