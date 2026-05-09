'use server';
/**
 * @fileOverview This file implements a Genkit flow for generating concise summaries of gaming news articles.
 *
 * - summarizeTrendingNews - A function that handles the news summarization process.
 * - TrendingNewsSummariesInput - The input type for the summarizeTrendingNews function.
 * - TrendingNewsSummariesOutput - The return type for the summarizeTrendingNews function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TrendingNewsSummariesInputSchema = z.object({
  title: z.string().describe('The title of the gaming news article.'),
  content: z.string().describe('The full content of the gaming news article.'),
});
export type TrendingNewsSummariesInput = z.infer<typeof TrendingNewsSummariesInputSchema>;

const TrendingNewsSummariesOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the gaming news article, no more than 3 sentences.'),
});
export type TrendingNewsSummariesOutput = z.infer<typeof TrendingNewsSummariesOutputSchema>;

export async function summarizeTrendingNews(input: TrendingNewsSummariesInput): Promise<TrendingNewsSummariesOutput> {
  return trendingNewsSummariesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeTrendingNewsPrompt',
  input: { schema: TrendingNewsSummariesInputSchema },
  output: { schema: TrendingNewsSummariesOutputSchema },
  prompt: `Summarize the following gaming news article concisely, focusing on the main points and keeping it to a maximum of 3 sentences.

Title: {{{title}}}

Content: {{{content}}}`,
});

const trendingNewsSummariesFlow = ai.defineFlow(
  {
    name: 'trendingNewsSummariesFlow',
    inputSchema: TrendingNewsSummariesInputSchema,
    outputSchema: TrendingNewsSummariesOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
