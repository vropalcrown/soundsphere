'use server';

/**
 * @fileOverview This file defines a Genkit flow that uses a tool to find subtitles online.
 * - findSubtitles - A function that attempts to find subtitles for a video.
 * - FindSubtitlesInput - The input type for the findSubtitles function.
 * - FindSubtitlesOutput - The output type for the findSubtitles function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// --- Schemas ---
const FindSubtitlesInputSchema = z.object({
  videoTitle: z.string().describe('The title of the video to find subtitles for.'),
});
export type FindSubtitlesInput = z.infer<typeof FindSubtitlesInputSchema>;

const FindSubtitlesOutputSchema = z.object({
  subtitleTrack: z.string().optional().describe('The full subtitle track found online, if available.'),
  message: z.string().describe('A message indicating the result of the search.'),
});
export type FindSubtitlesOutput = z.infer<typeof FindSubtitlesOutputSchema>;


// --- Tool Definition ---
const findOriginalSubtitlesTool = ai.defineTool(
  {
    name: 'findOriginalSubtitles',
    description: 'Searches the internet for an original subtitle file for a given video title.',
    inputSchema: z.object({
      title: z.string().describe('The title of the movie or series.'),
    }),
    outputSchema: z.object({
      found: z.boolean(),
      subtitleContent: z.string().optional(),
    }),
  },
  async ({ title }) => {
    console.log(`Searching for subtitles for: ${title}`);
    // In a real application, this would call a subtitle database API.
    // Here, we simulate finding subtitles for a specific video.
    if (title.toLowerCase().includes('big buck bunny')) {
      return {
        found: true,
        subtitleContent: "[00:00:01] A large rabbit, known as Big Buck Bunny, emerges from his burrow. [00:00:05] He observes a butterfly, peacefully. [00:00:10] Suddenly, three mischievous rodents appear and start bothering the butterfly. [00:00:15] Bunny watches, annoyed. [00:00:20] The rodents then turn their attention to Bunny himself, pelting him with nuts and berries. [00:00:25] Bunny has had enough and devises a plan for retaliation.",
      };
    }
    return { found: false };
  }
);


// --- Prompt and Flow ---
const findSubtitlesPrompt = ai.definePrompt({
  name: 'findSubtitlesPrompt',
  input: { schema: FindSubtitlesInputSchema },
  output: { schema: FindSubtitlesOutputSchema },
  tools: [findOriginalSubtitlesTool],
  prompt: `You are a subtitle-finding assistant. Use the available tools to find the original subtitle track for the video titled "{{videoTitle}}".

  If you find the subtitles, set the 'subtitleTrack' field with the content you found and set the message to "Subtitles found!".
  If you cannot find any subtitles, leave 'subtitleTrack' empty and set the message to "Sorry, I couldn't find any original subtitles for that video."`,
});

const findSubtitlesFlow = ai.defineFlow(
  {
    name: 'findSubtitlesFlow',
    inputSchema: FindSubtitlesInputSchema,
    outputSchema: FindSubtitlesOutputSchema,
  },
  async (input) => {
    const { output } = await findSubtitlesPrompt(input);
    return output!;
  }
);


// --- Exported Function ---
export async function findSubtitles(input: FindSubtitlesInput): Promise<FindSubtitlesOutput> {
  return findSubtitlesFlow(input);
}
