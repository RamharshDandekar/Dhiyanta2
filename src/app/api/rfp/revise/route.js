import { NextResponse } from 'next/server';
import { revisionAgent } from '@/lib/agents';

export async function POST(request) {
  try {
    const { originalRFP, previousProposal, userFeedback } = await request.json();

    if (!originalRFP || !previousProposal || !userFeedback) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('Starting Revision Agent...');
    const revisedProposal = await revisionAgent(originalRFP, previousProposal, userFeedback);

    // Add original RFP back to revised proposal
    revisedProposal.originalRFP = originalRFP;

    return NextResponse.json({
      success: true,
      proposal: revisedProposal
    });

  } catch (error) {
    console.error('Revision Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to revise proposal' },
      { status: 500 }
    );
  }
}
