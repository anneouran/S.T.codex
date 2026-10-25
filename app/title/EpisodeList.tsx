"use client";

import { useEffect, useRef } from "react";
import styles from "./title.module.css";

const episodes = [
  "プロローグ",
  "「また今度」の「今度」はなかなか来ない",
  "ご飯は食べないと体に良くない",
  "握手の手を離すタイミングって、難しい",
  "落ち込んでいる人は、そっとするのが1番",
  "ゴシップは、ジェラートより甘い",
];

export default function EpisodeList() {
  const viewport = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = viewport.current;
    if (!list) return;
    const atEdge = (direction: number) => direction > 0
      ? list.scrollTop + list.clientHeight >= list.scrollHeight - 2
      : list.scrollTop <= 2;
    let lockedUntil = 0;
    function leave(direction: number) {
      const section = list!.closest("section");
      const target = direction > 0 ? section?.nextElementSibling : section?.previousElementSibling;
      if (!(target instanceof HTMLElement) || target.tagName !== "SECTION") return;
      const page = section?.parentElement;
      if (!page) return;
      lockedUntil = performance.now() + 900;
      page.scrollTo({ top: target.offsetTop, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    }

    let lastWheel = 0;
    let wheelDirection = 0;
    let startedAtEdge = false;
    let distance = 0;
    function wheel(event: WheelEvent) {
      if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      event.preventDefault();
      event.stopPropagation();
      const now = performance.now();
      const direction = Math.sign(event.deltaY);
      if (!direction || now < lockedUntil) return;
      if (now - lastWheel > 180 || direction !== wheelDirection) {
        startedAtEdge = atEdge(direction);
        distance = 0;
      }
      lastWheel = now;
      wheelDirection = direction;
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? list!.clientHeight : 1);
      if (startedAtEdge) {
        distance += Math.abs(delta);
        if (distance >= 100) { leave(direction); distance = 0; startedAtEdge = false; }
      } else {
        list!.scrollTop += delta;
      }
    }

    let startY = 0;
    let startX = 0;
    let lastY = 0;
    let top = false;
    let bottom = false;
    function touchStart(event: TouchEvent) {
      if (event.touches.length !== 1) return;
      startY = lastY = event.touches[0].clientY;
      startX = event.touches[0].clientX;
      top = atEdge(-1);
      bottom = atEdge(1);
    }
    function touchMove(event: TouchEvent) {
      if (event.touches.length !== 1) return;
      const touch = event.touches[0];
      const total = startY - touch.clientY;
      if (Math.abs(touch.clientX - startX) > Math.abs(total)) return;
      event.preventDefault();
      event.stopPropagation();
      if (performance.now() < lockedUntil) return;
      if ((total > 0 && bottom) || (total < 0 && top)) {
        if (Math.abs(total) >= 100) { leave(Math.sign(total)); top = bottom = false; }
      } else {
        list!.scrollTop += lastY - touch.clientY;
      }
      lastY = touch.clientY;
    }
    list.addEventListener("wheel", wheel, { passive: false });
    list.addEventListener("touchstart", touchStart, { passive: true });
    list.addEventListener("touchmove", touchMove, { passive: false });
    return () => {
      list.removeEventListener("wheel", wheel);
      list.removeEventListener("touchstart", touchStart);
      list.removeEventListener("touchmove", touchMove);
    };
  }, []);

  return (
    <div ref={viewport} className={styles.episodeViewport} tabIndex={0} role="region" aria-label="エピソード一覧" onKeyDown={(event) => {
      if (event.key !== "PageDown" && event.key !== "PageUp" && event.key !== "ArrowDown" && event.key !== "ArrowUp" && event.key !== "Home" && event.key !== "End") return;
      event.preventDefault();
      event.stopPropagation();
      const element = event.currentTarget;
      if (event.key === "Home") element.scrollTop = 0;
      else if (event.key === "End") element.scrollTop = element.scrollHeight;
      else element.scrollTop += (event.key.includes("Down") ? 1 : -1) * (event.key.startsWith("Page") ? element.clientHeight * 0.8 : 48);
    }}>
      <div className={styles.episodeButtons}>
        {episodes.map((title, index) => (
          index <= 5 ? (
            <a key={index} className={styles.episodeButton} href={`/ep${index}`} aria-label={`Ep.${index} ${title}`}>
              <img src={`/episodes/ep-${index}.png`} alt={`Ep.${index} ${title}`} width={3130} height={906} draggable={false} />
            </a>
          ) : <button key={index} className={styles.episodeButton} type="button" aria-label={`Ep.${index} ${title}（準備中）`} disabled>
            <img src={`/episodes/ep-${index}.png`} alt={`Ep.${index} ${title}`} width={3130} height={906} draggable={false} />
          </button>
        ))}
        <button className={styles.episodeButton} type="button" aria-label="つづく（準備中）" disabled>
          <img src="/episodes/to-be-continued.png" alt="つづく" width={3130} height={906} draggable={false} />
        </button>
      </div>
    </div>
  );
}
