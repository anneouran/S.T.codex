"use client";

import { useRef, useState } from "react";
import styles from "./title.module.css";

const slides = [
  { src: "/character-laetilia-v2.png", alt: "レティリア・メドゥネル、第200期 実習生、実行部隊", width: 3439, height: 4996 },
  { src: "/character-profile.png?v=5", alt: "ルシアン・ローレン、第200期 実習生、特殊潜入部隊", width: 3161, height: 4961 },
];

export default function CharacterCarousel() {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [position, setPosition] = useState(0);

  function move(direction: number) {
    const element = track.current;
    if (!element) return;
    const next = Math.max(0, Math.min(slides.length - 1, index + direction));
    element.scrollTo({
      left: next * element.clientWidth,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }

  return (
    <div className={styles.characterStage} role="region" aria-label="キャラクター画像スライド">
      <div
        ref={track}
        className={styles.characterTrack}
        tabIndex={0}
        aria-label="左右にスワイプしてキャラクターを切り替え"
        onScroll={(event) => {
          const element = event.currentTarget;
          const position = element.scrollLeft / Math.max(1, element.clientWidth);
          setPosition(position);
          setIndex(Math.round(position));
        }}
        onKeyDown={(event) => {
          if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
          event.preventDefault();
          move(event.key === "ArrowRight" ? 1 : -1);
        }}
      >
        {slides.map((slide, slideIndex) => (
          <div className={styles.characterSlide} key={slideIndex} role="group" aria-label={`${slideIndex + 1} / ${slides.length}`}>
            <img className={styles.characterImage} src={slide.src} alt={slide.alt} width={slide.width} height={slide.height} draggable={false} />
          </div>
        ))}
      </div>
      <input
        className={styles.carouselBar}
        type="range"
        min={0}
        max={slides.length - 1}
        step={1}
        value={position}
        aria-label="キャラクターの横スクロール"
        aria-valuetext={`${index + 1} / ${slides.length}`}
        onChange={(event) => {
          const position = Number(event.currentTarget.value);
          setPosition(position);
          track.current?.scrollTo({ left: position * track.current.clientWidth, behavior: "instant" });
        }}
      />
    </div>
  );
}
