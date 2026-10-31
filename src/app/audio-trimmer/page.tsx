import React from "react";
import { Metadata } from "next";
import { getToolBySlug } from "@/config/tools";
import { ToolPageHeader } from "@/components/tool/ToolPageHeader";
import { AudioTrimmer } from "@/features/audio-trimmer/AudioTrimmer";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Audio Trimmer & Cutter — Trim MP3, WAV, OGG Online",
  description:
    "Cut and trim music, ringtones, and voice recordings with audio playback preview and lossless WAV export directly in browser.",
};

export default function AudioTrimmerPage() {
  const tool = getToolBySlug("audio-trimmer");
  if (!tool) notFound();

  return (
    <div className="flex flex-col min-h-screen">
      <ToolPageHeader tool={tool} badge="Lossless Web Audio" />
      <AudioTrimmer />
    </div>
  );
}

