import { getFlashModel, generateWithRetry } from '../huggingface';

function cleanModelText(text) {
  return String(text || '')
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();
}

function extractJsonCandidate(text) {
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');

  if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
    return null;
  }

  return text.substring(firstBrace, lastBrace + 1);
}

function extractSectionText(text, heading) {
  const pattern = new RegExp(`\\*\\*${heading}\\*\\*:?\\s*([\\s\\S]*?)(?=\\n\\*\\*[^*]+\\*\\*|$)`, 'i');
  const match = text.match(pattern);
  return match?.[1]?.trim() || '';
}

function extractBulletList(sectionText) {
  return sectionText
    .split('\n')
    .map((line) => line.replace(/^[-*•]\s*/, '').trim())
    .filter((line) => line.length > 0);
}

function parseFallbackSummary(text, summary) {
  const normalized = text.toLowerCase();
  const confidenceMatch = text.match(/confidence score:\s*(\d{1,3})%/i) || text.match(/\b(\d{1,3})%\b/);
  const recommendationText = extractSectionText(text, 'Recommendation') || text;
  const rationaleText = extractSectionText(text, 'Strategic Rationale') || extractSectionText(text, 'Key Risks') || text;
  const strengths = extractBulletList(extractSectionText(text, 'Key Strengths'));
  const risks = extractBulletList(extractSectionText(text, 'Key Risks'));
  const nextSteps = extractBulletList(extractSectionText(text, 'Next Steps'));

  let position = 'CONDITIONAL';
  if (normalized.includes('no-go')) {
    position = 'NO-GO';
  } else if (normalized.includes('conditional')) {
    position = 'CONDITIONAL';
  } else if (normalized.includes('go')) {
    position = 'GO';
  }

  return {
    position,
    recommendation: recommendationText,
    rationale: rationaleText,
    strengths: strengths.length > 0 ? strengths : [
      `Match score of ${summary.specMatch}% with a recommended bid of $${summary.recommendedBid}.`
    ],
    risks: risks.length > 0 ? risks : [`${summary.risks} risks identified during technical analysis.`],
    nextSteps: nextSteps.length > 0 ? nextSteps : [
      'Review technical risks and mitigation plan.',
      'Confirm bid assumptions and delivery timeline.',
      'Proceed with proposal execution.'
    ],
    confidenceScore: confidenceMatch ? Number(confidenceMatch[1]) : Number(summary.specMatch) || 80,
  };
}

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

  Output ONLY valid JSON and nothing else.
  Do not use markdown, bullets, or code fences.
  Start with { and end with }.

  Use this exact structure:
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
    const cleanedText = cleanModelText(text);
    
    // Log the actual AI response for debugging
    console.log('📄 AI Response (first 800 chars):', cleanedText.substring(0, 800));
    
    // Extract JSON with better error handling
    const jsonCandidate = extractJsonCandidate(cleanedText);
    
    try {
      if (jsonCandidate) {
        const result = JSON.parse(jsonCandidate);
        console.log('✅ Orchestrator Agent completed');
        console.log('🎉 All agents completed successfully!');
        return result;
      }

      console.warn('⚠️ No JSON found in orchestrator response, using fallback parser');
      const fallbackResult = parseFallbackSummary(cleanedText, summary);
      console.log('✅ Orchestrator Agent completed');
      console.log('🎉 All agents completed successfully!');
      return fallbackResult;
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError.message);
      console.error('❌ Extracted text:', cleanedText.substring(0, 500));
      throw new Error('Failed to parse JSON from orchestrator response');
    }
  } catch (error) {
    console.error('❌ Orchestrator Agent Error:', error);
    throw new Error(`Orchestrator Agent failed: ${error.message}`);
  }
}
