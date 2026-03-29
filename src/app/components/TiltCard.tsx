"use client";
import { useRef, ReactNode, CSSProperties, MouseEvent } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  intensity?: number; // degrees, default 10
  scale?: number;     // default 1.025
}

export default function TiltCard({
  children,
  className,
  style,
  intensity = 10,
  scale = 1.028,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;  // -0.5 → 0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) scale(${scale})`;
    el.style.transition = "transform 0.08s ease-out";
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)";
    el.style.transition = "transform 0.55s cubic-bezier(.22,1,.36,1)";
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{ transformStyle: "preserve-3d", ...style }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </div>
  );
}
