import { MetadataRoute } from "next";
import { TOOLS } from "@/config/tools";
import { SITE_CONFIG } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.url;
  const currentDate = new Date("2026-11-01");

  const toolRoutes = TOOLS.map((tool) => ({
    url: `${baseUrl}/${tool.slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: tool.popular ? 0.9 : 0.7,
  }));

  const staticRoutes = ["", "/about", "/privacy", "/terms"].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1.0 : 0.5,
  }));

  return [...staticRoutes, ...toolRoutes];
}

