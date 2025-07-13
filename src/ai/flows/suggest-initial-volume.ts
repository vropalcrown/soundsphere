// src/ai/flows/suggest-initial-volume.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow to suggest initial volume settings for audio devices
 *  based on their type (e.g., headphones, speakers).
 *
 * - suggestInitialVolume - A function that suggests initial volume settings.
 * - SuggestInitialVolumeInput - The input type for the suggestInitialVolume function.
 * - SuggestInitialVolumeOutput - The output type for the suggestInitialVolume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestInitialVolumeInputSchema = z.object({
  devices: z.array(
    z.object({
      deviceId: z.string().describe('The unique identifier of the audio device.'),
      deviceType: z
        .enum(['headphones', 'speakers', 'microphone', 'other'])
        .describe('The type of the audio device.'),
    })
  ).describe('A list of audio devices to suggest initial volumes for.'),
});

export type SuggestInitialVolumeInput = z.infer<typeof SuggestInitialVolumeInputSchema>;

const SuggestInitialVolumeOutputSchema = z.object({
  suggestedVolumes: z.record(
    z.string(),
    z.number().min(0).max(100).describe('Suggested initial volume (0-100) for the device.')
  ).describe('A map of device IDs to suggested initial volume levels.'),
});

export type SuggestInitialVolumeOutput = z.infer<typeof SuggestInitialVolumeOutputSchema>;

export async function suggestInitialVolume(input: SuggestInitialVolumeInput): Promise<SuggestInitialVolumeOutput> {
  return suggestInitialVolumeFlow(input);
}

const suggestInitialVolumePrompt = ai.definePrompt({
  name: 'suggestInitialVolumePrompt',
  input: {schema: SuggestInitialVolumeInputSchema},
  output: {schema: SuggestInitialVolumeOutputSchema},
  prompt: `You are an expert audio engineer. You will suggest initial volume settings for a list of audio devices.

  Given the following list of audio devices with their types, suggest an initial volume level between 0 and 100 for each device. Provide the output as a JSON map of device IDs to suggested volume levels. Take into account the device types.
  For example, headphones should have a lower initial volume than speakers. Microphones may also need to be suggested.

  Devices:
  {{#each devices}}
  - Device ID: {{deviceId}}, Type: {{deviceType}}
  {{/each}}`,
});

const suggestInitialVolumeFlow = ai.defineFlow(
  {
    name: 'suggestInitialVolumeFlow',
    inputSchema: SuggestInitialVolumeInputSchema,
    outputSchema: SuggestInitialVolumeOutputSchema,
  },
  async input => {
    const {output} = await suggestInitialVolumePrompt(input);
    return output!;
  }
);
