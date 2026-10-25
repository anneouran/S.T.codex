import styles from "./title.module.css";

// 固定した配置で、読み込み直後の描画とブラウザ側の描画を揃える。
const sparkles = [
  [7, 18, 18, 7.2, -2], [22, 7, 12, 9, -6],
  [80, 15, 23, 8.4, -4], [92, 33, 14, 10, -8],
  [12, 43, 28, 9.6, -7], [39, 29, 13, 8, -1],
  [68, 44, 17, 10.8, -5], [88, 61, 26, 8.8, -3],
  [6, 76, 14, 10.2, -9], [28, 66, 20, 7.8, -4],
  [55, 83, 12, 9.4, -6], [77, 91, 22, 8.2, -2],
  [46, 12, 16, 11, -8], [94, 85, 16, 9.8, -5],
];

export default function Sparkles() {
  return (
    <div className={styles.sparkles} aria-hidden="true">
      {sparkles.map(([x, y, size, duration, delay], index) => (
        <img
          key={index}
          className={styles.sparkle}
          src="/sparkle.png"
          alt=""
          width={584}
          height={775}
          draggable={false}
          style={{ left: `${x}%`, top: `${y}%`, width: `${size * 1.5}px`, animationDuration: `${duration}s`, animationDelay: `${delay}s` }}
        />
      ))}
    </div>
  );
}
