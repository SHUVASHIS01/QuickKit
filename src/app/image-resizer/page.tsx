import React from "react";
import { Metadata } from "next";
import { getToolBySlug } from "@/config/tools";
import { ToolPageHeader } from "@/components/tool/ToolPageHeader";
import { ImageResizer } from "@/features/image-resizer/ImageResizer";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Image Resizer — Scale and Resize Dimensions",
  description:
    "Resize images to exact pixel widths and heights with aspect ratio preservation and social media presets.",
};

export default function ImageResizerPage() {
  const tool = getToolBySlug("image-resizer");
  if (!tool) notFound();

  return (
    <div className="flex flex-col min-h-screen">
      <ToolPageHeader tool={tool} badge="Custom Scale" />
      <ImageResizer />
    </div>
  );
}

