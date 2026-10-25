"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./title.module.css";

const items = [
  { id: "introduction", name: "Introduction", image: "/menu/introduction.png" },
  { id: "characters", name: "Character", image: "/menu/character.png" },
  { id: "story", name: "Story", image: "/menu/story.png" },
  { id: "sns", name: "SNS", image: "/menu/sns.png" },
];

export default function SectionMenu() {
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
        <button type="button" className={styles.menu} aria-label="メニュー" aria-haspopup="dialog" aria-expanded={open} onClick={() => { dialog.current?.showModal(); setOpen(true); }}>
          <img src="/title-menu.png?v=3" alt="" width={150} height={150} />
        </button>
      </header>
      <dialog ref={dialog} className={styles.menuDialog} aria-label="セクションメニュー" onClose={() => setOpen(false)} onCancel={(event) => { event.preventDefault(); closeMenu(); }} onClick={(event) => { if (event.target === event.currentTarget) closeMenu(); }}>
        <div className={styles.menuDialogHeader}>
          <button className={styles.menu} type="button" aria-label="メニューを閉じる" onClick={() => closeMenu()}>
            <img src="/title-menu-open.png" alt="" width={150} height={150} />
          </button>
        </div>
        <nav className={styles.menuItems} aria-label="ページ内ナビゲーション">
          {items.map((item) => (
            <button key={item.id} className={styles.menuItem} type="button" aria-label={item.name} onClick={() => navigate(item.id)}>
              <img src={item.image} alt={item.name} />
            </button>
          ))}
        </nav>
      </dialog>
    </>
  );
}
