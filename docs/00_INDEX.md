# Complete Application Documentation Index

This is a comprehensive documentation of every file and folder in the Solana Playground application. The documentation is divided into multiple parts for easier navigation.

## Documentation Parts

1. **[Part 1: Root Level & Configuration](./01_ROOT_LEVEL_AND_CONFIGURATION.md)**
   - Root directory files (`package.json`, `turbo.json`, `docker-compose.yml`, etc.)
   - Workspace configuration
   - Build system setup
   - Deployment configurations

2. **[Part 2: Web Application](./02_WEB_APPLICATION.md)**
   - Next.js 14 frontend (`apps/web/`)
   - All pages and routes
   - React components
   - State management
   - Hooks and utilities
   - Testing setup

3. **[Part 3: API Service](./03_API_SERVICE.md)**
   - Express API service (`apps/api/`)
   - API routes and endpoints
   - Middleware (auth, error handling, rate limiting)
   - Services (cache, Gemini AI, metrics, runner client)
   - Testing

4. **[Part 4: Runner Service](./04_RUNNER_SERVICE.md)**
   - Solana execution service (`apps/runner/`)
   - Code execution endpoints
   - Compiler and validator services
   - Sandbox and security
   - State capture and tracing

5. **[Part 5: Shared Packages](./05_SHARED_PACKAGES.md)**
   - `packages/types/` - Shared TypeScript types
   - `packages/solana/` - Program templates
   - `packages/db/` - Database client and schema
   - `packages/auth/` - Authentication utilities
   - `packages/exercises/` - Exercise validation
   - `packages/config/` - Shared configurations
   - `packages/template-cli/` - Template CLI tool

6. **[Part 6: Scripts & Utilities](./06_SCRIPTS_AND_UTILITIES.md)**
   - Template health check scripts
   - Utility scripts
   - Development tools

---

## Quick Reference

### Application Architecture
- **Monorepo**: Turborepo with pnpm workspaces
- **Frontend**: Next.js 14 (App Router)
- **API**: Express.js
- **Runner**: Solana program execution service
- **Database**: Drizzle ORM with Supabase
- **Auth**: Supabase Auth + JWT

### Key Services
1. **Web App** (`apps/web`): Next.js frontend on port 3000
2. **API Service** (`apps/api`): Express API on port 3001
3. **Runner Service** (`apps/runner`): Solana execution on port 3002

### Critical Dependencies
- All apps depend on `packages/types`
- API depends on `packages/db`, `packages/auth`, `packages/solana`
- Web depends on `packages/types`, `packages/solana`
- Runner depends on `packages/types`, `packages/solana`

---

## How to Use This Documentation

1. **Understanding a specific file**: Navigate to the relevant part and find the file in the directory structure.

2. **Understanding a feature**: Check which parts mention the feature:
   - Frontend features → Part 2
   - API endpoints → Part 3
   - Code execution → Part 4
   - Shared types → Part 5

3. **Understanding dependencies**: Check Part 5 for shared packages, then see which apps use them.

4. **Removing files**: Each file entry includes "If removed" section explaining the impact.

---

## File Organization

Each documentation part follows this structure:
- **Directory Structure**: Visual tree of files
- **Configuration Files**: Build and config files
- **Source Files**: Application code organized by directory
- **Summary**: Critical vs. optional files

Each file entry includes:
- **Purpose**: What the file does
- **What it does**: Detailed functionality
- **If removed**: Impact of removing the file

---

## Maintenance

This documentation should be updated when:
- New files are added
- File purposes change
- Dependencies change
- Architecture changes

---

## Questions?

If you need to understand:
- **What a file does**: Check the relevant part
- **What happens if I remove X**: Check the "If removed" section
- **Where is feature Y**: Search across parts or check the index
- **How does Z work**: Read the detailed "What it does" sections

---

## Last Updated

Documentation created: [Current Date]
Covers: Complete codebase structure
Total Files Documented: All files in the repository

