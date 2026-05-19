"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue } from "motion/react";
import { Play, Pause, RotateCcw, Clock, Zap, Swords, Star, LogIn, LogOut, Waves } from "lucide-react";
import type { RotationConfig, TeamRotationEvent } from "@/types/guide";

/* ─── colour + icon map per event type ─── */
const EVENT_STYLES: Record<
  TeamRotationEvent["type"],
  { bg: string; border: string; glow: string; icon: React.ReactNode; label: string }
> = {
  intro:    { bg: "bg-blue-500/80",    border: "border-blue-400",   glow: "shadow-[0_0_18px_rgba(59,130,246,0.55)]",  icon: <LogIn   size={12} />, label: "Intro" },
  skill:    { bg: "bg-amber-500/80",   border: "border-amber-400",  glow: "shadow-[0_0_18px_rgba(245,158,11,0.55)]",  icon: <Swords  size={12} />, label: "Skill" },
  ultimate: { bg: "bg-rose-500/80",    border: "border-rose-400",   glow: "shadow-[0_0_18px_rgba(239,68,68,0.55)]",   icon: <Star    size={12} />, label: "Ultimate" },
  outro:    { bg: "bg-violet-500/80",  border: "border-violet-400", glow: "shadow-[0_0_18px_rgba(139,92,246,0.55)]",  icon: <LogOut  size={12} />, label: "Outro" },
  echo:     { bg: "bg-emerald-500/80", border: "border-emerald-400",glow: "shadow-[0_0_18px_rgba(16,185,129,0.55)]",  icon: <Waves   size={12} />, label: "Echo" },
};

const SLOT_COLORS = [
  { track: "from-blue-500/10 to-blue-500/5",   accent: "bg-blue-500",   text: "text-blue-400",   ring: "ring-blue-500/30" },
  { track: "from-amber-500/10 to-amber-500/5",  accent: "bg-amber-500",  text: "text-amber-400",  ring: "ring-amber-500/30" },
  { track: "from-emerald-500/10 to-emerald-500/5", accent: "bg-emerald-500", text: "text-emerald-400", ring: "ring-emerald-500/30" },
];

const DEFAULT_SLOT_NAMES: [string, string, string] = ["Slot 1 — Main", "Slot 2 — Sub", "Slot 3 — Support"];

