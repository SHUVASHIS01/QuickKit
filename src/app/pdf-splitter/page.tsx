import React from "react";
import { Metadata } from "next";
import { getToolBySlug } from "@/config/tools";
import { ToolPageHeader } from "@/components/tool/ToolPageHeader";
import { PdfSplitter } from "@/features/pdf-splitter/PdfSplitter";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "PDF Splitter — Extract Pages or Split All to ZIP",
  description:
    "Extract specific page ranges or separate all pages from any PDF document cleanly in your browser. Fast, 100% private, and free.",
};

export default function PdfSplitterPage() {
  const tool = getToolBySlug("pdf-splitter");
  if (!tool) notFound();

  return (
    <div className="flex flex-col min-h-screen">
      <ToolPageHeader tool={tool} badge="Instant Client Split" />
      <PdfSplitter />
    </div>
  );
}
