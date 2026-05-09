'use server';
/**
 * @fileOverview An AI-powered tool for providing personalized game recommendations based on user interactions.
 *
 * - aiGameDiscovererTool - A function that handles the game recommendation process.
 * - AIGameDiscovererToolInput - The input type for the aiGameDiscovererTool function.
 * - AIGameDiscovererToolOutput - The return type for the aiGameDiscovererTool function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AIGameDiscovererToolInputSchema = z.object({
  browsingHistory: z.array(z.string()).describe('A list of game titles the user has viewed.'),
  playedGames: z.array(
    z.object({
      title: z.string().describe('The title of the game.'),
      playtimeHours: z.number().optional().describe('Hours played, if available.'),
      rating: z.number().min(1).max(5).optional().describe('User rating (1-5 stars), if available.'),
    })
  ).describe('A list of games the user has played, with optional interaction data.'),
  preferredGenres: z.array(z.string()).describe('A list of game genres the user prefers.'),
  dislikedGenres: z.array(z.string()).optional().describe('A list of game genres the user dislikes.'),
});
export type AIGameDiscovererToolInput = z.infer<typeof AIGameDiscovererToolInputSchema>;

const AIGameDiscovererToolOutputSchema = z.object({
  recommendedGames: z.array(
    z.object({
      title: z.string().describe('The title of the recommended game.'),
      reason: z.string().describe('A brief explanation for why this game is recommended.'),
      genre: z.string().optional().describe('The primary genre of the recommended game.'),
    })
  ).describe('A list of personalized game recommendations.'),
});
export type AIGameDiscovererToolOutput = z.infer<typeof AIGameDiscovererToolOutputSchema>;

const prompt = ai.definePrompt({
  name: 'aiGameDiscovererPrompt',
  input: { schema: AIGameDiscovererToolInputSchema },
  output: { schema: AIGameDiscovererToolOutputSchema },
  prompt: `You are an expert game recommendation engine for Fide Games, a futuristic gaming platform.
Your goal is to suggest personalized game recommendations to the user based on their preferences and history.

Consider the following user data:

{{#if browsingHistory}}
Browsing History: {{#each browsingHistory}}{{{this}}}{{^@last}}, {{/@last}}{{/each}}
{{/if}}

{{#if playedGames}}
Played Games:
{{#each playedGames}}- Title: {{{this.title}}}{{#if this.playtimeHours}}, Playtime: {{{this.playtimeHours}}} hours{{/if}}{{#if this.rating}}, Rating: {{{this.rating}}} stars{{/if}}
{{/each}}
{{/if}}

{{#if preferredGenres}}
Preferred Genres: {{#each preferredGenres}}{{{this}}}{{^@last}}, {{/@last}}{{/each}}
{{/if}}

{{#if dislikedGenres}}
Disliked Genres: {{#each dislikedGenres}}{{{this}}}{{^@last}}, {{/@last}}{{/each}}
{{/if}}

Based on this information, provide a list of at most 5 game recommendations. For each recommendation, include the game title, a brief reason for the recommendation, and its primary genre if known.
Ensure the recommendations are fresh, engaging, and align with the user's demonstrated tastes while avoiding genres they dislike.
`,
});

const aiGameDiscovererFlow = ai.defineFlow(
  {
    name: 'aiGameDiscovererFlow',
    inputSchema: AIGameDiscovererToolInputSchema,
    outputSchema: AIGameDiscovererToolOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await prompt(input);
      return output!;
    } catch (e) {
      console.error('Genkit model error, returning fallbacks', e);
      return {
        recommendedGames: [
          { title: "The Witcher 3: Wild Hunt", reason: "A masterpiece of storytelling and open-world exploration that matches your RPG preferences.", genre: "RPG" },
          { title: "Elden Ring", reason: "Provides the high-fidelity challenge and atmospheric depth you enjoy in Action titles.", genre: "Action RPG" },
          { title: "Cyberpunk 2077", reason: "The ultimate futuristic experience aligned with your interest in neon-drenched narratives.", genre: "RPG" }
        ]
      };
    }
  }
);

export async function aiGameDiscovererTool(input: AIGameDiscovererToolInput): Promise<AIGameDiscovererToolOutput> {
  return aiGameDiscovererFlow(input);
}
