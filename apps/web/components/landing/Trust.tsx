"use client";

import React from "react";

import { motion } from "framer-motion";

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

const leftFeatures = [
  "No wallet required",
  "No mainnet risk",
  "Deterministic execution",
  "Same Solana runtime",
  "100% sandboxed environment",
  "Zero configuration needed",
];

const rightFeatures = [
  { icon: "📖", text: "Open source" },
  { icon: "🔄", text: "Active maintenance" },
  { icon: "🤝", text: "Community-driven examples" },
  { icon: "🐛", text: "Issue tracking on GitHub" },
  { icon: "📚", text: "Full documentation" },
  { icon: "💬", text: "Discord community support" },
];

export function Trust() {
  return (
    <section className="relative py-24 px-6">
      <div className="max-w-[1000px] mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-[40px] leading-[1.2] font-bold text-[#0A0A0A] mb-4">
            Built for developers
          </h2>
          <p className="text-lg text-[#525252]">
            Safe, secure, and designed for experimentation.
          </p>
        </motion.div>

        {/* Two Columns */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 gap-16"
        >
          {/* Left Column - Checkmarks */}
          <motion.div variants={fadeUp} className="space-y-3">
            {leftFeatures.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="text-[#14F195] text-lg mt-0.5">✓</span>
                <span className="text-base text-[#0A0A0A]">{feature}</span>
              </div>
            ))}
          </motion.div>

          {/* Right Column - Icons */}
          <motion.div variants={fadeUp} className="space-y-3">
            {rightFeatures.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="text-lg mt-0.5">{feature.icon}</span>
                <span className="text-base text-[#0A0A0A]">{feature.text}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
