const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config');
const { extractAndParseJSON } = require('../utils/jsonParser');

let genAI = null;
if (config.geminiApiKey) {
  try {
    genAI = new GoogleGenerativeAI(config.geminiApiKey);
    console.log('[Gemini API] Client initialized successfully');
  } catch (err) {
    console.warn('[Gemini API] Initialization error:', err.message);
  }
}

/**
 * Executes prompt against Gemini API (gemini-2.5-flash or gemini-1.5-flash) with structured JSON output,
 * or falls back to domain intelligent mock response generator if API key is not present.
 */
async function callAgentLLM(systemPrompt, userPrompt, fallbackObject) {
  if (genAI) {
    const modelsToTry = ['gemini-2.5-flash', 'gemini-1.5-flash'];
    const fullPrompt = `${systemPrompt}\n\nUSER INPUT / CONTEXT:\n${typeof userPrompt === 'string' ? userPrompt : JSON.stringify(userPrompt, null, 2)}\n\nIMPORTANT: Return STRICT valid JSON matching the schema outlined.`;

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          generationConfig: { responseMimeType: "application/json" }
        });

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();
        return extractAndParseJSON(text, fallbackObject);
      } catch (err) {
        console.warn(`[Gemini API Warning] Model '${modelName}' hit error/rate limit: ${err.message}. Trying next fallback...`);
        // Brief delay before fallback model retry
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
  }

  // Domain fallback with realistic reasoning delay simulation
  await new Promise((resolve) => setTimeout(resolve, 800));
  return fallbackObject;
}

module.exports = {
  callAgentLLM
};
