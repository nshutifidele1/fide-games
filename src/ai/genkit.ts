import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Initialize Genkit with the Google AI plugin.
 * We use an explicit API key check to provide better error feedback if missing.
 */
const apiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

export const ai = genkit({
  plugins: [
    googleAI({ apiKey: apiKey || 'MISSING_API_KEY' }),
  ],
  model: 'googleai/gemini-1.5-flash',
});
