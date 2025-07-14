
"use client";

import * as React from "react";
import { AudioLines, Film, ArrowRight, Download } from "lucide-react";
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
            <svg
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-primary"
              fill="currentColor"
            >
              <title>SyncSphere</title>
              <path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24zm0 22.286a10.286 10.286 0 1 1 0-20.572 10.286 10.286 0 0 1 0 20.572zm-4.286-6.43a.857.857 0 0 1-.607-1.464l3.429-3.429a.857.857 0 0 1 1.214 0l3.429 3.429a.857.857 0 1 1-1.214 1.214l-2.822-2.821-2.821 2.821a.857.857 0 0 1-.608.25zM12 9.429a.857.857 0 0 1-.857-.857V3.429a.857.857 0 1 1 1.714 0v5.143c0 .473-.384.857-.857.857z" />
            </svg>
            <h1 className="text-4xl font-bold tracking-tight font-headline">
              SyncSphere
            </h1>
          </div>
          <p className="text-muted-foreground">
            Route audio, share video, and sync experiences seamlessly.
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
                Capture PC audio and route it to multiple headphones or speakers at once.
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
                Share and sync video with friends, whether in the same room or across the globe.
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

        <Card className="col-span-1 md:col-span-2 hover:border-primary/60 transition-colors bg-card/50 border-dashed">
            <CardHeader className="text-center">
                 <div className="flex flex-col items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-md">
                        <Download className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Get the App</CardTitle>
                </div>
                <CardDescription>
                    Install SyncSphere on your desktop or mobile device for a native-like experience.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
                <Link href="/download" passHref>
                    <Button variant="secondary" className="w-full sm:w-auto">
                        View Install Instructions <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </CardContent>
        </Card>

      </div>
    </main>
  );
}
