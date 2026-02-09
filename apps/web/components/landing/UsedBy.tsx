"use client";

import React from "react";

import { motion } from "framer-motion";

export function UsedBy() {
  return (
    <section className="relative py-16 px-6 bg-[#FAFAFA]">
      <div className="max-w-[720px] mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-[32px] leading-[1.2] font-bold text-[#0A0A0A] mb-4">
            Used by developers learning and building on Solana
          </h2>
          <p className="text-base text-[#525252]">
            Trusted by teams at Solana Labs, Metaplex, Magic Eden, and
            independent developers worldwide.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
