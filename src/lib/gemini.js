import { GoogleGenerativeAI } from '@google/generative-ai';

// Load multiple API keys for different purposes
const API_KEYS = {
  primary: process.env.GEMINI_API_KEY,
  analysis: process.env.GEMINI_API_KEY_ANALYSIS || process.env.GEMINI_API_KEY,
  document: process.env.GEMINI_API_KEY_DOCUMENT || process.env.GEMINI_API_KEY,
};

if (!API_KEYS.primary) {
  throw new Error('GEMINI_API_KEY is not defined in environment variables');
}

// Create separate instances for different purposes
const genAIPrimary = new GoogleGenerativeAI(API_KEYS.primary);
const genAIAnalysis = new GoogleGenerativeAI(API_KEYS.analysis);
const genAIDocument = new GoogleGenerativeAI(API_KEYS.document);

// Rate limiting configuration
const RATE_LIMIT = {
  maxRetries: 5, // Increased from 3 to 5
  initialDelay: 3000, // Increased from 2s to 3s
  maxDelay: 90000, // Increased from 60s to 90s
  requestDelay: 2000, // 2 seconds between requests
};

// Track last request time for rate limiting
let lastRequestTime = 0;

/**
 * Sleep utility for rate limiting
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Wait to respect rate limits
 */
async function waitForRateLimit() {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < RATE_LIMIT.requestDelay) {
    const waitTime = RATE_LIMIT.requestDelay - timeSinceLastRequest;
    await sleep(waitTime);
  }
  
  lastRequestTime = Date.now();
}

/**
 * Retry logic with exponential backoff
 */
async function retryWithBackoff(fn, retries = RATE_LIMIT.maxRetries) {
  for (let i = 0; i < retries; i++) {
    try {
      await waitForRateLimit();
      return await fn();
    } catch (error) {
      // Check for retryable errors: rate limits, service unavailable, or overload
      const isRateLimitError = error.message?.includes('429') || 
                               error.message?.includes('quota') ||
                               error.message?.includes('Too Many Requests');
      const isServiceError = error.message?.includes('503') ||
                             error.message?.includes('Service Unavailable') ||
                             error.message?.includes('overloaded') ||
                             error.message?.includes('502') ||
                             error.message?.includes('Bad Gateway');
      
      const isRetryable = isRateLimitError || isServiceError;
      
      if (!isRetryable || i === retries - 1) {
        throw error;
      }
      
      // Extract retry delay from error message if available
      const retryMatch = error.message?.match(/retry in ([\d.]+)s/i);
      const suggestedDelay = retryMatch ? parseFloat(retryMatch[1]) * 1000 : null;
      
      // Use exponential backoff with suggested delay
      // For service errors (503), use longer delays
      const baseDelay = isServiceError ? RATE_LIMIT.initialDelay * 2 : RATE_LIMIT.initialDelay;
      const backoffDelay = suggestedDelay || Math.min(
        baseDelay * Math.pow(2, i),
        RATE_LIMIT.maxDelay
      );
      
      const errorType = isRateLimitError ? 'Rate limit' : 'Service unavailable';
      console.log(`⚠️ ${errorType} error. Retrying in ${backoffDelay / 1000}s... (Attempt ${i + 1}/${retries})`);
      await sleep(backoffDelay);
    }
  }
}

/**
 * Get Flash model (fast, for simple extraction tasks)
 * Uses gemini-2.5-flash - best for price-performance and high volume tasks
 * 1M token context window
 */
export const getFlashModel = () => {
  return genAIAnalysis.getGenerativeModel({ 
    model: 'gemini-2.5-flash',
    generationConfig: {
      maxOutputTokens: 8192, // Increased to handle larger responses
      temperature: 0.7,
    },
  });
};

/**
 * Get Pro model - advanced thinking model for complex reasoning
 * Uses gemini-2.5-pro - best for reasoning over complex problems
 * Note: Higher rate limits may apply - prefer Flash for high volume
 */
export const getProModel = () => {
  return genAIPrimary.getGenerativeModel({ 
    model: 'gemini-2.5-pro',
    generationConfig: {
      maxOutputTokens: 3000,
      temperature: 0.7,
    },
  });
};

/**
 * Get Document generation model (separate quota)
 * Uses gemini-2.5-flash for fast document generation
 */
export const getDocumentModel = () => {
  return genAIDocument.getGenerativeModel({ 
    model: 'gemini-2.5-flash',
    generationConfig: {
      maxOutputTokens: 8000,
      temperature: 0.4, // Lower temperature for formal documents
    },
  });
};

/**
 * Generate content with automatic retry and rate limiting
 */
export async function generateWithRetry(model, prompt) {
  return retryWithBackoff(async () => {
    console.log('🔄 Calling Gemini API...');
    const result = await model.generateContent(prompt);
    const response = result.response;
    
    // Validate response
    if (!response) {
      throw new Error('No response received from Gemini API');
    }
    
    // Check for safety ratings or finish reason issues
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      const candidate = candidates[0];
      console.log('📊 Finish Reason:', candidate.finishReason);
      
      if (candidate.finishReason && candidate.finishReason !== 'STOP') {
        console.warn('⚠️ Unusual finish reason:', candidate.finishReason);
        if (candidate.safetyRatings) {
          console.warn('⚠️ Safety ratings:', JSON.stringify(candidate.safetyRatings));
        }
      }
    }
    
    const text = response.text();
    if (!text || text.trim().length === 0) {
      throw new Error('Empty response from Gemini API');
    }
    
    console.log('✅ Gemini API response received:', text.length, 'characters');
    return response;
  });
}

export { retryWithBackoff, waitForRateLimit };
export default genAIPrimary;
