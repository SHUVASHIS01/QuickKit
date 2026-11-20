import React from "react";
import { notFound } from "next/navigation";
import { getToolBySlug } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import { ToolPageHeader } from "@/components/tool/ToolPageHeader";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { RelatedTools } from "@/components/tool/RelatedTools";
import { ImageCompressor } from "@/features/image-compressor/ImageCompressor";

const tool = getToolBySlug("image-compressor");
export const metadata = tool ? generateToolMetadata(tool) : {};

export default function ImageCompressorPage() {
  if (!tool) notFound();
  return (
    <div className="flex flex-col min-h-screen">
      <ToolJsonLd tool={tool} />
      <ToolPageHeader tool={tool} badge="Up to 80% Smaller" />
      <ImageCompressor />
      <RelatedTools currentToolId={tool.id} category={tool.category} />
    </div>
  );
}
