
export type AudioFeature = "dolbyAtmos" | "spatialAudio" | "stereo";

export type AudioDevice = {
  id: string;
  name: string;
  type: "headphones" | "speakers" | "microphone" | "other";
  selected: boolean;
  volume: number;
  supportedFeatures?: AudioFeature[];
  featureSettings?: {
    spatialAudio?: {
      enabled: boolean;
      headTracking: boolean;
    };
  };
};

export type ViewerStatus = "Playing" | "Paused" | "Buffering";

export interface Viewer {
  id: string;
  name: string;
  location: string;
  device: "Mobile" | "Laptop" | "TV";
  status: ViewerStatus;
  icon: React.ElementType;
}

export interface VideoHistoryItem {
  id: string;
  title: string;
  src: string;
  poster: string;
}
