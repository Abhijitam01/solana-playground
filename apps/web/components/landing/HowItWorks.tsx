"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Open an example",
    desc: "Start with PDAs, tokens, or account management"
  },
  {
    number: "02",
    title: "Read code with context",
    desc: "Hover over instructions for inline explanations"
  },
  {
    number: "03",
    title: "Run and inspect state",
    desc: "See accounts, balances, and logs in real-time"
  },
  {
    number: "04",
    title: "Modify and rerun",
    desc: "Experiment safely in a sandboxed environment"
  }
];

export function HowItWorks() {
  return (
    <section className="py-24 px-6 bg-[#0A0A0A]">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-[40px] font-bold text-[#FAFAFA] mb-16">How it works</h2>
        
        <div className="max-w-[600px] space-y-12">
          {steps.map((step, idx) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex gap-6 group"
            >
              <span className="text-sm font-mono font-bold text-[#14F195] pt-1">
                {step.number}
              </span>
              <div>
                <h3 className="text-xl font-semibold text-[#FAFAFA] mb-2 group-hover:text-[#14F195] transition-colors">
                  {step.title}
                </h3>
                <p className="text-[#737373]">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
