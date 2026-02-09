"use client";

import React from "react";

import { motion } from "framer-motion";

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
      staggerChildren: 0.15,
    },
  },
};

const columns = [
  {
    icon: "❌ → ✅",
    before: "Code without context",
    after: "Every line explained",
    detail:
      "Inline explanations for instructions, accounts, and Anchor macros.",
  },
  {
    icon: "👁️",
    before: "Hidden state changes",
    after: "Watch accounts transform",
    detail:
      "Real-time visualization of account data, PDAs, and lamport transfers.",
  },
  {
    icon: "🔬",
    before: "Trial and error",
    after: "Understand on first read",
    detail: "Execution logs map to your code line-by-line. No guessing.",
  },
];

export function WhySwitch() {
  return (
    <section className="relative py-24 px-6">
      <div className="max-w-[1200px] mx-auto">
        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[40px] leading-[1.2] font-bold text-[#0A0A0A] text-center mb-16"
        >
          Why developers are switching
        </motion.h2>

        {/* Three Columns */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-12"
        >
          {columns.map((column, index) => (
            <motion.div
              key={index}
              variants={fadeUp}
              className="max-w-[360px] text-left"
            >
              {/* Icon */}
              <div className="text-[32px] mb-6">{column.icon}</div>

              {/* Before/After */}
              <div className="mb-4">
                <p className="text-sm text-[#737373] mb-1">
                  <span className="line-through">Before:</span> {column.before}
                </p>
                <p className="text-lg font-semibold text-[#0A0A0A]">
                  After: {column.after}
                </p>
              </div>

              {/* Detail */}
              <p className="text-base text-[#525252] leading-relaxed">
                {column.detail}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
