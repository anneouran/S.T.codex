"use client";

import { useLanguage } from "../i18n/language";

import ScrollViewport from "./ScrollViewport";
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
  const { t } = useLanguage();
  return (
    <ScrollViewport label="エピソード一覧">
      <div className={styles.episodeButtons}>
        {episodes.map((title, index) => (
          index <= 5 ? (
            <a key={index} className={styles.episodeButton} href={`/ep${index}`} aria-label={`Ep.${index} ${t(title)}`}>
              <img src={`/episodes/ep-${index}.png`} alt={`Ep.${index} ${t(title)}`} width={3130} height={906} draggable={false} />
            </a>
          ) : <button key={index} className={styles.episodeButton} type="button" aria-label={`Ep.${index} ${t(title)}（準備中）`} disabled>
            <img src={`/episodes/ep-${index}.png`} alt={`Ep.${index} ${t(title)}`} width={3130} height={906} draggable={false} />
          </button>
        ))}
        <button className={styles.episodeButton} type="button" aria-label={t("つづく（準備中）")} disabled>
          <img src="/episodes/to-be-continued.png" alt={t("つづく")} width={3130} height={906} draggable={false} />
        </button>
      </div>
    </ScrollViewport>
  );
}
