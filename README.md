# Solana Developer Playground

A learning-first, developer-first system for understanding Solana programs through interactive, explorable code.

## Philosophy

This playground is designed to help developers deeply understand Solana programs by making code, structure, state, and execution explorable and explainable. It prioritizes:

- **Teaching mental models, not just syntax**
- **Making on-chain state visible**
- **Explaining every important line of code**
- **Supporting beginner → intermediate developers**
- **Being safe, sandboxed, and web-first**
- **Prioritizing clarity over feature count**

## Architecture

This is a Turborepo monorepo with the following structure:

```
solana-playground/
├── apps/
│   ├── web/        # Next.js 14 frontend
│   ├── api/        # Express API service
│   └── runner/     # Sandbox execution service
├── packages/
│   ├── types/      # Shared Zod schemas and TypeScript types
│   ├── solana/     # Program templates + metadata
│   └── config/     # Shared configs (tsconfig, eslint, tailwind)
```

## Features (V1)

### Core Features

- **Curated Program Templates**: 4 carefully crafted Solana programs with full explanations
- **Line-by-Line Explanations**: Every meaningful line has structured explanations (what, why, concepts)
- **Program Map Visualization**: See instructions, accounts, PDAs, and CPI calls
- **State Visualization**: View account state before/after execution
- **Hybrid Execution**: Pre-computed results for instant feedback, live execution for experimentation
- **AI-Powered Explanations**: Gemini API fallback for explaining code lines

### Templates

1. **Hello Solana** - Basic Anchor program structure and logging
2. **Account Initialization** - Creating and managing on-chain accounts
3. **PDA Vault** - Program Derived Addresses and lamport management
4. **Basic Token Mint** - SPL Token creation, minting, and transfers

## Development

### Prerequisites

- Node.js 18+
- pnpm 8+
- (Optional) Solana CLI for local testing

### Setup

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run development servers
pnpm dev
```

### Environment Variables

#### Web App (`apps/web`)
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

#### API Service (`apps/api`)
```bash
PORT=3001
GEMINI_API_KEY=your_gemini_api_key
RUNNER_URL=http://localhost:3002
CORS_ORIGIN=http://localhost:3000
```

#### Runner Service (`apps/runner`)
```bash
PORT=3002
MAX_EXECUTION_TIME_MS=30000
VALIDATOR_PORT=8899
```




```

### Docker Compose (Local Development)

```bash
docker-compose up
```

## V1 Limitations

- **No wallet connection**: All execution is sandboxed
- **No mainnet/devnet**: Only local test validator
- **No user-written programs**: Only curated templates
- **No payments**: Completely free to use
- **No collaboration**: Single-user experience
- **Live execution**: Placeholder implementation (use pre-computed mode)

## Contributing

This is V1 - focused on core learning experience. Contributions welcome for:
- Additional templates
- Improved explanations
- UI/UX enhancements
- Documentation improvements

