import { getFlashModel, generateWithRetry } from '../gemini';

/**
 * Pricing Agent - Formulates pricing strategy based on technical analysis
 * Only receives essential data (no full objects) to minimize tokens
 * @param {Object} technicalAnalysis - Output from technical agent
 * @param {Object} clientInfo - Client information from sales agent
 * @returns {Promise<Object>} Pricing strategy
 */
export async function pricingAgent(technicalAnalysis, clientInfo) {
  try {
    console.log('Step 3/4: Pricing Agent - Calculating costs...');
    const model = getFlashModel();
    
    // Extract only essential data to reduce token count
    const essentialTech = {
      specMatch: technicalAnalysis.specMatch,
      summary: technicalAnalysis.summary,
      risks: technicalAnalysis.risks || []
    };
    
    const essentialClient = {
      client: clientInfo.client,
      projectValue: clientInfo.projectValue,
      dueDate: clientInfo.dueDate
    };
    
    const prompt = `Pricing Strategist. Rules: 20% margin, 5% discount if >$100K, add services if risks.

Client: ${JSON.stringify(essentialClient)}
Tech Match: ${essentialTech.specMatch}%, ${essentialTech.risks.length} risks

CRITICAL: Output ONLY valid JSON. No markdown, no explanation, no text before or after.
Start with { and end with }. Use this exact structure:
{
  "baseCost": 50000,
  "testingCosts": 5000,
  "margin": 20,
  "discount": 5,
  "recommendedBid": 58500,
  "justification": "detailed pricing rationale",
  "breakdown": [
    {
      "item": "description",
      "quantity": 1,
      "unitPrice": 1000,
      "total": 1000
    }
  ],
  "complimentaryServices": ["service 1", "service 2"],
  "paymentTerms": "suggested terms",
  "validityPeriod": "90 days"
}`;

    const response = await generateWithRetry(model, prompt);
    const text = response.text();
    
    // Log the actual AI response for debugging
    console.log('📄 AI Response (first 800 chars):', text.substring(0, 800));
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('❌ No JSON found in response');
      console.error('❌ Full response:', text);
      throw new Error('Failed to extract JSON from pricing agent response');
    }
    
    const result = JSON.parse(jsonMatch[0]);
    console.log('✓ Pricing Agent completed');
    return result;
  } catch (error) {
    console.error('Pricing Agent Error:', error);
    throw new Error(`Pricing Agent failed: ${error.message}`);
  }
}
