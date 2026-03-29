"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import styles from "./MatrixTitle.module.css";

// â”€â”€ GPU glyph pool â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const GLYPHS =
  "0123456789ABCDEF" +
  "â–‘â–’â–“â–„â–€â– â–¡â—†â—‡" +
  "Ã—Ã·Â±âˆ‚âˆ‘âˆšâˆžâ‰ˆâ‰ â‰¡" +
  "âŠ•âŠ—âŠ˜â†’â†â†‘â†“" +
  "01001101 10110100";

function randomGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
}

// â”€â”€ Config â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const LINE1 = "The web runtime";
const LINE2 = "that thinks.";
const ALL_CHARS = [...LINE1, "\n", ...LINE2];

// How long each char scrambles before resolving (ms)
const SCRAMBLE_MS   = 680;
// Stagger between characters (ms)
const STAGGER_MS    = 48;
// How fast glyphs cycle while scrambling (ms per frame)
const CYCLE_MS      = 42;

interface CharState {
  display: string;
  resolved: boolean;
  resolving: boolean; // slowing-down phase
}

export default function MatrixTitle() {
  const [chars, setChars] = useState<CharState[]>(
    ALL_CHARS.map((c) => ({
      display: c === " " || c === "\n" ? c : randomGlyph(),
      resolved: false,
      resolving: false,
    }))
  );
  const [progress, setProgress] = useState(0); // 0â€“100
  const [phase, setPhase] = useState<"boot" | "loading" | "done">("boot");

  // label shown in the HUD bar
  const [hudLabel, setHudLabel] = useState("INIT");

  const stateRef = useRef(chars);
  stateRef.current = chars;

  const tick = useCallback(() => {
    const now = performance.now();

    setChars((prev) => {
      const next = prev.map((c) => ({ ...c }));
      let allDone = true;
      for (let i = 0; i < next.length; i++) {
        const ch = ALL_CHARS[i];
        if (ch === " " || ch === "\n") continue;
        if (!next[i].resolved) {
          allDone = false;
          // cycle glyph
          if (next[i].resolving) {
            // slower cycling, occasionally show real char
            if (Math.random() < 0.45) {
              next[i].display = ch;
            } else {
              next[i].display = randomGlyph();
            }
          } else {
            next[i].display = randomGlyph();
          }
        }
      }
      return next;
    });

    // update progress bar proportionally
    const totalChars = ALL_CHARS.filter(
      (c) => c !== " " && c !== "\n"
    ).length;
    const resolvedCount = stateRef.current.filter((c) => c.resolved).length;
    setProgress(Math.round((resolvedCount / totalChars) * 100));
  }, []);

  useEffect(() => {
    let bootTimer: ReturnType<typeof setTimeout>;
    let cycleInterval: ReturnType<typeof setInterval>;
    let resolveTimers: ReturnType<typeof setTimeout>[] = [];

    // Short boot pause before starting
    bootTimer = setTimeout(() => {
      setPhase("loading");
      setHudLabel("LOADING RENDER KERNEL");

      // Start glyph cycling
      cycleInterval = setInterval(tick, CYCLE_MS);

      // Schedule resolve for each char
      let charIdx = 0;
      for (let i = 0; i < ALL_CHARS.length; i++) {
        const ch = ALL_CHARS[i];
        if (ch === " " || ch === "\n") continue;

        const delay    = charIdx * STAGGER_MS;
        const slowDown = delay + SCRAMBLE_MS * 0.55;
        const resolve  = delay + SCRAMBLE_MS;
        const idx      = i; // capture

        // enter slow/resolving phase
        resolveTimers.push(
          setTimeout(() => {
            setChars((prev) => {
              const n = [...prev];
              n[idx] = { ...n[idx], resolving: true };
              return n;
            });
          }, slowDown)
        );

        // lock in real character
        resolveTimers.push(
          setTimeout(() => {
            setChars((prev) => {
              const n = [...prev];
              n[idx] = { display: ch, resolved: true, resolving: false };
              return n;
            });
          }, resolve)
        );

        charIdx++;
      }

      // total animation duration
      const totalChars = ALL_CHARS.filter(
        (c) => c !== " " && c !== "\n"
      ).length;
      const totalMs = (totalChars - 1) * STAGGER_MS + SCRAMBLE_MS + 80;

      resolveTimers.push(
        setTimeout(() => {
          clearInterval(cycleInterval);
          setPhase("done");
          setHudLabel("RENDER COMPLETE");
          setProgress(100);
        }, totalMs)
      );

      // HUD label midpoint
      resolveTimers.push(
        setTimeout(() => {
          setHudLabel("COMPILING EFFECT LATTICE");
        }, totalMs * 0.35)
      );
      resolveTimers.push(
        setTimeout(() => {
          setHudLabel("TIERING COMPONENTS");
        }, totalMs * 0.65)
      );
    }, 320);

    return () => {
      clearTimeout(bootTimer);
      clearInterval(cycleInterval);
      resolveTimers.forEach(clearTimeout);
    };
  }, [tick]);

  // Split into line1 / line2 for rendering
  const line1Chars = chars.slice(0, LINE1.length);
  const line2Chars = chars.slice(LINE1.length + 1); // +1 skip \n

  return (
    <div className={styles.root}>
      {/* HUD scan-line overlay */}
      {phase !== "done" && <div className={styles.scanlines} aria-hidden />}

      {/* Progress bar */}
      {phase !== "done" && (
        <div className={styles.progressBar} aria-hidden>
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
          <span className={styles.progressLabel}>
            {phase === "boot"
              ? "ALBDO // BOOT"
              : `${hudLabel} ··· ${progress}%`}
          </span>
        </div>
      )}

      {/* Line 1 */}
      <div className={styles.line1} aria-label={LINE1}>
        {line1Chars.map((c, i) => {
          if (ALL_CHARS[i] === " ")
            return <span key={i} className={styles.space}> </span>;
          return (
            <span
              key={i}
              className={`${styles.char} ${
                c.resolved ? styles.charResolved : ""
              } ${c.resolving ? styles.charResolving : ""}`}
            >
              {c.display}
            </span>
          );
        })}
      </div>

      {/* Line 2 â€” accent gradient once resolved */}
      <div className={styles.line2wrapper} aria-label={LINE2}>
        <span
          className={`${styles.line2} ${
            phase === "done" ? styles.line2Accent : ""
          }`}
        >
          {line2Chars.map((c, i) => {
            const globalIdx = LINE1.length + 1 + i;
            if (ALL_CHARS[globalIdx] === " ")
              return <span key={i} className={styles.space}> </span>;
            return (
              <span
                key={i}
                className={`${styles.char} ${
                  c.resolved ? styles.charResolved : ""
                } ${c.resolving ? styles.charResolving : ""}`}
              >
                {c.display}
              </span>
            );
          })}
        </span>
      </div>
    </div>
  );
}
