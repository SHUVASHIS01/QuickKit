import React from "react";
import { notFound } from "next/navigation";
import { getToolBySlug } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import { ToolPageHeader } from "@/components/tool/ToolPageHeader";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { RelatedTools } from "@/components/tool/RelatedTools";
import { TypingSpeedTest } from "@/features/typing-speed-test/TypingSpeedTest";

const tool = getToolBySlug("typing-speed-test");
export const metadata = tool ? generateToolMetadata(tool) : {};

export default function TypingSpeedTestPage() {
  if (!tool) notFound();
  return (
    <div className="flex flex-col min-h-screen">
      <ToolJsonLd tool={tool} />
      <ToolPageHeader tool={tool} badge="Real-time WPM" />
      <TypingSpeedTest />
      <RelatedTools currentToolId={tool.id} category={tool.category} />
    </div>
  );
}
