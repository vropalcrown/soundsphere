import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-initial-volume.ts';
import '@/ai/flows/generate-subtitle-flow';
import '@/ai/flows/find-subtitles-flow';
