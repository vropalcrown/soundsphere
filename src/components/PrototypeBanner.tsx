"use client";

import { FlaskConical } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function PrototypeBanner() {
  return (
    <div className="w-full bg-background p-2">
      <Alert variant="default" className="border-yellow-500/50 text-yellow-500 [&>svg]:text-yellow-500 container mx-auto">
        <FlaskConical className="h-4 w-4" />
        <AlertTitle>Prototype Mode</AlertTitle>
        <AlertDescription>
          This is a web-based prototype for demonstration purposes. Features like device scanning and video sources are simulated.
        </AlertDescription>
      </Alert>
    </div>
  );
}
