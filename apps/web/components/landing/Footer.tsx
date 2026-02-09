"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Github, Twitter } from "lucide-react";


export function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-[#1a1a1a] relative z-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:64px_64px]">
      {/* Moon-like Arc at Top */}
      <div className="absolute top-0 left-0 w-full h-10 overflow-hidden pointer-events-none">
        <svg
          className="w-full h-full"
          viewBox="0 0 1200 40"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 0,40 Q 600,0 1200,40"
            stroke="#000000"
            strokeWidth="1.5"
            strokeOpacity="0.4"
            fill="none"
          />
        </svg>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1fr] gap-8 lg:gap-10 mb-10">
          {/* Brand Section */}
          <div className="flex flex-col gap-4 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <Image
                src="/logo/og.png"
                alt="Solana Atlas"
                width={50}
                height={50}
                className="w-[50px] h-[50px] flex-shrink-0 object-contain"
                unoptimized
              />
              <h2 className="text-xl font-semibold tracking-[0.05em] text-white">
                SOLANA ATLAS
              </h2>
            </div>
            <p className="text-[#888] leading-relaxed text-[0.95rem] max-w-[320px]">
              Interactive playground for learning Solana development. Run real
              programs, visualize state, and understand execution—all in your
              browser.
            </p>
            <div className="flex gap-3">
              <a
                href="https://github.com/Abhijitam01"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg flex items-center justify-center text-[#888] hover:bg-[#2a2a2a] hover:border-[#3a3a3a] hover:text-white transition-all"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://x.com/Abhijitam_"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg flex items-center justify-center text-[#888] hover:bg-[#2a2a2a] hover:border-[#3a3a3a] hover:text-white transition-all"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h3 className="text-[0.75rem] font-semibold tracking-[0.1em] uppercase text-[#666] mb-4">
              Product
            </h3>
            <ul className="flex flex-col gap-2.5 list-none">
              <li>
                <Link
                  href="/playground/hello-solana"
                  className="text-[#999] text-[0.95rem] hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  Playground
                </Link>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="text-[#999] text-[0.95rem] hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  How it works
                </a>
              </li>
              <li>
                <a
                  href="#examples"
                  className="text-[#999] text-[0.95rem] hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  Examples
                </a>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="text-[0.75rem] font-semibold tracking-[0.1em] uppercase text-[#666] mb-4">
              Resources
            </h3>
            <ul className="flex flex-col gap-2.5 list-none">
              <li>
                <a
                  href="https://github.com/Abhijitam01/solana-playground"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#999] text-[0.95rem] hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  Codebase{" "}
                  <span className="text-[0.75rem] opacity-50">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Abhijitam01/solana-playground"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#999] text-[0.95rem] hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Abhijitam01"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#999] text-[0.95rem] hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          {/* Community Column */}
          <div>
            <h3 className="text-[0.75rem] font-semibold tracking-[0.1em] uppercase text-[#666] mb-4">
              Community
            </h3>
            <ul className="flex flex-col gap-2.5 list-none">
              <li>
                <a
                  href="https://x.com/Abhijitam_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#999] text-[0.95rem] hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  Twitter{" "}
                  <span className="text-[0.75rem] opacity-50">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://discord.gg/solana"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#999] text-[0.95rem] hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  Discord
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-[0.75rem] font-semibold tracking-[0.1em] uppercase text-[#666] mb-4">
              Legal
            </h3>
            <ul className="flex flex-col gap-2.5 list-none">
              <li>
                <a
                  href="#"
                  className="text-[#999] text-[0.95rem] hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#999] text-[0.95rem] hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#1a1a1a] pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-[#666] text-sm">
            © 2026 Solana Atlas. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-[#666]">
            <a
              href="#"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors"
            >
              Cookies Settings
            </a>
          </div>
        </div>
      </div>

      {/* Large Background Text - Similar to GRAPHY style */}
      <div className="w-full relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="text-center select-none pointer-events-none"
            style={{
              fontSize: 'clamp(8rem, 20vw, 24rem)',
              fontWeight: '900',
              letterSpacing: '-0.05em',
              lineHeight: '1',
              color: '#1a1a1a', // Dark gray, similar to the GRAPHY image
              whiteSpace: 'nowrap',
              fontFamily: 'sans-serif',
            }}
          >
            ATLAS
          </div>
        </div>
      </div>




</footer>
  );
}
