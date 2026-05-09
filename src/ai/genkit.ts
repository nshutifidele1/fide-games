import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const apiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

/**
 * Initialize Genkit with the Google AI plugin.
 * We use a placeholder key if none is found to prevent startup crashes in environments
 * where the API key is not yet configured.
 */
export const ai = genkit({
  plugins: [
    googleAI({ apiKey: apiKey || 'MISSING_API_KEY' }),
  ],
  model: 'googleai/gemini-2.5-flash',
});
