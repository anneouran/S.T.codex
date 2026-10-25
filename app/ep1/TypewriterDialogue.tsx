"use client";

import { useEffect, useRef, useState } from "react";
import DialogueBox from "../DialogueBox";
import type { TextKind } from "./scenario";

type Props = {
  kind: TextKind;
  name?: string;
  text: string;
  ended: boolean;
  onAdvance: () => void;
};

export default function TypewriterDialogue({ kind, name, text, ended, onAdvance }: Props) {
  const characters = Array.from(text);
  const [count, setCount] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const complete = useRef(false);

  useEffect(() => {
    const length = Array.from(text).length;
    let shown = 0;
    complete.current = false;
    setCount(0);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(length);
      complete.current = true;
      return;
    }
    timer.current = setInterval(() => {
      shown += 1;
      setCount(shown);
      if (shown >= length) {
        complete.current = true;
        if (timer.current !== null) clearInterval(timer.current);
        timer.current = null;
      }
    }, 60);
    return () => {
      if (timer.current !== null) clearInterval(timer.current);
      timer.current = null;
    };
  }, [text]);

  function tap() {
    if (!complete.current) {
      if (timer.current !== null) clearInterval(timer.current);
      timer.current = null;
      complete.current = true;
      setCount(characters.length);
      return;
    }
    onAdvance();
  }

  const content = (
    <span className="typewriter-line">
      {/* 全文の高さを確保して、文字が増えても箱や星の位置を動かさない。 */}
      <span className="typewriter-measure" aria-hidden="true">{text}</span>
      <span className="typewriter-visible" aria-hidden="true">{characters.slice(0, count).join("")}</span>
      <span className="sr-only">{text}</span>
    </span>
  );
  const disabled = ended && count >= characters.length;

  return kind === "narration" ? (
    <DialogueBox kind="narration" onNext={tap} nextDisabled={disabled}>{content}</DialogueBox>
  ) : (
    <DialogueBox kind={kind} characterName={name!} onNext={tap} nextDisabled={disabled}>{content}</DialogueBox>
  );
}
