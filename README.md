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
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Optional, defaults to window.location.origin
GITHUB_TOKEN=your_github_personal_access_token  # Required for storing large code snippets in GitHub Gists
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

### OAuth Setup (Supabase)

To enable OAuth authentication (GitHub, Google, Twitter/X), you need to configure redirect URLs in your Supabase dashboard:

1. **Go to Supabase Dashboard** → Your Project → Authentication → Settings → Redirect URLs

2. **Add the following URLs:**
   - `http://localhost:3000/auth/callback` (for local development)
   - `https://your-production-domain.com/auth/callback` (for production)
   
   **Examples based on your deployment platform:**
   - **Vercel**: `https://your-app.vercel.app/auth/callback` (or your custom domain)
   - **Railway**: `https://your-app.up.railway.app/auth/callback` (or your custom domain)
   - **Render**: `https://your-app.onrender.com/auth/callback` (or your custom domain)
   - **Custom domain**: `https://yourdomain.com/auth/callback`
   
   **Note:** Replace `your-production-domain.com` with your actual deployed URL. You can find this in your deployment platform's dashboard.

3. **Important:** Supabase will ignore the `redirectTo` parameter if the URL isn't explicitly whitelisted. Without this configuration, OAuth providers will redirect back to `/` instead of `/auth/callback`.

4. **Make sure your dev server is running** (`pnpm dev`) when testing OAuth, otherwise the callback route won't be available when the provider redirects back.

The OAuth flow works as follows:
- User clicks OAuth button → Redirected to provider (GitHub/Google/X)
- Provider authenticates → Redirects to `/auth/callback?code=...`
- Callback route exchanges code for session → Redirects to `/playground/hello-solana`

### GitHub Gist Setup (Optional but Recommended)

For storing large code snippets (>= 5KB), the application uses GitHub Gists. This reduces database storage requirements.

1. **Create a GitHub Personal Access Token:**
   - Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token (classic)"
   - Give it a descriptive name (e.g., "Solana Playground Gist Storage")
   - Select the `gist` scope (this allows creating and managing gists)
   - Click "Generate token"
   - **Copy the token immediately** (you won't be able to see it again)

2. **Add the token to your environment:**
   - Add `GITHUB_TOKEN=your_token_here` to your `.env` file in `apps/web/`
   - Or set it in your deployment platform's environment variables

3. **How it works:**
   - Code snippets smaller than 5KB are stored in the database (fast access)
   - Code snippets 5KB or larger are automatically stored in GitHub Gists (unlisted, not searchable)
   - The application handles fetching from Gists transparently
   - If Gist creation fails, the code falls back to database storage

**Note:** If `GITHUB_TOKEN` is not set, the application will store all code in the database regardless of size.




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

