import React from "react";
import { notFound } from "next/navigation";
import { getToolBySlug } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import { ToolPageHeader } from "@/components/tool/ToolPageHeader";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { RelatedTools } from "@/components/tool/RelatedTools";
import { PinterestDownloader } from "@/features/pinterest-downloader/PinterestDownloader";

const tool = getToolBySlug("pinterest-downloader");
export const metadata = tool ? generateToolMetadata(tool) : {};

export default function PinterestDownloaderPage() {
  if (!tool) notFound();
  return (
    <div className="flex flex-col min-h-screen">
      <ToolJsonLd tool={tool} />
      <ToolPageHeader tool={tool} badge="HD Download" />
      <PinterestDownloader />
      <RelatedTools currentToolId={tool.id} category={tool.category} />
    </div>
  );
}
