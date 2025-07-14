
import * as React from "react";
import VideoShareCard from "@/components/VideoShareCard";
import { ArrowLeft, Film } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function VideoPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12 bg-background">
      <div className="w-full max-w-4xl space-y-8">
         <header className="relative flex justify-center text-center">
           <div className="absolute left-0">
            <Link href="/" passHref>
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="inline-flex flex-col items-center">
            <div className="inline-flex items-center gap-2 mb-2">
                <Film className="h-8 w-8 text-primary" />
                <h1 className="text-4xl font-bold tracking-tight font-headline">
                Video Watch Party
                </h1>
            </div>
            <p className="text-muted-foreground">
                Share and sync video with anyone, anywhere.
            </p>
          </div>
        </header>
        <VideoShareCard />
      </div>
    </main>
  );
}
