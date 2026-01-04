"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePlaygroundStore } from "@/stores/playground";
import { useTemplates } from "@/hooks/use-templates";
import type { TemplateMetadata } from "@solana-playground/types";
import { Home, ChevronLeft, ChevronRight, Play, Database, Badge as BadgeIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import { Tooltip } from "@/components/ui/Tooltip";

interface TemplateHeaderProps {
  template: {
    id: string;
    metadata: TemplateMetadata;
  };
}

export function TemplateHeader({ template }: TemplateHeaderProps) {
  const router = useRouter();
  const { data: templates } = useTemplates();
  const { executionMode, setExecutionMode } = usePlaygroundStore();

  const currentIndex = templates?.findIndex((t) => t.id === template.id) ?? -1;
  const hasNext = currentIndex >= 0 && currentIndex < (templates?.length ?? 0) - 1;
  const hasPrev = currentIndex > 0;
  const nextTemplate = hasNext ? templates?.[currentIndex + 1] : null;
  const prevTemplate = hasPrev ? templates?.[currentIndex - 1] : null;

  return (
    <header className="border-b border-border bg-card shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Tooltip content="Back to templates">
              <Link
                href="/"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-fast"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
            </Tooltip>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-3">
              {hasPrev && (
                <Tooltip content={`Previous: ${prevTemplate?.metadata.name}`}>
                  <button
                    onClick={() => router.push(`/playground/${prevTemplate!.id}`)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-fast"
                    aria-label="Previous template"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </Tooltip>
              )}
              <div className="flex flex-col">
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold text-foreground">
                    {template.metadata.name}
                  </h1>
                  <Badge
                    variant={template.metadata.difficulty === "beginner" ? "success" : "info"}
                    size="sm"
                  >
                    {template.metadata.difficulty}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {template.metadata.description}
                </p>
              </div>
              {hasNext && (
                <Tooltip content={`Next: ${nextTemplate?.metadata.name}`}>
                  <button
                    onClick={() => router.push(`/playground/${nextTemplate!.id}`)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-fast"
                    aria-label="Next template"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </Tooltip>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
              <Tooltip content="Use pre-computed execution results">
                <button
                  onClick={() => setExecutionMode("precomputed")}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-fast flex items-center gap-2 ${
                    executionMode === "precomputed"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Database className="w-4 h-4" />
                  <span>Pre-computed</span>
                </button>
              </Tooltip>
              <Tooltip content="Execute code live (coming soon)">
                <button
                  onClick={() => setExecutionMode("live")}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-fast flex items-center gap-2 ${
                    executionMode === "live"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Play className="w-4 h-4" />
                  <span>Live</span>
                </button>
              </Tooltip>
            </div>
            <StatusIndicator
              status={executionMode === "precomputed" ? "success" : "info"}
              size="sm"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

