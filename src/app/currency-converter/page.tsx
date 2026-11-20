import React from "react";
import { notFound } from "next/navigation";
import { getToolBySlug } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import { ToolPageHeader } from "@/components/tool/ToolPageHeader";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { RelatedTools } from "@/components/tool/RelatedTools";
import { CurrencyConverter } from "@/features/currency-converter/CurrencyConverter";

const tool = getToolBySlug("currency-converter");
export const metadata = tool ? generateToolMetadata(tool) : {};

export default function CurrencyConverterPage() {
  if (!tool) notFound();
  return (
    <div className="flex flex-col min-h-screen">
      <ToolJsonLd tool={tool} />
      <ToolPageHeader tool={tool} badge="Live Rates" />
      <CurrencyConverter />
      <RelatedTools currentToolId={tool.id} category={tool.category} />
    </div>
  );
}
