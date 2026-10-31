import React from "react";
import { Metadata } from "next";
import { getToolBySlug } from "@/config/tools";
import { ToolPageHeader } from "@/components/tool/ToolPageHeader";
import { WordCounter } from "@/features/word-counter/WordCounter";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Word & Character Counter — Text Statistics & Reading Time",
  description:
    "Free online word count and character count workstation. Calculate sentences, paragraphs, reading speed, speaking duration, and case transforms.",
};

export default function WordCounterPage() {
  const tool = getToolBySlug("word-counter");
  if (!tool) notFound();

  return (
    <div className="flex flex-col min-h-screen">
      <ToolPageHeader tool={tool} badge="Real-time Stats" />
      <WordCounter />
    </div>
  );
}

