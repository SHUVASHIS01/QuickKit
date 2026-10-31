import React from "react";
import { Metadata } from "next";
import { getToolBySlug } from "@/config/tools";
import { ToolPageHeader } from "@/components/tool/ToolPageHeader";
import { PdfToJpg } from "@/features/pdf-to-jpg/PdfToJpg";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "PDF to JPG Converter — Convert PDF Pages to Images",
  description:
    "Render PDF document pages into high-resolution JPG or PNG images with ZIP batch download support.",
};

export default function PdfToJpgPage() {
  const tool = getToolBySlug("pdf-to-jpg");
  if (!tool) notFound();

  return (
    <div className="flex flex-col min-h-screen">
      <ToolPageHeader tool={tool} badge="High-Res 300 DPI" />
      <PdfToJpg />
    </div>
  );
}

