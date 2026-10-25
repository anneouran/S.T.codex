// エピソードからの復帰だけを一度記録し、通常のリロードはロード画面から始める。
export const storyReturnKey = "st-codex-return-to-story";

export function returnToStory() {
  sessionStorage.setItem(storyReturnKey, "story");
  window.location.replace("/title#story");
}
