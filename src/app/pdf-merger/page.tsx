import React from "react";
import { Metadata } from "next";
import { getToolBySlug } from "@/config/tools";
import { ToolPageHeader } from "@/components/tool/ToolPageHeader";
import { PdfMerger } from "@/features/pdf-merger/PdfMerger";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "PDF Merger — Combine Multiple PDFs Online",
  description:
    "Combine and reorder multiple PDF documents into a single organized file directly in your browser. Powered by pdf-lib.",
};

export default function PdfMergerPage() {
  const tool = getToolBySlug("pdf-merger");
  if (!tool) notFound();

  return (
    <div className="flex flex-col min-h-screen">
      <ToolPageHeader tool={tool} badge="pdf-lib Powered" />
      <PdfMerger />
    </div>
  );
}

