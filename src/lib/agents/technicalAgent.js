import { getFlashModel, generateWithRetry } from '../gemini';

/**
 * Technical Agent - Analyzes technical requirements and feasibility
 * Only receives essential data from sales agent (no full RFP text)
 * @param {Array<string>} requiredProducts - List of required products/services from sales agent
 * @param {string} keyRequirements - Key requirements summary from sales agent
 * @returns {Promise<Object>} Technical analysis with feasibility assessment
 */
export async function technicalAgent(requiredProducts, keyRequirements) {
  try {
    console.log('Step 2/4: Technical Agent - Analyzing technical requirements...');
    const model = getFlashModel();
    
    // Handle case where requiredProducts might be a string instead of array
    const productsText = Array.isArray(requiredProducts) 
      ? requiredProducts.join(', ') 
      : requiredProducts;
    
    const prompt = `You are a technical analyst evaluating an RFP's requirements.

Required Products/Services: ${productsText}
Key Requirements: ${keyRequirements}

Analyze the technical feasibility with CONCISE output:
1. Group similar products into categories (e.g., "Testing Equipment", "Laboratory Systems")
2. Assess overall capability (0-100% match)
3. Identify critical requirements and standards
4. Flag only HIGH-RISK items

CRITICAL INSTRUCTIONS:
- Output ONLY valid JSON
- Be CONCISE - use short sentences (max 20 words each)
- Group similar items together to reduce output size
- Include only 3-5 key detail entries (not every single product)
- Include only high-severity risks (max 3)
- No markdown, no explanation, no text before or after
- Start with { and end with }

Use this EXACT structure:
{
  "specMatch": 85,
  "summary": "Brief overall assessment (max 40 words)",
  "details": [
    {
      "category": "Testing Equipment",
      "items": "UTM, NDT, compression machines",
      "matchPercentage": 92,
      "capabilities": "Brief justification",
      "standards": "BIS, ISO"
    }
  ],
  "risks": [
    {
      "category": "Integration",
      "issue": "Brief risk description",
      "mitigation": "Brief solution"
    }
  ]
}`;

    const response = await generateWithRetry(model, prompt);
    let text = response.text();
    
    // Log the actual AI response for debugging
    console.log('📄 AI Response length:', text.length, 'characters');
    console.log('📄 AI Response (first 1000 chars):', text.substring(0, 1000));
    
    // Clean up markdown code fences if present
    text = text.replace(/```json\s*/g, '').replace(/```\s*$/g, '').trim();
    
    // Extract JSON - look for first { to last }
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    
    if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
      console.error('❌ No valid JSON structure found in response');
      console.error('❌ Cleaned response:', text);
      throw new Error('Failed to extract JSON from technical agent response');
    }
    
    const jsonString = text.substring(firstBrace, lastBrace + 1);
    
    try {
      const result = JSON.parse(jsonString);
      console.log('✅ Technical Agent completed');
      return result;
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError.message);
      console.error('❌ Extracted JSON string:', jsonString.substring(0, 500));
      throw new Error('Failed to parse JSON from technical agent response');
    }
  } catch (error) {
    console.error('❌ Technical Agent Error:', error);
    throw new Error(`Technical Agent failed: ${error.message}`);
  }
}
