"use client";

import { useEffect, useSyncExternalStore, type HTMLAttributes, type ImgHTMLAttributes } from "react";
import translations from "./zh-TW.json";

export type Language = "ja" | "zh-TW";
const dictionary: Record<string, string> = translations;
const storageKey = "st-codex-language";
const listeners = new Set<() => void>();
let language: Language = "ja";
let initialized = false;
function notify() { listeners.forEach((listener) => listener()); }
function readPreference() {
  try { language = localStorage.getItem(storageKey) === "zh-TW" ? "zh-TW" : "ja"; } catch { /* Storage may be disabled. */ }
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!initialized) {
    initialized = true;
    readPreference();
  }
  const sync = (event: StorageEvent) => { if (event.key === storageKey || event.key === null) { readPreference(); notify(); } };
  window.addEventListener("storage", sync);
  return () => { listeners.delete(listener); window.removeEventListener("storage", sync); };
}
export function translate(text: string, locale: Language) {
  return locale === "ja" ? text : dictionary[text] ?? dictionary[text.trim()] ?? text;
}
export function useLanguage(pageTitle?: string) {
  const locale = useSyncExternalStore(subscribe, () => language, () => "ja" as Language);
  useEffect(() => { document.documentElement.lang = locale; }, [locale]);
  useEffect(() => { if (pageTitle) document.title = translate(pageTitle, locale); }, [pageTitle, locale]);
  function setLanguage(next: Language) {
    language = next;
    try { localStorage.setItem(storageKey, next); } catch { /* Keep the selection for this visit. */ }
    document.documentElement.lang = next;
    notify();
  }
  return { language: locale, setLanguage, t: (text: string) => translate(text, locale) };
}
export function LocalizedText({ text }: { text: string }) {
  const { t } = useLanguage();
  return <>{t(text)}</>;
}

export function LocalizedSection(props: HTMLAttributes<HTMLElement>) {
  const { t } = useLanguage();
  return <section {...props} aria-label={props["aria-label"] ? t(props["aria-label"]) : undefined} />;
}
export function LocalizedImage(props: ImgHTMLAttributes<HTMLImageElement>) {
  const { t } = useLanguage();
  return <img {...props} alt={props.alt ? t(props.alt) : ""} />;
}
