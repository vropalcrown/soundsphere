// src/app/actions.ts
"use server";

import {
  suggestInitialVolume,
  type SuggestInitialVolumeInput,
  type SuggestInitialVolumeOutput,
} from "@/ai/flows/suggest-initial-volume";

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
