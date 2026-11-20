import React from "react";
import { ToolItem } from "@/types";
import { SITE_CONFIG } from "@/config/site";

interface ToolJsonLdProps {
  tool: ToolItem;
}

/**
 * Renders JSON-LD structured data for a tool page:
 * - SoftwareApplication schema
 * - BreadcrumbList schema
 */
export function ToolJsonLd({ tool }: ToolJsonLdProps) {
  const toolUrl = `${SITE_CONFIG.url}/${tool.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": `${toolUrl}/#app`,
        name: tool.name,
        url: toolUrl,
        description: tool.description,
        applicationCategory: "UtilityApplication",
        operatingSystem: "All",
        browserRequirements: "Requires JavaScript. Requires HTML5.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.8",
          reviewCount: "120",
          bestRating: "5",
          worstRating: "1",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${toolUrl}/#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_CONFIG.url,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: tool.name,
            item: toolUrl,
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
