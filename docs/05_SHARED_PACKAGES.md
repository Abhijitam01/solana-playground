# Documentation Part 5: Shared Packages (packages/)

This document covers every file and folder in the shared packages directory.

## Directory Structure

```
packages/
├── types/          # Shared TypeScript types and Zod schemas
├── solana/         # Solana program templates and metadata
├── db/             # Database client and schema
├── auth/           # Authentication utilities
├── exercises/      # Exercise validation and types
├── config/         # Shared configurations
└── template-cli/   # Template management CLI
```

---

## Package: `types/`

**Purpose**: Shared TypeScript types and Zod schemas used across all applications.

### Directory Structure
```
packages/types/
├── src/
│   ├── index.ts           # Main exports
│   ├── template.ts        # Template type definitions
│   ├── explanation.ts      # Code explanation types
│   ├── execution.ts        # Execution result types
│   ├── program-map.ts      # Program map types
│   └── function-spec.ts    # Function specification types
├── dist/                   # Compiled output
├── package.json
└── tsconfig.json
```

### Files

#### `src/index.ts`
**Purpose**: Main export file.

**What it does**:
- Exports all types and schemas
- Defines combined `Template` interface
- Re-exports from all type files

**If removed**: Types would not be exported, imports would fail.

---

#### `src/template.ts`
**Purpose**: Template metadata types.

**What it does**:
- Defines `TemplateMetadata` type
- Zod schema for template validation
- Template structure definitions

**If removed**: Template types would be missing, validation would fail.

---

#### `src/explanation.ts`
**Purpose**: Code explanation types.

**What it does**:
- Defines `LineExplanation` type
- Explanation structure (what, why, concepts)
- Zod schema for explanations

**If removed**: Explanation types would be missing, AI explanations would fail.

---

#### `src/execution.ts`
**Purpose**: Execution result types.

**What it does**:
- Defines execution request/response types
- Precomputed state types
- Execution result structure
- Zod schemas for validation

**If removed**: Execution types would be missing, API would fail.

---

#### `src/program-map.ts`
**Purpose**: Program map visualization types.

**What it does**:
- Defines program structure types
- Instruction types
- Account types
- PDA types
- CPI call types

**If removed**: Program map visualization would not work.

---

#### `src/function-spec.ts`
**Purpose**: Function specification types.

**What it does**:
- Defines function signature types
- Parameter types
- Return types
- Function metadata

**If removed**: Function specifications would not work.

---

### `package.json`
**Purpose**: Package configuration.

**Dependencies**: `zod` for schema validation

**If removed**: Package would not be recognized, workspace dependencies would fail.

---

## Package: `solana/`

**Purpose**: Solana program templates, metadata, and template loading utilities.

### Directory Structure
```
packages/solana/
├── src/
│   └── index.ts            # Template loading functions
├── templates/              # Template files
│   └── [template-id]/      # Individual templates
│       ├── program/        # Rust/Anchor program
│       ├── metadata.json   # Template metadata
│       └── line-explanations.json  # Code explanations
├── dist/                   # Compiled output
├── package.json
└── tsconfig.json
```

### Files

#### `src/index.ts`
**Purpose**: Template loading functions.

**What it does**:
- `listTemplates()`: Lists all available templates
- `loadTemplate(id)`: Loads template by ID
- Reads template files from filesystem
- Returns complete template data

**If removed**: Templates would not load, playground would be empty.

---

#### `templates/[template-id]/`
**Purpose**: Individual template directories.

**Structure**:
- `program/lib.rs`: Rust/Anchor program code
- `metadata.json`: Template metadata (name, description, difficulty)
- `line-explanations.json`: Line-by-line code explanations

**If removed**: Specific template would not be available.

---

### `package.json`
**Purpose**: Package configuration.

**Dependencies**: `@solana-playground/types`

**If removed**: Package would not be recognized.

---

## Package: `db/`

**Purpose**: Database client, schema definitions, and database utilities.

