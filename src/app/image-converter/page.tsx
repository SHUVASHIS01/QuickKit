import React from "react";
import { notFound } from "next/navigation";
import { getToolBySlug } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import { ToolPageHeader } from "@/components/tool/ToolPageHeader";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { RelatedTools } from "@/components/tool/RelatedTools";
import { ImageConverter } from "@/features/image-converter/ImageConverter";

const tool = getToolBySlug("image-converter");
export const metadata = tool ? generateToolMetadata(tool) : {};

export default function ImageConverterPage() {
  if (!tool) notFound();
  return (
    <div className="flex flex-col min-h-screen">
      <ToolJsonLd tool={tool} />
      <ToolPageHeader tool={tool} badge="Batch Convert" />
      <ImageConverter />
      <RelatedTools currentToolId={tool.id} category={tool.category} />
    </div>
  );
}
