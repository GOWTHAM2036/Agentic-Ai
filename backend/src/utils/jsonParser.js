/**
 * Safely extracts and parses JSON objects from LLM text outputs.
 * Handles ```json ... ``` fences and stray formatting.
 */
function extractAndParseJSON(rawText, fallbackDefault = {}) {
  if (!rawText) return fallbackDefault;
  try {
    // If rawText is already an object, return it
    if (typeof rawText === 'object') return rawText;

    // Clean markdown code blocks
    let cleaned = rawText.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.substring(7);
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.substring(3);
    }
    if (cleaned.endsWith('```')) {
      cleaned = cleaned.substring(0, cleaned.length - 3);
    }
    cleaned = cleaned.trim();

    // Find first { or [ and last } or ]
    const firstBrace = cleaned.search(/[\{\[]/);
    const lastBrace = Math.max(cleaned.lastIndexOf('}'), cleaned.lastIndexOf(']'));

    if (firstBrace !== -1 && lastBrace > firstBrace) {
      cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    }

    return JSON.parse(cleaned);
  } catch (err) {
    console.warn('[JSON Parser Warning] Failed to parse JSON from LLM output. Returning fallback.', err.message);
    return fallbackDefault;
  }
}

module.exports = {
  extractAndParseJSON
};
