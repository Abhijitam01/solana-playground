"use client";

import React from "react";

import { motion } from "framer-motion";
import { Code2, BookOpen, Activity, Sparkles } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Open an example",
    description: "Start with PDAs, tokens, or account management",
    Icon: Code2,
  },
  {
    number: "02",
    title: "Read code with context",
    description: "Hover over instructions for inline explanations",
    Icon: BookOpen,
  },
  {
    number: "03",
    title: "Run and inspect state",
    description: "See accounts, balances, and logs in real-time",
    Icon: Activity,
  },
  {
    number: "04",
    title: "Modify and rerun",
    description: "Experiment safely in a sandboxed environment",
    Icon: Sparkles,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 px-6 bg-[#FAFAFA]">
      <div className="max-w-[1200px] mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-[40px] leading-[1.2] font-bold text-[#0A0A0A] mb-3">
            How it works
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="max-w-[600px] mx-auto space-y-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-start gap-6"
            >
              {/* Number */}
              <div className="flex-shrink-0">
                <span className="inline-block font-mono text-sm font-semibold text-[#14F195]">
                  {step.number}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-[#0A0A0A] mb-2">
                  {step.title}
                </h3>
                <p className="text-base text-[#525252]">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
