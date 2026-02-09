# Documentation Part 3: API Service (apps/api)

This document covers every file and folder in the Express API service.

## Directory Structure

```
apps/api/
├── src/
│   ├── app.ts              # Express app setup
│   ├── index.ts            # Entry point
│   ├── middleware/         # Express middleware
│   ├── routes/             # API route handlers
│   ├── services/           # Business logic services
│   └── types/              # Type definitions
├── tests/                  # Test files
├── dist/                   # Compiled JavaScript (generated)
├── Dockerfile              # Docker build config
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── tsconfig.build.json     # Build-specific TS config
└── vitest.config.ts        # Test configuration
```

---

## Configuration Files

### `package.json`
**Purpose**: API service dependencies and scripts.

**Key Dependencies**:
- `express`: Web framework
- `cors`: CORS middleware
- `helmet`: Security headers
- `@solana-playground/*`: Workspace packages (auth, db, exercises, solana, types)
- `@google/generative-ai`: Gemini API client
- `drizzle-orm`: Database ORM
- `zod`: Schema validation

**Scripts**:
- `dev`: Development server with hot reload (tsx watch)
- `build`: TypeScript compilation
- `start`: Production server (node dist/index.js)
- `type-check`: Type checking
- `clean`: Remove dist folder
- `test`: Run tests

**If removed**: Service would not run, dependencies undefined.

---

### `tsconfig.json`
**Purpose**: TypeScript configuration for development.

**What it does**:
- Extends shared config
- Sets compilation options
- Used by IDE and type checking

**If removed**: TypeScript would not work properly.

---

### `tsconfig.build.json`
**Purpose**: TypeScript configuration for production builds.

**What it does**:
- Extends base tsconfig
- Optimized for production builds
- Excludes test files

**If removed**: Production builds might include test files.

---

### `vitest.config.ts`
**Purpose**: Vitest test configuration.

**What it does**:
- Configures test environment
- Sets up test patterns
- Configures coverage

**If removed**: Tests would not run.

---

### `Dockerfile`
**Purpose**: Docker build configuration.

**What it does**:
- Multi-stage build
- Installs dependencies
- Builds TypeScript
- Creates production image

**If removed**: Docker builds would fail.

---

## Source Files (`src/`)

### `src/index.ts`
**Purpose**: Application entry point.

**What it does**:
- Loads environment variables (dotenv)
- Imports Express app
- Starts HTTP server on PORT (default 3001)
- Logs server status

**If removed**: Service would not start, no entry point.

---

### `src/app.ts`
**Purpose**: Express application setup.

**What it does**:
- Creates Express app instance
- Configures middleware (helmet, cors, json parser)
- Sets up request logging
- Configures rate limiting
- Registers all route handlers:
  - `/health`: Health check
  - `/metrics`: Metrics endpoint
  - `/auth`: Authentication routes
  - `/progress`: Progress tracking
  - `/exercises`: Exercise routes
  - `/analytics`: Analytics routes
  - `/cohorts`: Cohort routes
  - `/templates`: Template routes
  - `/execute`: Execution routes
- Sets up 404 handler
- Configures error handler

**If removed**: Express app would not be configured, routes would not work.

---

## Middleware (`src/middleware/`)

### `src/middleware/auth.ts`
**Purpose**: Authentication middleware.

**What it does**:
- Validates JWT tokens
- Extracts user information
- Protects routes requiring authentication
- Sets user context on request

**If removed**: Authentication would not work, protected routes would be insecure.

---

### `src/middleware/error-handler.ts`
**Purpose**: Global error handling middleware.

**What it does**:
- Catches errors from route handlers
- Formats error responses
- Logs errors
- Provides `asyncHandler` wrapper for async routes
- Handles Zod validation errors
- Returns appropriate HTTP status codes

**If removed**: Errors would crash the server, no error handling.

---

### `src/middleware/logging.ts`
**Purpose**: Request logging middleware.

**What it does**:
- Logs incoming requests (method, path, IP)
- Logs response status and timing
- Helps with debugging and monitoring

**If removed**: Request logging would be lost, debugging harder.

---

### `src/middleware/rate-limit.ts`
**Purpose**: Rate limiting middleware.

**What it does**:
- Prevents API abuse
- Limits requests per IP
- Configures general and specific rate limits
- Returns 429 (Too Many Requests) when exceeded

**If removed**: API would be vulnerable to abuse, no rate limiting.

---

## Routes (`src/routes/`)

