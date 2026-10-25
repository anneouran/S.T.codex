export type TextKind = "narration" | "speech" | "protagonist";
export type Portrait = { file: string; variant: "adult" | "child" | "girl" };
export type Block = { kind: TextKind | "location"; name?: string; lines: string[]; background?: string; darken?: boolean; pan?: boolean; portrait?: Portrait; };
export const ep1Blocks: Block[] = [
  {
    "kind": "narration",
    "background": "village_night.png",
    "darken": true,
    "pan": true,
    "lines": [
      "点々と建ち並ぶ家々の明かりがひとつ、またひとつと消え、夜空の星が輝きを増す。",
      "そんな夜だからだろうか。",
      "カーテンの隙間から明かりが漏れ出る屋根裏部屋が、ひときわ目立っていた。"
    ]
  },
  {
    "kind": "location",
    "background": "attic_night.png",
    "darken": true,
    "pan": true,
    "lines": [
      "屋根裏部屋"
    ]
  },
  {
    "kind": "narration",
    "lines": [
      "オレンジ色の温かな光に包まれた屋根裏部屋で、十歳前後の少女がベッドの上で本を広げていた。",
      "紺色の表紙に金色の装飾が施された分厚いハードカバー本。",
      "それは、世界の均衡を守るために活動する組織「カルコルディス」について記されたものである。",
      "歴史に関する章を読み終え、組織構成の章に差しかかったところで少女の手がぴたりと止まった。"
    ]
  },
  {
    "kind": "speech",
    "name": "本の記述",
    "lines": [
      "カルコルディスの「特殊潜入部隊」は、組織内でも特に優秀な人材のみが所属を許される精鋭部隊である。",
      "主な役割は、情報収集や調査を目的とした他世界への潜入。",
      "また、通常のエージェントには立ち入りが許されていない未知の世界での任務も担当しており、",
      "まさにカルコルディスの最前線に立つ部隊と言えるだろう。"
    ]
  },
  {
    "kind": "protagonist",
    "name": "少女",
    "portrait": {
      "file": "vera_young.png",
      "variant": "girl"
    },
    "lines": [
      "特殊潜入部隊……。",
      "……ここならもしかしたら……。"
    ]
  },
  {
    "kind": "narration",
    "lines": [
      "少女はそのページを食い入るように見つめた。",
      "コンコンコン！",
      "突然のノック音に少女はハッと顔を上げる。",
      "扉が開き、寝巻き姿の女性が顔を覗かせた。"
    ]
  },
  {
    "kind": "speech",
    "name": "女性",
    "portrait": {
      "file": "mother_vera.png",
      "variant": "adult"
    },
    "lines": [
      "もうヴェラったらまだ寝てないの？",
      "全く……勉強熱心なのは感心だけど、いくら本を読んだって寝ないと頭は良くならな……",
      "！？"
    ]
  },
  {
    "kind": "narration",
    "lines": [
      "少女はベッドから飛び起き、彼女の元へ駆け寄る。",
      "そして、女性の寝巻きの裾をぎゅっと掴んで懇願するように見上げた。"
    ]
  },
  {
    "kind": "protagonist",
    "name": "少女",
    "portrait": {
      "file": "vera_young.png",
      "variant": "girl"
    },
    "lines": [
      "まま……私……。"
    ]
  },
  {
    "kind": "narration",
    "lines": [
      "普段はおとなしい少女の突然の行動に女性は驚き、心配そうな表情を浮かべた。"
    ]
  },
  {
    "kind": "speech",
    "name": "女性",
    "portrait": {
      "file": "mother_vera.png",
      "variant": "adult"
    },
    "lines": [
      "どうしたの……？もしかしてどこか痛い？"
    ]
  },
  {
    "kind": "protagonist",
    "name": "少女",
    "portrait": {
      "file": "vera_young.png",
      "variant": "girl"
    },
    "lines": [
      "ううん……。"
    ]
  },
  {
    "kind": "speech",
    "name": "女性",
    "portrait": {
      "file": "mother_vera.png",
      "variant": "adult"
    },
    "lines": [
      "じゃあ何？"
    ]
  },
  {
    "kind": "narration",
    "lines": [
      "少女は1度ためらうように俯いたが、すぐに意を決したような表情で再び女性を見つめ直した。"
    ]
  },
  {
    "kind": "protagonist",
    "name": "少女",
    "portrait": {
      "file": "vera_young.png",
      "variant": "girl"
    },
    "lines": [
      "まま……",
      "私、カルコルディスに入りたい。"
    ]
  }
];
export const ep1Ending = { darken: true };
export type Frame = { block: number; line: number; kind: Block["kind"]; name?: string; text: string; background: string; portrait?: Portrait; darken: boolean; pan: boolean; };
export function makeFrames(blocks: Block[]): Frame[] {
 let background = "黒";
 let portrait: Portrait | undefined;
 return blocks.flatMap((block, blockIndex) => {
  background = block.background ?? background;
  portrait = block.portrait ?? portrait;
  return block.lines.map((text, line) => ({ block: blockIndex, line, kind: block.kind, name: block.name, text, background, portrait, darken: line === 0 && !!block.darken, pan: line === 0 && !!block.pan }));
 });
}
export const ep1Frames = makeFrames(ep1Blocks);
