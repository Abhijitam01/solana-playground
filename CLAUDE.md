# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Solana Atlas is a learning-first Solana developer playground. Users explore on-chain programs through runnable code with line-by-line explanations. Live at solana-atlas.xyz.

## Monorepo Structure

Turborepo + pnpm workspaces. All packages use `@solana-playground/*` scope.

- **apps/web** — Next.js 14 (App Router) frontend on port 3000
- **apps/api** — Express.js API service on port 3001
- **apps/runner** — Solana program execution sandbox on port 3002
- **packages/types** — Shared Zod schemas and TypeScript interfaces
- **packages/solana** — 24 program templates with metadata, explanations, tests, diagrams
- **packages/db** — Drizzle ORM + PostgreSQL schema and client
- **packages/auth** — Auth utilities (bcryptjs, JWT)
- **packages/exercises** — Exercise validation
- **packages/template-cli** — CLI for template init/validate/preview
- **packages/config/** — Shared tsconfig, eslint, tailwind configs

## Commands

```bash
pnpm install                    # Install all dependencies
pnpm dev                        # Start all dev servers
pnpm build                      # Build all packages and apps
pnpm lint                       # Lint all packages
pnpm type-check                 # Type-check all packages

# Target specific apps
pnpm --filter @solana-playground/web dev
pnpm --filter @solana-playground/web test
pnpm --filter @solana-playground/web test:e2e
pnpm --filter @solana-playground/api dev
pnpm --filter @solana-playground/api test

# Database
pnpm --filter @solana-playground/db generate   # Generate Drizzle migrations
pnpm --filter @solana-playground/db push        # Push schema to DB

# Template validation
pnpm --filter @solana-playground/template-cli build && node packages/template-cli/dist/cli.js validate
```

## Architecture

**Three-service model:** Web serves the frontend + tRPC/REST API routes. API handles templates, auth, progress, analytics, explanations, and proxies execution to Runner. Runner compiles and executes Solana programs in an isolated sandbox.

**Data flow pattern:** Template data flows through Next.js API routes (REST), user data mutations use tRPC. tRPC routers live at `apps/web/server/routers/` (auth, code, profile).

**State management:** Zustand stores in `apps/web/stores/` — key stores are `playground.ts` (core state), `programs.ts` (sessions), `execution.ts`, `layout.ts` (panels/zen mode), `settings.ts` (theme/editor prefs), `terminal.ts` (output buffering).

**Template system:** Each template in `packages/solana/templates/*/` contains `program/lib.rs`, `metadata.json`, `line-explanations.json`, `program-map.json`, `precomputed-state.json`, `function-specs.json`, `checklist.json`, `mermaid-diagram.txt`, and `test.ts`. The template loader validates all data against Zod schemas. 100% line explanation coverage is enforced.

**In-browser tests:** Each template has Mocha/Chai behavioral tests (`test.ts`) that run in the browser via xterm. The TestPanel renders pass/fail results.

## Key Technical Details

- **Import aliases:** `@/*` for web app local imports, `@solana-playground/*` for workspace packages
- **TypeScript:** Strict mode, ES2022 target, bundler module resolution
- **Styling:** Tailwind CSS with `darkMode: "class"`, HSL CSS variable design tokens
- **Auth:** Supabase Auth (SSR) for the web app, plus JWT in packages/auth
- **AI integrations:** OpenAI SDK (web), Gemini (api), Groq (web/lib)
- **Next.js output:** `standalone` mode for containerized deployment
- **Webpack polyfills:** Buffer and process are polyfilled in next.config.js for Solana/Anchor compatibility
- **`.npmrc`:** `shamefully-hoist=true` required for Solana/Anchor packages

## Database Schema (packages/db)

Tables: `users`, `user_sessions`, `user_progress`, `user_code`, `profiles`, `analytics_events`. DB client gracefully handles missing `DATABASE_URL` by disabling DB features.

## CI Pipeline (.github/workflows/test.yml)

Install → Lint → Type-check → Unit tests → Build → Validate templates → Template health check → E2E tests (Playwright, Chromium only)

## Testing

- **Unit:** Vitest in `apps/web/tests/unit/` (jsdom) and `apps/api/tests/` (node)
- **E2E:** Playwright in `apps/web/tests/e2e/`, Chromium only, 60s timeout
- **Template tests:** Mocha/Chai in `packages/solana/templates/*/test.ts`, validated by template-cli
