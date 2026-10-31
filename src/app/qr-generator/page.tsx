import React from "react";
import { Metadata } from "next";
import { getToolBySlug } from "@/config/tools";
import { ToolPageHeader } from "@/components/tool/ToolPageHeader";
import { QrGenerator } from "@/features/qr-generator/QrGenerator";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "QR Code Generator — Free & Customizable",
  description:
    "Generate high-resolution customized QR codes for URLs, WiFi, and text directly in your browser. Download as PNG or SVG instantly.",
};

export default function QrGeneratorPage() {
  const tool = getToolBySlug("qr-generator");
  if (!tool) notFound();

  return (
    <div className="flex flex-col min-h-screen">
      <ToolPageHeader tool={tool} badge="Instant Preview" />
      <QrGenerator />
    </div>
  );
}

