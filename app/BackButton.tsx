"use client";

export default function BackButton({ onBack }: { onBack?: () => void }) {
  return (
    <button
      type="button"
      className="back-button back-button--round"
      aria-label="戻る"
      onClick={onBack ?? (() => window.history.back())}
    >
      <img src="/back-button.png?v=5" alt="" className="back-button-image" />
    </button>
  );
}
