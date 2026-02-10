import { generateMetadata as genMeta } from "@/lib/seo";

export const metadata = genMeta({
  title: "Solana Playground - Interactive Code Editor",
  description: "Interactive Solana programming playground. Run real Solana programs, watch state transform, and understand execution. Zero setup required.",
  path: "/playground",
  keywords: [
    "Solana playground",
    "Solana IDE",
    "interactive coding",
    "Solana editor",
    "blockchain development",
    "Web3 development",
  ],
});

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

