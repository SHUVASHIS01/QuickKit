import React from "react";
import { Metadata } from "next";
import { getToolBySlug } from "@/config/tools";
import { ToolPageHeader } from "@/components/tool/ToolPageHeader";
import { PinterestDownloader } from "@/features/pinterest-downloader/PinterestDownloader";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Pinterest Media Downloader — Download Images & Videos",
  description:
    "Extract original high-resolution photos and video clips from public Pinterest pin links directly to your device.",
};

export default function PinterestDownloaderPage() {
  const tool = getToolBySlug("pinterest-downloader");
  if (!tool) notFound();

  return (
    <div className="flex flex-col min-h-screen">
      <ToolPageHeader tool={tool} badge="Direct CDN Extraction" />
      <PinterestDownloader />
    </div>
  );
}
