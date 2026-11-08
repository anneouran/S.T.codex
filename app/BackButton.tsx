"use client";

import { useLanguage } from "./i18n/language";

export default function BackButton({ onBack }: { onBack?: () => void }) {
  const { t } = useLanguage();
  return (
    <button
      type="button"
      className="back-button back-button--round"
      aria-label={t("戻る")}
      onClick={onBack ?? (() => window.history.back())}
    >
      <img src="/back-button.png?v=5" alt="" className="back-button-image" />
    </button>
  );
}
