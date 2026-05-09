'use server';
/**
 * @fileOverview An AI agent that summarizes community game reviews.
 *
 * - communityReviewSummarizer - A function that handles the summarization of game reviews.
 * - CommunityReviewSummarizerInput - The input type for the communityReviewSummarizer function.
 * - CommunityReviewSummarizerOutput - The return type for the communityReviewSummarizer function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CommunityReviewSummarizerInputSchema = z
  .array(z.string())
  .describe('An array of game reviews.');
export type CommunityReviewSummarizerInput = z.infer<typeof CommunityReviewSummarizerInputSchema>;

const CommunityReviewSummarizerOutputSchema = z
  .string()
  .describe('A concise summary of the overall sentiment of the reviews.');
export type CommunityReviewSummarizerOutput = z.infer<typeof CommunityReviewSummarizerOutputSchema>;

export async function communityReviewSummarizer(
  input: CommunityReviewSummarizerInput
): Promise<CommunityReviewSummarizerOutput> {
  return communityReviewSummarizerFlow(input);
}

const communityReviewSummarizerPrompt = ai.definePrompt({
  name: 'communityReviewSummarizerPrompt',
  input: { schema: CommunityReviewSummarizerInputSchema },
  output: { schema: CommunityReviewSummarizerOutputSchema },
  prompt: `You are an AI assistant tasked with summarizing the overall sentiment from a collection of game reviews.\nRead through the following reviews and provide a concise summary (1-3 sentences) that captures the general consensus, highlighting key positive and negative points if applicable, and the overall sentiment (e.g., overwhelmingly positive, mixed, generally negative).\n\nGame Reviews:\n{{#each this}}\n- "{{{.}}}"\n{{/each}}`,
});

const communityReviewSummarizerFlow = ai.defineFlow(
  {
    name: 'communityReviewSummarizerFlow',
    inputSchema: CommunityReviewSummarizerInputSchema,
    outputSchema: CommunityReviewSummarizerOutputSchema,
  },
  async (input) => {
    const { output } = await communityReviewSummarizerPrompt(input);
    return output!;
  }
);
