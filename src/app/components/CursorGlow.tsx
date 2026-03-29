"use client";
import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  // smooth-follow targets
  const pos = useRef({ x: -999, y: -999 });
  const smooth = useRef({ x: -999, y: -999 });

  useEffect(() => {
    const update = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", update);

    let raf: number;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      smooth.current.x = lerp(smooth.current.x, pos.current.x, 0.1);
      smooth.current.y = lerp(smooth.current.y, pos.current.y, 0.1);
      if (glowRef.current) {
        glowRef.current.style.transform =
          `translate(${smooth.current.x - 220}px, ${smooth.current.y - 220}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", update);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 440,
        height: 440,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(255,190,60,0.13) 0%, rgba(255,140,30,0.07) 40%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 9999,
        willChange: "transform",
        mixBlendMode: "multiply",
      }}
      ref={glowRef}
    />
  );
}
