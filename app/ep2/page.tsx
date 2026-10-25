import type { Metadata, Viewport } from "next";
import Episode from "./Episode";
export const metadata: Metadata = { title: "Ep.2 ご飯は食べないと体に良くない", description: "カルコルディスの物語 — Ep.2" };
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };
export default function EpisodePage() { return <Episode />; }
