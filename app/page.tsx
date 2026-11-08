import type { Metadata, Viewport } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "S.T.",
  description: "オリジナルノベルゲーム",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1C3062",
};

export default function Home() {
  redirect("/title");
}
