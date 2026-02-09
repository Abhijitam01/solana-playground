"use client";

import React from "react";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function Hero() {
  return (
    <section className="relative pt-32 pb-24 px-6">
      <div className="max-w-[720px] mx-auto text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="space-y-8"
        >
          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-[56px] leading-[1.1] font-bold tracking-tight text-foreground"
          >
            The Solana Playground you needed.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeUp}
            className="text-lg leading-relaxed text-muted-foreground max-w-[600px] mx-auto"
          >
            Run real Solana programs. Watch state transform.
            <br />
            Understand execution—not just syntax.
            <br />
            Zero setup. No wallet. Open source.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUp}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <Link
              href="/playground/hello-anchor"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#14F195] text-[#0A0A0A] rounded-lg font-semibold text-base hover:opacity-90 transition-opacity duration-200"
            >
              Open Playground
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#templates"
              className="inline-flex items-center gap-2 px-6 py-3 bg-transparent text-foreground border border-border rounded-lg font-medium text-base hover:bg-muted/50 transition-colors duration-200"
            >
              Browse Examples
            </Link>
          </motion.div>

          {/* Fast Facts Bar */}
          <motion.div
            variants={fadeUp}
            className="flex items-center justify-center gap-3 text-sm text-muted-foreground flex-wrap mt-8"
          >
            <span className="flex items-center gap-1.5">
              ⚡ Zero setup
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              🔒 Sandboxed
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              📖 Open source
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              🚀 Active maintenance
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
