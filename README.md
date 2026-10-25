# S.T.codex

キャラクター紹介と、プロローグ・全5話のノベルゲーム。

## ローカル制作

Node.js 22.13以上で `npm ci` の後、`npm run build` と `npm run start`。
制作ルールは `SCENARIO_RULES.md` を参照。

## GitHub Pages

`npm run build:pages` で `dist-pages/` に公開用の静的サイトを出力する。
既存のReact画面・原稿・画像を利用し、GitHubのリポジトリ名に合わせて
`/S.T.codex/` を画像とリンクに付ける。ローカル制作のURLには影響しない。

`main` へのpushで `.github/workflows/pages.yml` がビルドと公開を行う。
公開先: https://anneouran.github.io/S.T.codex/
