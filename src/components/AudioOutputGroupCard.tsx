
"use client";

import * as React from "react";
import { Headphones, Loader2, Sparkles, Speaker, Mic, AudioLines, Bluetooth } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { AudioDevice } from "@/types";
import DeviceItem from "@/components/DeviceItem";
import { getSuggestedVolumes } from "@/app/actions";

const initialDevices: AudioDevice[] = [
  { id: "1", name: "Realtek HD Audio", type: "speakers", selected: true, volume: 75, supportedFeatures: ["stereo"] },
  { id: "2", name: "Logitech Pro X", type: "headphones", selected: false, volume: 30, supportedFeatures: ["stereo"] },
  { id: "3", name: "NVIDIA Broadcast", type: "microphone", selected: false, volume: 60 },
  { id: "4", name: "SteelSeries Sonar", type: "other", selected: false, volume: 50 },
  { id: "5", name: "Sony WH-1000XM4", type: "headphones", selected: false, volume: 40, supportedFeatures: ["spatialAudio", "stereo"], featureSettings: { spatialAudio: { enabled: false, headTracking: true } } },
  { id: "6", name: "Monitor Speakers", type: "speakers", selected: false, volume: 80, supportedFeatures: ["stereo"] },
  { id: "7", name: "Blue Yeti", type: "microphone", selected: true, volume: 65 },
  { id: "8", name: "Home Theatre System", type: "other", selected: false, volume: 85, supportedFeatures: ["dolbyAtmos", "stereo"] },
];

export default function AudioOutputGroupCard() {
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

  const handleToggleDevice = React.useCallback((id: string) => {
    setDevices(
      (currentDevices) => currentDevices.map((d) => (d.id === id ? { ...d, selected: !d.selected } : d))
    );
  }, []);

  const handleVolumeChange = React.useCallback((id: string, volume: number[]) => {
    setDevices(
      (currentDevices) => currentDevices.map((d) => (d.id === id ? { ...d, volume: volume[0] } : d))
    );
  }, []);
  
  const handleFeatureSettingsChange = React.useCallback((id: string, newSettings: AudioDevice['featureSettings']) => {
    setDevices(prevDevices =>
      prevDevices.map(d =>
        d.id === id
          ? {
              ...d,
              featureSettings: {
                ...d.featureSettings,
                ...newSettings,
              },
            }
          : d
      )
    );
     toast({
      title: "Settings Updated",
      description: `Audio features for ${devices.find(d => d.id === id)?.name} have been updated.`,
    });
  }, [devices, toast]);

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
        supportedFeatures: ["spatialAudio", "stereo"],
        featureSettings: { spatialAudio: { enabled: true, headTracking: false } }
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
                  onFeatureSettingsChange={handleFeatureSettingsChange}
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
  )
}
