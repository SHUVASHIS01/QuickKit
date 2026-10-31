import React from "react";
import { Metadata } from "next";
import { getToolBySlug } from "@/config/tools";
import { ToolPageHeader } from "@/components/tool/ToolPageHeader";
import { ImageUpscaler } from "@/features/image-upscaler/ImageUpscaler";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Image Upscaler — 2x & 4x Resolution Enhancer",
  description:
    "Upscale images 200% and 400% with adaptive bicubic scaling and edge contrast sharpening directly in your browser.",
};

export default function ImageUpscalerPage() {
  const tool = getToolBySlug("image-upscaler");
  if (!tool) notFound();

  return (
    <div className="flex flex-col min-h-screen">
      <ToolPageHeader tool={tool} badge="2X & 4X Upscale" />
      <ImageUpscaler />
    </div>
  );
}

