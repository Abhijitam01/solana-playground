import { Metadata } from "next";

function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // Default fallback - update this to your actual domain
  return 'https://solana-atlas.com';
}

const siteUrl = getSiteUrl();

export function getBaseUrl(): string {
  return siteUrl;
}

export interface PageMetadataOptions {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  keywords?: string[];
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
}

export function generateMetadata(options: PageMetadataOptions): Metadata {
  const {
    title,
    description,
    path = "",
    image = "/logo/og.png",
    noIndex = false,
    keywords = [],
    type = "website",
    publishedTime,
    modifiedTime,
    authors = [],
  } = options;

  const url = `${siteUrl}${path}`;
  const imageUrl = image.startsWith("http") ? image : `${siteUrl}${image}`;

  const metadata: Metadata = {
    title,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    openGraph: {
      type: type === "article" ? "article" : "website",
      url,
      title,
      description,
      siteName: "Solana Atlas",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(type === "article" && {
        publishedTime,
        modifiedTime,
        authors: authors.length > 0 ? authors : undefined,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };

  return metadata;
}

export function generateTemplateMetadata(templateId: string, templateName?: string, description?: string): Metadata {
  return generateMetadata({
    title: templateName ? `${templateName} - Solana Template` : `${templateId} - Solana Template`,
    description: description || `Interactive Solana programming template: ${templateId}. Learn Solana development with hands-on examples.`,
    path: `/playground/${templateId}`,
    keywords: [
      "Solana",
      "Solana template",
      templateId,
      "blockchain programming",
      "Web3 development",
      "Solana tutorial",
    ],
    type: "article",
  });
}

export function generateConceptMetadata(conceptId: string, conceptName?: string, description?: string): Metadata {
  return generateMetadata({
    title: conceptName ? `${conceptName} - Solana Concept` : `${conceptId} - Solana Concept`,
    description: description || `Learn about ${conceptId} in Solana programming. Interactive tutorials and examples.`,
    path: `/concepts/${conceptId}`,
    keywords: [
      "Solana",
      "Solana concepts",
      conceptId,
      "blockchain education",
      "Solana learning",
    ],
    type: "article",
  });
}

