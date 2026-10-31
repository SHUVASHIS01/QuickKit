import React from "react";
import { Metadata } from "next";
import { getToolBySlug } from "@/config/tools";
import { ToolPageHeader } from "@/components/tool/ToolPageHeader";
import { ComingSoonTool } from "@/components/tool/ComingSoonTool";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Video to GIF Converter — Short Clips to GIF",
  description:
    "Convert MP4 and WebM video clips into lightweight, loopable GIFs with custom frame rate and dimensions.",
};

export default function VideoToGifPage() {
  const tool = getToolBySlug("video-to-gif");
  if (!tool) notFound();

  return (
    <div className="flex flex-col min-h-screen">
      <ToolPageHeader tool={tool} badge="Coming Soon" />
      <ComingSoonTool tool={tool} />
    </div>
  );
}

