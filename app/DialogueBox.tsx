import type { ReactNode } from "react";

// セリフ・主人公には名前を指定する。ナレーションには名前欄を出さない。
type DialogueBoxProps = {
  children?: ReactNode;
  onNext?: () => void;
  nextDisabled?: boolean;
} & (
  | { kind: "narration"; characterName?: never }
  | { kind: "speech"; characterName: string }
  | { kind: "protagonist"; characterName: string }
  | { kind: "location"; locationName: string; characterName?: never }
);

export default function DialogueBox(props: DialogueBoxProps) {
  // 場所表示のときは、本文・キャラクター名・星を描画しない。
  if (props.kind === "location") {
    return (
      <section className="dialogue-box dialogue-box--location" aria-label="場所表示">
        <div key={props.locationName} className="location-label">{props.locationName}</div>
      </section>
    );
  }

  return (
    <section
      className={`dialogue-box dialogue-box--${props.kind}`}
      aria-label={props.kind === "narration" ? "ナレーション" : props.kind === "protagonist" ? "主人公のセリフ" : "セリフ"}
    >
      {props.kind !== "narration" && (
        <div className="dialogue-name">{props.characterName}</div>
      )}
      <div className="dialogue-text">{props.children}</div>
      <button type="button" className="story-next-button" aria-label="物語を進める" onClick={props.onNext} disabled={props.nextDisabled}>
        <img src="/button-star.svg" alt="" className="story-next-image" />
      </button>
    </section>
  );
}
