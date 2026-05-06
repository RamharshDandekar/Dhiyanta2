// Minimal Hugging Face inference wrapper to replace Gemini usage
// Reads API key from VITE_HF_API_KEY or HF_API_KEY

const HF_API_KEY = process.env.VITE_HF_API_KEY || process.env.HF_API_KEY;

const DEFAULT_MODEL_CANDIDATES = [
  process.env.VITE_HF_MODEL,
  process.env.HF_MODEL,
  'HuggingFaceH4/zephyr-7b-beta',
  'google/flan-t5-large',
].filter(Boolean);

const RATE_LIMIT = {
  maxRetries: 5,
  initialDelay: 3000,
  maxDelay: 90000,
  requestDelay: 2000,
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let lastRequestTime = 0;
async function waitForRateLimit() {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < RATE_LIMIT.requestDelay) {
    await sleep(RATE_LIMIT.requestDelay - timeSinceLastRequest);
  }
  lastRequestTime = Date.now();
}

async function retryWithBackoff(fn, retries = RATE_LIMIT.maxRetries) {
  for (let i = 0; i < retries; i++) {
    try {
      await waitForRateLimit();
      return await fn();
    } catch (error) {
      const isRateLimitError = error.message?.includes('429') || error.message?.toLowerCase().includes('rate limit');
      const isServiceError = error.message?.includes('503') || error.message?.includes('502') || error.message?.toLowerCase().includes('service unavailable');
      const isRetryable = isRateLimitError || isServiceError;
      if (!isRetryable || i === retries - 1) throw error;
      const baseDelay = isServiceError ? RATE_LIMIT.initialDelay * 2 : RATE_LIMIT.initialDelay;
      const backoffDelay = Math.min(baseDelay * Math.pow(2, i), RATE_LIMIT.maxDelay);
      console.log(`⚠️ HF retry in ${backoffDelay / 1000}s (attempt ${i + 1}/${retries})`);
      await sleep(backoffDelay);
    }
  }
}

function buildModel(modelName, generationConfig = {}, kind = 'flash') {
  return {
    __kind: kind,
    __modelName: modelName,
    generateContent: async (prompt) => {
      if (!HF_API_KEY) {
        throw new Error('Hugging Face API key not defined. Set VITE_HF_API_KEY or HF_API_KEY');
      }
      await waitForRateLimit();
      const modelCandidates = modelName ? [modelName] : DEFAULT_MODEL_CANDIDATES;

      const urlHandlers = [
        {
          url: 'https://router.huggingface.co/v1/chat/completions',
          bodyFor: (currentModel) => ({
            model: currentModel,
            messages: [{ role: 'user', content: typeof prompt === 'string' ? prompt : JSON.stringify(prompt) }],
            max_tokens: generationConfig.maxOutputTokens || generationConfig.max_new_tokens || 512,
            temperature: generationConfig.temperature ?? 0.7,
          }),
          extractText: (data) => data?.choices?.[0]?.message?.content,
        },
        {
          url: (currentModel) => `https://router.huggingface.co/hf-inference/models/${currentModel}`,
          bodyFor: () => ({
            inputs: typeof prompt === 'string' ? prompt : JSON.stringify(prompt),
            parameters: {
              max_new_tokens: generationConfig.maxOutputTokens || generationConfig.max_new_tokens || 512,
              temperature: generationConfig.temperature ?? 0.7,
            },
          }),
          extractText: (data) => {
            if (Array.isArray(data) && data.length > 0) return data[0]?.generated_text || (typeof data[0] === 'string' ? data[0] : null);
            if (data?.generated_text) return data.generated_text;
            return null;
          },
        },
      ];

      let text = '';
      let lastError = null;

      for (const currentModel of modelCandidates) {
        for (const handler of urlHandlers) {
          const endpoint = typeof handler.url === 'function' ? handler.url(currentModel) : handler.url;
          const body = handler.bodyFor(currentModel);

          const res = await fetch(endpoint, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${HF_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          });

          if (!res.ok) {
            const responseText = await res.text();
            lastError = new Error(`HF inference error ${res.status} (${endpoint}, model=${currentModel}): ${responseText}`);
            continue;
          }

          const data = await res.json();
          if (data?.error) {
            const message = String(data.error);
            if (message.toLowerCase().includes('loading')) {
              throw new Error(`HF inference loading: ${message}`);
            }
            lastError = new Error(`HF inference error (${endpoint}, model=${currentModel}): ${message}`);
            continue;
          }

          text = handler.extractText(data) || '';
          if (text && text.trim().length > 0) {
            break;
          }

          lastError = new Error(`HF inference returned empty output (${endpoint}, model=${currentModel})`);
        }

        if (text && text.trim().length > 0) {
          break;
        }
      }

      if (!text || text.trim().length === 0) {
        throw lastError || new Error('Hugging Face inference failed with unknown error');
      }

      return {
        text: () => text,
        candidates: [{ finishReason: 'STOP' }],
      };
    },
  };
}

