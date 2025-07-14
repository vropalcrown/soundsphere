
import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Monitor, Apple, Smartphone, Bot } from "lucide-react";
import Link from "next/link";

const instructions = [
  {
    os: "Windows & Linux (Chrome/Edge)",
    icon: Monitor,
    steps: [
      "Open SyncSphere in your Chrome or Edge browser.",
      "Look for the 'Install' icon in the address bar, usually on the right side.",
      "Click the icon and then click 'Install' in the prompt that appears.",
      "The app will be added to your desktop and Start Menu.",
    ],
  },
  {
    os: "macOS (Chrome/Edge)",
    icon: Apple,
    steps: [
      "Open SyncSphere in your Chrome or Edge browser.",
      "Click the 'Install' icon in the address bar.",
      "Confirm the installation to add SyncSphere to your Applications folder.",
      "You can launch it from the Launchpad or Dock like any other app.",
    ],
  },
    {
    os: "Android (Chrome)",
    icon: Smartphone,
    steps: [
      "Open SyncSphere in the Chrome browser on your Android device.",
      "Tap the three-dot menu icon in the top-right corner.",
      "Select 'Install app' or 'Add to Home screen' from the menu.",
      "Follow the on-screen prompts to add the app icon to your home screen.",
    ],
  },
];

export default function DownloadPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12 bg-background">
      <div className="w-full max-w-4xl space-y-8">
        <header className="relative flex justify-center text-center">
          <div className="absolute left-0">
            <Link href="/" passHref>
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="inline-flex flex-col items-center">
            <div className="inline-flex items-center gap-2 mb-2">
                <h1 className="text-4xl font-bold tracking-tight font-headline">
                    Install SyncSphere
                </h1>
            </div>
            <p className="text-muted-foreground">
                Get a native-like experience on your favorite devices.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {instructions.map((inst) => (
                <Card key={inst.os}>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <inst.icon className="h-6 w-6 text-primary" />
                            <CardTitle>{inst.os}</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                            {inst.steps.map((step, index) => (
                                <li key={index}>{step}</li>
                            ))}
                        </ol>
                    </CardContent>
                </Card>
            ))}
        </div>
         <Card className="border-dashed">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Bot className="h-6 w-6 text-primary" />
                    <CardTitle>What is this?</CardTitle>
                </div>
                <CardDescription>
                    SyncSphere is a Progressive Web App (PWA). Installing it adds it to your device like a native app, but it still runs securely in your browser. This enables offline access and a more integrated experience without the need for an app store.
                </CardDescription>
            </CardHeader>
        </Card>
      </div>
    </main>
  );
}
