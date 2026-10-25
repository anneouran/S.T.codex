"use client";

import { useEffect, useRef } from "react";

type Choice = { id: string; text: string };

export default function ChoiceOverlay({ choices, onSelect }: {
  choices: Choice[];
  onSelect: (id: string) => void;
}) {
  const firstButton = useRef<HTMLButtonElement>(null);
  useEffect(() => { firstButton.current?.focus(); }, []);

  return (
    <section className="choice-overlay" aria-label="選択肢">
      <div className="choice-list">
        {choices.map((choice, index) => (
          <button
            key={choice.id}
            ref={index === 0 ? firstButton : undefined}
            type="button"
            className="choice-button"
            onClick={() => onSelect(choice.id)}
          >
            {choice.text}
          </button>
        ))}
      </div>
    </section>
  );
}
