import type { Metadata, Viewport } from "next";
import EpisodeOne from "../ep1/EpisodeOne";

export const metadata: Metadata = {
  title: "Ep.0_プロローグ",
  description: "Ep.0_プロローグ — カルコルディスの物語",
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function EpisodePage() {
  return <EpisodeOne />;
}
