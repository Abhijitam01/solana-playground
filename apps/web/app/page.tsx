"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useTemplates } from "@/hooks/use-templates";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Search, Filter, BookOpen, Code, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { data: templates, isLoading } = useTemplates();
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<
    "all" | "beginner" | "intermediate"
  >("all");

  const filteredTemplates = useMemo(() => {
    if (!templates) return [];

    return templates.filter((template) => {
      const matchesSearch =
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty =
        difficultyFilter === "all" || template.difficulty === difficultyFilter;

      return matchesSearch && matchesDifficulty;
    });
  }, [templates, searchQuery, difficultyFilter]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-primary-light/5 to-accent/5 dark:from-background dark:via-primary-light/10 dark:to-accent/10">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="gradient-text">Solana Developer</span>
              <br />
              <span className="text-foreground">Playground</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Learn Solana programming through interactive, explorable code.
              Master on-chain concepts with line-by-line explanations and
              visual state tracking.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-primary" />
                <span>Interactive Code</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                <span>Line-by-Line Explanations</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <span>Live Execution</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="container mx-auto px-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search templates by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus-ring transition-all duration-fast focus:border-primary"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <select
                value={difficultyFilter}
                onChange={(e) =>
                  setDifficultyFilter(
                    e.target.value as "all" | "beginner" | "intermediate"
                  )
                }
                className="pl-10 pr-8 py-3 rounded-lg border border-border bg-card text-foreground focus-ring transition-all duration-fast focus:border-primary appearance-none cursor-pointer"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
              </select>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Templates Grid */}
      <div className="container mx-auto px-4 pb-16">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredTemplates.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="inline-block p-4 rounded-full bg-muted mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-lg text-muted-foreground mb-2">
              No templates found
            </p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
          >
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link
                  href={`/playground/${template.id}`}
                  className="group block h-full"
                >
                  <div className="h-full p-6 bg-card rounded-xl border border-border hover:border-primary/50 transition-all duration-normal shadow-sm hover:shadow-lg hover:shadow-primary/5 flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-fast">
                        {template.name}
                      </h3>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          template.difficulty === "beginner"
                            ? "bg-success-light text-success"
                            : "bg-info-light text-info"
                        }`}
                      >
                        {template.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 flex-grow leading-relaxed">
                      {template.description}
                    </p>
                    <div className="flex items-center text-sm text-primary group-hover:gap-2 transition-all duration-fast">
                      <span className="font-medium">Explore template</span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-fast">
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </main>
  );
}

