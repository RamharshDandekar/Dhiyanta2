import { getDocumentModel, generateWithRetry } from '../huggingface';

/**
 * Document Generation Agent - Creates a complete tender bid submission document
 * Uses separate API key to avoid quota conflicts with analysis agents
 * @param {Object} proposalData - The approved proposal data
 * @param {Object} companyInfo - Company information
 * @returns {Promise<string>} Complete HTML document
 */
export async function documentGenerationAgent(proposalData, companyInfo) {
  try {
    console.log('📄 Document Generation Agent - Creating final document...');
    const model = getDocumentModel(); // Use separate API key for document generation
    
    // Helper function to generate technical compliance table
    const generateTechnicalComplianceTable = (details) => {
      if (!details || details.length === 0) return '';
      
      const rows = details.map(item => {
        const req = item.requirement || 'N/A';
        const sku = item.recommendedSKU || 'N/A';
        const match = item.matchPercentage || 0;
        const just = item.justification || 'N/A';
        return `<tr><td>${req}</td><td>${sku}</td><td>${match}%</td><td>${just}</td></tr>`;
      }).join('');
      
      return `<table><thead><tr><th>Requirement</th><th>Proposed Solution</th><th>Compliance %</th><th>Justification</th></tr></thead><tbody>${rows}</tbody></table>`;
    };
    
    // Helper function to generate financial breakdown table
    const generateFinancialTable = (breakdown) => {
      if (!breakdown || breakdown.length === 0) return '';
      
      const rows = breakdown.map(item => {
        const itemName = item.item || 'N/A';
        const qty = item.quantity || 1;
        const unitPrice = (item.unitPrice || 0).toLocaleString();
        const total = (item.total || 0).toLocaleString();
        return `<tr><td>${itemName}</td><td>${qty}</td><td>$${unitPrice}</td><td>$${total}</td></tr>`;
      }).join('');
      
      return `<table><thead><tr><th>Item Description</th><th>Quantity</th><th>Unit Price</th><th>Total</th></tr></thead><tbody>${rows}</tbody></table>`;
    };
    
    // Helper function to generate checklist rows
    const generateChecklistRows = () => {
      const items = [
        'Company Registration Certificate',
        'GST Registration',
        'PAN Card',
        'Technical Specifications',
        'Financial Proposal',
        'Terms and Conditions',
        'Authorized Signatory Details',
        'Bank Guarantee (if required)'
      ];
      
      return items.map(item => {
        const page = Math.floor(Math.random() * 20) + 1;
        return `<tr><td>${item}</td><td style="text-align: center;">✓</td><td>Page ${page}</td></tr>`;
      }).join('');
    };
    
    const prompt = `Generate a CONCISE professional tender bid document in HTML. CRITICAL: Keep output under 6000 tokens total.

**PROPOSAL DATA:**
Client: ${proposalData.clientInfo?.client || 'N/A'}
Due Date: ${proposalData.clientInfo?.dueDate || 'N/A'}
Position: ${proposalData.executiveSummary?.position || 'GO'}
Spec Match: ${proposalData.technicalRationale?.specMatch || 0}%
Recommended Bid: $${proposalData.pricingStrategy?.recommendedBid?.toLocaleString() || 'TBD'}
Products Count: ${proposalData.clientInfo?.requiredProducts?.length || 0}

**KEY STRENGTHS:**
${proposalData.executiveSummary?.strengths?.slice(0, 3).join('; ') || 'Strong match'}

**TECHNICAL SUMMARY:**
${proposalData.technicalRationale?.summary || 'Technical capabilities align with requirements'}

**PRICING JUSTIFICATION:**
${proposalData.pricingStrategy?.justification || 'Competitive pricing based on market analysis'}

**COMPANY:**
Name: ${companyInfo.name}
Address: ${companyInfo.address}
Phone: ${companyInfo.phone}
Email: ${companyInfo.email}

**CONCISE OUTPUT RULES:**
- Max 3 sentences per section
- Use 1-2 short tables only (max 5 rows each)
- Minimal inline CSS (basic font, color, spacing)
- No decorative elements
- Group technical items into 3-5 categories (not individual items)
- Keep financial breakdown to 5 line items max

**DOCUMENT SECTIONS (BRIEF):**
1. **Header**: Company name, tender title, date
2. **Executive Summary**: 3 sentences - position, match%, bid amount
3. **Technical Overview**: 1 paragraph + 1 table (5 categories max, columns: Category, Items, Match%)
4. **Pricing**: 1 table (5 rows: Equipment, Services, Testing, Margin, Total)
5. **Recommendation**: 2 sentences
6. **Footer**: Company contact, authorized signatory

**OUTPUT FORMAT:**
<!DOCTYPE html><html><head><style>body{font-family:Arial;margin:2em;} h1{color:#1a365d;} table{border-collapse:collapse;width:100%;margin:1em 0;} th,td{border:1px solid #ccc;padding:8px;text-align:left;} th{background:#f0f0f0;}</style></head><body>[CONTENT]</body></html>

Generate ONLY the HTML. NO explanations. Keep total output under 6000 tokens.`;

    const response = await generateWithRetry(model, prompt);
    const text = response.text();
    
    // Extract HTML (remove markdown code blocks if present)
    let html = text.trim();
    if (html.startsWith('```html')) {
      html = html.replace(/```html\n?/g, '').replace(/```\n?$/g, '');
    } else if (html.startsWith('```')) {
      html = html.replace(/```\n?/g, '');
    }
    
    console.log('✓ Document Generation completed');
    return html;
  } catch (error) {
    console.error('Document Generation Agent Error:', error);
    throw new Error(`Document Generation Agent failed: ${error.message}`);
  }
}
