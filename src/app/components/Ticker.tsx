"use client";
import styles from "./Ticker.module.css";

const ITEMS = [
  "Rust", "Zero-JS by default", "Axum 0.8", "Tokio", "SWC AST",
  "Effect Lattice", "Tier A · 0 KB JS", "Selective Hydration",
  "DashMap lock-free", "WebTransport", "11 MB idle RAM", "0.07 ms",
  "Single binary deploy", "< 30 MB Docker", "No Node.js in hot path",
];

export default function Ticker() {
  const doubled = [...ITEMS, ...ITEMS];
  return (
    <div className={styles.track}>
      <div className={styles.inner}>
        {doubled.map((item, i) => (
          <span key={i} className={styles.item}>
            <span className={styles.dot} aria-hidden>◆</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
