
"use client";

import * as React from "react";
import { Headphones, Loader2, Sparkles, Speaker, Mic, AudioLines, Bluetooth } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { AudioDevice } from "@/types";
import DeviceItem from "@/components/DeviceItem";
import { getSuggestedVolumes } from "./actions";
import VideoShareCard from "@/components/VideoShareCard";

const initialDevices: AudioDevice[] = [
  { id: "1", name: "Realtek HD Audio", type: "speakers", selected: true, volume: 75 },
  { id: "2", name: "Logitech Pro X", type: "headphones", selected: false, volume: 30 },
  { id: "3", name: "NVIDIA Broadcast", type: "microphone", selected: false, volume: 60 },
  { id: "4", name: "SteelSeries Sonar", type: "other", selected: false, volume: 50 },
  { id: "5", name: "Sony WH-1000XM4", type: "headphones", selected: false, volume: 40 },
  { id: "6", name: "Monitor Speakers", type: "speakers", selected: false, volume: 80 },
  { id: "7", name: "Blue Yeti", type: "microphone", selected: true, volume: 65 },
  { id: "8", name: "Auxiliary Device", type: "other", selected: false, volume: 55 },
];

export default function Home() {
  const [devices, setDevices] = React.useState<AudioDevice[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSuggesting, setIsSuggesting] = React.useState(false);
  const [isScanning, setIsScanning] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    try {
      const savedConfig = localStorage.getItem("audioSplitConfig");
      if (savedConfig) {
        setDevices(JSON.parse(savedConfig));
      } else {
        setDevices(initialDevices);
      }
    } catch (error) {
      console.error("Failed to load config from localStorage", error);
      setDevices(initialDevices);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem("audioSplitConfig", JSON.stringify(devices));
      } catch (error) {
        console.error("Failed to save config to localStorage", error);
      }
    }
  }, [devices, isLoading]);

  const handleToggleDevice = (id: string) => {
    setDevices(
      devices.map((d) => (d.id === id ? { ...d, selected: !d.selected } : d))
    );
  };

  const handleVolumeChange = (id: string, volume: number[]) => {
    setDevices(
      devices.map((d) => (d.id === id ? { ...d, volume: volume[0] } : d))
    );
  };

  const handleSuggestVolumes = async () => {
    const selectedDevices = devices.filter((d) => d.selected);
    if (selectedDevices.length === 0) {
      toast({
        variant: "destructive",
        title: "No devices selected",
        description: "Please select at least one device to get suggestions.",
      });
      return;
    }

    setIsSuggesting(true);
    try {
      const result = await getSuggestedVolumes(
        selectedDevices.map((d) => ({ deviceId: d.id, deviceType: d.type }))
      );

      if (result.suggestedVolumes) {
        setDevices((prevDevices) =>
          prevDevices.map((d) =>
            result.suggestedVolumes[d.id]
              ? { ...d, volume: result.suggestedVolumes[d.id] }
              : d
          )
        );
        toast({
          title: "Success",
          description: "Volume levels have been updated with AI suggestions.",
        });
      }
    } catch (error) {
      console.error("Failed to get volume suggestions", error);
      toast({
        variant: "destructive",
        title: "AI Suggestion Failed",
        description: "Could not get volume suggestions. Please try again later.",
      });
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleScanForDevices = () => {
    setIsScanning(true);
    toast({
      title: "Scanning for devices...",
      description: "Looking for new Bluetooth devices in range.",
    });

    setTimeout(() => {
      const newDevice: AudioDevice = {
        id: (devices.length + 1).toString(),
        name: "Bose QuietComfort",
        type: "headphones",
        selected: false,
        volume: 50,
      };

      setDevices(prev => [...prev, newDevice]);

      toast({
        title: "Device Found!",
        description: `${newDevice.name} has been added to your device list.`,
      });

      setIsScanning(false);
    }, 2000);
  };

  const selectedDevicesCount = devices.filter(d => d.selected).length;

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

        <VideoShareCard />

        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Audio Output Group</CardTitle>
              <CardDescription>
                {selectedDevicesCount > 0 ? `${selectedDevicesCount} device${selectedDevicesCount > 1 ? 's' : ''} selected` : 'No devices selected'}
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button onClick={handleScanForDevices} disabled={isScanning} variant="outline" className="w-full sm:w-auto">
                {isScanning ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Bluetooth className="mr-2 h-4 w-4" />
                )}
                Scan
              </Button>
              <Button onClick={handleSuggestVolumes} disabled={isSuggesting || isScanning} className="w-full sm:w-auto">
                {isSuggesting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Suggest Volumes
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-4">
                {devices.length > 0 ? (
                  devices.map((device) => (
                    <DeviceItem
                      key={device.id}
                      device={device}
                      onToggle={handleToggleDevice}
                      onVolumeChange={handleVolumeChange}
                    />
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No audio devices detected.
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

    