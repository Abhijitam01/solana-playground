import { NextResponse } from 'next/server';
import { loadTemplate, listTemplates } from '@solana-playground/solana';

// Simple in-memory cache for serverless
let templatesCache: { data: any[]; timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function GET() {
  try {
    // Check cache
    if (templatesCache && Date.now() - templatesCache.timestamp < CACHE_TTL) {
      return NextResponse.json(templatesCache.data);
    }

    const templateIds = await listTemplates();
    const loadedTemplates = await Promise.all(
      templateIds.map(async (id) => {
        try {
          const template = await loadTemplate(id);
          return {
            id: template.id,
            name: template.metadata.name,
            description: template.metadata.description,
            difficulty: template.metadata.difficulty,
          };
        } catch (error) {
          console.error(`Error loading template ${id}:`, error);
          return null;
        }
      })
    );

    const templates = loadedTemplates.filter((t): t is NonNullable<typeof t> => t !== null);
    
    // Update cache
    templatesCache = { data: templates, timestamp: Date.now() };
    
    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}
