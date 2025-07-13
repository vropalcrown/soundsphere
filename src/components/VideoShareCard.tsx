
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, MonitorSmartphone, Laptop, Tv, Users, Link as LinkIcon, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Viewer } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";


const initialViewers: Viewer[] = [
    { id: "1", name: "Alice", location: "New York", device: "Mobile", status: "Playing", icon: MonitorSmartphone },
    { id: "2", name: "Bob", location: "London", device: "Laptop", status: "Playing", icon: Laptop },
    { id: "3", name: "Charlie", location: "Tokyo", device: "TV", status: "Playing", icon: Tv },
  ];

export default function VideoShareCard() {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [viewers, setViewers] = React.useState<Viewer[]>(initialViewers);
  const { toast } = useToast();

  const shareLink = "https://audiosplit.example.com/watch?party=A8B2Z";

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  const updateViewerStatus = (status: "Playing" | "Paused" | "Buffering") => {
    setViewers(viewers.map(v => ({ ...v, status })));
  };

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      setIsPlaying(true);
      updateViewerStatus("Playing");
    };
    const handlePause = () => {
      setIsPlaying(false);
      updateViewerStatus("Paused");
    };
    const handleWaiting = () => {
      updateViewerStatus("Buffering");
    }

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("waiting", handleWaiting);


    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("waiting", handleWaiting);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast({
      title: "Link Copied!",
      description: "You can now share the link with your friends.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Video Watch Party</CardTitle>
        <CardDescription>Share and sync video playback with friends near or far.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative aspect-video rounded-lg overflow-hidden border bg-muted">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            poster="https://placehold.co/1280x720.png"
            data-ai-hint="nature movie"
            controls={false}
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="w-16 h-16 text-white/80 hover:text-white hover:bg-white/20 rounded-full"
              onClick={togglePlayPause}
            >
              {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
            </Button>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2 flex items-center gap-2 text-muted-foreground">
            <Users className="w-4 h-4" />
            Synced Viewers ({viewers.length})
          </h3>
          <div className="space-y-2">
            {viewers.map((viewer) => (
              <div key={viewer.id} className="flex items-center justify-between p-2 rounded-md bg-secondary/50">
                <div className="flex items-center gap-3">
                  <viewer.icon className="w-5 h-5 text-muted-foreground" />
                  <div className="text-sm">
                    <span className="font-medium text-foreground">{viewer.name}</span>
                    <span className="text-muted-foreground"> ({viewer.location})</span>
                  </div>
                </div>
                <Badge
                  variant={viewer.status === 'Playing' ? 'default' : viewer.status === 'Paused' ? 'secondary' : 'destructive'}
                  className={cn("transition-colors", {
                    "bg-green-500/20 text-green-700 border-green-500/30 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20": viewer.status === "Playing",
                    "bg-yellow-500/20 text-yellow-700 border-yellow-500/30 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20": viewer.status === "Buffering",
                  })}
                >
                  {viewer.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <LinkIcon className="mr-2 h-4 w-4" />
              Invite Friends
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Share Watch Party</DialogTitle>
              <DialogDescription>
                Anyone with this link will be able to join your watch party.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="link" className="sr-only">
                  Link
                </Label>
                <Input
                  id="link"
                  defaultValue={shareLink}
                  readOnly
                />
              </div>
              <Button type="submit" size="icon" className="px-3" onClick={handleCopyLink}>
                <span className="sr-only">Copy</span>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
