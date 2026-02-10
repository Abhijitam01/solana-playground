import { generateMetadata as genMeta } from "@/lib/seo";

export const metadata = genMeta({
  title: "Learning Paths - Solana Development Courses",
  description: "Structured learning paths for mastering Solana development. Follow guided courses from beginner to advanced, covering all aspects of Solana programming.",
  path: "/paths",
  keywords: [
    "Solana courses",
    "Solana learning paths",
    "blockchain courses",
    "Web3 education",
    "Solana curriculum",
    "blockchain tutorials",
  ],
});

export default function PathsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

