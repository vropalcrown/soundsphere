'use server';

/**
 * @fileOverview This file defines a Genkit flow to generate subtitles from a snippet of transcript.
 * - generateSubtitle - A function that generates a subtitle.
 * - GenerateSubtitleInput - The input type for the generateSubtitle function.
 * - GenerateSubtitleOutput - The output type for the generateSubtitle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSubtitleInputSchema = z.object({
  transcript: z.string().describe('A small chunk of audio transcript from a video.'),
  videoTitle: z.string().describe('The title of the video being watched.'),
  targetLanguage: z.string().optional().describe('The language to translate the subtitle into (e.g., "Spanish", "Japanese").'),
});

export type GenerateSubtitleInput = z.infer<typeof GenerateSubtitleInputSchema>;

const GenerateSubtitleOutputSchema = z.object({
  subtitle: z.string().describe('The generated subtitle, corrected for grammar and context, and translated if requested.'),
});

export type GenerateSubtitleOutput = z.infer<typeof GenerateSubtitleOutputSchema>;

export async function generateSubtitle(input: GenerateSubtitleInput): Promise<GenerateSubtitleOutput> {
  return generateSubtitleFlow(input);
}

const generateSubtitlePrompt = ai.definePrompt({
  name: 'generateSubtitlePrompt',
  input: {schema: GenerateSubtitleInputSchema},
  output: {schema: GenerateSubtitleOutputSchema},
  prompt: `You are an expert real-time subtitle generator for a video watch party.
You will be given a small, raw snippet of transcript from the video titled "{{videoTitle}}".
Your first task is to correct any transcription errors, add appropriate punctuation, and format it as a single, clear subtitle line. The subtitle should be concise.

{{#if targetLanguage}}
Your second task is to translate the corrected subtitle into {{targetLanguage}}. The final output should be only the translated text.
{{/if}}

Original Transcript: "{{transcript}}"
`,
});

const generateSubtitleFlow = ai.defineFlow(
  {
    name: 'generateSubtitleFlow',
    inputSchema: GenerateSubtitleInputSchema,
    outputSchema: GenerateSubtitleOutputSchema,
  },
  async input => {
    // In a real app, you might add logic here to handle timing or speaker changes.
    const {output} = await generateSubtitlePrompt(input);
    return output!;
  }
);
