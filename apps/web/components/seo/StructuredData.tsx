"use client";

import { useEffect } from "react";
import { getBaseUrl } from "@/lib/seo";

const siteUrl = getBaseUrl();

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Solana Atlas",
  description: "Interactive Solana programming playground for learning blockchain development",
  url: siteUrl,
  logo: `${siteUrl}/logo/og.png`,
  sameAs: [
    // Add social media links when available
    // "https://twitter.com/solanaatlas",
    // "https://github.com/solana-atlas",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Technical Support",
    availableLanguage: "English",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Solana Atlas",
  url: siteUrl,
  description: "Learn Solana programming through interactive, explorable code",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteUrl}/playground?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Solana Atlas",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web Browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    ratingCount: "1",
  },
};

const courseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Solana Programming Course",
  description: "Interactive course for learning Solana blockchain development",
  provider: {
    "@type": "Organization",
    name: "Solana Atlas",
    sameAs: siteUrl,
  },
  courseCode: "SOLANA-101",
  educationalLevel: "Beginner to Advanced",
  inLanguage: "en-US",
};

export function StructuredData() {
  useEffect(() => {
    const schemas = [organizationSchema, websiteSchema, softwareApplicationSchema, courseSchema];
    
    // Remove existing structured data scripts to avoid duplicates
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach(script => {
      if (script.id?.startsWith('structured-data-')) {
        script.remove();
      }
    });

    // Add structured data scripts to head
    schemas.forEach((schema, index) => {
      const script = document.createElement("script");
      script.id = `structured-data-${index}`;
      script.type = "application/ld+json";
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    return () => {
      // Cleanup on unmount
      const scripts = document.querySelectorAll('script[id^="structured-data-"]');
      scripts.forEach(script => script.remove());
    };
  }, []);

  return null;
}

