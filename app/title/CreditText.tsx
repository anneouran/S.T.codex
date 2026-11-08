"use client";

import { useLanguage } from "../i18n/language";
import styles from "./title.module.css";

const credits = `サイトデザイン：
HCl

キャラクターイラスト：
HCl

シナリオ：
HCl

背景イラスト：
ChatGPT

コーディング：
Codex`;

export default function CreditText() {
  const { t } = useLanguage();
  const entries = t(credits).split("\n\n").map(entry => entry.split("\n"));
  return (
    <div className={`${styles.storyText} ${styles.creditEntries}`}>
      {entries.map(([role, name], index) => (
        <div key={index}>
          <div className={styles.creditRole}>{role.replace(/[：:]$/, "")}</div>
          <div className={styles.creditName}>{name}</div>
        </div>
      ))}
    </div>
  );
}
