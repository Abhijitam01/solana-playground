"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Zap, Lock, BookOpen, Rocket } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export function Hero() {
  // Allow direct access to playground - no auth check needed
  // Auth will be required when user tries to edit code

  return (
    <section className="relative pt-32 sm:pt-40 pb-20 sm:pb-32 px-4 sm:px-6 flex items-center justify-center bg-[#0A0A0A] text-[#FAFAFA] border-b border-[#262626] min-h-[70vh] sm:min-h-[80vh] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:64px_64px]">
      <div className="max-w-[1200px] w-full text-center relative z-10 px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div variants={fadeUp} className="mb-6 flex justify-center">
            <span className="px-3 py-1 text-xs font-mono text-[#14F195] border border-[#14F195]/20 bg-[#14F195]/5 rounded uppercase tracking-wider">
              v1.0 Public Beta
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-[36px] leading-[1.1] sm:text-[48px] md:text-[64px] lg:text-[80px] xl:text-[96px] font-bold tracking-tight mb-6 sm:mb-8 text-white px-2"
          >
            The Solana Playground
            <br />
            <span className="text-[#14F195]">you needed.</span>
          </motion.h1>
          
          <motion.p
            variants={fadeUp}
            className="text-[16px] leading-[24px] sm:text-[18px] sm:leading-[28px] md:text-[20px] md:leading-[32px] lg:text-[22px] text-[#A3A3A3] mb-8 sm:mb-12 max-w-[600px] mx-auto px-4"
          >
            Run real Solana programs. Watch state transform. 
            Understand execution—not just syntax.
            Zero setup. No wallet. Open source.
          </motion.p>
          
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 mb-8 sm:mb-12 px-4"
          >
            <Link
              href="/playground/hello-solana"
              className="w-full sm:w-auto bg-[#FAFAFA] text-[#0A0A0A] px-8 sm:px-10 py-3 sm:py-4 rounded text-sm sm:text-base font-semibold hover:bg-white transition-colors text-center"
            >
              Open Playground
            </Link>
            <a
              href="#examples"
              className="w-full sm:w-auto bg-transparent text-[#A3A3A3] border border-[#262626] px-8 sm:px-10 py-3 sm:py-4 rounded text-sm sm:text-base font-medium hover:text-[#FAFAFA] hover:border-[#525252] transition-colors text-center"
            >
              Browse Examples
            </a>
          </motion.div>

          {/* Fast Facts - Grid Style */}
          <motion.div
            variants={fadeUp}
            className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#262626] border border-[#262626] rounded-lg overflow-hidden max-w-3xl mx-auto w-full"
          >
            {[
              { icon: Zap, text: "Zero setup" },
              { icon: Lock, text: "Sandboxed" },
              { icon: BookOpen, text: "Open source" },
              { icon: Rocket, text: "Active dev" },
            ].map((fact, i) => (
              <div key={i} className="flex items-center justify-center gap-2 sm:gap-3 py-4 sm:py-5 md:py-6 bg-[#0A0A0A] text-xs sm:text-sm md:text-base text-[#A3A3A3] hover:text-[#FAFAFA] hover:bg-[#111111] transition-all px-3 sm:px-4">
                <fact.icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 flex-shrink-0" />
                <span className="font-medium">{fact.text}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
