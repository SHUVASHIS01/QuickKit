import React from "react";
import { Metadata } from "next";
import { getToolBySlug } from "@/config/tools";
import { ToolPageHeader } from "@/components/tool/ToolPageHeader";
import { ImageToPdf } from "@/features/image-to-pdf/ImageToPdf";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Image to PDF Converter — Convert Photos to PDF Online",
  description:
    "Combine multiple JPG, PNG, and WebP images into a single organized PDF document. 100% in-browser processing.",
};

export default function ImageToPdfPage() {
  const tool = getToolBySlug("image-to-pdf");
  if (!tool) notFound();

  return (
    <div className="flex flex-col min-h-screen">
      <ToolPageHeader tool={tool} badge="Multi-photo Combine" />
      <ImageToPdf />
    </div>
  );
}

