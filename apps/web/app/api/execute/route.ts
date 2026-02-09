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

    const runnerUrl = process.env.RUNNER_URL;

    if (runnerUrl) {
      try {
        const response = await fetch(`${runnerUrl}/execute`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(parsed.data),
        });

        if (!response.ok) {
           const errorText = await response.text();
           return NextResponse.json(
             { error: 'Runner service error', details: errorText },
             { status: response.status }
           );
        }

        const data = await response.json();
        return NextResponse.json(data);
      } catch (err) {
        console.error('Runner service connection failed:', err);
        // Fallback to simulation or error? 
        // For now, let's return error to make it obvious
         return NextResponse.json(
            { error: 'Failed to connect to runner service' },
            { status: 502 }
          );
      }
    }

    // Fallback Simulation if no RUNNER_URL
    const result = {
      success: true,
      logs: [
        'Simulation Mode (RUNNER_URL not set)',
        'Program log: Instruction invoked',
        'Program log: Processing transaction...',
        'Program log: Transaction completed successfully',
      ],
      computeUnits: 2450,
      stateChanges: {
        before: {},
        after: {},
      },
      message: 'Execution simulated. Configure RUNNER_URL for real execution.',
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
