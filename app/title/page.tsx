import type { Metadata, Viewport } from "next";
import styles from "./title.module.css";
import CharacterCarousel from "./CharacterCarousel";
import EpisodeList from "./EpisodeList";
import SectionMenu from "./SectionMenu";
import TitleEntry from "./TitleEntry";

export const metadata: Metadata = { title: "S.T.codex" };
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F0F3F8",
};

const storyText = `宇宙に存在するすべての世界に干渉できる
特別な世界——「カルコルディア」。

この世界には、宇宙の均衡を守るために
世界の境界を越えて活動するエージェント集団 
「カルコルディス」が存在する。

カルコルディスの創設から約200年——。
 5年間の教育課程を主席で修了し、
 晴れて実習生となったヴェラ。

幼い頃からカルコルディスのエージェントを夢見ていた彼女には、
とある理由で目指し続けてきた部隊があった。

しかし、実習生認定書に記されていた配属先は
彼女が希望していた部隊ではなく「実行部隊」だった——。`;

export default function TitlePage() {
  return (
    <TitleEntry>
    <main className={styles.page}>
      <section className={styles.titleSection} aria-label="タイトル">
      <img
        className={styles.illustration}
        src="/title-illustration.png"
        alt="S.T.codex 遊べるウェブサイト"
        width={3244}
        height={4306}
        fetchPriority="high"
      />
      </section>
      <section id="introduction" tabIndex={-1} className={styles.storySection} aria-label="イントロダクション">
        <div className={styles.storyContent}>
          <div className={styles.headingFrame}>
          <img
            className={styles.sectionHeading}
            src="/introduction-heading.png?v=2"
            alt=""
            width={3438}
            height={775}
          />
          </div>
          <p className={styles.storyText}>{storyText}</p>
        </div>
      </section>
      <section id="characters" tabIndex={-1} className={styles.characterSection} aria-label="キャラクター紹介">
        <div className={styles.characterContent}>
          <div className={styles.headingFrame}>
            <img className={styles.sectionHeading} src="/character-heading.png?v=2" alt="キャラクター" width={2985} height={775} />
          </div>
          <CharacterCarousel />
        </div>
      </section>
      <section id="story" tabIndex={-1} className={styles.episodesSection} aria-label="Story エピソード一覧">
        <div className={styles.episodesContent}>
          <div className={styles.headingFrame}>
            <img className={styles.sectionHeading} src="/story-heading.png?v=2" alt="ストーリー" width={2343} height={775} />
          </div>
          <EpisodeList />
        </div>
      </section>
      <section id="sns" tabIndex={-1} className={styles.snsSection} aria-label="SNS">
        <div className={styles.snsContent}>
          <div className={styles.headingFrame}>
            <img className={styles.sectionHeading} src="/sns-heading.png?v=2" alt="SNS" width={2184} height={775} />
          </div>
          <div className={styles.snsBody}>
            <a className={styles.instagramLink} href="https://www.instagram.com/s.t.codex/" target="_blank" rel="noopener noreferrer">
              <img className={styles.instagramQr} src="/instagram-qr.png?v=2" alt="Instagram @s.t.codex のQRコード" width={492} height={492} />
            </a>
          </div>
        </div>
        <footer className={styles.snsCopyright}>© S.T.codex</footer>
      </section>
      <SectionMenu />
      <footer className={styles.footer} />
    </main>
    </TitleEntry>
  );
}