### Directory Structure
```
packages/db/
├── src/
│   ├── index.ts            # Main exports
│   ├── client.ts           # Database client setup
│   └── schema/             # Database schemas
│       ├── index.ts        # Schema exports
│       ├── profiles.ts     # User profiles schema
│       ├── user_code.ts    # User code schema
│       └── legacy.ts       # Legacy schema
├── drizzle/                # Drizzle migrations
├── dist/                   # Compiled output
├── drizzle.config.ts       # Drizzle configuration
├── reset-db.js             # Database reset script
├── package.json
└── tsconfig.json
```

### Files

#### `src/index.ts`
**Purpose**: Main exports.

**What it does**:
- Exports database client
- Exports schema definitions
- Main entry point

**If removed**: Database exports would fail.

---

#### `src/client.ts`
**Purpose**: Database client setup.

**What it does**:
- Creates Drizzle ORM client
- Configures database connection
- Sets up connection pooling
- Exports client instance

**If removed**: Database connection would not work.

---

#### `src/schema/index.ts`
**Purpose**: Schema exports.

**What it does**:
- Exports all schema definitions
- Central schema registry

**If removed**: Schemas would not be exported.

---

#### `src/schema/profiles.ts`
**Purpose**: User profiles schema.

**What it does**:
- Defines user profile table
- Profile fields and types
- Drizzle schema definition

**If removed**: User profiles would not work.

---

#### `src/schema/user_code.ts`
**Purpose**: User code storage schema.

**What it does**:
- Defines user code table
- Code storage structure
- Drizzle schema definition

**If removed**: User code saving would not work.

---

#### `src/schema/legacy.ts`
**Purpose**: Legacy schema definitions.

**What it does**:
- Legacy table definitions
- Migration support
- Backward compatibility

**If removed**: Legacy data might not work.

---

#### `drizzle.config.ts`
**Purpose**: Drizzle ORM configuration.

**What it does**:
- Configures database connection
- Sets up migration paths
- Configures schema location

**If removed**: Migrations would not work.

---

#### `drizzle/`
**Purpose**: Database migrations.

**What it does**:
- Contains SQL migration files
- Migration metadata
- Database version history

**If removed**: Database migrations would fail, schema would be out of sync.

---

#### `reset-db.js`
**Purpose**: Database reset utility.

**What it does**:
- Resets database to initial state
- Useful for development
- Clears all data

**If removed**: Database reset would need manual SQL.

---

### `package.json`
**Purpose**: Package configuration.

**Dependencies**: `drizzle-orm`, database driver

**If removed**: Package would not be recognized.

---

## Package: `auth/`

**Purpose**: Authentication utilities (JWT, password hashing).

### Directory Structure
```
packages/auth/
├── src/
│   ├── index.ts            # Main exports
│   ├── jwt.ts              # JWT utilities
│   └── password.ts         # Password hashing
├── dist/                   # Compiled output
├── package.json
└── tsconfig.json
```

### Files

#### `src/index.ts`
**Purpose**: Main exports.

**What it does**:
- Exports JWT functions
- Exports password functions

**If removed**: Auth exports would fail.

---

#### `src/jwt.ts`
**Purpose**: JWT token utilities.

**What it does**:
- `signToken()`: Signs JWT tokens
- `verifyToken()`: Verifies JWT tokens
- Token generation and validation
- Secret key management

**If removed**: JWT authentication would not work.

---

#### `src/password.ts`
**Purpose**: Password hashing utilities.

**What it does**:
- `hashPassword()`: Hashes passwords
- `verifyPassword()`: Verifies password hashes
- Uses bcrypt or similar
- Secure password handling

**If removed**: Password authentication would not work.

---

### `package.json`
**Purpose**: Package configuration.

**Dependencies**: JWT library, bcrypt

**If removed**: Package would not be recognized.

---

## Package: `exercises/`

**Purpose**: Exercise validation and type definitions.

