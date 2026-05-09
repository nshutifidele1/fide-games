import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Initialize Genkit with the Google AI plugin.
 * We use a resilient approach to prevent application crashes if the API key is missing.
 */
const apiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

export const ai = genkit({
  plugins: apiKey ? [googleAI({ apiKey })] : [],
  model: 'googleai/gemini-1.5-flash',
});
