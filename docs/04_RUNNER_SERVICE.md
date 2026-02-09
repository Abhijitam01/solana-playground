# Documentation Part 4: Runner Service (apps/runner)

This document covers every file and folder in the Solana program execution service.

## Directory Structure

```
apps/runner/
├── src/
│   ├── index.ts            # Entry point
│   ├── routes/             # API routes
│   ├── services/           # Execution services
│   └── types/              # Type definitions
├── dist/                   # Compiled JavaScript (generated)
├── Dockerfile              # Docker build config
├── package.json            # Dependencies
└── tsconfig.json           # TypeScript config
```

---

## Configuration Files

### `package.json`
**Purpose**: Runner service dependencies and scripts.

**Key Dependencies**:
- `express`: Web framework
- `@coral-xyz/anchor`: Anchor framework for Solana
- `@solana/web3.js`: Solana Web3 library
- `@solana-playground/types`: Shared types
- `@solana-playground/solana`: Solana templates
- `zod`: Schema validation

**Scripts**:
- `dev`: Development server (tsx watch)
- `build`: TypeScript compilation
- `start`: Production server
- `type-check`: Type checking
- `clean`: Remove dist folder

**If removed**: Service would not run, dependencies undefined.

---

### `tsconfig.json`
**Purpose**: TypeScript configuration.

**What it does**:
- Extends shared config
- Sets compilation options
- Configures paths

**If removed**: TypeScript would not compile.

---

### `Dockerfile`
**Purpose**: Docker build configuration.

**What it does**:
- Multi-stage build
- Installs Solana CLI and Anchor
- Sets up execution environment
- Creates production image

**If removed**: Docker builds would fail.

---

## Source Files (`src/`)

### `src/index.ts`
**Purpose**: Application entry point.

**What it does**:
- Creates Express app
- Sets up JSON parsing
- Registers `/health` endpoint
- Registers `/execute` route
- Starts HTTP server on PORT (default 3002)
- Logs server status

**If removed**: Service would not start, no entry point.

---

## Routes (`src/routes/`)

### `src/routes/execute.ts`
**Purpose**: Code execution route handler.

**Endpoints**:
- `POST /execute`: Execute Solana program

**What it does**:
- Validates execution requests using Zod schema
- Calls `executeProgram` service
- Returns execution results
- Handles errors gracefully
- Returns JSON responses

**If removed**: Code execution endpoint would not work, API service could not execute code.

---

## Services (`src/services/`)

### `src/services/executor.ts`
**Purpose**: Main execution orchestrator.

**What it does**:
- Coordinates execution flow
- Manages execution lifecycle
- Calls compiler, validator, and execution engine
- Handles timeouts
- Returns execution results

**If removed**: Code execution would not work, no execution coordination.

---

### `src/services/compiler.ts`
**Purpose**: Solana program compiler.

**What it does**:
- Compiles Rust/Anchor programs
- Manages compilation process
- Handles compilation errors
- Returns compiled program artifacts

**If removed**: Programs would not compile, execution would fail.

---

### `src/services/execution-engine.ts`
**Purpose**: Core execution engine.

**What it does**:
- Executes Solana transactions
- Manages execution state
- Handles program execution
- Returns execution results

**If removed**: Programs would not execute, core functionality broken.

---

### `src/services/executor.ts` (alternative/duplicate)
**Purpose**: Execution service wrapper.

**What it does**:
- Wraps execution engine
- Provides higher-level API
- Manages execution context

**If removed**: Execution API would be different, may break integration.

---

### `src/services/sandbox.ts`
**Purpose**: Sandbox environment management.

**What it does**:
- Creates isolated execution environments
- Manages sandbox lifecycle
- Ensures security isolation
- Cleans up after execution

**If removed**: Security would be compromised, no isolation.

---

### `src/services/validator.ts`
**Purpose**: Solana validator management.

**What it does**:
- Manages local Solana validator
- Starts/stops validator
- Configures validator settings
- Provides validator connection

**If removed**: No Solana validator, execution would fail.

---

### `src/services/workspace.ts`
**Purpose**: Workspace management.

**What it does**:
- Manages temporary workspaces
- Creates workspace directories
- Manages file structure
- Cleans up workspaces

**If removed**: Workspace management would fail, file operations would break.

---

### `src/services/state-capture.ts`
**Purpose**: Account state capture.

**What it does**:
- Captures account state before/after execution
- Serializes account data
- Returns state snapshots
- Used for state visualization

**If removed**: State visualization would not work, no state tracking.

---

### `src/services/trace.ts`
**Purpose**: Execution tracing.

**What it does**:
- Traces program execution
- Captures execution flow
- Records instruction execution
- Returns execution trace

**If removed**: Execution tracing would not work, debugging harder.

---

### `src/services/transaction.ts`
**Purpose**: Transaction building and management.

**What it does**:
- Builds Solana transactions
- Signs transactions
- Manages transaction lifecycle
- Returns transaction results

**If removed**: Transaction building would fail, execution would not work.

---

### `src/services/execution/local-validator-adapter.ts`
**Purpose**: Local validator adapter.

**What it does**:
- Adapts local validator for execution
- Provides validator interface
- Manages validator connection
- Handles validator lifecycle

**If removed**: Local validator integration would fail.

---

## Types (`src/types/`)

### `src/types/anchor.d.ts`
**Purpose**: Anchor framework type definitions.

**What it does**:
- Type definitions for Anchor
- Augments Anchor types
- Provides type safety

**If removed**: TypeScript errors for Anchor types.

---

## Build Output (`dist/`)

### `dist/`
**Purpose**: Compiled JavaScript output.

**What it does**:
- Contains compiled TypeScript
- Production-ready code
- Generated by `pnpm build`

**If removed**: Can regenerate with `pnpm build`, production would fail until rebuild.

---

## Summary

**Critical Files**:
- `src/index.ts` - Entry point
- `src/routes/execute.ts` - Execution endpoint
- `src/services/executor.ts` - Execution orchestrator
- `src/services/execution-engine.ts` - Core execution
- `src/services/compiler.ts` - Program compilation
- `src/services/validator.ts` - Solana validator

**Important Files**:
- `src/services/sandbox.ts` - Security isolation
- `src/services/state-capture.ts` - State tracking
- `src/services/trace.ts` - Execution tracing
- `src/services/transaction.ts` - Transaction building

**Can Remove** (with impact):
- `dist/` - Can regenerate
- Individual service files - Would break specific features

**Dependencies**:
- Requires Solana CLI installed
- Requires Anchor framework
- Requires local validator running
- Called by `apps/api` service

**Security Considerations**:
- Runs user-submitted code (sandboxed)
- Manages local validator
- Handles execution timeouts
- Isolates execution environments

