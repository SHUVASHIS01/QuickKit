import React from "react";
import { Metadata } from "next";
import { getToolBySlug } from "@/config/tools";
import { ToolPageHeader } from "@/components/tool/ToolPageHeader";
import { CurrencyConverter } from "@/features/currency-converter/CurrencyConverter";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Currency Converter — Real-Time Global Exchange Rates",
  description:
    "Convert between 160+ world currencies instantly with real-time exchange rates, offline benchmark fallback, and quick conversion tables.",
};

export default function CurrencyConverterPage() {
  const tool = getToolBySlug("currency-converter");
  if (!tool) notFound();

  return (
    <div className="flex flex-col min-h-screen">
      <ToolPageHeader tool={tool} badge="Live & Offline Rates" />
      <CurrencyConverter />
    </div>
  );
}
