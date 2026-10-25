"use client";

import { useRef, useState } from "react";
import DialogueBox from "./DialogueBox";
import ChoiceOverlay from "./ChoiceOverlay";
import CharacterPortrait from "./CharacterPortrait";

export default function ScenePreview() {
  const [phase, setPhase] = useState<"idle" | "out" | "in">("idle");
  const [scene, setScene] = useState(0);
  const [panKey, setPanKey] = useState(0);
  const [choicesOpen, setChoicesOpen] = useState(false);
  const choiceTrigger = useRef<HTMLButtonElement>(null);

  return (
    <>
      <div className="scene-background" aria-hidden="true">
        <img key={panKey} className="scene-background-image" src="/village-night.png" alt="" />
      </div>
      <div inert={choicesOpen}>
      <CharacterPortrait src="/vera-young.png" variant="child" alt="立ち絵（表示確認用）" />
      <DialogueBox kind="speech" characterName="キャラクター名" />
      </div>
      {choicesOpen && (
        <ChoiceOverlay
          choices={[
            { id: "a", text: "選択肢A（確認用）" },
            { id: "b", text: "選択肢B（確認用）" },
            { id: "c", text: "選択肢C（確認用）" },
          ]}
          onSelect={() => {
            // 今は表示確認のみ。原稿の段階で選択先のシーンにつなぐ。
            setChoicesOpen(false);
            requestAnimationFrame(() => choiceTrigger.current?.focus());
          }}
        />
      )}
      <div
        className={`scene-curtain${phase === "out" ? " scene-curtain--dark" : ""}${phase !== "idle" ? " scene-curtain--active" : ""}`}
        aria-hidden="true"
        onTransitionEnd={(event) => {
          if (event.target !== event.currentTarget || event.propertyName !== "opacity") return;
          if (phase === "out") {
            // 真っ黒になってからシーンを切り替え、その後に幕を開く。
            setScene((current) => current === 0 ? 1 : 0);
            setPhase("in");
          } else if (phase === "in") {
            setPhase("idle");
          }
        }}
      />
    </>
  );
}
