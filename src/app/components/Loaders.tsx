"use client";
import dynamic from "next/dynamic";

const HeroCanvasInner = dynamic(() => import("./HeroCanvas"), { ssr: false });
const RingsCanvasInner = dynamic(() => import("./RingsCanvas"), { ssr: false });

export function HeroCanvasLoader() {
  return <HeroCanvasInner />;
}

export function RingsCanvasLoader() {
  return <RingsCanvasInner />;
}
