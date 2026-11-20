import React from "react";
import { notFound } from "next/navigation";
import { getToolBySlug } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import { ToolPageHeader } from "@/components/tool/ToolPageHeader";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { RelatedTools } from "@/components/tool/RelatedTools";
import { UrlShortener } from "@/features/url-shortener/UrlShortener";

const tool = getToolBySlug("url-shortener");
export const metadata = tool ? generateToolMetadata(tool) : {};

export default function UrlShortenerPage() {
  if (!tool) notFound();
  return (
    <div className="flex flex-col min-h-screen">
      <ToolJsonLd tool={tool} />
      <ToolPageHeader tool={tool} badge="+ QR Code" />
      <UrlShortener />
      <RelatedTools currentToolId={tool.id} category={tool.category} />
    </div>
  );
}
