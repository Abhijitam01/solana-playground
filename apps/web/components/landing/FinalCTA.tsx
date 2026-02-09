"use client";

import React from "react";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="relative py-24 px-6 bg-[#FAFAFA]">
      <div className="max-w-[600px] mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h2 className="text-[40px] leading-[1.2] font-bold text-[#0A0A0A]">
            Start understanding Solana
          </h2>
          <p className="text-base text-[#525252]">
            No setup. No risk. Just real programs and real execution.
          </p>
          <Link
            href="/playground/hello-anchor"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#14F195] text-[#0A0A0A] rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity duration-200"
          >
            Open Solana Playground
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
