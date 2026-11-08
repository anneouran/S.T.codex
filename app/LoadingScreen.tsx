"use client";

import { useLanguage } from "./i18n/language";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const { t } = useLanguage();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let transitionTimer: ReturnType<typeof setTimeout> | undefined;
    const images = ["/title-illustration.png", "/title-menu.png?v=3", "/title-menu-open.png", "/menu/introduction.png", "/menu/character.png", "/menu/story.png", "/menu/sns.png", "/character-heading.png?v=2", "/character-previous.png", "/character-next.png", "/character-introduction-vera-v2.png", "/character-introduction-lucian-v2.png", "/introduction-heading.png?v=2", "/character-introduction-laetilia-v2.png", "/story-heading.png?v=2", "/credit-heading.png", "/sns-heading.png?v=2", "/instagram-card-v3.png", "/episodes/to-be-continued.png", ...Array.from({ length: 6 }, (_, i) => `/episodes/ep-${i}.png`)].map((src) => {
      const image = new Image();
      image.src = src;
      return image.decode();
    });
    Promise.all(images).then(() => {
      if (!cancelled) {
        transitionTimer = setTimeout(onComplete, 2000);
      }
    }).catch(() => {
      if (!cancelled) setFailed(true);
    });
    return () => {
      cancelled = true;
      clearTimeout(transitionTimer);
    };
  }, [onComplete]);

  return (
    <main className={styles.loadingScreen} aria-label={t("読み込み中")}>
      {failed ? (
        <button type="button" onClick={() => window.location.reload()}>
          {t("画像を再読み込み")}
        </button>
      ) : (
        <img
          className={styles.loadingImage}
          src="/site-loading.png?v=2"
          alt="Lording..."
          width={1363}
          height={355}
          fetchPriority="high"
        />
      )}
    </main>
  );
}
