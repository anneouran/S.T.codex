import type { Metadata, Viewport } from "next";
import Episode from "../episode-one/Episode";
export const metadata: Metadata = { title: "Ep.1 「また今度」の「今度」はなかなか来ない", description: "カルコルディスの物語 — Ep.1" };
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };
export default function EpisodePage() { return <Episode />; }
