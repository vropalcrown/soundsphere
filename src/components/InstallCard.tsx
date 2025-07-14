
"use client";

import * as React from "react";
import { Download, ArrowRight } from "lucide-react";
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
  const { toast } = useToast();

  React.useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      installPromptRef.current = e;
    };

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
          "The app may already be installed, or your browser doesn't support this feature.",
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
        description: "You can install the app any time from the main page.",
      });
    }
    
    installPromptRef.current = null;
  };

  return (
     <Card className="md:col-span-2 border-primary/40 bg-primary/5">
        <CardHeader>
            <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-md">
                <Download className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Install SyncSphere</CardTitle>
            </div>
            <CardDescription>
                Get the best experience by installing the SyncSphere app on your device. It's fast, works offline, and feels like a native app.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Button className="w-full" onClick={handleInstallClick}>
              Install App on Your Device <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </CardContent>
    </Card>
  );
}
