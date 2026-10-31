import React from "react";
import { Metadata } from "next";
import { getToolBySlug } from "@/config/tools";
import { ToolPageHeader } from "@/components/tool/ToolPageHeader";
import { PdfToWord } from "@/features/pdf-to-word/PdfToWord";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "PDF to Word Converter — Convert PDF to DOCX & Vice Versa",
  description:
    "Convert PDF documents to editable Microsoft Word (.docx) files or convert Word files into clean PDFs directly in your browser.",
};

export default function PdfToWordPage() {
  const tool = getToolBySlug("pdf-to-word");
  if (!tool) notFound();

  return (
    <div className="flex flex-col min-h-screen">
      <ToolPageHeader tool={tool} badge="Editable DOCX" />
      <PdfToWord />
    </div>
  );
}

