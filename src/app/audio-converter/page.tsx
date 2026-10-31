import React from "react";
import { Metadata } from "next";
import { getToolBySlug } from "@/config/tools";
import { ToolPageHeader } from "@/components/tool/ToolPageHeader";
import { AudioConverter } from "@/features/audio-converter/AudioConverter";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Audio Format Converter — MP3, WAV, OGG, AAC",
  description:
    "Fast, browser-based audio converter with custom sample rate adjustment and zero upload requirements.",
};

export default function AudioConverterPage() {
  const tool = getToolBySlug("audio-converter");
  if (!tool) notFound();

  return (
    <div className="flex flex-col min-h-screen">
      <ToolPageHeader tool={tool} badge="Instant Format Switch" />
      <AudioConverter />
    </div>
  );
}

