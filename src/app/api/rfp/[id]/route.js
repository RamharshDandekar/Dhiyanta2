import { NextResponse } from 'next/server';
import { getProposal } from '@/lib/proposalStore';

export async function GET(request, { params }) {
  try {
    // In Next.js 15+, params is a Promise and must be awaited
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Proposal ID is required' },
        { status: 400 }
      );
    }

    const proposal = getProposal(id);
    
    if (!proposal) {
      return NextResponse.json(
        { error: 'Proposal not found or expired' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      proposal
    });

  } catch (error) {
    console.error('Get Proposal Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve proposal' },
      { status: 500 }
    );
  }
}
