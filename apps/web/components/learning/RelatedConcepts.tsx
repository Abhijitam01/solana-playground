"use client";

import { BookOpen, ExternalLink, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import type { Concept } from "./ConceptGraph";

interface RelatedConceptsProps {
  concepts: Concept[];
  currentConceptId?: string;
}

export function RelatedConcepts({ concepts, currentConceptId }: RelatedConceptsProps) {
  const relatedConcepts = concepts.filter(
    (c) => c.id !== currentConceptId && concepts.some((other) => other.relatedConcepts.includes(c.id))
  );

  if (relatedConcepts.length === 0) {
    return (
      <div className="p-4 rounded-lg bg-muted/30 border border-border text-sm text-muted-foreground">
        No related concepts found
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Related Concepts
      </h3>
      {relatedConcepts.map((concept) => (
        <motion.div
          key={concept.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-3 rounded-lg bg-card border border-border hover:border-primary transition-colors"
        >
          <Link href={`/concepts/${concept.id}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">
                    {concept.name}
                  </span>
                  {concept.mastered && (
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {concept.description}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {concept.templates.slice(0, 2).map((templateId) => (
                    <Badge key={templateId} variant="info" size="sm">
                      {templateId}
                    </Badge>
                  ))}
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0 ml-2" />
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

