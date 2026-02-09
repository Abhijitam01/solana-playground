import { NextRequest, NextResponse } from 'next/server';
import { loadTemplate } from '@solana-playground/solana';

// Simple in-memory cache
const templateCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

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

    const template = await loadTemplate(id);
    
    // Update cache
    templateCache.set(id, { data: template, timestamp: Date.now() });
    
    return NextResponse.json(template);
  } catch (error) {
    console.error(`Error loading template ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Template not found' },
      { status: 404 }
    );
  }
}
