import React from "react";
import { Metadata } from "next";
import { getToolBySlug } from "@/config/tools";
import { ToolPageHeader } from "@/components/tool/ToolPageHeader";
import { PdfTextEditor } from "@/features/pdf-text-editor/PdfTextEditor";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "PDF Text & Annotation Editor — Add Text, Stamps & Signs",
  description:
    "Click anywhere on a PDF page to overlay text, add stamps, insert dates, or sign documents right inside your browser.",
};

export default function PdfTextEditorPage() {
  const tool = getToolBySlug("pdf-text-editor");
  if (!tool) notFound();

  return (
    <div className="flex flex-col min-h-screen">
      <ToolPageHeader tool={tool} badge="Point & Click Edit" />
      <PdfTextEditor />
    </div>
  );
}

