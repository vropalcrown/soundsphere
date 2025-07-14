
"use client";

import * as React from "react";
import { Headphones, Speaker, Mic, AudioLines, Volume2, Settings, Wind, Podcast } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import type { AudioDevice, AudioFeature } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface DeviceItemProps {
  device: AudioDevice;
  onToggle: (id: string) => void;
  onVolumeChange: (id: string, volume: number[]) => void;
  onFeatureSettingsChange: (id: string, settings: AudioDevice['featureSettings']) => void;
}

const deviceIcons = {
  headphones: <Headphones className="h-5 w-5 text-muted-foreground" />,
  speakers: <Speaker className="h-5 w-5 text-muted-foreground" />,
  microphone: <Mic className="h-5 w-5 text-muted-foreground" />,
  other: <AudioLines className="h-5 w-5 text-muted-foreground" />,
};

const featureDisplay: Record<AudioFeature, { name: string, icon: React.ElementType }> = {
    dolbyAtmos: { name: "Dolby Atmos", icon: Podcast },
    spatialAudio: { name: "Spatial Audio", icon: Wind },
    stereo: { name: "Stereo", icon: Speaker }
}

interface AudioFeatureSettingsDialogProps {
  device: AudioDevice;
  onSettingsChange: (newSettings: AudioDevice['featureSettings']) => void;
  children: React.ReactNode;
}

const AudioFeatureSettingsDialog: React.FC<AudioFeatureSettingsDialogProps> = ({ device, onSettingsChange, children }) => {
    const [spatialEnabled, setSpatialEnabled] = React.useState(device.featureSettings?.spatialAudio?.enabled ?? false);
    const [headTracking, setHeadTracking] = React.useState(device.featureSettings?.spatialAudio?.headTracking ?? false);

    const hasSettings = device.supportedFeatures?.includes('spatialAudio');

    if (!hasSettings) {
        return <>{children}</>;
    }

    const handleSaveChanges = () => {
        onSettingsChange({
            spatialAudio: {
                enabled: spatialEnabled,
                headTracking: headTracking
            }
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{device.name} Audio Settings</DialogTitle>
                    <DialogDescription>
                        Fine-tune advanced audio features for this device.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    {device.supportedFeatures?.includes('spatialAudio') && (
                        <div className="space-y-4">
                            <h4 className="font-medium text-sm">Spatial Audio</h4>
                            <div className="flex items-center justify-between">
                                <Label htmlFor={`spatial-audio-switch-${device.id}`}>Enable Spatial Audio</Label>
                                <Switch id={`spatial-audio-switch-${device.id}`} checked={spatialEnabled} onCheckedChange={setSpatialEnabled} />
                            </div>
                            {spatialEnabled && (
                                <div className="flex items-center justify-between pl-4">
                                <Label htmlFor={`head-tracking-switch-${device.id}`} className="text-muted-foreground">Dynamic Head Tracking</Label>
                                <Switch id={`head-tracking-switch-${device.id}`} checked={headTracking} onCheckedChange={setHeadTracking} />
                            </div>
                            )}
                        </div>
                    )}
                </div>
                <DialogTrigger asChild>
                    <Button onClick={handleSaveChanges}>Save Changes</Button>
                </DialogTrigger>
            </DialogContent>
        </Dialog>
    );
}

const DeviceItem = React.memo(function DeviceItem({
  device,
  onToggle,
  onVolumeChange,
  onFeatureSettingsChange
}: DeviceItemProps) {
    const hasAudioFeatures = device.supportedFeatures && device.supportedFeatures.length > 0;
    const hasFeatureSettings = device.supportedFeatures?.includes('spatialAudio');

  return (
    <Collapsible open={device.selected}>
      <Card className={cn("transition-colors", device.selected ? "border-primary/50 bg-primary/5" : "")}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {deviceIcons[device.type]}
              <span className="font-medium">{device.name}</span>
            </div>
            <div className="flex items-center gap-2">
                {hasFeatureSettings && device.selected ? (
                     <AudioFeatureSettingsDialog device={device} onSettingsChange={(newSettings) => onFeatureSettingsChange(device.id, newSettings)}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Settings className="h-4 w-4" />
                        </Button>
                    </AudioFeatureSettingsDialog>
                ) : hasFeatureSettings && device.selected && (
                  <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
                    <Settings className="h-4 w-4" />
                  </Button>
                )}
                <Switch
                    checked={device.selected}
                    onCheckedChange={() => onToggle(device.id)}
                    aria-label={`Select ${device.name}`}
                />
            </div>
          </div>

          {hasAudioFeatures && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
                {device.supportedFeatures?.map(feature => (
                     <Badge key={feature} variant="secondary" className="gap-1.5 pr-2.5">
                        {React.createElement(featureDisplay[feature].icon, { className: "h-3 w-3" })}
                        {featureDisplay[feature].name}
                    </Badge>
                ))}
            </div>
          )}

          <CollapsibleContent>
            <div className="flex items-center gap-4 pt-4 mt-4 border-t border-border">
              <Volume2 className="h-5 w-5 text-muted-foreground" />
              <Slider
                value={[device.volume]}
                onValueChange={(value) => onVolumeChange(device.id, value)}
                max={100}
                step={1}
                aria-label={`${device.name} volume`}
              />
              <span className="text-sm font-mono w-10 text-right">
                {device.volume}
              </span>
            </div>
          </CollapsibleContent>
        </CardContent>
      </Card>
    </Collapsible>
  );
});

export default DeviceItem;
