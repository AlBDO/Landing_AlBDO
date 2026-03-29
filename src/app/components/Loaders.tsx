"use client";
import dynamic from "next/dynamic";

const HeroCanvasInner    = dynamic(() => import("./HeroCanvas"),    { ssr: false });
const RingsCanvasInner   = dynamic(() => import("./RingsCanvas"),   { ssr: false });
const CTACanvasInner     = dynamic(() => import("./CTACanvas"),     { ssr: false });
const CursorGlowInner    = dynamic(() => import("./CursorGlow"),    { ssr: false });
const MatrixTitleInner   = dynamic(() => import("./MatrixTitle"),   { ssr: false });

export function HeroCanvasLoader()  { return <HeroCanvasInner />; }
export function RingsCanvasLoader() { return <RingsCanvasInner />; }
export function CTACanvasLoader()   { return <CTACanvasInner />; }
export function CursorGlowLoader()  { return <CursorGlowInner />; }
export function MatrixTitleLoader() { return <MatrixTitleInner />; }
