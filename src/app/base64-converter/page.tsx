import React from "react";
import { notFound } from "next/navigation";
import { getToolBySlug } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import { ToolPageHeader } from "@/components/tool/ToolPageHeader";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { RelatedTools } from "@/components/tool/RelatedTools";
import { Base64Converter } from "@/features/base64-converter/Base64Converter";

const tool = getToolBySlug("base64-converter");
export const metadata = tool ? generateToolMetadata(tool) : {};

export default function Base64ConverterPage() {
  if (!tool) notFound();
  return (
    <div className="flex flex-col min-h-screen">
      <ToolJsonLd tool={tool} />
      <ToolPageHeader tool={tool} badge="Text & File" />
      <Base64Converter />
      <RelatedTools currentToolId={tool.id} category={tool.category} />
    </div>
  );
}
