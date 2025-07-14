
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Monitor, AppWindow, Gamepad2, Sprout } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const initialApps = [
  { id: "vlc", name: "VLC media player", icon: Sprout, captured: false },
  { id: "chrome", name: "Google Chrome", icon: AppWindow, captured: true },
  { id: "game", name: "Game.exe", icon: Gamepad2, captured: false },
  { id: "system", name: "System Sounds", icon: Monitor, captured: true },
];

export default function SystemAudioCard() {
  const [apps, setApps] = React.useState(initialApps);
  const { toast } = useToast();

  const handleToggleCapture = (id: string) => {
    setApps(apps.map(app => {
      if (app.id === id) {
        const newCapturedState = !app.captured;
        toast({
          title: `Audio Capture ${newCapturedState ? 'Enabled' : 'Disabled'}`,
          description: `Audio from ${app.name} will now be ${newCapturedState ? 'routed to your devices' : 'played normally'}.`
        });
        return { ...app, captured: newCapturedState };
      }
      return app;
    }));
  };

  const capturedAppsCount = apps.filter(a => a.captured).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Audio Capture</CardTitle>
        <CardDescription>
          Route audio from any application on your PC to your selected devices.
          ({capturedAppsCount} app{capturedAppsCount === 1 ? '' : 's'} captured)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {apps.map((app, index) => (
            <React.Fragment key={app.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <app.icon className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{app.name}</span>
                </div>
                <Switch
                  checked={app.captured}
                  onCheckedChange={() => handleToggleCapture(app.id)}
                  aria-label={`Capture audio from ${app.name}`}
                />
              </div>
              {index < apps.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
