import { generateConceptMetadata } from "@/lib/seo";

// Mock concept data - in production, fetch from API or database
const conceptData: Record<string, { name: string; description: string }> = {
  accounts: {
    name: "Accounts",
    description: "Accounts are the fundamental data structure in Solana. They store state and can be owned by programs or users.",
  },
  programs: {
    name: "Programs",
    description: "Programs are the executable code on Solana that define the logic for your applications.",
  },
  pdas: {
    name: "PDAs (Program Derived Addresses)",
    description: "Program Derived Addresses are accounts owned by programs, providing deterministic account generation.",
  },
  instructions: {
    name: "Instructions",
    description: "Instructions are the basic unit of execution in Solana, defining what actions programs can perform.",
  },
  transactions: {
    name: "Transactions",
    description: "Transactions bundle multiple instructions together and are executed atomically on Solana.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: { conceptId: string };
}): Promise<ReturnType<typeof generateConceptMetadata>> {
  const conceptId = params.conceptId;
  const concept = conceptData[conceptId];
  
  if (!concept) {
    return generateConceptMetadata(conceptId);
  }
  
  return generateConceptMetadata(conceptId, concept.name, concept.description);
}

export default function ConceptLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

