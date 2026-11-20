import React from "react";
import { notFound } from "next/navigation";
import { getToolBySlug } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import { ToolPageHeader } from "@/components/tool/ToolPageHeader";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { RelatedTools } from "@/components/tool/RelatedTools";
import { PdfToWord } from "@/features/pdf-to-word/PdfToWord";

const tool = getToolBySlug("pdf-to-word");
export const metadata = tool ? generateToolMetadata(tool) : {};

export default function PdfToWordPage() {
  if (!tool) notFound();
  return (
    <div className="flex flex-col min-h-screen">
      <ToolJsonLd tool={tool} />
      <ToolPageHeader tool={tool} badge="DOCX Output" />
      <PdfToWord />
      <RelatedTools currentToolId={tool.id} category={tool.category} />
    </div>
  );
}
