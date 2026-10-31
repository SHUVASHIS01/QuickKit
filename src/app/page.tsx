import React from "react";
import { TOOLS, CATEGORIES } from "@/config/tools";
import { MinimalHome } from "@/components/home/MinimalHome";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <MinimalHome allTools={TOOLS} categories={CATEGORIES} />
    </div>
  );
}