/* ─── Digital Timer ─── */
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const tenths = Math.floor((seconds % 1) * 10);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}.${tenths}`;
};

/* ─── Tick marks generator ─── */
const generateTicks = (totalDuration: number) => {
  const ticks: number[] = [];
  // Decide tick interval based on duration
  let interval = 1;
  if (totalDuration > 30) interval = 5;
  if (totalDuration > 120) interval = 10;
  for (let t = 0; t <= totalDuration; t += interval) {
    ticks.push(t);
  }
  return { ticks, interval };
};

/* ═══════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════ */
export interface TeamRotationTimelineProps {
  config: RotationConfig;
  elementColor?: string;
}

export const TeamRotationTimeline: React.FC<TeamRotationTimelineProps> = ({ config, elementColor = "#f43f5e" }) => {
  const { totalDuration, events, slotNames } = config;
  const names = slotNames ?? DEFAULT_SLOT_NAMES;

  /* ── Playback state ── */
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const rafRef = useRef<number>(0);
  const lastFrameRef = useRef<number>(0);
  const timeRef = useRef(0); // avoid stale closures

  /* ── Refs for seeking and dragging ── */
  const rulerRef = useRef<HTMLDivElement>(null);
  const trackContainerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const playheadX = useMotionValue(0);

  // Sync playhead X coordinate with currentTime when not dragging
  useEffect(() => {
    if (!isDragging.current && trackContainerRef.current) {
      const rect = trackContainerRef.current.getBoundingClientRect();
      playheadX.set((currentTime / totalDuration) * rect.width);
    }
  }, [currentTime, totalDuration, playheadX]);

  // Handle window resizing to keep playhead in the right visual place
  useEffect(() => {
    const handleResize = () => {
      if (!isDragging.current && trackContainerRef.current) {
        const rect = trackContainerRef.current.getBoundingClientRect();
        playheadX.set((timeRef.current / totalDuration) * rect.width);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [totalDuration, playheadX]);

  const handleDragStart = () => {
    isDragging.current = true;
    setIsPlaying(false);
  };

  const handleDrag = (_event: any, info: any) => {
    if (!trackContainerRef.current) return;
    const rect = trackContainerRef.current.getBoundingClientRect();
    const currentX = playheadX.get();
    const pct = Math.max(0, Math.min(1, currentX / rect.width));
    const newTime = pct * totalDuration;
    timeRef.current = newTime;
    setCurrentTime(newTime);
  };

  const handleDragEnd = () => {
    isDragging.current = false;
  };

  /* ── Animation loop ── */
  const tick = useCallback((timestamp: number) => {
    if (lastFrameRef.current === 0) lastFrameRef.current = timestamp;
    const delta = (timestamp - lastFrameRef.current) / 1000;
    lastFrameRef.current = timestamp;

    let next = timeRef.current + delta;
    if (next >= totalDuration) {
      next = 0; // auto-loop
    }
    timeRef.current = next;
    setCurrentTime(next);
    rafRef.current = requestAnimationFrame(tick);
  }, [totalDuration]);

  useEffect(() => {
    if (isPlaying) {
      lastFrameRef.current = 0;
      rafRef.current = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(rafRef.current);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying, tick]);

  /* keep ref in sync */
  useEffect(() => { timeRef.current = currentTime; }, [currentTime]);

  /* ── Controls ── */
  const togglePlay = () => setIsPlaying((p) => !p);
  const reset = () => {
    setIsPlaying(false);
    cancelAnimationFrame(rafRef.current);
    timeRef.current = 0;
    setCurrentTime(0);
    lastFrameRef.current = 0;
  };

  /* ── Click-to-seek ── */
  const seekToX = useCallback((clientX: number) => {
    if (!trackContainerRef.current) return;
    const rect = trackContainerRef.current.getBoundingClientRect();
    const xOffset = clientX - rect.left;
    const pct = Math.max(0, Math.min(1, xOffset / rect.width));
    const newTime = pct * totalDuration;
    timeRef.current = newTime;
    setCurrentTime(newTime);
  }, [totalDuration]);

  const handleTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // Left click only
    seekToX(e.clientX);
  };

  const handleRulerClick = (e: React.MouseEvent<HTMLDivElement> | React.PointerEvent<HTMLDivElement>) => {
    if (!rulerRef.current) return;
    const rect = rulerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    const newTime = pct * totalDuration;
    timeRef.current = newTime;
    setCurrentTime(newTime);
  };

  /* ── Block intersection check ── */
  const isBlockActive = (evt: TeamRotationEvent) =>
    currentTime >= evt.startTime && currentTime < evt.startTime + evt.duration;

  /* ── Per-slot events ── */
  const slotEvents: [TeamRotationEvent[], TeamRotationEvent[], TeamRotationEvent[]] = [
    events.filter((e) => e.characterSlot === 1),
    events.filter((e) => e.characterSlot === 2),
    events.filter((e) => e.characterSlot === 3),
  ];

  /* ── Derive unique avatar per slot from the first event with an avatar ── */
  const slotAvatars = slotEvents.map((evts) => {
    const withAvatar = evts.find((e) => e.avatarUrl);
    return withAvatar?.avatarUrl ?? null;
  });

  const playheadPct = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;
  const { ticks, interval } = generateTicks(totalDuration);

  return (
    <div className="w-full h-full bg-[#0a0a10] rounded-[2rem] border border-white/10 shadow-2xl flex flex-col overflow-hidden font-sans text-white relative select-none">

      {/* ─── Background Decorations ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full blur-[120px] opacity-20" style={ { backgroundColor: elementColor } } />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-violet-500/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.03]" style={ { backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "40px 40px" } } />
      </div>

      {/* ═══ HEADER ═══ */}
      <div className="relative z-10 flex items-center justify-between px-6 md:px-10 pt-8 pb-5 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 bg-white/5" style={ { color: elementColor } }>
            <Clock size={20} />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-black tracking-widest uppercase">Rotation Timeline</h2>
            <p className="text-[10px] text-white/30 tracking-[0.2em] uppercase font-bold mt-0.5">
              {totalDuration}s total • {events.length} events
            </p>
          </div>
        </div>

        {/* ─── Controls ─── */}
        <div className="flex items-center gap-3">
          {/* Digital Timer */}
          <div className="hidden sm:flex items-center gap-2 bg-black/40 border border-white/10 rounded-full px-4 py-2">
            <span className="text-xs font-mono tracking-wider text-white/80">{formatTime(currentTime)}</span>
            <span className="text-white/20">/</span>
            <span className="text-xs font-mono tracking-wider text-white/40">{formatTime(totalDuration)}</span>
          </div>

          <button
            title="Reset"
            onClick={reset}
            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all active:scale-90"
          >
            <RotateCcw size={14} />
          </button>

          <button
            title={isPlaying ? "Pause" : "Play"}
            onClick={togglePlay}
            className="w-11 h-11 rounded-full flex items-center justify-center text-white transition-all active:scale-90 shadow-lg"
            style={ { backgroundColor: elementColor, boxShadow: `0 4px 20px ${elementColor}60` } }
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
          </button>
        </div>
      </div>

      {/* ═══ TIMELINE BODY ═══ */}
      <div className="relative z-10 flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="flex-1 flex flex-col overflow-x-auto overflow-y-hidden md:overflow-hidden">
          <div className="flex-1 flex flex-col min-w-[600px] relative">
            {/* ─── Lanes ─── */}
            {([0, 1, 2] as const).map((slotIdx) => (
              <div
                key={slotIdx}
                className={`flex-1 flex items-stretch border-b border-white/5 last:border-b-0 relative group/lane bg-gradient-to-r ${SLOT_COLORS[slotIdx].track}`}
              >
                {/* Slot Label Column */}
                <div className="w-[120px] md:w-[160px] shrink-0 flex items-center gap-3 px-4 md:px-6 border-r border-white/5 bg-black/20">
                  {/* Avatar */}
                  {slotAvatars[slotIdx] ? (
                    <div className={`w-8 h-8 rounded-lg overflow-hidden ring-2 ${SLOT_COLORS[slotIdx].ring} shrink-0 shadow-md`}>
                      <img
                        src={slotAvatars[slotIdx]!}
                        alt={names[slotIdx]}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className={`w-8 h-8 rounded-lg ${SLOT_COLORS[slotIdx].accent} opacity-30 flex items-center justify-center shrink-0`}>
                      <span className="text-xs font-black text-white">{slotIdx + 1}</span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className={`text-[10px] font-black tracking-widest uppercase truncate ${SLOT_COLORS[slotIdx].text}`}>
                      {names[slotIdx]}
                    </p>
                  </div>
                </div>

                {/* Event Blocks Area */}
                <div
                  className="flex-1 relative cursor-pointer"
                  onPointerDown={handleTrackPointerDown}
                >
                  {slotEvents[slotIdx].map((evt) => {
                    const style = EVENT_STYLES[evt.type];
                    const active = isBlockActive(evt);
                    const leftPct = (evt.startTime / totalDuration) * 100;
                    const widthPct = (evt.duration / totalDuration) * 100;

                    return (
                      <div
                        key={evt.id}
                        className={`absolute top-[12%] bottom-[12%] rounded-lg border transition-all duration-150 flex items-center gap-1.5 px-2 overflow-hidden cursor-default transform-gpu
                          ${style.bg} ${style.border}
                          ${active ? `scale-[1.04] brightness-125 z-20 ${style.glow}` : "scale-100 opacity-80 z-10 shadow-md"}
                        `}
                        style={ {
                          left: `${leftPct}%`,
                          width: `${widthPct}%`,
                        } }
                        title={`${evt.characterName}: ${evt.label || style.label} (${evt.startTime}s – ${evt.startTime + evt.duration}s)`}
                      >
                        {/* Mini avatar on block */}
                        {evt.avatarUrl && (
                          <div className="w-5 h-5 rounded-md overflow-hidden shrink-0 ring-1 ring-white/30 shadow-sm hidden sm:block">
                            <img src={evt.avatarUrl} alt="" className="w-full h-full object-cover" />
                          </div>
                        )}
                        {/* Icon */}
                        <span className="text-white/90 shrink-0">{style.icon}</span>
                        {/* Label */}
                        <span className="text-[9px] md:text-[10px] font-bold tracking-wider uppercase text-white truncate">
                          {evt.label || style.label}
                        </span>
                        {/* Active shimmer */}
                        {active && (
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-[shimmer_1.5s_ease-in-out_infinite] pointer-events-none" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* ─── Global Playhead Overlay ─── */}
            <div
              ref={trackContainerRef}
              className="absolute top-0 bottom-0 left-[120px] md:left-[160px] right-0 z-30 pointer-events-none"
            >
              <motion.div
                drag="x"
                dragConstraints={trackContainerRef}
                dragElastic={0}
                dragMomentum={false}
                onDragStart={handleDragStart}
                onDrag={handleDrag}
                onDragEnd={handleDragEnd}
                style={ { x: playheadX } }
                onPointerDown={(e) => e.stopPropagation()}
                className="absolute top-0 bottom-0 w-px bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.4)] pointer-events-auto cursor-ew-resize active:cursor-grabbing"
              >
                {/* Playhead Draggable Handle */}
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.6)] border-2 border-white flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-110 transition-transform z-40">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* ═══ RULER / SEEK BAR ═══ */}
        <div
          className="h-10 md:h-12 border-t border-white/10 bg-black/30 flex items-center relative z-10 shrink-0 overflow-x-auto md:overflow-hidden"
        >
          <div className="flex flex-row w-full h-full min-w-[600px]">
            {/* Slot column placeholder to align with lanes */}
            <div className="w-[120px] md:w-[160px] shrink-0 border-r border-white/5 bg-black/20 h-full" />

            {/* Ruler active tick area */}
            <div
              className="flex-1 h-full cursor-pointer relative"
              onPointerDown={handleRulerClick}
              ref={rulerRef}
            >
              {/* Filled progress */}
              <div
                className="absolute top-0 left-0 bottom-0 opacity-10 pointer-events-none transition-none"
                style={ { width: `${playheadPct}%`, backgroundColor: elementColor } }
              />

              {/* Tick marks */}
              <div className="relative w-full h-full">
                {ticks.map((t) => {
                  const pct = (t / totalDuration) * 100;
                  const isMajor = t % (interval * 5) === 0 || t === 0;
                  return (
                    <div
                      key={t}
                      className="absolute top-0 bottom-0 flex flex-col items-center justify-end pointer-events-none"
                      style={ { left: `${pct}%` } }
                    >
                      <div className={`w-px ${isMajor ? "h-3 bg-white/30" : "h-2 bg-white/10"}`} />
                      {isMajor && (
                        <span className="text-[8px] font-mono text-white/30 mt-0.5">{t}s</span>
                      )}
                    </div>
                  );
                })}

                {/* Playhead marker on ruler */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white/80 pointer-events-none transform-gpu z-20"
                  style={ { left: `${playheadPct}%` } }
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ FOOTER LEGEND ═══ */}
      <div className="relative z-10 flex items-center justify-center gap-4 md:gap-6 px-6 py-3 border-t border-white/5 bg-black/20 flex-wrap">
        {(Object.entries(EVENT_STYLES) as [TeamRotationEvent["type"], typeof EVENT_STYLES["intro"]][]).map(([type, style]) => (
          <div key={type} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-sm ${style.bg} ${style.border} border`} />
            <span className="text-[9px] font-bold tracking-widest uppercase text-white/40">{style.label}</span>
          </div>
        ))}
      </div>

      {/* Shimmer keyframe */}
      <style dangerouslySetInnerHTML={ { __html: `
        @keyframes shimmer {
          0% { transform: translateX(-200%); }
          100% { transform: translateX(200%); }
        }
      ` } } />
    </div>
  );
};

