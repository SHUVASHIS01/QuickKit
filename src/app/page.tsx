import React from "react";
import { TOOLS, CATEGORIES, getPopularTools, getRecentTools } from "@/config/tools";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeSections } from "@/components/home/HomeSections";

export default function HomePage() {
  const popularTools = getPopularTools();
  const recentTools = getRecentTools();

  return (
    <div className="flex flex-col min-h-screen">
      <HomeHero allTools={TOOLS} />
      <HomeSections
        popularTools={popularTools}
        recentTools={recentTools}
        categories={CATEGORIES}
        allTools={TOOLS}
      />
    </div>
  );
}
