import { generateMetadata as genMeta } from "@/lib/seo";

export const metadata = genMeta({
  title: "Solana Templates - Code Examples & Tutorials",
  description: "Browse interactive Solana programming templates and code examples. Learn Solana development with hands-on tutorials covering accounts, programs, PDAs, tokens, NFTs, and more.",
  path: "/templates",
  keywords: [
    "Solana templates",
    "Solana examples",
    "Solana tutorials",
    "Solana code samples",
    "blockchain examples",
    "Web3 tutorials",
  ],
});

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

