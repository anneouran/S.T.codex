"use client";

import { useEffect, useRef, useState } from "react";
import BackButton from "../BackButton";
import DialogueBox from "../DialogueBox";
import TypewriterDialogue from "../ep1/TypewriterDialogue";
import { returnToStory } from "../returnToStory";
import { frames } from "./scenario";
import styles from "./episode.module.css";

type Phase = "loading" | "out" | "in" | "idle";
const backgroundColor = (file: string) => file === "黒" ? "#000000" : file === "白" ? "#FFFFFF" : /^#[0-9a-f]{3,8}$/i.test(file) ? file : undefined;
export const imageFiles: Record<string, string> = {
  "scutarius.png": "scutarius.png",
  "carcordis_hall.png": "training-hall-v2.png",
  "carcordis_hall2.png": "training-hall-v2.png",
  "training_room.png": "training-room-v2.png",
  "world_training.png": "training-world-v2.png",
  "lucian_training.png": "lucian_training1.png",
};
const assetUrl = (file: string) => `/ep4/${imageFiles[file] ?? file}`;

export default function Episode() {
  const [index, setIndex] = useState(-1);
  const [phase, setPhase] = useState<Phase>("loading");
  const [error, setError] = useState(false);
  const [readyIndex, setReadyIndex] = useState(-1);
  const [textReady, setTextReady] = useState(false);
  const [portraits, setPortraits] = useState<{ file: string; leaving: boolean }[]>([]);
  const previousPortrait = useRef<string | undefined>(undefined);
  const target = useRef(0);
  const exiting = useRef(false);
  const busy = useRef(true);
  const frame = frames[index];
  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const showText = !!frame && frame.kind !== "location" && phase === "idle" && readyIndex === index;

  useEffect(() => {
    let cancelled = false;
    const files = [...new Set(frames.flatMap((item) => [...(backgroundColor(item.background) ? [] : [item.background]), ...(item.portrait ? [item.portrait] : [])]))];
    Promise.all(files.map((file) => new Promise<void>((resolve, reject) => {
      const image = new Image();
      image.onload = () => image.decode().then(resolve, reject);
      image.onerror = () => reject(new Error(file));
      image.src = assetUrl(file);
    }))).then(() => {
      if (!cancelled && !exiting.current) { setIndex(0); setPhase("in"); }
    }).catch(() => { if (!cancelled) setError(true); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (phase !== "out" && phase !== "in") return;
    const timer = window.setTimeout(() => {
      if (phase === "out") {
        if (exiting.current) { returnToStory(); return; }
        setIndex(target.current);
        setPhase("in");
      } else {
        busy.current = false;
        setPhase("idle");
      }
    }, reduced() ? 10 : 1500);
    return () => window.clearTimeout(timer);
  }, [phase]);

  // 登場・退場とも0.5秒。差し替え時は旧画像を消しながら新画像を表示。
  useEffect(() => {
    if (!frame || frame.portrait === previousPortrait.current) return;
    const old = previousPortrait.current;
    const current = frame.portrait;
    previousPortrait.current = current;
    setPortraits([
      ...(old ? [{ file: old, leaving: true }] : []),
      ...(current ? [{ file: current, leaving: false }] : []),
    ]);
    const timer = window.setTimeout(() => setPortraits(current ? [{ file: current, leaving: false }] : []), reduced() ? 10 : 500);
    return () => window.clearTimeout(timer);
  }, [frame?.portrait]);

  // 場所表示と背景移動は同時に開始。本文は演出完了まで待機する。
  useEffect(() => {
    if (!frame) return;
    setReadyIndex(-1);
    const previous = frames[index - 1];
    const portraitChanged = frame.portrait !== previous?.portrait;
    const wait = reduced() ? 0 : Math.max(frame.pan ? 3000 : 0, portraitChanged ? 500 : 0);
    const timer = window.setTimeout(() => setReadyIndex(index), wait);
    return () => window.clearTimeout(timer);
  }, [index]);

  useEffect(() => {
    setTextReady(false);
    if (!showText) return;
    const timer = window.setTimeout(() => { setTextReady(true); busy.current = false; }, reduced() ? 10 : 500);
    return () => window.clearTimeout(timer);
  }, [index, showText]);

  useEffect(() => {
    if (frame?.kind !== "location") return;
    const timer = window.setTimeout(() => setIndex((current) => current + 1), reduced() ? 10 : 3000);
    return () => window.clearTimeout(timer);
  }, [index, frame?.kind]);

  function exitEpisode() {
    if (exiting.current) return;
    exiting.current = true;
    busy.current = true;
    setPhase("out");
  }

  function next() {
    if (busy.current || phase !== "idle" || readyIndex !== index || !textReady) return;
    if (index === frames.length - 1) { exitEpisode(); return; }
    busy.current = true;
    setTextReady(false);
    target.current = index + 1;
    if (frames[index + 1].darken) setPhase("out");
    else setIndex(index + 1);
  }

  // 同じ背景の本文送りでは背景画像を再マウントせず、移動の終了位置を保持する。
  const scene = frame && frames.find((item) => item.background === frame.background);
  return (
    <div className="novel-page episode-page">
      <header className="novel-header"><BackButton onBack={exitEpisode} /></header>
      <div className="scene-background" aria-hidden="true" style={{ background: frame ? backgroundColor(frame.background) ?? "#000" : "#000" }}>
        {frame && !backgroundColor(frame.background) && <img key={frame.background} className={`scene-background-image ${scene?.reversePan ? styles.reverse : ""}`} src={assetUrl(frame.background)} alt="" />}
      </div>
      {portraits.map(({ file, leaving }) => (
        <div key={file} className="character-layer">
          <img className={`character-image character-image--adult ${styles.portrait} ${leaving ? styles.leaving : ""}`} src={assetUrl(file)} alt="立ち絵" />
        </div>
      ))}
      <main className="novel-content" aria-label="Ep.4 落ち込んでいる人は、そっとするのが1番">
        {frame?.kind === "location" ? (
          <DialogueBox key={`location:${index}`} kind="location" locationName={frame.text} />
        ) : frame && showText && (
          <TypewriterDialogue key={index} kind={frame.kind} name={frame.name} text={frame.text} ended={false} onAdvance={next} />
        )}
        {error && <p className="episode-load-error" role="alert">画像を読み込めませんでした。ページを再読み込みしてください。</p>}
      </main>
      <footer className="novel-footer" />
      <div className={`scene-curtain${phase === "loading" || phase === "out" ? " scene-curtain--dark" : ""}${phase !== "idle" ? " scene-curtain--active" : ""}`} aria-hidden="true" />
    </div>
  );
}
