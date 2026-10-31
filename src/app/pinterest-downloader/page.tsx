import React from "react";
import { Metadata } from "next";
import { getToolBySlug } from "@/config/tools";
import { ToolPageHeader } from "@/components/tool/ToolPageHeader";
import { ComingSoonTool } from "@/components/tool/ComingSoonTool";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Pinterest Media Downloader — Download Pins & Assets",
  description:
    "Extract high-resolution images and video clips from public Pinterest pin links directly to your device.",
};

export default function PinterestDownloaderPage() {
  const tool = getToolBySlug("pinterest-downloader");
  if (!tool) notFound();

  return (
    <div className="flex flex-col min-h-screen">
      <ToolPageHeader tool={tool} badge="Coming Soon" />
      <ComingSoonTool tool={tool} />
    </div>
  );
}

