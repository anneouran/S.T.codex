"use client";

import { useLanguage } from "../i18n/language";

import { useRef, useState } from "react";
import styles from "./title.module.css";

const slides = [
  { src: "/character-introduction-vera-v2.png", alt: "ヴェラ・アマート、第200期 実習生、実行部隊", width: 3102, height: 4995 },
  { src: "/character-introduction-laetilia-v2.png", alt: "レティリア・メドゥネル、第200期 実習生、実行部隊", width: 3102, height: 4996 },
  { src: "/character-introduction-lucian-v2.png", alt: "ルシアン・ローレン、第200期 実習生、特殊潜入部隊", width: 3164, height: 4995 },
];

export default function CharacterCarousel() {
  const { t } = useLanguage();
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
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
    <div className={styles.characterStage} role="region" aria-label={t("キャラクター画像スライド")}>
      <div
        ref={track}
        className={styles.characterTrack}
        tabIndex={0}
        aria-label={t("左右にスワイプしてキャラクターを切り替え")}
        onScroll={(event) => {
          const element = event.currentTarget;
          const position = element.scrollLeft / Math.max(1, element.clientWidth);
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
            <img className={styles.characterImage} src={slide.src} alt={t(slide.alt)} width={slide.width} height={slide.height} draggable={false} />
          </div>
        ))}
      </div>
      {index > 0 && (
        <button type="button" className={`${styles.characterArrow} ${styles.characterArrowLeft}`} aria-label={t("前のキャラクター")} onClick={() => move(-1)}>
          <img src="/character-previous.png" alt="" width={150} height={150} />
        </button>
      )}
      {index < slides.length - 1 && (
        <button type="button" className={`${styles.characterArrow} ${styles.characterArrowRight}`} aria-label={t("次のキャラクター")} onClick={() => move(1)}>
          <img src="/character-next.png" alt="" width={150} height={150} />
        </button>
      )}
    </div>
  );
}
