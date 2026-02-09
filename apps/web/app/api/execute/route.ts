import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const ExecutionRequestSchema = z.object({
  code: z.string(),
  templateId: z.string().optional(),
  scenario: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = ExecutionRequestSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: parsed.error.errors },
        { status: 400 }
      );
    }

    // For now, return a simulated execution result
    // In production, this would call the actual Solana runner
    // The runner service handles actual Solana program execution
    
    const result = {
      success: true,
      logs: [
        'Program log: Instruction invoked',
        'Program log: Processing transaction...',
        'Program log: Transaction completed successfully',
      ],
      computeUnits: 2450,
      stateChanges: {
        before: {},
        after: {},
      },
      message: 'Execution simulated. Connect a runner service for real execution.',
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error executing code:', error);
    return NextResponse.json(
      { error: 'Failed to execute code' },
      { status: 500 }
    );
  }
}
