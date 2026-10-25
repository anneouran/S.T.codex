"use client";

import { useEffect, useRef, useState } from "react";
import BackButton from "../BackButton";
import DialogueBox from "../DialogueBox";
import TypewriterDialogue from "../ep1/TypewriterDialogue";
import { returnToStory } from "../returnToStory";
import { routes, choices } from "./scenario";
import ChoiceOverlay from "../ChoiceOverlay";
import styles from "./episode.module.css";

type Phase = "loading" | "out" | "in" | "idle";
const backgroundColor = (file: string) => file === "黒" ? "#000000" : file === "白" ? "#FFFFFF" : /^#[0-9a-f]{3,8}$/i.test(file) ? file : undefined;
const imageFiles: Record<string, string> = {
  "Clara_private.png": "clara.png",
  "laetilia_apron.png": "laetilia-apron-v2.png",
  "laetilia_private.png": "laetilia-private-v2.png",
  "dormitory_room.png": "dormitory-room-v2.png",
  "dormitory_room2.png": "dormitory-dining-v2.png",
  "shop_gelato.png": "shop-gelato-v2.png",
};
const assetUrl = (file: string) => `/ep5/${imageFiles[file] ?? file}`;

export default function Episode() {
  const [frames, setFrames] = useState(routes["1"]);
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
  const showText = !!frame && !frame.choice && frame.kind !== "location" && phase === "idle" && readyIndex === index;

  useEffect(() => {
    let cancelled = false;
    const files = [...new Set(Object.values(routes).flat().flatMap((item) => [...(backgroundColor(item.background) ? [] : [item.background]), ...(item.portrait ? [item.portrait] : [])]))];
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

  function selectChoice(id: string) {
    if (exiting.current || !frame?.choice || phase !== "idle") return;
    busy.current = true;
    setFrames(routes[id]);
    setIndex(index + 1);
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
  let sceneIndex = index;
  while (sceneIndex > 0 && frames[sceneIndex - 1].background === frame?.background) sceneIndex--;
  const scene = frames[sceneIndex];
  return (
    <div className="novel-page episode-page">
      <header className="novel-header"><BackButton onBack={exitEpisode} /></header>
      <div className="scene-background" aria-hidden="true" style={{ background: frame ? backgroundColor(frame.background) ?? "#000" : "#000" }}>
        {frame && !backgroundColor(frame.background) && <img key={frame.background} className={`scene-background-image ${scene?.reversePan ? styles.reverse : ""} ${!scene?.pan ? styles.noPan : ""}`} src={assetUrl(frame.background)} alt="" />}
      </div>
      {portraits.map(({ file, leaving }) => (
        <div key={file} className="character-layer">
          <img className={`character-image character-image--adult ${styles.portrait} ${leaving ? styles.leaving : ""}`} src={assetUrl(file)} alt="立ち絵" />
        </div>
      ))}
      <main className="novel-content" aria-label="Ep.5 ゴシップは、ジェラートより甘い">
        {frame?.kind === "location" ? (
          <div className={frame.reversePan ? styles.locationSlide : undefined}><DialogueBox key={`location:${index}`} kind="location" locationName={frame.text} /></div>
        ) : frame && showText && (
          <TypewriterDialogue key={index} kind={frame.kind} name={frame.name} text={frame.text} ended={false} onAdvance={next} />
        )}
        {error && <p className="episode-load-error" role="alert">画像を読み込めませんでした。ページを再読み込みしてください。</p>}
      </main>
      {frame?.choice && phase === "idle" && !exiting.current && <ChoiceOverlay choices={choices} onSelect={selectChoice} />}
      <footer className="novel-footer" />
      <div className={`scene-curtain${phase === "loading" || phase === "out" ? " scene-curtain--dark" : ""}${phase !== "idle" ? " scene-curtain--active" : ""}`} aria-hidden="true" />
    </div>
  );
}
