import React from "react";
import { Metadata } from "next";
import { getToolBySlug } from "@/config/tools";
import { ToolPageHeader } from "@/components/tool/ToolPageHeader";
import { ImageConverter } from "@/features/image-converter/ImageConverter";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Image Format Converter — JPG, PNG, WEBP",
  description:
    "Convert images between JPG, PNG, and WebP instantly in your browser with adjustable compression quality.",
};

export default function ImageConverterPage() {
  const tool = getToolBySlug("image-converter");
  if (!tool) notFound();

  return (
    <div className="flex flex-col min-h-screen">
      <ToolPageHeader tool={tool} badge="Instant Format Switch" />
      <ImageConverter />
    </div>
  );
}

