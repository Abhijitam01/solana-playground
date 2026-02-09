"use client";

import React from "react";

import { motion } from "framer-motion";
import { Activity, Terminal } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

export function ProductDemo() {
  return (
    <section className="relative py-20 px-6 bg-[#0A0A0A]">
      <div className="max-w-[1200px] mx-auto">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-xs font-semibold tracking-wider text-[#888888] uppercase mb-6">
            SEE IT IN ACTION
          </p>
        </motion.div>

        {/* Screenshot Mockup */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="relative"
        >
          <div className="border border-[#333333] rounded-xl overflow-hidden bg-[#000000] shadow-2xl shadow-black/50">
            {/* Editor Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[#333333] bg-[#111111]">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              <span className="text-sm font-mono text-[#888888]">vault.rs</span>
            </div>

            {/* Editor Content - Split Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-[#333333]">
              {/* Code Editor Panel */}
              <div className="lg:col-span-3 p-6 font-mono text-sm bg-[#000000]">
                <pre className="text-[#E5E5E5] leading-relaxed">
                  <code>
                    <span className="text-[#0066CC]">use</span>{" "}
                    <span className="text-[#14F195]">anchor_lang</span>::prelude::*;
                    {"\n\n"}
                    <span className="text-[#737373]">
                      {"// Initialize vault account"}
                    </span>
                    {"\n"}
                    <span className="text-[#0066CC]">pub fn</span>{" "}
                    <span className="text-[#0A0A0A]">initialize</span>(
                    {"\n"}
                    {"    "}ctx: Context&lt;Initialize&gt;,
                    {"\n"}
                    {"    "}amount: <span className="text-[#DC2626]">u64</span>
                    {"\n"}
                    ) -&gt; Result&lt;()&gt; {"{"}
                    {"\n"}
                    {"    "}
                    <span className="text-[#0066CC]">let</span> vault = &amp;
                    <span className="text-[#0066CC]">mut</span> ctx.accounts.vault;
                    {"\n"}
                    {"    "}vault.authority = ctx.accounts.authority.key();
                    {"\n"}
                    {"    "}vault.balance = <span className="text-[#DC2626]">0</span>;
                    {"\n"}
                    {"    \n"}
                    {"    "}
                    <span className="text-[#14F195]">msg!</span>(
                    <span className="text-[#CA8A04]">&quot;Vault initialized&quot;</span>);
                    {"\n"}
                    {"    "}Ok(())
                    {"\n"}
                    {"}"}
                    {"\n\n"}
                    <span className="text-[#0066CC]">#[account]</span>
                    {"\n"}
                    <span className="text-[#0066CC]">pub struct</span> Vault {"{"}
                    {"\n"}
                    {"    "}
                    <span className="text-[#0066CC]">pub</span> authority: Pubkey,
                    {"\n"}
                    {"    "}
                    <span className="text-[#0066CC]">pub</span> balance:{" "}
                    <span className="text-[#DC2626]">u64</span>,
                    {"\n"}
                    {"}"}
                  </code>
                </pre>
              </div>

              {/* State & Execution Panel */}
              <div className="lg:col-span-2 p-6 bg-[#FAFAFA]">
                {/* Live State */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-[#737373] uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Activity className="w-3 h-3" />
                    Account State
                  </h4>
                  <div className="space-y-2">
                    <div className="p-3 rounded-lg bg-white border border-[#E5E5E5]">
                      <div className="text-xs text-[#737373] mb-1">
                        Account: <span className="text-[#0A0A0A] font-mono">vault</span>
                      </div>
                      <div className="text-xs font-mono space-y-1">
                        <div>
                          <span className="text-[#737373]">├─ authority:</span>{" "}
                          <span className="text-[#14F195]">Fg6P...n4Zq</span>
                        </div>
                        <div>
                          <span className="text-[#737373]">├─ balance:</span>{" "}
                          <span className="text-[#0A0A0A]">0 SOL</span>
                        </div>
                        <div>
                          <span className="text-[#737373]">└─ discriminator:</span>{" "}
                          <span className="text-[#737373]">[140, 151, 37...]</span>
                        </div>
                      </div>
                      <div className="mt-2 text-xs">
                        <span className="text-[#14F195]">✓</span> Initialized
                      </div>
                    </div>
                  </div>
                </div>

                {/* Execution Log */}
                <div>
                  <h4 className="text-xs font-bold text-[#737373] uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Terminal className="w-3 h-3" />
                    Execution Log
                  </h4>
                  <div className="space-y-1.5 font-mono text-xs">
                    <div className="flex items-start gap-2 text-[#14F195]">
                      <span>→</span>
                      <span>Program invoked</span>
                    </div>
                    <div className="flex items-start gap-2 text-[#14F195]">
                      <span>→</span>
                      <span>Account created (vault)</span>
                    </div>
                    <div className="flex items-start gap-2 text-[#14F195]">
                      <span>→</span>
                      <span>PDA derived: Fg6P...n4Zq</span>
                    </div>
                    <div className="flex items-start gap-2 text-[#14F195]">
                      <span>✓</span>
                      <span>Vault initialized</span>
                    </div>
                    <div className="flex items-start gap-2 text-[#14F195]">
                      <span>✓</span>
                      <span>Transaction successful</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Caption */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center text-base text-[#525252] mt-8 max-w-[600px] mx-auto"
        >
          Unlike the original Solana Playground, every execution shows you
          exactly what changed—accounts, balances, and state.
        </motion.p>
      </div>
    </section>
  );
}
