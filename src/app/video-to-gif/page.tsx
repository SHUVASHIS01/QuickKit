import React from "react";
import { Metadata } from "next";
import { getToolBySlug } from "@/config/tools";
import { ToolPageHeader } from "@/components/tool/ToolPageHeader";
import { VideoToGif } from "@/features/video-to-gif/VideoToGif";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Video to GIF Converter — MP4 and WebM to GIF",
  description:
    "Convert MP4, WebM, and MOV video clips into lightweight, loopable GIFs with custom frame rates and dimensions directly in your browser.",
};

export default function VideoToGifPage() {
  const tool = getToolBySlug("video-to-gif");
  if (!tool) notFound();

  return (
    <div className="flex flex-col min-h-screen">
      <ToolPageHeader tool={tool} badge="Browser Rendered" />
      <VideoToGif />
    </div>
  );
}
