"use client";

import * as React from "react";
import { Headphones, Speaker, Mic, AudioLines, Volume2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import type { AudioDevice } from "@/types";

interface DeviceItemProps {
  device: AudioDevice;
  onToggle: (id: string) => void;
  onVolumeChange: (id: string, volume: number[]) => void;
}

const deviceIcons = {
  headphones: <Headphones className="h-5 w-5 text-muted-foreground" />,
  speakers: <Speaker className="h-5 w-5 text-muted-foreground" />,
  microphone: <Mic className="h-5 w-5 text-muted-foreground" />,
  other: <AudioLines className="h-5 w-5 text-muted-foreground" />,
};

export default function DeviceItem({
  device,
  onToggle,
  onVolumeChange,
}: DeviceItemProps) {
  return (
    <Collapsible open={device.selected}>
      <Card className={cn("transition-colors", device.selected ? "border-primary/50 bg-primary/5" : "")}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {deviceIcons[device.type]}
              <span className="font-medium">{device.name}</span>
            </div>
            <Switch
              checked={device.selected}
              onCheckedChange={() => onToggle(device.id)}
              aria-label={`Select ${device.name}`}
            />
          </div>
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
}
