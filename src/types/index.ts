export type AudioDevice = {
  id: string;
  name: string;
  type: "headphones" | "speakers" | "microphone" | "other";
  selected: boolean;
  volume: number;
};
