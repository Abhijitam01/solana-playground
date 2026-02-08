"use client";

import Link from "next/link";

export default function SolanaPlaygroundLanding() {
  return (
    <div className="landing">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap");

        :root {
          --ink: #1a1a1a;
          --ink-soft: #3b3b3b;
          --mist: #f5f4f1;
          --mist-2: #efeee9;
          --line: rgba(26, 26, 26, 0.14);
          --accent: #2f6f62;
          --accent-soft: rgba(47, 111, 98, 0.12);
          --shadow: 0 24px 60px rgba(26, 26, 26, 0.08);
          --radius: 24px;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>

      <div className="backdrop" />
      <div className="grain" />

      <nav className="nav">
        <div className="nav-inner">
          <Link href="/" className="logo">
            <span className="logo-mark" />
            <span className="logo-text">Solana Playground</span>
          </Link>
          <div className="nav-links">
            <a href="#features" className="nav-link">
              Features
            </a>
            <a href="#how" className="nav-link">
              How it works
            </a>
          </div>
          <Link href="/" className="nav-cta">
            Start in the playground
          </Link>
        </div>
      </nav>

      <main className="main">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">Solana Playground</p>
            <h1>Build Solana experiences.</h1>
            <p className="lead">
              A calm, focused environment to explore templates, visualize state,
              and understand every line before you deploy.
            </p>
            <div className="hero-actions">
              <Link href="/" className="primary">
                Start in the playground
              </Link>
              <a href="#features" className="secondary">
                See what’s inside
              </a>
            </div>
          </div>
          <div className="hero-panel">
            <div className="panel-header">
              <span>Preview workspace</span>
              <span className="pill">No setup</span>
            </div>
            <div className="panel-body">
              <div className="panel-row">
                <span className="panel-label">Template</span>
                <span className="panel-value">PDA Vault</span>
              </div>
              <div className="panel-row">
                <span className="panel-label">Network</span>
                <span className="panel-value">Local sandbox</span>
              </div>
              <div className="panel-row">
                <span className="panel-label">Feedback</span>
                <span className="panel-value">State diff + traces</span>
              </div>
              <div className="panel-divider" />
              <div className="panel-metrics">
                <div>
                  <div className="metric">24</div>
                  <div className="metric-label">Templates</div>
                </div>
                <div>
                  <div className="metric">2</div>
                  <div className="metric-label">Learning paths</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="features">
          <div className="section-heading">
            <p className="eyebrow">Designed for Solana builders</p>
            <h2>Every detail supports deep understanding.</h2>
          </div>
          <div className="feature-grid">
            <div className="card">
              <h3>Guided templates</h3>
              <p>
                Start from curated programs with clear goals, shared patterns,
                and consistent structure.
              </p>
            </div>
            <div className="card">
              <h3>Explainable execution</h3>
              <p>
                Inspect instruction flow, account changes, and runtime logs as
                you iterate.
              </p>
            </div>
            <div className="card">
              <h3>State-first UI</h3>
              <p>
                Watch pre/post state in context so you can reason about every
                mutation.
              </p>
            </div>
          </div>
        </section>

        <section id="how" className="how">
          <div className="section-heading">
            <p className="eyebrow">How it works</p>
            <h2>A short path from idea to understanding.</h2>
          </div>
          <div className="timeline">
            <div className="timeline-step">
              <span className="step-index">01</span>
              <div>
                <h3>Pick a template</h3>
                <p>Choose from a focused library of core Solana patterns.</p>
              </div>
            </div>
            <div className="timeline-step">
              <span className="step-index">02</span>
              <div>
                <h3>Trace the flow</h3>
                <p>Follow the instruction map, accounts, and derived addresses.</p>
              </div>
            </div>
            <div className="timeline-step">
              <span className="step-index">03</span>
              <div>
                <h3>Run and compare</h3>
                <p>See diffs, logs, and state changes side-by-side.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="cta">
          <div className="cta-card">
            <div>
              <p className="eyebrow">Ready when you are</p>
              <h2>Start building in minutes.</h2>
              <p className="lead">
                No local toolchain, no wallet setup, just a clean slate for
                learning.
              </p>
            </div>
            <Link href="/" className="primary">
              Start in the playground
            </Link>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <div>
            <div className="footer-brand">Solana Playground</div>
            <div className="footer-note">
              A learning-first environment for Solana programs.
            </div>
          </div>
          <div className="footer-links">
            <a href="#features">Features</a>
            <a href="#how">How it works</a>
            <a href="/">Launch</a>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .landing {
          min-height: 100vh;
          background: var(--mist);
          color: var(--ink);
          font-family: "IBM Plex Sans", "Segoe UI", sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        .backdrop {
          position: fixed;
          inset: 0;
          background: radial-gradient(1200px at 20% 10%, #ffffff, transparent 60%),
            radial-gradient(900px at 80% 0%, rgba(47, 111, 98, 0.14), transparent 55%),
            linear-gradient(180deg, var(--mist), var(--mist-2));
          z-index: 0;
        }

        .grain {
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)' opacity='0.2'/%3E%3C/svg%3E");
          mix-blend-mode: multiply;
          opacity: 0.08;
          pointer-events: none;
          z-index: 1;
        }

        .nav {
          position: sticky;
          top: 0;
          z-index: 4;
          backdrop-filter: blur(16px);
          background: rgba(245, 244, 241, 0.8);
          border-bottom: 1px solid var(--line);
        }

        .nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        .logo {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: inherit;
          font-weight: 600;
          font-size: 16px;
          font-family: "Space Grotesk", sans-serif;
        }

        .logo-mark {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 0 6px var(--accent-soft);
        }

        .nav-links {
          display: flex;
          gap: 24px;
          font-size: 14px;
        }

        .nav-link {
          text-decoration: none;
          color: var(--ink-soft);
          transition: color 0.2s ease;
        }

        .nav-link:hover {
          color: var(--ink);
        }

        .nav-cta {
          text-decoration: none;
          padding: 10px 18px;
          border-radius: 999px;
          background: var(--accent);
          color: #fff;
          font-size: 14px;
          font-weight: 600;
        }

        .main {
          position: relative;
          z-index: 2;
          max-width: 1200px;
          margin: 0 auto;
          padding: 72px 32px 120px;
          display: flex;
          flex-direction: column;
          gap: 120px;
        }

        .hero {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 48px;
          align-items: center;
        }

        .hero-copy h1 {
          font-family: "Space Grotesk", sans-serif;
          font-size: clamp(40px, 6vw, 72px);
          margin: 16px 0 20px;
          line-height: 1.05;
        }

        .eyebrow {
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-size: 11px;
          color: var(--ink-soft);
          margin: 0;
        }

        .lead {
          font-size: 18px;
          line-height: 1.7;
          color: var(--ink-soft);
          margin: 0;
        }

        .hero-actions {
          display: flex;
          gap: 16px;
          margin-top: 28px;
          align-items: center;
        }

        .primary {
          background: var(--accent);
          color: #fff;
          text-decoration: none;
          padding: 14px 24px;
          border-radius: 999px;
          font-weight: 600;
          box-shadow: var(--shadow);
        }

        .secondary {
          color: var(--ink);
          text-decoration: none;
          font-weight: 500;
        }

        .hero-panel {
          background: #fff;
          border-radius: var(--radius);
          padding: 28px;
          box-shadow: var(--shadow);
          border: 1px solid rgba(26, 26, 26, 0.08);
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          color: var(--ink-soft);
          margin-bottom: 24px;
        }

        .pill {
          background: var(--accent-soft);
          color: var(--accent);
          border-radius: 999px;
          padding: 6px 12px;
          font-weight: 600;
        }

        .panel-body {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .panel-row {
          display: flex;
          justify-content: space-between;
          font-size: 15px;
        }

        .panel-label {
          color: var(--ink-soft);
        }

        .panel-value {
          font-weight: 600;
        }

        .panel-divider {
          height: 1px;
          background: var(--line);
          margin: 8px 0;
        }

        .panel-metrics {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .metric {
          font-size: 28px;
          font-weight: 600;
          font-family: "Space Grotesk", sans-serif;
        }

        .metric-label {
          font-size: 12px;
          color: var(--ink-soft);
          text-transform: uppercase;
          letter-spacing: 0.15em;
        }

        .section-heading h2 {
          font-family: "Space Grotesk", sans-serif;
          font-size: clamp(28px, 4vw, 48px);
          margin: 12px 0 0;
        }

        .features {
          display: flex;
          flex-direction: column;
          gap: 48px;
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
        }

        .card {
          background: #fff;
          border-radius: 20px;
          padding: 28px;
          border: 1px solid rgba(26, 26, 26, 0.08);
          box-shadow: 0 20px 40px rgba(26, 26, 26, 0.06);
        }

        .card h3 {
          margin-top: 0;
          font-family: "Space Grotesk", sans-serif;
        }

        .card p {
          color: var(--ink-soft);
          line-height: 1.6;
          margin-bottom: 0;
        }

        .how {
          display: flex;
          flex-direction: column;
          gap: 48px;
        }

        .timeline {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
        }

        .timeline-step {
          padding: 24px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(26, 26, 26, 0.08);
        }

        .step-index {
          font-family: "Space Grotesk", sans-serif;
          font-size: 12px;
          letter-spacing: 0.2em;
          color: var(--accent);
        }

        .timeline-step h3 {
          margin: 10px 0 8px;
        }

        .timeline-step p {
          margin: 0;
          color: var(--ink-soft);
        }

        .cta {
          display: flex;
          justify-content: center;
        }

        .cta-card {
          width: min(900px, 100%);
          background: #fff;
          border-radius: 28px;
          padding: 40px;
          border: 1px solid rgba(26, 26, 26, 0.08);
          box-shadow: var(--shadow);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        .cta-card h2 {
          font-family: "Space Grotesk", sans-serif;
          margin: 8px 0 16px;
        }

        .footer {
          border-top: 1px solid var(--line);
          padding: 40px 0 60px;
          position: relative;
          z-index: 2;
        }

        .footer-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          color: var(--ink-soft);
        }

        .footer-brand {
          font-family: "Space Grotesk", sans-serif;
          font-weight: 600;
          color: var(--ink);
        }

        .footer-note {
          font-size: 13px;
        }

        .footer-links {
          display: flex;
          gap: 20px;
          font-size: 14px;
        }

        .footer-links a {
          text-decoration: none;
          color: inherit;
        }

        @media (max-width: 960px) {
          .hero {
            grid-template-columns: 1fr;
          }

          .feature-grid,
          .timeline {
            grid-template-columns: 1fr;
          }

          .cta-card {
            flex-direction: column;
            align-items: flex-start;
          }

          .nav-links {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
