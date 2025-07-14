
"use client";

import * as React from "react";
import { AudioLines } from "lucide-react";
import VideoShareCard from "@/components/VideoShareCard";
import AudioOutputGroupCard from "@/components/AudioOutputGroupCard";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 bg-background">
      <div className="w-full max-w-4xl space-y-8">
        <header className="text-center">
          <div className="inline-flex items-center gap-2 mb-2">
            <AudioLines className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight font-headline">
              AudioSplit
            </h1>
          </div>
          <p className="text-muted-foreground">
            Route audio and share video to multiple devices simultaneously.
          </p>
        </header>

        <VideoShareCard />
        <AudioOutputGroupCard />

      </div>
    </main>
  );
}
