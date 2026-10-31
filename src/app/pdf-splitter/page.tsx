import React from "react";
import { Metadata } from "next";
import { getToolBySlug } from "@/config/tools";
import { ToolPageHeader } from "@/components/tool/ToolPageHeader";
import { ComingSoonTool } from "@/components/tool/ComingSoonTool";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "PDF Splitter — Extract Pages from PDF",
  description:
    "Extract specific pages or separate single PDF documents cleanly in your browser. Coming soon to QuickKit.",
};

export default function PdfSplitterPage() {
  const tool = getToolBySlug("pdf-splitter");
  if (!tool) notFound();

  return (
    <div className="flex flex-col min-h-screen">
      <ToolPageHeader tool={tool} badge="Coming Soon" />
      <ComingSoonTool tool={tool} />
    </div>
  );
}

