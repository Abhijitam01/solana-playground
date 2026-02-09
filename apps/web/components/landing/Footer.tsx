"use client";

import React from "react";

import { Github, Twitter, MessageSquare, BookOpen } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative py-12 px-6 border-t border-[#E5E5E5]">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left Side */}
          <div className="text-center md:text-left">
            <p className="text-sm text-[#737373]">
              © 2024 Solana Playground
            </p>
            <p className="text-sm text-[#737373] mt-1">
              Open Source • MIT License
            </p>
          </div>

          {/* Right Side - Links */}
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/solana-playground"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#525252] hover:text-[#0A0A0A] transition-colors text-sm"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="/docs"
              className="text-[#525252] hover:text-[#0A0A0A] transition-colors text-sm"
            >
              <BookOpen className="w-5 h-5" />
            </a>
            <a
              href="https://discord.gg/solana"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#525252] hover:text-[#0A0A0A] transition-colors text-sm"
            >
              <MessageSquare className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com/solana"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#525252] hover:text-[#0A0A0A] transition-colors text-sm"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
