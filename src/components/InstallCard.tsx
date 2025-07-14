
"use client";

import * as React from "react";
import { Download, ArrowRight, HelpCircle } from "lucide-react";
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
  const { toast } = useToast();

  React.useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      installPromptRef.current = e;
      setIsSupported(true);
    };

    // Check for browser support
    if ('onbeforeinstallprompt' in window) {
      setIsSupported(true);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPromptRef.current) {
      toast({
        variant: "destructive",
        title: "Installation Not Available",
        description:
          "The app may already be installed or your browser doesn't fully support this feature. Try a browser like Chrome or Edge.",
      });
      return;
    }

    const prompt = installPromptRef.current;
    prompt.prompt();

    const { outcome } = await prompt.userChoice;

    if (outcome === "accepted") {
      toast({
        title: "Installation Complete!",
        description: "SyncSphere has been successfully installed.",
      });
    } else {
      toast({
        title: "Installation Cancelled",
        description: "You can install the app any time from this card.",
      });
    }

    installPromptRef.current = null;
  };

  return (
    <Card className="md:col-span-2 border-primary/40 bg-primary/5">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-md">
            {isSupported ? <Download className="h-6 w-6 text-primary" /> : <HelpCircle className="h-6 w-6 text-primary" />}
          </div>
          <CardTitle>Install SyncSphere</CardTitle>
        </div>
        <CardDescription>
          {isSupported
            ? "Get the best experience by installing the SyncSphere app on your device. It's fast, works offline, and feels like a native app."
            : "Your browser does not support direct installation. To add this app to your desktop, you can create a shortcut from your browser's menu."}
        </CardDescription>
      </CardHeader>
      {isSupported && (
        <CardContent>
          <Button className="w-full" onClick={handleInstallClick}>
            Install App on Your Device <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      )}
    </Card>
  );
}
