import type { Metadata, Viewport } from "next";
import Episode from "./Episode";
export const metadata: Metadata = { title: "Ep.5 ゴシップは、ジェラートより甘い", description: "カルコルディスの物語 — Ep.5" };
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };
export default function EpisodePage() { return <Episode />; }
