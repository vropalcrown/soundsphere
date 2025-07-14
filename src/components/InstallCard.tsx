
"use client";

import * as React from "react";
import { Download, ArrowRight, Wifi } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function InstallCard() {
  const installPromptRef = React.useRef<any>(null);
  const [isSupported, setIsSupported] = React.useState(false);
  const [isOfflineReady, setIsOfflineReady] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    // Check if the Service Worker is ready for offline use
    if (navigator.serviceWorker?.controller) {
      setIsOfflineReady(true);
    }
    
    // Check for 'beforeinstallprompt' event support
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the browser's default install prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      installPromptRef.current = e;
      // Set the flag to indicate PWA installation is supported.
      setIsSupported(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPromptRef.current) {
      toast({
        variant: "destructive",
        title: "Installation Not Available",
        description: "The app may already be installed or your browser doesn't support this feature.",
      });
      return;
    }

    const prompt = installPromptRef.current;
    prompt.prompt();

    const { outcome } = await prompt.userChoice;

    if (outcome === "accepted") {
      toast({
        title: "Installation Complete!",
        description: "SyncSphere has been successfully installed on your device.",
      });
    } else {
      toast({
        title: "Installation Cancelled",
        description: "You can install the app any time from this card.",
      });
    }

    // Clear the deferred prompt, it can't be used again.
    installPromptRef.current = null;
    setIsSupported(false); // The button will be removed after the choice is made
  };

  return (
    <Card className="md:col-span-2 border-primary/40 bg-primary/5">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-md">
            {isSupported ? <Download className="h-6 w-6 text-primary" /> : <Wifi className="h-6 w-6 text-primary" />}
          </div>
          <CardTitle>App Installation & Offline Mode</CardTitle>
        </div>
        <CardDescription>
          {isSupported
            ? "Get the best experience by installing SyncSphere on your device. It's fast, works offline, and feels like a native app."
            : "This app is ready for offline use! Just visit once while connected to the internet, and it will be available without a connection."}
        </CardDescription>
      </CardHeader>
      <CardContent>
          {isSupported ? (
            <Button className="w-full" onClick={handleInstallClick}>
              Install App on Your Device <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <div className="flex items-center justify-center p-2 rounded-md bg-secondary text-secondary-foreground">
                <Wifi className="mr-2 h-4 w-4" />
                <span className="text-sm font-medium">
                    {isOfflineReady ? "App is ready for offline use." : "Connect to the internet once to enable offline mode."}
                </span>
            </div>
          )}
        </CardContent>
    </Card>
  );
}
