import React from "react";
import { Metadata } from "next";
import { getToolBySlug } from "@/config/tools";
import { ToolPageHeader } from "@/components/tool/ToolPageHeader";
import { PdfCompressor } from "@/features/pdf-compressor/PdfCompressor";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "PDF Compressor — Reduce Document Size Online Privately",
  description:
    "Compress bloated PDF documents and strip heavy metadata in your browser without uploading files to remote servers.",
};

export default function PdfCompressorPage() {
  const tool = getToolBySlug("pdf-compressor");
  if (!tool) notFound();

  return (
    <div className="flex flex-col min-h-screen">
      <ToolPageHeader tool={tool} badge="Fast Local Shrink" />
      <PdfCompressor />
    </div>
  );
}

