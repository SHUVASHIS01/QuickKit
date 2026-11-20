import React from "react";
import { notFound } from "next/navigation";
import { getToolBySlug } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import { ToolPageHeader } from "@/components/tool/ToolPageHeader";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { RelatedTools } from "@/components/tool/RelatedTools";
import { VideoToGif } from "@/features/video-to-gif/VideoToGif";

const tool = getToolBySlug("video-to-gif");
export const metadata = tool ? generateToolMetadata(tool) : {};

export default function VideoToGifPage() {
  if (!tool) notFound();
  return (
    <div className="flex flex-col min-h-screen">
      <ToolJsonLd tool={tool} />
      <ToolPageHeader tool={tool} badge="Animated GIF" />
      <VideoToGif />
      <RelatedTools currentToolId={tool.id} category={tool.category} />
    </div>
  );
}
