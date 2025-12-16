import { getFlashModel, generateWithRetry } from '../gemini';

/**
 * Revision Agent - Incorporates user feedback and regenerates proposal
 * Human-in-the-loop: User provides feedback, agent revises
 * @param {string} originalRFPText - Original RFP document
 * @param {Object} previousProposal - Previous proposal version
 * @param {string} userFeedback - User's revision feedback
 * @returns {Promise<Object>} Revised complete proposal
 */
export async function revisionAgent(originalRFPText, previousProposal, userFeedback) {
  try {
    console.log('🔄 Revision Agent - Processing user feedback...');
    const model = getFlashModel();
    
    // Extract only essential data from previous proposal
    const essentialPrev = {
      version: previousProposal.version,
      position: previousProposal.executiveSummary?.position,
      specMatch: previousProposal.technicalRationale?.specMatch,
      bid: previousProposal.pricingStrategy?.recommendedBid,
      client: previousProposal.clientInfo?.client
    };
    
    const nextVersion = previousProposal.version + 1;
    
    const prompt = `Revision Agent V${previousProposal.version}.

Previous: ${essentialPrev.position}, Match=${essentialPrev.specMatch}%, Bid=$${essentialPrev.bid}
User Feedback: ${userFeedback.substring(0, 500)}

Generate revised complete proposal:
1. Addresses all user feedback points
2. Re-evaluates technical and pricing decisions if needed
3. Updates the executive summary
4. Maintains consistency across all sections
5. Increments version number

Output ONLY valid JSON with this complete structure:
{
  "version": ${nextVersion},
  "changeLog": "Summary of changes made based on feedback",
  "executiveSummary": {
    "position": "GO/NO-GO/CONDITIONAL",
    "recommendation": "text",
    "rationale": "text",
    "strengths": ["item1", "item2"],
    "risks": ["item1", "item2"],
    "nextSteps": ["step1", "step2"],
    "confidenceScore": 85
  },
  "technicalRationale": {
    "specMatch": 90,
    "summary": "text",
    "details": [
      {
        "requirement": "name",
        "recommendedSKU": "SKU",
        "matchPercentage": 95,
        "justification": "text"
      }
    ],
    "risks": []
  },
  "pricingStrategy": {
    "baseCost": 50000,
    "recommendedBid": 58000,
    "justification": "text",
    "breakdown": [],
    "complimentaryServices": []
  }
}`;

    const response = await generateWithRetry(model, prompt);
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to extract JSON from revision agent response');
    }
    
    const result = JSON.parse(jsonMatch[0]);
    console.log('✓ Revision Agent completed - Proposal updated to V' + result.version);
    return result;
  } catch (error) {
    console.error('Revision Agent Error:', error);
    throw new Error(`Revision Agent failed: ${error.message}`);
  }
}
