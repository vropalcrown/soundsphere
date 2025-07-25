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

import {
  findSubtitles,
  type FindSubtitlesInput,
  type FindSubtitlesOutput,
} from "@/ai/flows/find-subtitles-flow";

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
  videoTitle: string,
  targetLanguage?: string,
): Promise<GenerateSubtitleOutput> {
  const input: GenerateSubtitleInput = { transcript, videoTitle, targetLanguage };
  try {
    const output = await generateSubtitle(input);
    return output;
  } catch (error) {
    console.error("Error in getAiSubtitle action:", error);
    throw new Error("Failed to get subtitle from the AI flow.");
  }
}

export async function findOriginalSubtitles(
  videoTitle: string
): Promise<FindSubtitlesOutput> {
  const input: FindSubtitlesInput = { videoTitle };
  try {
    const output = await findSubtitles(input);
    return output;
  } catch (error) {
    console.error("Error in findOriginalSubtitles action:", error);
    throw new Error("Failed to find subtitles from the AI flow.");
  }
}
