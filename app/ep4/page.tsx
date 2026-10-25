import type { Metadata, Viewport } from "next";
import Episode from "./Episode";
export const metadata: Metadata = { title: "Ep.4 落ち込んでいる人は、そっとするのが1番", description: "カルコルディスの物語 — Ep.4" };
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };
export default function EpisodePage() { return <Episode />; }
