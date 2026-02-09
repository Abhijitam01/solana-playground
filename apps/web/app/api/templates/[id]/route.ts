import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { z } from 'zod';
import {
  TemplateMetadataSchema,
  ProgramMapSchema,
  PrecomputedStateSchema,
  FunctionSpecSchema,
} from '@solana-playground/types';

// Simple in-memory cache
const templateCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

async function readJSON<T>(path: string): Promise<T> {
  try {
    const content = await readFile(path, 'utf-8');
    return JSON.parse(content) as T;
  } catch (error) {
    throw new Error(`Failed to read JSON file at ${path}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const LocalLineExplanationSchema = z.object({
  line: z.number(),
  type: z.enum(["instruction", "account", "macro", "logic", "security"]),
  summary: z.string(),
  why: z.string().optional(),
  risk: z.string().optional(),
  concepts: z.array(z.string()).optional(),
});

// Local implementation of loadTemplate to ensure correct path resolution
async function loadTemplateLocal(id: string) {
  // Try multiple possible paths for template resolution
  // This handles different deployment scenarios (local dev, Vercel, Railway, etc.)
  
  const cwd = process.cwd();
  const possiblePaths = [
    // Standalone build (production) - templates should be copied to .next/standalone
    join(cwd, 'packages/solana/templates'),
    join(cwd, '..', 'packages', 'solana', 'templates'),
    join(cwd, '..', '..', 'packages', 'solana', 'templates'),
    // Local development
    join(cwd, 'apps', 'web', 'packages', 'solana', 'templates'),
    // Root context
    join(process.cwd(), 'packages', 'solana', 'templates'),
  ];
  
  let templatesDir: string | null = null;
  
  // Find the first path that exists
  for (const path of possiblePaths) {
    try {
      const testPath = join(path, 'hello-solana', 'metadata.json');
      await readFile(testPath, 'utf-8');
      templatesDir = path;
      break;
    } catch {
      // Path doesn't exist, try next one
      continue;
    }
  }
  
  if (!templatesDir) {
    throw new Error(
      `Templates directory not found. Tried paths: ${possiblePaths.join(', ')}. CWD: ${cwd}`
    );
  }
  
  // Handle nested template paths like "beginner/hello-anchor"
  // Sanitize the id to prevent path traversal
  const sanitizedId = id.replace(/\.\./g, '').replace(/^\//, '');
  const basePath = join(templatesDir, sanitizedId);
  console.log(`Loading template "${id}" from ${basePath} (CWD: ${cwd})`);

  try {
     const [code, metadata, explanations, programMap, precomputedState, functionSpecs] =
      await Promise.all([
        readFile(join(basePath, "program/lib.rs"), "utf-8"),
        readJSON(join(basePath, "metadata.json")).then((data) => TemplateMetadataSchema.parse(data)),
        readJSON(join(basePath, "line-explanations.json")).then((data) => z.array(LocalLineExplanationSchema).parse(data)),
        readJSON(join(basePath, "program-map.json")).then((data) => ProgramMapSchema.parse(data)),
        readJSON(join(basePath, "precomputed-state.json")).then((data) => PrecomputedStateSchema.parse(data)),
        readJSON(join(basePath, "function-specs.json"))
          .then((data) => z.array(FunctionSpecSchema).parse(data))
          .catch(() => []), 
      ]);

    return {
      id,
      code,
      metadata,
      explanations,
      programMap,
      functionSpecs,
      precomputedState,
    };
  } catch (error) {
     console.error("Local load failed:", error);
     throw error;
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id || id.length > 100) {
      return NextResponse.json(
        { error: 'Invalid template ID' },
        { status: 400 }
      );
    }

    // Check cache
    const cached = templateCache.get(id);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json(cached.data);
    }

    // Use local implementation
    const template = await loadTemplateLocal(id);
    console.log(`Loaded template ${id}`);
    
    // Update cache
    templateCache.set(id, { data: template, timestamp: Date.now() });
    
    return NextResponse.json(template);
  } catch (error) {
    console.error(`Error loading template ${params.id}:`, error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Template not found' },
      { status: 404 }
    );
  }
}
