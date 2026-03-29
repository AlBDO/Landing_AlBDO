"use client";
import { useEffect, useRef, useState } from "react";

interface Props {
  value: string; // e.g. "0.07 ms", "11 MB", "< 30 MB", "1.4 s"
  duration?: number;
  className?: string;
}

function parseValue(raw: string): { prefix: string; num: number; suffix: string } {
  const match = raw.match(/^([^0-9]*)([0-9]+\.?[0-9]*)(.*)$/);
  if (!match) return { prefix: "", num: 0, suffix: raw };
  return { prefix: match[1], num: parseFloat(match[2]), suffix: match[3] };
}

export default function CountUp({ value, duration = 1600, className }: Props) {
  const { prefix, num, suffix } = parseValue(value);
  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  const decimals = num % 1 !== 0 ? String(num).split(".")[1]?.length ?? 0 : 0;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            // ease out cubic
            const e = 1 - Math.pow(1 - p, 3);
            setDisplay((num * e).toFixed(decimals));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [num, duration, decimals]);

  return (
    <span ref={ref} className={className}>
      {prefix}{display}{suffix}
    </span>
  );
}
