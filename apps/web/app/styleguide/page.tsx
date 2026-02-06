"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import { Tooltip } from "@/components/ui/Tooltip";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function StyleguidePage() {
  return (
    <main className="relative min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.08),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(14,165,233,0.08),transparent_35%)]" />
      <div className="container mx-auto px-6 py-16 max-w-6xl">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Solana Playground UI System
            </p>
            <h1 className="text-4xl font-semibold text-foreground">Styleguide</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Canonical reference for typography, surfaces, and UI primitives.
            </p>
          </div>
          <Link
            href="/"
            className="rounded-xl border border-border bg-card/80 px-4 py-2 text-sm text-foreground shadow-sm transition hover:border-primary/50"
          >
            Back to home
          </Link>
        </div>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="panel p-6">
            <h2 className="text-lg font-semibold text-foreground">Badges</h2>
            <p className="text-sm text-muted-foreground">System status and intent labels.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="info">Info</Badge>
              <Badge variant="destructive">Critical</Badge>
            </div>
          </div>

          <div className="panel p-6">
            <h2 className="text-lg font-semibold text-foreground">Status Indicators</h2>
            <p className="text-sm text-muted-foreground">Live process signaling.</p>
            <div className="mt-4 flex items-center gap-4">
              <StatusIndicator status="success" />
              <StatusIndicator status="warning" />
              <StatusIndicator status="info" />
              <StatusIndicator status="error" />
              <StatusIndicator status="loading" />
            </div>
          </div>

          <div className="panel p-6">
            <h2 className="text-lg font-semibold text-foreground">Tooltip</h2>
            <p className="text-sm text-muted-foreground">High-signal helper microcopy.</p>
            <div className="mt-4">
              <Tooltip content="System status is streamed live.">
                <button className="rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground">
                  Hover for detail
                </button>
              </Tooltip>
            </div>
          </div>

          <div className="panel p-6">
            <h2 className="text-lg font-semibold text-foreground">Loading</h2>
            <p className="text-sm text-muted-foreground">Minimal, aligned with the palette.</p>
            <div className="mt-4">
              <LoadingSpinner size="lg" />
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="panel lg:col-span-2">
            <div className="panel-header">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Panel</p>
                <h2 className="text-lg font-semibold text-foreground">Surface hierarchy</h2>
              </div>
              <Badge variant="info">Live</Badge>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-muted-foreground">
                Panels are the primary building block for the playground. They emphasize
                readable layout, soft depth, and clear headers.
              </p>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Sample payload</p>
                <pre className="mt-2 text-xs text-foreground font-mono">
{`accounts: 4
instructions: 2
latency: 380ms`}
                </pre>
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground shadow-sm transition hover:bg-primary-hover">
                  Primary Action
                </button>
                <button className="rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground transition hover:border-primary/50">
                  Secondary Action
                </button>
              </div>
            </div>
          </div>

          <div className="panel p-6">
            <h2 className="text-lg font-semibold text-foreground">Card Stack</h2>
            <p className="text-sm text-muted-foreground">Micro surfaces for dense data.</p>
            <div className="mt-4 space-y-3">
              {[
                { label: "Compute units", value: "32k / 200k" },
                { label: "Accounts touched", value: "4" },
                { label: "Instruction count", value: "2" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-border bg-card/80 px-4 py-3 shadow-sm"
                >
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-semibold text-foreground">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10 panel p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Table</p>
              <h2 className="text-lg font-semibold text-foreground">State summary</h2>
            </div>
            <Badge variant="success">Synced</Badge>
          </div>
          <div className="mt-4 overflow-hidden rounded-xl border border-border">
            <div className="grid grid-cols-3 gap-0 bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <div className="px-4 py-3">Account</div>
              <div className="px-4 py-3">Role</div>
              <div className="px-4 py-3">Status</div>
            </div>
            {[
              { account: "Vault", role: "PDA", status: "Mutable" },
              { account: "Authority", role: "Signer", status: "Verified" },
              { account: "Mint", role: "Program", status: "Readonly" },
            ].map((row) => (
              <div key={row.account} className="grid grid-cols-3 gap-0 border-t border-border bg-card/80">
                <div className="px-4 py-3 text-sm text-foreground font-mono">{row.account}</div>
                <div className="px-4 py-3 text-sm text-muted-foreground">{row.role}</div>
                <div className="px-4 py-3 text-sm text-foreground">{row.status}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
