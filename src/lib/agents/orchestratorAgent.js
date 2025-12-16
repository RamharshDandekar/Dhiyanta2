import { getFlashModel, generateWithRetry } from '../gemini';

/**
 * Orchestrator Agent - Synthesizes final executive summary
 * Only receives key metrics (no full data structures) to minimize tokens
 * @param {Object} finalReportData - Combined data from all agents
 * @returns {Promise<Object>} Executive summary
 */
export async function orchestratorAgent(finalReportData) {
  try {
    console.log('Step 4/4: Orchestrator Agent - Synthesizing summary...');
    const model = getFlashModel();
    
    // Extract only key metrics to reduce tokens
    const summary = {
      client: finalReportData.clientInfo?.client,
      specMatch: finalReportData.technicalAnalysis?.specMatch,
      recommendedBid: finalReportData.pricingStrategy?.recommendedBid,
      risks: finalReportData.technicalAnalysis?.risks?.length || 0
    };
    
    const prompt = `Orchestrator: Create executive summary.

Data: Client=${summary.client}, Match=${summary.specMatch}%, Bid=$${summary.recommendedBid}, Risks=${summary.risks}

Output JSON:
{
  "position": "GO",
  "recommendation": "Brief recommendation statement",
  "rationale": "Detailed strategic rationale",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "risks": ["risk 1", "risk 2"],
  "nextSteps": ["step 1", "step 2", "step 3"],
  "confidenceScore": 85
}`;

    const response = await generateWithRetry(model, prompt);
    const text = response.text();
    
    // Log the actual AI response for debugging
    console.log('📄 AI Response (first 800 chars):', text.substring(0, 800));
    
    // Extract JSON with better error handling
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('❌ No JSON found in response');
      console.error('❌ Full response:', text);
      throw new Error('Failed to extract JSON from orchestrator response');
    }
    
    try {
      const result = JSON.parse(jsonMatch[0]);
      console.log('✅ Orchestrator Agent completed');
      console.log('🎉 All agents completed successfully!');
      return result;
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError.message);
      console.error('❌ Extracted text:', jsonMatch[0].substring(0, 500));
      throw new Error('Failed to parse JSON from orchestrator response');
    }
  } catch (error) {
    console.error('❌ Orchestrator Agent Error:', error);
    throw new Error(`Orchestrator Agent failed: ${error.message}`);
  }
}
