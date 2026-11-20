import React from "react";
import { notFound } from "next/navigation";
import { getToolBySlug } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import { ToolPageHeader } from "@/components/tool/ToolPageHeader";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { RelatedTools } from "@/components/tool/RelatedTools";
import { ImageUpscaler } from "@/features/image-upscaler/ImageUpscaler";

const tool = getToolBySlug("image-upscaler");
export const metadata = tool ? generateToolMetadata(tool) : {};

export default function ImageUpscalerPage() {
  if (!tool) notFound();
  return (
    <div className="flex flex-col min-h-screen">
      <ToolJsonLd tool={tool} />
      <ToolPageHeader tool={tool} badge="2x & 4x" />
      <ImageUpscaler />
      <RelatedTools currentToolId={tool.id} category={tool.category} />
    </div>
  );
}
