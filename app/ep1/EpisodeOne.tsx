"use client";

import { useEffect, useRef, useState } from "react";
import BackButton from "../BackButton";
import CharacterPortrait from "../CharacterPortrait";
import DialogueBox from "../DialogueBox";
import { ep1Frames, ep1Ending } from "./scenario";
import TypewriterDialogue from "./TypewriterDialogue";
import { returnToStory } from "../returnToStory";

type Phase = "loading" | "out" | "in" | "idle" | "finished";
const assetUrl = (file: string) => `/ep1/${file === "village_night.png" ? "village-night-v2.png" : file === "attic_night.png" ? "attic-night-v2.png" : file}`;

export default function EpisodeOne() {
  const [index, setIndex] = useState(-1);
  const [phase, setPhase] = useState<Phase>("loading");
  const [error, setError] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [textReady, setTextReady] = useState(false);
  const target = useRef(0);
  const busy = useRef(true);
  const exiting = useRef(false);
  const frame = ep1Frames[index];
  // 本文は演出と待機が終わるまで描画せず、登場時にフェードを開始する。
  const showText = !!frame && frame.kind !== "location" && phase === "idle" && sceneReady;

  // 画像を先に読み込み、幕を開いたときの画像の遅れを防ぐ。
  useEffect(() => {
    let cancelled = false;
    const files = ["village_night.png", "attic_night.png", "vera_young.png", "mother_vera.png"];
    Promise.all(files.map((file) => new Promise<void>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve();
      image.onerror = () => reject(new Error(file));
      image.src = assetUrl(file);
    }))).then(() => {
      if (!cancelled && !exiting.current) {
        setIndex(0);
        setPhase("in");
      }
    }).catch(() => { if (!cancelled) setError(true); });
    return () => { cancelled = true; };
  }, []);

  // 暗転の中点だけでシーンを切り替える。新しい表示・演出は一緒に開始。
  useEffect(() => {
    if (phase !== "out" && phase !== "in") return;
    const milliseconds = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 10 : 1500;
    const timer = window.setTimeout(() => {
      if (phase === "out") {
        if (target.current === ep1Frames.length) {
          setIndex(ep1Frames.length);
          setPhase("finished");
          return;
        }
        setIndex(target.current);
        setPhase("in");
      } else {
        busy.current = false;
        setPhase("idle");
      }
    }, milliseconds);
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase === "finished") returnToStory();
  }, [phase]);

  function exitEpisode() {
    if (exiting.current) return;
    exiting.current = true;
    busy.current = true;
    target.current = ep1Frames.length;
    setPhase("out");
  }

  // 背景移動2秒＋終了位置で1秒停止。本文を進めても再開しない。
  useEffect(() => {
    if (!frame) return;
    setSceneReady(false);
    const timer = window.setTimeout(() => setSceneReady(true), frame.pan ? 3000 : 0);
    return () => window.clearTimeout(timer);
    // 同じ背景内の改行では、この待機を繰り返さない。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frame?.background]);

  // 毎行0.5秒で再表示。連打でフェード中の行を飛ばさない。
  useEffect(() => {
    if (!showText) {
      setTextReady(false);
      return;
    }
    setTextReady(false);
    const timer = window.setTimeout(() => {
      setTextReady(true);
      busy.current = false;
    }, 500);
    return () => window.clearTimeout(timer);
  }, [index, showText]);

  // 場所欄は2秒のフェード後に1秒保持し、自動で本文へ。
  useEffect(() => {
    if (frame?.kind !== "location") return;
    const timer = window.setTimeout(() => setIndex((current) => current + 1), 3000);
    return () => window.clearTimeout(timer);
  }, [index, frame?.kind]);

  function next() {
    if (busy.current || phase !== "idle" || !sceneReady || !textReady) return;
    if (index === ep1Frames.length - 1) {
      if (ep1Ending.darken) {
        exitEpisode();
      }
      return;
    }
    busy.current = true;
    setTextReady(false);
    const nextIndex = index + 1;
    if (ep1Frames[nextIndex].darken) {
      busy.current = true;
      target.current = nextIndex;
      setPhase("out");
    } else {
      setIndex(nextIndex);
    }
  }

  const ended = index === ep1Frames.length - 1 && !ep1Ending.darken;
  const color = frame?.background === "白" ? "#ffffff" : frame?.background === "黒" ? "#000000" : frame?.background.startsWith("#") ? frame.background : undefined;

  return (
    <div className="novel-page episode-page">
      <header className="novel-header"><BackButton onBack={exitEpisode} /></header>
      <div className="scene-background" aria-hidden="true" style={{ background: color ?? "#000000" }}>
        {frame && !color && (
          <img key={frame.background} className="scene-background-image" src={assetUrl(frame.background)} alt="" />
        )}
      </div>
      <main className="novel-content" aria-label="Ep.0_プロローグ">
        {frame?.portrait && (
          <CharacterPortrait src={assetUrl(frame.portrait.file)} variant={frame.portrait.variant} />
        )}
        {frame?.kind === "location" ? (
          <DialogueBox key={`location:${frame.block}`} kind="location" locationName={frame.text} />
        ) : frame && showText && (
          <TypewriterDialogue key={`text:${index}`} kind={frame.kind} name={frame.name} text={frame.text} ended={ended} onAdvance={next} />
        )}
        {error && <p className="episode-load-error" role="alert">画像を読み込めませんでした。ページを再読み込みしてください。</p>}
      </main>
      <footer className="novel-footer" />
      <div className={`scene-curtain${phase === "loading" || phase === "out" || phase === "finished" ? " scene-curtain--dark" : ""}${phase !== "idle" ? " scene-curtain--active" : ""}`} aria-hidden="true" />
    </div>
  );
}