export const getFlashModel = () => {
  const model = process.env.VITE_HF_MODEL || process.env.HF_MODEL || DEFAULT_MODEL_CANDIDATES[0];
  return buildModel(model, { maxOutputTokens: 8192, temperature: 0.7 }, 'flash');
};

export const getProModel = () => {
  const model = process.env.VITE_HF_MODEL || process.env.HF_PRO_MODEL || process.env.HF_MODEL || DEFAULT_MODEL_CANDIDATES[0];
  return buildModel(model, { maxOutputTokens: 3000, temperature: 0.7 }, 'pro');
};

export const getDocumentModel = () => {
  const model = process.env.VITE_HF_MODEL || process.env.HF_DOC_MODEL || process.env.HF_MODEL || DEFAULT_MODEL_CANDIDATES[0];
  return buildModel(model, { maxOutputTokens: 8000, temperature: 0.4 }, 'document');
};

export async function generateWithRetry(model, prompt) {
  return retryWithBackoff(async () => {
    try {
      console.log('🔄 Calling Hugging Face inference...');
      const result = await model.generateContent(prompt);
      if (!result) throw new Error('No response from Hugging Face');
      const text = result.text();
      if (!text || text.trim().length === 0) throw new Error('Empty response from Hugging Face');
      return { text: () => text, candidates: result.candidates || [{ finishReason: 'STOP' }] };
    } catch (hfError) {
      const hasGeminiKey = Boolean(
        process.env.GEMINI_API_KEY ||
        process.env.GEMINI_API_KEY_ANALYSIS ||
        process.env.GEMINI_API_KEY_DOCUMENT ||
        process.env.VITE_GEMINI_API_KEY ||
        process.env.VITE_GEMINI_API_KEY_ANALYSIS ||
        process.env.VITE_GEMINI_API_KEY_DOCUMENT
      );

      if (!hasGeminiKey) {
        throw new Error(
          `Hugging Face failed: ${hfError.message}; Gemini fallback is unavailable because GEMINI_API_KEY (or VITE_GEMINI_API_KEY) is not set`
        );
      }

      console.warn('⚠️ Hugging Face failed, falling back to Gemini 2.5 Flash...');
      try {
        const gemini = await import('./gemini');
        const fallbackModel = model?.__kind === 'document'
          ? gemini.getDocumentModel()
          : gemini.getFlashModel();
        return await gemini.generateWithRetry(fallbackModel, prompt);
      } catch (fallbackError) {
        throw new Error(`Hugging Face failed: ${hfError.message}; Gemini fallback failed: ${fallbackError.message}`);
      }
    }
  });
}

export { retryWithBackoff, waitForRateLimit };

const huggingFaceClient = { getFlashModel, getProModel, getDocumentModel, generateWithRetry };
export default huggingFaceClient;
