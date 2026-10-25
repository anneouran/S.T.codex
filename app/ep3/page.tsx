import type { Metadata, Viewport } from "next";
import Episode from "./Episode";
export const metadata: Metadata = { title: "Ep.3 握手の手を離すタイミングって、難しい", description: "カルコルディスの物語 — Ep.3" };
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };
export default function EpisodePage() { return <Episode />; }
