import React from "react";
import { Metadata } from "next";
import { getToolBySlug } from "@/config/tools";
import { ToolPageHeader } from "@/components/tool/ToolPageHeader";
import { ImageCompressor } from "@/features/image-compressor/ImageCompressor";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Image Compressor — Reduce File Size Privately",
  description:
    "Compress JPG, PNG, and WebP images by up to 80% without quality degradation. Local canvas processing ensures zero server upload.",
};

export default function ImageCompressorPage() {
  const tool = getToolBySlug("image-compressor");
  if (!tool) notFound();

  return (
    <div className="flex flex-col min-h-screen">
      <ToolPageHeader tool={tool} badge="Lossless Compression" />
      <ImageCompressor />
    </div>
  );
}

