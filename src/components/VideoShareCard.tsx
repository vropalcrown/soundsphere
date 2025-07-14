
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, MonitorSmartphone, Laptop, Tv, Users, Link as LinkIcon, Copy, WifiOff, History, RotateCw, Captions, Loader2, Languages, FileSearch, Maximize, Minimize } from "lucide-react";
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
import { getAiSubtitle, findOriginalSubtitles } from "@/app/actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator as DropdownSeparator,
} from "@/components/ui/dropdown-menu"
import { Slider } from "@/components/ui/slider";

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
  const playerRef = React.useRef<HTMLDivElement>(null);
  const subtitleIntervalRef = React.useRef<NodeJS.Timeout>();

  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isBuffering, setIsBuffering] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

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
  const [subtitleLanguage, setSubtitleLanguage] = React.useState<string>();
  const [isFindingSubtitles, setIsFindingSubtitles] = React.useState(false);


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

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = (value[0] / 100) * duration;
      setProgress(value[0]);
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const toggleFullscreen = () => {
    if (!playerRef.current) return;

    if (!document.fullscreenElement) {
        playerRef.current.requestFullscreen().catch(err => {
        alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handlePlaybackSpeedChange = (speed: number) => {
    if (videoRef.current) {
        videoRef.current.playbackRate = speed;
    }
  };


  const fetchAndSetSubtitle = React.useCallback(async () => {
    setIsGeneratingSubtitle(true);
    try {
      const transcriptIndex = Math.floor(Math.random() * videoTranscript.length);
      const transcript = videoTranscript[transcriptIndex];
      const result = await getAiSubtitle(transcript, currentVideo.title, subtitleLanguage);
      setCurrentSubtitle(result.subtitle);
    } catch (error) {
      console.error("Failed to generate subtitle", error);
      setCurrentSubtitle("Error generating subtitles.");
    } finally {
      setIsGeneratingSubtitle(false);
    }
  }, [currentVideo.title, subtitleLanguage]);

  const toggleSubtitles = () => {
    setAreSubtitlesEnabled(prev => {
        const newState = !prev;
        if (!newState) {
            setSubtitleLanguage(undefined);
            setCurrentSubtitle("");
        }
        return newState;
    });
  };

  React.useEffect(() => {
    if (areSubtitlesEnabled && isPlaying) {
      fetchAndSetSubtitle();
      subtitleIntervalRef.current = setInterval(fetchAndSetSubtitle, 5000);
    } else {
      if (subtitleIntervalRef.current) {
        clearInterval(subtitleIntervalRef.current);
      }
      if (!areSubtitlesEnabled) {
          setCurrentSubtitle("");
      }
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
      setIsBuffering(false);
      updateViewerStatus("Playing");
    };
    const handlePause = () => {
      setIsPlaying(false);
      setIsBuffering(false);
      updateViewerStatus("Paused");
    };
    const handleWaiting = () => {
      setIsBuffering(true);
      updateViewerStatus("Buffering");
    }
    const handleTimeUpdate = () => {
        setProgress((video.currentTime / video.duration) * 100);
    };
    const handleLoadedMetadata = () => {
        setDuration(video.duration);
    };
    const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    document.addEventListener('fullscreenchange', handleFullscreenChange);


    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

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

  const handleFindSubtitles = async () => {
    setIsFindingSubtitles(true);
    toast({
      title: "Searching for subtitles...",
      description: `Looking for original subtitles for "${currentVideo.title}".`
    });
    try {
        const result = await findOriginalSubtitles(currentVideo.title);
        if (result.subtitleTrack) {
            setAreSubtitlesEnabled(true);
            setSubtitleLanguage(undefined);
            if (subtitleIntervalRef.current) clearInterval(subtitleIntervalRef.current);
            setCurrentSubtitle(result.subtitleTrack);
            toast({
                title: "Subtitles Found!",
                description: "Original subtitle track has been loaded."
            });
        } else {
            toast({
                variant: "destructive",
                title: "Not Found",
                description: result.message
            });
        }
    } catch (error) {
        console.error("Failed to find subtitles", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "An unexpected error occurred while searching for subtitles."
        });
    } finally {
        setIsFindingSubtitles(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Video Watch Party</CardTitle>
        <CardDescription>Share and sync video with friends, whether they're in the same room or across the globe.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div ref={playerRef} className="group relative aspect-video rounded-lg overflow-hidden border bg-muted">
          <video
            ref={videoRef}
            key={currentVideo.src}
            className="w-full h-full object-cover"
            poster={currentVideo.poster}
            data-ai-hint="nature movie"
            onClick={togglePlayPause}
            onDoubleClick={toggleFullscreen}
            controls={false}
          >
            <source src={currentVideo.src} type="video/mp4" />
          </video>
          <div className="absolute inset-0 flex flex-col justify-between bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             {/* Top bar (for title maybe) - Empty for now */}
            <div></div>
            {/* Center play/pause button */}
            <div className="flex-grow flex items-center justify-center">
              {isBuffering ? (
                <Loader2 className="w-12 h-12 text-white/80 animate-spin" />
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "w-16 h-16 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all duration-300",
                    isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"
                  )}
                  onClick={togglePlayPause}
                >
                  {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                </Button>
              )}
            </div>
            
            {/* Subtitles */}
            {areSubtitlesEnabled && (
              <div className="text-center pb-4 px-4 text-white text-lg font-semibold drop-shadow-lg h-24 flex items-center justify-center">
                {isGeneratingSubtitle && !currentSubtitle ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <p className="line-clamp-3">{currentSubtitle}</p>
                )}
              </div>
            )}
            
            {/* Custom Controls */}
            <div className="p-3 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
                <div className="flex items-center gap-3">
                    <span className="text-white text-xs font-mono">{formatTime(videoRef.current?.currentTime ?? 0)}</span>
                    <Slider
                        value={[progress]}
                        onValueChange={handleSeek}
                        max={100}
                        step={0.1}
                        className="w-full"
                    />
                    <span className="text-white text-xs font-mono">{formatTime(duration)}</span>
                </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={togglePlayPause} className="text-white/80 hover:text-white hover:bg-white/20">
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={handleFindSubtitles} disabled={isFindingSubtitles} className="text-white/80 hover:text-white hover:bg-white/20">
                        {isFindingSubtitles ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileSearch className="w-5 h-5" />}
                    </Button>
                    <Button variant={areSubtitlesEnabled ? "secondary" : "ghost"} size="icon" onClick={toggleSubtitles} className="text-white/80 hover:text-white hover:bg-white/20">
                        <Captions className="w-5 h-5" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-white/80 hover:text-white hover:bg-white/20">
                            <Languages className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>AI Generated Subtitles</DropdownMenuLabel>
                        <DropdownSeparator />
                        <DropdownMenuItem onClick={() => setSubtitleLanguage(undefined)} disabled={!areSubtitlesEnabled}>English (Default)</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSubtitleLanguage('Spanish')} disabled={!areSubtitlesEnabled}>Spanish</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSubtitleLanguage('French')} disabled={!areSubtitlesEnabled}>French</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSubtitleLanguage('Japanese')} disabled={!areSubtitlesEnabled}>Japanese</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSubtitleLanguage('German')} disabled={!areSubtitlesEnabled}>German</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-white/80 hover:text-white hover:bg-white/20">
                                <span className="text-xs font-bold">{videoRef.current?.playbackRate ?? 1}x</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                           <DropdownMenuItem onClick={() => handlePlaybackSpeedChange(0.5)}>0.5x</DropdownMenuItem>
                           <DropdownMenuItem onClick={() => handlePlaybackSpeedChange(1)}>1x (Normal)</DropdownMenuItem>
                           <DropdownMenuItem onClick={() => handlePlaybackSpeedChange(1.5)}>1.5x</DropdownMenuItem>
                           <DropdownMenuItem onClick={() => handlePlaybackSpeedChange(2)}>2x</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="text-white/80 hover:text-white hover:bg-white/20">
                        {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                    </Button>
                </div>
              </div>
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
        <Button variant="secondary" className="w-full sm:w-auto" onClick={handleOfflineShare}>
            <WifiOff className="mr-2 h-4 w-4" />
            Offline Share
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
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
