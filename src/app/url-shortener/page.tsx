import React from "react";
import { Metadata } from "next";
import { getToolBySlug } from "@/config/tools";
import { ToolPageHeader } from "@/components/tool/ToolPageHeader";
import { UrlShortener } from "@/features/url-shortener/UrlShortener";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "URL Shortener & QR Maker — Short Links Instantly",
  description:
    "Shorten lengthy links into concise URLs with paired high-resolution QR codes. Fast, free, and privacy-preserving.",
};

export default function UrlShortenerPage() {
  const tool = getToolBySlug("url-shortener");
  if (!tool) notFound();

  return (
    <div className="flex flex-col min-h-screen">
      <ToolPageHeader tool={tool} badge="Instant QR Included" />
      <UrlShortener />
    </div>
  );
}

