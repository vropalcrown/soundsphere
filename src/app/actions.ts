// src/app/actions.ts
"use server";

import {
  suggestInitialVolume,
  type SuggestInitialVolumeInput,
  type SuggestInitialVolumeOutput,
} from "@/ai/flows/suggest-initial-volume";

import {
  generateSubtitle,
  type GenerateSubtitleInput,
  type GenerateSubtitleOutput,
} from "@/ai/flows/generate-subtitle-flow";

export async function getSuggestedVolumes(
  devices: SuggestInitialVolumeInput["devices"]
): Promise<SuggestInitialVolumeOutput> {
  const input: SuggestInitialVolumeInput = { devices };
  try {
    const output = await suggestInitialVolume(input);
    return output;
  } catch (error) {
    console.error("Error in getSuggestedVolumes action:", error);
    throw new Error("Failed to get suggestions from the AI flow.");
  }
}

export async function getAiSubtitle(
  transcript: string,
  videoTitle: string
): Promise<GenerateSubtitleOutput> {
  const input: GenerateSubtitleInput = { transcript, videoTitle };
  try {
    const output = await generateSubtitle(input);
    return output;
  } catch (error) {
    console.error("Error in getAiSubtitle action:", error);
    throw new Error("Failed to get subtitle from the AI flow.");
  }
}
