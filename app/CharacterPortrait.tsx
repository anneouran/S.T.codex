type CharacterPortraitProps = {
  src: string;
  alt?: string;
  variant?: "adult" | "child" | "girl";
};

// 「立ち絵：（ファイル名）」で指定した画像を共通の位置・大きさで表示する。
export default function CharacterPortrait({ src, alt = "立ち絵", variant = "adult" }: CharacterPortraitProps) {
  return (
    <div className="character-layer">
      <img key={`${src}:${variant}`} className={`character-image character-image--${variant}`} src={src} alt={alt} />
    </div>
  );
}
