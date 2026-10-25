"use client";

import { useCallback, useEffect, useLayoutEffect, useState, type ReactNode } from "react";
import LoadingScreen from "../LoadingScreen";
import { storyReturnKey } from "../returnToStory";
import styles from "../page.module.css";

type Phase = "checking" | "returning" | "loading" | "darkening" | "revealing" | "ready";

export default function TitleEntry({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>("checking");
  useEffect(() => {
    const returning = sessionStorage.getItem(storyReturnKey) === "story";
    sessionStorage.removeItem(storyReturnKey);
    setPhase(returning ? "returning" : "loading");
  }, []);
  useLayoutEffect(() => {
    if (phase !== "returning") return;
    const target = document.getElementById("story");
    if (target?.parentElement) {
      target.parentElement.scrollTo({ top: target.offsetTop, behavior: "instant" });
      target.focus({ preventScroll: true });
    }
    setPhase(matchMedia("(prefers-reduced-motion: reduce)").matches ? "ready" : "revealing");
  }, [phase]);
  const complete = useCallback(() => {
    setPhase(matchMedia("(prefers-reduced-motion: reduce)").matches ? "ready" : "darkening");
  }, []);
  const showTitle = phase === "returning" || phase === "revealing" || phase === "ready";

  return (
    <>
      {showTitle ? <div inert={phase !== "ready"}>{children}</div> : phase !== "checking" && <LoadingScreen onComplete={complete} />}
      {(phase === "checking" || phase === "returning" || phase === "darkening" || phase === "revealing") && (
        <div
          className={`${styles.entryCurtain} ${phase === "darkening" ? styles.curtainClose : phase === "revealing" ? styles.curtainOpen : ""}`}
          aria-hidden="true"
          onAnimationEnd={(event) => {
            if (event.target !== event.currentTarget) return;
            setPhase((current) => current === "darkening" ? "revealing" : current === "revealing" ? "ready" : current);
          }}
        />
      )}
    </>
  );
}
