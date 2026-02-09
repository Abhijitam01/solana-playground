"use client";

import React from "react";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Code2, Loader2 } from "lucide-react";
import { useTemplates } from "@/hooks/use-templates";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export function Examples() {
  const { data: templates = [], isLoading } = useTemplates();

  const difficultyColors = {
    beginner: {
      badge: "bg-[#14F195]/10 text-[#14F195] border border-[#14F195]/20",
      border: "#14F195",
    },
    intermediate: {
      badge: "bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20",
      border: "#F59E0B",
    },
    expert: {
      badge: "bg-[#0EA5E9]/10 text-[#0EA5E9] border border-[#0EA5E9]/20",
      border: "#0EA5E9",
    },
  };

  return (
    <section id="templates" className="relative py-24 px-6">
      <div className="max-w-[1200px] mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-[40px] leading-[1.2] font-bold text-[#0A0A0A] mb-4">
            Start from an example
          </h2>
          <p className="text-lg text-[#525252] max-w-[600px] mx-auto">
            Curated Solana patterns, explained line-by-line
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#14F195] animate-spin" />
          </div>
        ) : (
          <div className="space-y-16">
            {["beginner", "intermediate", "expert"].map((difficulty) => {
              const categoryTemplates = templates.filter(
                (t) => t.difficulty === difficulty
              );

              if (categoryTemplates.length === 0) return null;

              const colors =
                difficultyColors[difficulty as keyof typeof difficultyColors];

              return (
                <motion.div
                  key={difficulty}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={stagger}
                >
                  <h3 className="text-2xl font-bold text-[#0A0A0A] mb-6 capitalize">
                    {difficulty} Examples
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryTemplates.map((template) => (
                      <motion.div key={template.id} variants={fadeUp}>
                        <Link
                          href={`/playground/${template.id}`}
                          className="group block h-full"
                        >
                          <div className="h-full p-6 rounded-lg border border-[#E5E5E5] bg-white hover:border-[#14F195] hover:-translate-y-0.5 transition-all duration-200">
                            <div className="flex items-start justify-between mb-4">
                              <div
                                className="w-12 h-12 rounded-lg flex items-center justify-center"
                                style={{
                                  backgroundColor: `${colors.border}10`,
                                  border: `1px solid ${colors.border}30`,
                                }}
                              >
                                <Code2
                                  className="w-6 h-6"
                                  style={{ color: colors.border }}
                                />
                              </div>
                              <span
                                className={`px-3 py-1 text-xs rounded-full font-semibold capitalize ${colors.badge}`}
                              >
                                {difficulty}
                              </span>
                            </div>
                            <h4 className="text-lg font-bold text-[#0A0A0A] mb-2 group-hover:text-[#14F195] transition-colors">
                              {template.name}
                            </h4>
                            <p className="text-sm text-[#525252] mb-4 line-clamp-2">
                              {template.description}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-[#737373] group-hover:text-[#14F195] transition-colors">
                              <span>Explore template</span>
                              <ArrowRight className="w-4 h-4" />
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