### `src/routes/templates.ts`
**Purpose**: Template management routes.

**Endpoints**:
- `GET /templates`: List all templates
- `GET /templates/:id`: Get template by ID

**What it does**:
- Loads templates from `@solana-playground/solana`
- Caches template data
- Returns template metadata and code
- Validates template IDs

**If removed**: Template API would not work, frontend could not load templates.

---

### `src/routes/explain.ts`
**Purpose**: Code explanation routes.

**Endpoints**:
- `GET /templates/:id/explain`: Get code explanations
- `POST /templates/:id/explain`: Generate explanations

**What it does**:
- Returns line-by-line code explanations
- Uses Gemini API for AI explanations
- Caches explanations

**If removed**: Code explanations would not work.

---

### `src/routes/execute.ts`
**Purpose**: Code execution routes.

**Endpoints**:
- `POST /execute`: Execute Solana program

**What it does**:
- Validates execution requests
- Forwards to runner service
- Returns execution results
- Handles errors

**If removed**: Code execution would not work, playground would be broken.

---

### `src/routes/auth.ts`
**Purpose**: Authentication routes.

**Endpoints**:
- Various auth endpoints (login, register, etc.)

**What it does**:
- Handles user authentication
- JWT token generation
- Password validation
- User session management

**If removed**: Authentication would not work.

---

### `src/routes/progress.ts`
**Purpose**: User progress tracking routes.

**Endpoints**:
- Progress-related endpoints

**What it does**:
- Tracks user learning progress
- Saves progress to database
- Returns progress data

**If removed**: Progress tracking would not work.

---

### `src/routes/exercises.ts`
**Purpose**: Exercise management routes.

**Endpoints**:
- Exercise-related endpoints

**What it does**:
- Manages exercises
- Validates exercise submissions
- Tracks exercise completion

**If removed**: Exercise features would not work.

---

### `src/routes/analytics.ts`
**Purpose**: Analytics routes.

**Endpoints**:
- Analytics endpoints

**What it does**:
- Collects usage analytics
- Returns analytics data
- Tracks user behavior

**If removed**: Analytics would not be collected.

---

### `src/routes/cohorts.ts`
**Purpose**: Cohort management routes.

**Endpoints**:
- Cohort-related endpoints

**What it does**:
- Manages learning cohorts
- Cohort membership
- Cohort progress

**If removed**: Cohort features would not work.

---

## Services (`src/services/`)

### `src/services/cache.ts`
**Purpose**: Caching service.

**What it does**:
- Caches template data
- Caches template lists
- Reduces database/disk reads
- Improves performance

**If removed**: Performance would degrade, more database queries.

---

### `src/services/gemini.ts`
**Purpose**: Gemini AI service.

**What it does**:
- Interfaces with Google Gemini API
- Generates code explanations
- Handles API errors
- Manages API keys

**If removed**: AI explanations would not work.

---

### `src/services/metrics.ts`
**Purpose**: Metrics collection service.

**What it does**:
- Collects API metrics
- Tracks request counts
- Monitors performance
- Exposes metrics endpoint

**If removed**: Metrics would not be collected.

---

### `src/services/runner-client.ts`
**Purpose**: Runner service client.

**What it does**:
- Communicates with runner service
- Sends execution requests
- Handles runner responses
- Manages runner connection

**If removed**: Code execution would not work, cannot communicate with runner.

---

## Types (`src/types/`)

### `src/types/external.d.ts`
**Purpose**: External type definitions.

**What it does**:
- Type definitions for external libraries
- Augments third-party types

**If removed**: TypeScript errors for external types.

---

## Tests (`tests/`)

### `tests/example.test.ts`
**Purpose**: Example test file.

**What it does**:
- Example test structure
- Test template

**If removed**: Example test would be missing.

---

### `tests/integration/`
**Purpose**: Integration tests.

**What it does**:
- Tests API endpoints
- Integration test suite

**If removed**: Integration tests would not run.

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
- `src/app.ts` - Express setup
- `src/routes/` - All API endpoints
- `src/services/runner-client.ts` - Runner communication

**Important Files**:
- `src/middleware/` - Security and error handling
- `src/services/` - Business logic
- `package.json` - Dependencies

**Can Remove** (with impact):
- `dist/` - Can regenerate
- `tests/` - Testing only
- Individual route files - Would break specific endpoints

**Dependencies**:
- Requires `apps/runner` service running
- Requires database (via `@solana-playground/db`)
- Requires Gemini API key for AI features

