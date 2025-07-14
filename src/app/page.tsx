
"use client";

import * as React from "react";
import { AudioLines, Film, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 bg-background">
      <div className="w-full max-w-4xl space-y-8">
        <header className="text-center">
          <div className="inline-flex items-center gap-2 mb-2">
            <AudioLines className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight font-headline">
              SyncSphere
            </h1>
          </div>
          <p className="text-muted-foreground">
            Route audio and share video to multiple devices simultaneously.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="hover:border-primary/60 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-md">
                   <AudioLines className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Audio Routing</CardTitle>
              </div>
              <CardDescription>
                Capture audio from any app on your PC and route it to multiple
                headphones or speakers at once.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/audio" passHref>
                <Button className="w-full">
                  Open Audio Tools <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/60 transition-colors">
            <CardHeader>
               <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-md">
                   <Film className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Video Watch Party</CardTitle>
              </div>
              <CardDescription>
                Share and sync video with friends, whether they're in the same
                room or across the globe.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/video" passHref>
                <Button className="w-full">
                  Start a Watch Party <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
