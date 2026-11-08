"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../i18n/language";
import styles from "./title.module.css";

const items = [
  { id: "introduction", name: "Introduction", image: "/menu/introduction.png" },
  { id: "characters", name: "Character", image: "/menu/character.png" },
  { id: "story", name: "Story", image: "/menu/story.png" },
  { id: "sns", name: "SNS", image: "/menu/sns.png" },
  { id: "credits", name: "Credit", image: "/credit-heading.png" },
];

export default function SectionMenu() {
  const { language, setLanguage, t } = useLanguage();
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const closing = useRef(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(closeTimer.current), []);

  function closeMenu(afterClose?: () => void) {
    const element = dialog.current;
    if (!element?.open || closing.current) return;
    closing.current = true;
    element.dataset.closing = "true";
    const finish = () => {
      element.close();
      delete element.dataset.closing;
      closing.current = false;
      afterClose?.();
    };
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) finish();
    else closeTimer.current = setTimeout(finish, 400);
  }

  function navigate(id: string) {
    const target = document.getElementById(id);
    closeMenu(() => {
    if (!target?.parentElement) return;
    target.parentElement.scrollTo({
      top: target.offsetTop,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
    target.focus({ preventScroll: true });
    });
  }

  return (
    <>
      <header className={styles.header}>
        <button type="button" className={styles.menu} aria-label={t("メニュー")} aria-haspopup="dialog" aria-expanded={open} onClick={() => { dialog.current?.showModal(); setOpen(true); }}>
          <img src="/title-menu.png?v=3" alt="" width={150} height={150} />
        </button>
      </header>
      <dialog ref={dialog} className={styles.menuDialog} aria-label={t("セクションメニュー")} onClose={() => setOpen(false)} onCancel={(event) => { event.preventDefault(); closeMenu(); }} onClick={(event) => { if (event.target === event.currentTarget) closeMenu(); }}>
        <div className={styles.menuDialogHeader}>
          <button className={styles.menu} type="button" aria-label={t("メニューを閉じる")} onClick={() => closeMenu()}>
            <img src="/title-menu-open.png" alt="" width={150} height={150} />
          </button>
        </div>
        <nav className={styles.menuItems} aria-label={t("ページ内ナビゲーション")}>
          <div className={styles.languageSelector} role="group" aria-label={t("言語選択")}>
            <div className={styles.languageButtons}>
              <button type="button" lang="ja" aria-pressed={language === "ja"} onClick={() => setLanguage("ja")}><img src="/menu/language-japanese.png" alt="日本語" width={670} height={221} /></button>
              <button type="button" lang="zh-TW" aria-pressed={language === "zh-TW"} onClick={() => setLanguage("zh-TW")}><img src="/menu/language-traditional-chinese.png" alt="中文（繁體）" width={1120} height={229} /></button>
            </div>
          </div>
          {items.map((item) => (
            <button key={item.id} className={styles.menuItem} type="button" aria-label={item.name} onClick={() => navigate(item.id)}>
              <img className={item.id === "credits" ? styles.creditMenuImage : undefined} src={item.image} alt={item.name} />
            </button>
          ))}
        </nav>
      </dialog>
    </>
  );
}
