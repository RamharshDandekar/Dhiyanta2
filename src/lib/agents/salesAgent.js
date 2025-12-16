import { getFlashModel, generateWithRetry } from '../gemini';

/**
 * Sales Agent - Performs initial RFP triage and extraction from HTML portal
 * Uses Gemini 2.5 Flash with 1M token context - processes ENTIRE HTML in ONE call!
 * @param {string} htmlContent - Full HTML content from tender portal (can be large)
 * @returns {Promise<Object>} Extracted RFP metadata
 */
export async function salesAgent(htmlContent) {
  try {
    const contentLength = htmlContent.length;
    console.log(`Step 1/4: Sales Agent - Analyzing HTML portal (${contentLength} chars)...`);
    
    // Use Gemini 2.5 Flash - handles up to 1M tokens, 15 RPM (vs Pro's 2 RPM)
    const model = getFlashModel();
    
    const prompt = `You are a Sales Agent AI. Your job is to analyze the following HTML source code from a tender portal webpage. 

Identify the single most prominent RFP or Tender on the page and extract its details. Focus on the PRIMARY, FEATURED, or MOST DETAILED tender listing.

HTML Source Code:
${htmlContent}

Extract these details from the most prominent RFP/Tender:
1. Client/Organization name (issuing authority)
2. Submission deadline (due date)
3. ALL required products/services/equipment mentioned in technical requirements
4. Project value/budget/estimated cost
5. Comprehensive summary of technical scope, testing requirements, and project deliverables (2-3 detailed sentences)

CRITICAL INSTRUCTIONS:
- Focus ONLY on the most detailed/prominent tender (ignore summary listings)
- Extract ALL product names, equipment types, and testing requirements mentioned
- Be thorough with the requiredProducts array - include every item/service listed
- Output ONLY valid JSON. No markdown, no explanation, no text before or after.
- Start with { and end with }

Use this exact structure:
{
  "client": "organization name",
  "dueDate": "date or Not specified",
  "requiredProducts": ["product1", "product2", "equipment1", "service1", ...],
  "projectValue": "value or Not specified",
  "keyRequirements": "comprehensive 2-3 sentence summary covering technical scope, testing requirements, deliverables"
}`;

    console.log('🤖 Processing HTML portal with Gemini 2.5 Flash (1M token context)...');
    const response = await generateWithRetry(model, prompt);
    let text = response.text();
    
    // Log the actual AI response for debugging
    console.log('📄 AI Response length:', text.length, 'characters');
    console.log('📄 AI Response (first 1000 chars):', text.substring(0, 1000));
    
    // Clean up markdown code fences if present
    text = text.replace(/```json\s*/g, '').replace(/```\s*$/g, '').trim();
    
    // Extract JSON with better error handling - look for first { to last }
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    
    if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
      console.error('❌ No valid JSON structure found in response');
      console.error('❌ Cleaned response:', text);
      throw new Error('Failed to extract JSON from sales agent response');
    }
    
    const jsonString = text.substring(firstBrace, lastBrace + 1);
    
    try {
      const metadata = JSON.parse(jsonString);
      console.log('✅ Sales Agent completed - HTML portal analyzed in ONE call');
      console.log(`✅ Extracted: ${metadata.client} | Due: ${metadata.dueDate} | Products: ${metadata.requiredProducts?.length || 0}`);
      return metadata;
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError.message);
      console.error('❌ Extracted JSON string:', jsonString.substring(0, 500));
      throw new Error('Failed to parse JSON from sales agent response');
    }
    
  } catch (error) {
    console.error('❌ Sales Agent Error:', error);
    throw new Error(`Sales Agent failed: ${error.message}`);
  }
}