/* ═══════════════════════════════════════════════
   Empty State — shown when no rotation data exists
   ═══════════════════════════════════════════════ */
export const RotationEmptyState: React.FC<{ elementColor?: string }> = ({ elementColor = "#f43f5e" }) => (
  <div className="w-full h-full bg-white rounded-[2rem] border border-slate-100/50 shadow-2xl flex flex-col items-center justify-center p-8 relative overflow-hidden">
    {/* Decorative */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-0 opacity-[0.02]" style={ { backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)", backgroundSize: "32px 32px" } } />
    </div>

    <div className="relative z-10 flex flex-col items-center text-center max-w-md">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border shadow-lg"
        style={ { backgroundColor: `${elementColor}15`, borderColor: `${elementColor}30`, color: elementColor } }
      >
        <Clock size={28} strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-2">
        No Rotation Data
      </h3>
      <p className="text-sm text-slate-400 leading-relaxed mb-4">
        A team rotation timeline hasn&apos;t been created for this character yet.
        Check back later or suggest one in our community.
      </p>
      <div className="flex items-center gap-2 text-xs text-slate-300">
        <Zap size={12} />
        <span className="font-bold tracking-widest uppercase">Coming Soon</span>
      </div>
    </div>
  </div>
);

export default TeamRotationTimeline;
