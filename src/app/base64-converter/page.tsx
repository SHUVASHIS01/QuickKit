import React from "react";
import { Metadata } from "next";
import { getToolBySlug } from "@/config/tools";
import { ToolPageHeader } from "@/components/tool/ToolPageHeader";
import { Base64Converter } from "@/features/base64-converter/Base64Converter";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Base64 Encoder & Decoder — Text and Files",
  description:
    "Encode strings or files into Base64 format, or decode Base64 strings back to text and files with complete browser privacy.",
};

export default function Base64ConverterPage() {
  const tool = getToolBySlug("base64-converter");
  if (!tool) notFound();

  return (
    <div className="flex flex-col min-h-screen">
      <ToolPageHeader tool={tool} badge="Text & Files" />
      <Base64Converter />
    </div>
  );
}

