
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, MonitorSmartphone, Laptop, Tv, Users, Link as LinkIcon, Copy, WifiOff, History, RotateCw, Captions, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Viewer, VideoHistoryItem } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { QRCodeSVG } from 'qrcode.react';
import { Separator } from "@/components/ui/separator";
import { getAiSubtitle } from "@/app/actions";

const initialViewers: Viewer[] = [
    { id: "1", name: "Alice", location: "New York", device: "Mobile", status: "Playing", icon: MonitorSmartphone },
    { id: "2", name: "Bob", location: "London", device: "Laptop", status: "Playing", icon: Laptop },
    { id: "3", name: "Charlie", location: "Tokyo", device: "TV", status: "Playing", icon: Tv },
  ];

const initialHistory: VideoHistoryItem[] = [
  { id: "1", title: "Elephants Dream", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", poster: "https://placehold.co/1280x720.png" },
  { id: "2", title: "For All Mankind", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", poster: "https://placehold.co/1280x720.png" },
];

const videoTranscript = [
  "so what do you think",
  "i dont know it looks kind of shabby",
  "shabby you think this is shabby",
  "well yeah its a bit rough around the edges",
  "i think it has character",
  "you would say that",
  "hey i like things with a little bit of history",
  "this looks more like a lot of history",
  "is that a squirrel in the corner",
  "oh thats just chip he lives here",
];


export default function VideoShareCard() {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const subtitleIntervalRef = React.useRef<NodeJS.Timeout>();
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [viewers, setViewers] = React.useState<Viewer[]>(initialViewers);
  const [history, setHistory] = React.useState<VideoHistoryItem[]>(initialHistory);
  const [currentVideo, setCurrentVideo] = React.useState({
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      poster: "https://placehold.co/1280x720.png",
      title: "Big Buck Bunny"
  });
  const [areSubtitlesEnabled, setAreSubtitlesEnabled] = React.useState(false);
  const [currentSubtitle, setCurrentSubtitle] = React.useState("");
  const [isGeneratingSubtitle, setIsGeneratingSubtitle] = React.useState(false);

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
  
  const fetchAndSetSubtitle = React.useCallback(async () => {
    setIsGeneratingSubtitle(true);
    try {
      const transcriptIndex = Math.floor(Math.random() * videoTranscript.length);
      const transcript = videoTranscript[transcriptIndex];
      const result = await getAiSubtitle(transcript, currentVideo.title);
      setCurrentSubtitle(result.subtitle);
    } catch (error) {
      console.error("Failed to generate subtitle", error);
      setCurrentSubtitle("Error generating subtitles.");
    } finally {
      setIsGeneratingSubtitle(false);
    }
  }, [currentVideo.title]);
  
  const toggleSubtitles = () => {
    setAreSubtitlesEnabled(prev => !prev);
    setCurrentSubtitle("");
  };

  React.useEffect(() => {
    if (areSubtitlesEnabled && isPlaying) {
      fetchAndSetSubtitle(); 
      subtitleIntervalRef.current = setInterval(fetchAndSetSubtitle, 5000);
    } else {
      if (subtitleIntervalRef.current) {
        clearInterval(subtitleIntervalRef.current);
      }
      setCurrentSubtitle("");
    }
    
    return () => {
      if (subtitleIntervalRef.current) {
        clearInterval(subtitleIntervalRef.current);
      }
    };
  }, [areSubtitlesEnabled, isPlaying, fetchAndSetSubtitle]);


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

  const handleOfflineShare = () => {
    toast({
      title: "Offline Sharing Started",
      description: "Ready for nearby devices to connect.",
    });
  }

  const handleLoadVideo = (video: VideoHistoryItem) => {
    setCurrentVideo({ src: video.src, poster: video.poster, title: video.title });
    if(videoRef.current) {
        videoRef.current.load();
        toast({
            title: "Video Loaded",
            description: `"${video.title}" is ready to play.`,
        });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Video Watch Party</CardTitle>
        <CardDescription>Share and sync video with friends, whether they're in the same room or across the globe.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative aspect-video rounded-lg overflow-hidden border bg-muted">
          <video
            ref={videoRef}
            key={currentVideo.src}
            className="w-full h-full object-cover"
            poster={currentVideo.poster}
            data-ai-hint="nature movie"
            controls={false}
          >
            <source src={currentVideo.src} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end">
            <div className="flex-grow flex items-center justify-center">
              <Button
                variant="ghost"
                size="icon"
                className="w-16 h-16 text-white/80 hover:text-white hover:bg-white/20 rounded-full"
                onClick={togglePlayPause}
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
              </Button>
            </div>
            {areSubtitlesEnabled && (
              <div className="text-center p-4 text-white text-lg font-semibold drop-shadow-lg h-20 flex items-center justify-center">
                {isGeneratingSubtitle && !currentSubtitle ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <p>{currentSubtitle}</p>
                )}
              </div>
            )}
            <div className="p-2 flex justify-end">
                <Button variant={areSubtitlesEnabled ? "secondary" : "ghost"} size="icon" onClick={toggleSubtitles} className="text-white/80 hover:text-white hover:bg-white/20">
                    <Captions className="w-5 h-5" />
                </Button>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center gap-2 text-muted-foreground">
                <History className="w-4 h-4" />
                Watch History
              </h3>
              <div className="space-y-2">
                {history.map((video) => (
                  <div key={video.id} className="flex items-center justify-between p-2 rounded-md bg-secondary/50">
                    <div className="flex items-center gap-3">
                      <div className="text-sm">
                        <span className="font-medium text-foreground">{video.title}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleLoadVideo(video)}>
                        <RotateCw className="mr-2 h-4 w-4" />
                        Load
                    </Button>
                  </div>
                ))}
              </div>
            </div>
        </div>

      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2">
        <Button variant="secondary" className="w-full" onClick={handleOfflineShare}>
            <WifiOff className="mr-2 h-4 w-4" />
            Offline Share
        </Button>
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
                Anyone with this link can join. Scan the QR code or copy the link.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center gap-4 py-4">
              <div className="p-4 bg-white rounded-lg">
                <QRCodeSVG value={shareLink} size={128} />
              </div>
              <div className="flex items-center space-x-2 w-full">
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
                <Button type="button" size="icon" className="px-3" onClick={handleCopyLink}>
                  <span className="sr-only">Copy</span>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
