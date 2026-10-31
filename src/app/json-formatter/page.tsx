import React from "react";
import { Metadata } from "next";
import { getToolBySlug } from "@/config/tools";
import { ToolPageHeader } from "@/components/tool/ToolPageHeader";
import { JsonFormatter } from "@/features/json-formatter/JsonFormatter";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "JSON Formatter & Validator — Clean & Prettify",
  description:
    "Prettify, minify, inspect, and validate JSON payloads client-side with zero data leaving your device.",
};

export default function JsonFormatterPage() {
  const tool = getToolBySlug("json-formatter");
  if (!tool) notFound();

  return (
    <div className="flex flex-col min-h-screen">
      <ToolPageHeader tool={tool} badge="100% Client-Side" />
      <JsonFormatter />
    </div>
  );
}

