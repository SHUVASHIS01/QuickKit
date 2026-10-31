import React from "react";
import { Metadata } from "next";
import { getToolBySlug } from "@/config/tools";
import { ToolPageHeader } from "@/components/tool/ToolPageHeader";
import { BackgroundRemover } from "@/features/background-remover/BackgroundRemover";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Background Remover — Erase Image Backgrounds Free",
  description:
    "Isolate subjects and create transparent background cutouts for portraits, products, and graphics directly in your browser.",
};

export default function BackgroundRemoverPage() {
  const tool = getToolBySlug("background-remover");
  if (!tool) notFound();

  return (
    <div className="flex flex-col min-h-screen">
      <ToolPageHeader tool={tool} badge="Transparent PNG Cutout" />
      <BackgroundRemover />
    </div>
  );
}