### Directory Structure
```
packages/exercises/
├── src/
│   ├── index.ts            # Main exports
│   ├── types.ts            # Exercise types
│   └── validator.ts        # Exercise validation
├── dist/                   # Compiled output
├── package.json
└── tsconfig.json
```

### Files

#### `src/index.ts`
**Purpose**: Main exports.

**What it does**:
- Exports exercise types
- Exports validators

**If removed**: Exercise exports would fail.

---

#### `src/types.ts`
**Purpose**: Exercise type definitions.

**What it does**:
- Defines exercise structure
- Exercise question types
- Answer types
- Exercise metadata

**If removed**: Exercise types would be missing.

---

#### `src/validator.ts`
**Purpose**: Exercise validation.

**What it does**:
- Validates exercise submissions
- Checks answers
- Validates exercise structure
- Returns validation results

**If removed**: Exercise validation would not work.

---

### `package.json`
**Purpose**: Package configuration.

**Dependencies**: `zod` for validation

**If removed**: Package would not be recognized.

---

## Package: `config/`

**Purpose**: Shared configuration files (TypeScript, ESLint, Tailwind).

### Directory Structure
```
packages/config/
├── tsconfig/               # TypeScript configs
│   ├── base.json           # Base TypeScript config
│   ├── nextjs.json         # Next.js TypeScript config
│   └── node.json           # Node.js TypeScript config
├── eslint/                 # ESLint config
│   └── base.js             # Base ESLint config
└── tailwind/               # Tailwind config
    └── base.js             # Base Tailwind config
```

### Files

#### `tsconfig/base.json`
**Purpose**: Base TypeScript configuration.

**What it does**:
- Shared TypeScript compiler options
- Base settings for all projects
- Extended by app-specific configs

**If removed**: TypeScript configs would need duplication.

---

#### `tsconfig/nextjs.json`
**Purpose**: Next.js TypeScript configuration.

**What it does**:
- Extends base config
- Next.js-specific settings
- React types configuration

**If removed**: Next.js apps would need manual TypeScript config.

---

#### `tsconfig/node.json`
**Purpose**: Node.js TypeScript configuration.

**What it does**:
- Extends base config
- Node.js-specific settings
- Server-side TypeScript config

**If removed**: Node.js apps would need manual TypeScript config.

---

#### `eslint/base.js`
**Purpose**: Base ESLint configuration.

**What it does**:
- Shared linting rules
- Code quality standards
- Extended by apps

**If removed**: ESLint configs would need duplication.

---

#### `tailwind/base.js`
**Purpose**: Base Tailwind CSS configuration.

**What it does**:
- Shared Tailwind theme
- Custom colors and styles
- Extended by web app

**If removed**: Tailwind config would need duplication.

---

## Package: `template-cli/`

**Purpose**: CLI tool for template management and validation.

### Directory Structure
```
packages/template-cli/
├── src/
│   └── cli.ts              # CLI implementation
├── dist/                   # Compiled output
├── package.json
└── tsconfig.json
```

### Files

#### `src/cli.ts`
**Purpose**: CLI tool implementation.

**What it does**:
- Template validation
- Template generation
- Template health checks
- CLI commands for template management

**If removed**: Template CLI would not work, manual template management needed.

---

### `package.json`
**Purpose**: Package configuration.

**Dependencies**: CLI framework, template utilities

**If removed**: Package would not be recognized.

---

## Summary

**Critical Packages**:
- `types/` - Used by all apps, type safety
- `solana/` - Templates, core feature
- `db/` - Database access, required for persistence
- `auth/` - Authentication, required for user features

**Important Packages**:
- `exercises/` - Exercise features
- `config/` - Shared configs, reduces duplication

**Optional Packages**:
- `template-cli/` - Development tool, not required for runtime

**Build Output**:
- All packages have `dist/` folders (can regenerate)
- All packages have `node_modules/` (can reinstall)

**Dependencies Between Packages**:
- `solana/` depends on `types/`
- `db/` is independent
- `auth/` is independent
- `exercises/` depends on `types/`
- All apps depend on multiple packages

