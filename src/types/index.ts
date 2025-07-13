
export type AudioDevice = {
  id: string;
  name: string;
  type: "headphones" | "speakers" | "microphone" | "other";
  selected: boolean;
  volume: number;
};

export type ViewerStatus = "Playing" | "Paused" | "Buffering";

export interface Viewer {
  id: string;
  name: string;
  device: "Mobile" | "Laptop" | "TV";
  status: ViewerStatus;
  icon: React.ElementType;
}
