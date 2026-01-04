"use client";

import { useParams } from "next/navigation";
import { BookOpen, CheckCircle2, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { RelatedConcepts } from "@/components/learning/RelatedConcepts";
import Link from "next/link";

// Mock data - in real implementation, this would come from API
const mockConcept = {
  id: "accounts",
  name: "Accounts",
  description:
    "Accounts are the fundamental data structure in Solana. They store state and can be owned by programs or users.",
  category: "solana" as const,
  mastered: true,
  relatedConcepts: ["programs", "pdas", "ownership"],
  templates: ["hello-solana", "account-init"],
  details: {
    overview:
      "Accounts in Solana are similar to files in a traditional system. They store data and have an owner (either a program or the System Program).",
    keyPoints: [
      "Accounts store up to 10MB of data",
      "Each account has an owner (program ID)",
      "Accounts can be mutable or immutable",
      "Accounts require rent (lamports) to exist",
    ],
    examples: [
      "User accounts store wallet balances",
      "Program accounts store program state",
      "PDA accounts are owned by programs",
    ],
  },
};

const mockRelatedConcepts = [
  {
    id: "programs",
    name: "Programs",
    description: "Programs are the executable code on Solana",
    category: "solana" as const,
    mastered: false,
    relatedConcepts: ["accounts"],
    templates: ["hello-solana"],
  },
  {
    id: "pdas",
    name: "PDAs",
    description: "Program Derived Addresses are accounts owned by programs",
    category: "solana" as const,
    mastered: false,
    relatedConcepts: ["accounts"],
    templates: ["pda-vault"],
  },
];

export default function ConceptPage() {
  const params = useParams();
  const conceptId = params.conceptId as string;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "solana":
        return "primary";
      case "rust":
        return "warning";
      case "anchor":
        return "info";
      default:
        return "default";
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {mockConcept.name}
              </h1>
              <div className="flex items-center gap-2">
                <Badge variant={getCategoryColor(mockConcept.category) as any} size="sm">
                  {mockConcept.category}
                </Badge>
                {mockConcept.mastered && (
                  <Badge variant="success" size="sm">
                    <CheckCircle2 className="w-3 h-3 inline mr-1" />
                    Mastered
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <p className="text-lg text-muted-foreground">{mockConcept.description}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-lg bg-card border border-border"
            >
              <h2 className="text-xl font-semibold text-foreground mb-4">Overview</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {mockConcept.details.overview}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-lg bg-card border border-border"
            >
              <h2 className="text-xl font-semibold text-foreground mb-4">Key Points</h2>
              <ul className="space-y-2">
                {mockConcept.details.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                    <span className="text-primary mt-1">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-lg bg-card border border-border"
            >
              <h2 className="text-xl font-semibold text-foreground mb-4">Examples</h2>
              <div className="space-y-2">
                {mockConcept.details.examples.map((example, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg bg-muted/30 border border-border text-sm text-foreground"
                  >
                    {example}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Templates */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 rounded-lg bg-card border border-border"
            >
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Related Templates
              </h2>
              <div className="space-y-2">
                {mockConcept.templates.map((templateId) => (
                  <Link
                    key={templateId}
                    href={`/playground/${templateId}`}
                    className="block p-3 rounded-lg bg-muted/30 border border-border hover:border-primary transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-foreground">
                        {templateId}
                      </span>
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <RelatedConcepts
                concepts={mockRelatedConcepts}
                currentConceptId={conceptId}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}

