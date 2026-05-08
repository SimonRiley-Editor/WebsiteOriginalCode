"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import {
  Crosshair,
  ChevronLeft,
  ChevronRight,
  Snowflake,
  Swords,
  ShieldAlert,
  Shield,
  Zap,
  Users,
  Target,
  Activity,
  Clock,
  Wind,
  Flame,
  Sun,
  Moon,
  Sword,
  Info,
  Circle,
  Play,
  Star,
  Sparkles,
  X,
  LayoutGrid,
  Gamepad2,
  Coffee,
  Twitch,
  Triangle,
  Hexagon,
  CircleDot,
  Cpu,
  Terminal,
  Workflow,
  MousePointerClick,
  Command,
  Asterisk,
  LogIn,
  LogOut,
  Disc,
  Focus,
  Box,
  Layers,
  Fingerprint,
  Radar,
  ListFilter,
  PieChart,
  Dna,
  AudioWaveform
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Sanitize HTML from the rich text editor, allowing only safe formatting tags
const sanitizeHtml = (html: string): string => {
  if (!html) return '';
  // If the content has no HTML tags at all, return as-is (plain text backward compat)
  if (!/<[a-z][\s\S]*>/i.test(html)) return html;
  // Remove dangerous tags entirely
  let clean = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/<object[\s\S]*?<\/object>/gi, '')
    .replace(/<embed[\s\S]*?>/gi, '')
    .replace(/<link[\s\S]*?>/gi, '')
    .replace(/<meta[\s\S]*?>/gi, '');
  // Remove event handler attributes
  clean = clean.replace(/\s+on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]*)/gi, '');
  // Remove javascript: URLs
  clean = clean.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, '');
  return clean;
};

const RichText = ({ html, fallback = '', className = '' }: { html?: string, fallback?: string, className?: string }) => {
  const content = html || fallback;
  if (!content) return null;
  // If it contains HTML tags, render as HTML
  if (/<[a-z][\s\S]*>/i.test(content)) {
    return <span className={className} dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }} />;
  }
  // Plain text fallback
  return <span className={className}>{content}</span>;
};

const SequenceFracture = ({ sequences = [] }: { sequences?: any[] }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    if (hoveredIdx !== null) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [hoveredIdx]);

  const seqs = Array.from({ length: 6 }).map((_, i) => sequences[i] || { node: `S${i + 1}` });

  // Purely CSS polygons for perfectly fitted fractures
  const shards = [
    { id: 0, clip: 'polygon(0% 0%, 40% 0%, 35% 35%, 0% 50%)', cx: 18, cy: 21, tx: -16, ty: -16 },
    { id: 1, clip: 'polygon(40% 0%, 80% 0%, 65% 45%, 35% 35%)', cx: 55, cy: 20, tx: 0, ty: -24 },
    { id: 2, clip: 'polygon(80% 0%, 100% 0%, 100% 60%, 65% 45%)', cx: 86, cy: 26, tx: 24, ty: -8 },
    { id: 3, clip: 'polygon(65% 45%, 100% 60%, 100% 100%, 50% 100%)', cx: 78, cy: 76, tx: 16, ty: 20 },
    { id: 4, clip: 'polygon(35% 35%, 65% 45%, 50% 100%, 20% 100%, 30% 60%)', cx: 40, cy: 68, tx: -4, ty: 20 },
    { id: 5, clip: 'polygon(0% 50%, 35% 35%, 30% 60%, 20% 100%, 0% 100%)', cx: 17, cy: 69, tx: -24, ty: 12 },
  ];

  const activeSeq = hoveredIdx !== null ? seqs[hoveredIdx] : null;

  return (
    <div className="relative w-full min-h-screen bg-[#000000] font-sans flex items-center justify-center overflow-hidden border-t border-rose-500/10 shadow-[0_0_80px_rgba(225,29,72,0.1)]">

      {/* EPIC BACKGROUND WITH SHARP FRACTURED LIGHTS */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Deep mysterious space background with subtle noise */}
        <div
          className="absolute inset-0 opacity-[0.25] mix-blend-lighten grayscale-[50%]"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&q=80&w=1600')`, backgroundSize: 'cover' }}
        />

        {/* Colorful nebula gradients */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle_at_center,rgba(225,29,72,0.15)_0%,transparent_70%)] blur-[40px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.1)_0%,transparent_70%)] blur-[50px] mix-blend-screen" />

        {/* Dynamic laser streaks */}
        <div className="absolute top-1/2 left-1/2 w-[200%] h-px bg-gradient-to-r from-transparent via-rose-500/60 to-transparent rotate-[-20deg] origin-center -translate-x-1/2 -translate-y-1/2 shadow-[0_0_15px_rgba(225,29,72,0.8)]" />
        <div className="absolute top-1/2 left-1/2 w-[200%] h-[2px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent rotate-[45deg] origin-center -translate-x-1/2 -translate-y-1/2 blur-[1px]" />

        {/* Background Grid for depth */}
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '40px 40px', transform: 'perspective(1000px) rotateX(70deg) scale(2.5) translateY(-20%)', transformOrigin: 'top' }} />

        {/* Floating dust particles / stars */}
        <div className="absolute top-[20%] left-[30%] w-1 h-1 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,1)] animate-pulse" />
        <div className="absolute top-[60%] left-[70%] w-1.5 h-1.5 bg-rose-400 rounded-full shadow-[0_0_15px_rgba(225,29,72,1)] animate-pulse delay-700" />
        <div className="absolute bottom-[30%] left-[20%] w-1 h-1 bg-white/50 rounded-full animate-pulse delay-1000" />

        <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.95)] z-10" />
      </div>

      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {/* The Red String of Fate (rope effect) */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="none" className="overflow-visible absolute inset-0">
            <defs>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            {/* Elegant woven strings connecting nodes */}
            <motion.path
              d="M 18,21 L 55,20 L 86,26 L 78,76 L 40,68 L 17,69 Z M 18,21 L 40,68 M 55,20 L 78,76 M 86,26 L 17,69 M 18,21 L 78,76"
              vectorEffect="non-scaling-stroke"
              fill="none"
              stroke="rgba(244, 63, 94, 0.4)"
              strokeWidth="1.5"
              filter="url(#glow)"
              className="mix-blend-screen [stroke-linecap:round] scale-[1.05] origin-center"
            />
            <motion.path
              d="M 18,21 L 55,20 L 86,26 L 78,76 L 40,68 L 17,69 Z M 18,21 L 40,68 M 55,20 L 78,76 M 86,26 L 17,69 M 18,21 L 78,76"
              vectorEffect="non-scaling-stroke"
              fill="none"
              stroke="rgba(255, 255, 255, 0.8)"
              strokeWidth="0.5"
              className="scale-[1.05] origin-center"
            />
            {/* Small glowing nodes at intersections */}
            {shards.map(s => (
              <circle
                key={`node-${s.id}`}
                cx={s.cx}
                cy={s.cy}
                r="0.8"
                fill="#f43f5e"
                filter="url(#glow)"
                className="scale-[1.05] origin-center"
              />
            ))}
            {/* Inner white dots */}
            {shards.map(s => (
              <circle
                key={`inner-${s.id}`}
                cx={s.cx}
                cy={s.cy}
                r="0.3"
                fill="#ffffff"
                className="scale-[1.05] origin-center"
              />
            ))}
          </svg>
        </div>

        {/* The glass pieces container */}
        <div className="absolute inset-0 pointer-events-none">
          {shards.map((shard) => {
            const isHovered = hoveredIdx === shard.id;
            const isActive = hoveredIdx === null || isHovered;
            const seq = seqs[shard.id];

            return (
              <motion.div
                key={shard.id}
                drag
                dragMomentum={false}
                initial={{ x: shard.tx, y: shard.ty, scale: 1, zIndex: 10 }}
                whileHover={{ scale: 1.05, zIndex: 40 }}
                whileDrag={{ scale: 1.1, zIndex: 50 }}
                className="absolute inset-0 z-10"
                style={{
                  filter: isHovered
                    ? "drop-shadow(0 0 25px rgba(244,63,94,0.5)) drop-shadow(0 15px 30px rgba(0,0,0,0.8))"
                    : "drop-shadow(0 0 1px rgba(255,255,255,0.4)) drop-shadow(0 8px 16px rgba(0,0,0,0.5))",
                }}
              >
                <div
                  onMouseEnter={() => setHoveredIdx(shard.id)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className="w-full h-full cursor-grab active:cursor-grabbing group relative pointer-events-auto"
                  style={{ clipPath: shard.clip }}
                >
                  {/* Full size image background (replaces simple frosted glass if image exists) */}
                  <div className={cn(
                    "absolute inset-0 bg-black transition-opacity duration-500",
                    isActive ? "opacity-100" : "opacity-40"
                  )}>
                    {seq.icon && (
                      <img
                        src={seq.icon}
                        alt={`S${shard.id + 1}`}
                        loading="lazy"
                        decoding="async"
                        className={cn(
                          "absolute object-cover transition-all duration-700 ease-out origin-center left-1/2 top-1/2 w-full h-full object-contain",
                          isHovered
                            ? "opacity-100 grayscale-[10%]"
                            : "opacity-60 grayscale-[60%]"
                        )}
                        style={{
                          transform: isHovered
                            ? `translate(calc(-50% + ${seq.offsetX || 0}%), calc(-50% + ${seq.offsetY || 0}%)) scale(${0.85 * (seq.iconScale || 1.0)})`
                            : `translate(calc(-50% + ${seq.offsetX || 0}%), calc(-50% + ${seq.offsetY || 0}%)) scale(${0.8 * (seq.iconScale || 1.0)})`,
                        }}
                      />
                    )}
                    {!seq.icon && (
                      <div className="absolute inset-0 bg-slate-900 border border-white/5 flex flex-col items-center justify-center">
                        <span className={cn(
                          "text-5xl sm:text-7xl font-black font-mono transition-transform duration-500",
                          isHovered ? "text-rose-300 drop-shadow-[0_0_25px_rgba(244,63,94,0.8)] scale-110" : "text-white/30 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                        )}>
                          S{shard.id + 1}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className={cn(
                    "absolute inset-0 mix-blend-overlay transition-colors duration-500",
                    isHovered ? "bg-rose-500/20" : "bg-black/60"
                  )} />

                  <div
                    className={cn(
                      "absolute inset-0 transition-all duration-1000 mix-blend-soft-light pointer-events-none z-20",
                      isHovered ? "opacity-100" : "opacity-0"
                    )}
                    style={{
                      backgroundImage: `url('https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&q=80&w=800')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent pointer-events-none z-30" />
                  <div className="absolute inset-0 bg-[linear-gradient(105deg,transparent_20%,rgba(255,255,255,0.15)_25%,transparent_30%)] group-hover:bg-[linear-gradient(105deg,transparent_30%,rgba(255,255,255,0.3)_45%,transparent_50%)] transition-all duration-700 pointer-events-none z-30" />
                  <div className="absolute inset-0 bg-gradient-to-tl from-black/80 to-transparent pointer-events-none z-10" />
                  <div className={cn(
                    "absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.4)_0%,transparent_60%)] pointer-events-none transition-transform duration-500 mix-blend-screen z-30",
                    isHovered ? "opacity-100 scale-110" : "opacity-0 scale-90"
                  )} />
                  <div className="absolute w-[200%] h-[400%] bg-gradient-to-r from-transparent via-rose-200/20 to-transparent rotate-[35deg] origin-top-left -translate-x-[200%] group-hover:translate-x-[200%] group-hover:rotate-[45deg] transition-all duration-[1500ms] ease-out pointer-events-none mix-blend-screen z-40" />
                  <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(255,255,255,0.15)] pointer-events-none z-40" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {activeSeq && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.2 }}
            className="fixed z-[9999] pointer-events-none w-72 md:w-96 bg-[#0a0a0a]/95 backdrop-blur-xl border border-rose-500/30 rounded-2xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.9),0_0_30px_rgba(225,29,72,0.15)]"
            style={{
              left: mousePos.x > (typeof window !== 'undefined' ? window.innerWidth / 2 : 500) ? mousePos.x - 380 : mousePos.x + 30,
              top: mousePos.y > (typeof window !== 'undefined' ? window.innerHeight / 2 : 500) ? mousePos.y - 180 : mousePos.y + 30,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 via-transparent to-transparent rounded-2xl pointer-events-none" />

            <div className="relative z-10 w-full overflow-hidden">
              <div className="flex justify-between items-start mb-3">
                <div className="text-[10px] md:text-xs font-black text-rose-400 uppercase tracking-widest flex items-center gap-3">
                  <div className="relative flex items-center justify-center">
                    <span className="absolute w-3 h-3 rounded-full bg-rose-400/20 animate-ping" />
                    <span className="relative w-1.5 h-1.5 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,1)]" />
                  </div>
                  {activeSeq.node || `S${(hoveredIdx || 0) + 1}`}
                </div>
              </div>

              <h4 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight mb-3 drop-shadow-md leading-none truncate">
                {activeSeq.name || 'Memory Fragment'}
              </h4>

              <div className="w-full h-px bg-gradient-to-r from-rose-500/50 via-white/10 to-transparent mb-4" />

              <p className="text-sm font-normal text-slate-300 leading-relaxed max-w-full font-sans break-words pb-1">
                <RichText html={activeSeq.description} fallback="Awakens the hidden potential locked within this fractured memory." />
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SkillVideoPlayer = ({ url, start, end, playbackRate = 1 }: { url: string, start?: number, end?: number, playbackRate?: number }) => {
  const playerRef = useRef<any>(null);
  const isYouTube = url && (url.includes('youtube.com') || url.includes('youtu.be'));

  const safeSeekTo = (seconds: number) => {
    try {
      if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
        playerRef.current.seekTo(seconds, 'seconds');
      }
    } catch (e) {
      console.warn("Could not seek video", e);
    }
  };

  const handleProgress = (state: { playedSeconds: number }) => {
    if (end && state.playedSeconds >= end) {
      safeSeekTo(start || 0);
    }
  };

  if (isYouTube) {
    return (
      <div className="w-full h-full relative bg-[#0a0a0c] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-10 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]"></div>
        <div className="w-[140%] h-[140%] absolute pointer-events-none opacity-80 mix-blend-screen scale-110 blur-[1px]">
          <ReactPlayer
            playbackRate={playbackRate}
            url={url}
            playing={true}
            muted={true}
            controls={false}
            loop={!end}
            width="100%"
            height="100%"
            config={{
              youtube: {
                playerVars: {
                  start: start,
                  end: end,
                  disablekb: 1,
                  modestbranding: 1,
                  controls: 0,
                  showinfo: 0,
                  rel: 0,
                  iv_load_policy: 3
                }
              }
            }}
            onReady={() => {
              if (start) safeSeekTo(start);
            }}
          />
        </div>
        <div className="w-[120%] h-[120%] absolute pointer-events-none z-0">
          <ReactPlayer
            ref={playerRef}
            playbackRate={playbackRate}
            url={url}
            playing={true}
            muted={true}
            controls={false}
            loop={!end}
            width="100%"
            height="100%"
            config={{
              youtube: {
                playerVars: {
                  start: start,
                  end: end,
                  disablekb: 1,
                  modestbranding: 1,
                  controls: 0,
                  showinfo: 0,
                  rel: 0,
                  iv_load_policy: 3
                }
              }
            }}
            onProgress={handleProgress}
            onReady={() => {
              if (start) safeSeekTo(start);
            }}
          />
        </div>
        <div className="absolute inset-0 border-[3px] border-rose-500/20 rounded-2xl z-20 pointer-events-none mix-blend-overlay shadow-[inset_0_0_20px_theme('colors.rose.500/20')]"></div>
        <div className="absolute inset-0 z-10 pointer-events-none opacity-10 bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative group">
      <video
        ref={(el) => { if (el) el.playbackRate = playbackRate; }}
        src={url}
        autoPlay
        loop={!end}
        muted
        playsInline
        onTimeUpdate={(e) => {
          if (end && e.currentTarget.currentTime >= end) {
            e.currentTarget.currentTime = start || 0;
            e.currentTarget.play();
          }
        }}
        onLoadedMetadata={(e) => {
          if (start) {
            e.currentTarget.currentTime = start;
          }
        }}
        className="w-full h-full object-cover rounded-2xl brightness-90 relative z-0"
      />
      <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_30px_rgba(0,0,0,0.4)] pointer-events-none z-10"></div>
      <div className="absolute inset-0 border border-slate-500/20 rounded-2xl z-20 pointer-events-none"></div>
    </div>
  );
};

const MechanicVideoFeed = ({ mechanic }: { mechanic: any }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<any>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);

  const startSeconds = mechanic.videoStartTime ? Number(mechanic.videoStartTime) : undefined;
  const endSeconds = mechanic.videoEndTime ? Number(mechanic.videoEndTime) : undefined;
  const isYouTube = mechanic.videoUrl && (mechanic.videoUrl.includes('youtube.com') || mechanic.videoUrl.includes('youtu.be'));

  const safeSeekTo = (seconds: number) => {
    try {
      if (playerRef.current && typeof (playerRef.current as any).seekTo === 'function') {
        (playerRef.current as any).seekTo(seconds, 'seconds');
      }
    } catch (e) {
      console.warn("Could not seek video", e);
    }
  };

  const handleProgress = (state: { playedSeconds: number }) => {
    if (endSeconds && state.playedSeconds >= endSeconds) {
      safeSeekTo(startSeconds || 0);
    }
  };

  if (!mechanic.videoUrl) {
    return mechanic.imageUrl ? (
      <img src={mechanic.imageUrl} alt={mechanic.title} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-700" />
    ) : (
      <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 opacity-50 group-hover:opacity-100 transition-all duration-500">
        <Play size={28} className="mb-2 opacity-50" />
        <span className="text-[10px] font-mono tracking-widest uppercase">No Video Feed</span>
      </div>
    );
  }

  if (isYouTube) {
    return (
      <div
        className="w-full h-full opacity-50 group-hover:opacity-100 transition-opacity duration-500 relative bg-black flex items-center justify-center overflow-hidden"
        onMouseEnter={() => setIsPlaying(true)}
        onMouseLeave={() => { setIsPlaying(false); safeSeekTo(startSeconds || 0); }}
      >
        <div className="absolute inset-0 z-10"></div>
        <div className="w-[140%] h-[140%] absolute pointer-events-none">
          <ReactPlayer
            ref={playerRef}
            url={mechanic.videoUrl}
            playing={isPlaying}
            muted={true}
            controls={false}
            loop={!endSeconds}
            width="100%"
            height="100%"
            config={{
              youtube: {
                playerVars: {
                  start: startSeconds,
                  end: endSeconds,
                  disablekb: 1,
                  modestbranding: 1,
                  controls: 0,
                  showinfo: 0,
                  rel: 0,
                  iv_load_policy: 3
                }
              }
            }}
            onProgress={handleProgress}
            onReady={() => {
              if (startSeconds && !isPlaying) {
                safeSeekTo(startSeconds);
              }
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <video
      src={mechanic.videoUrl}
      loop={!endSeconds}
      muted
      playsInline
      className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity duration-500"
      onMouseOver={(e: any) => {
        const playPromise = e.target.play();
        if (playPromise !== undefined) {
          playPromiseRef.current = playPromise;
          playPromise.catch((_err: any) => { });
        }
      }}
      onMouseOut={(e: any) => {
        const pauseVideo = () => {
          e.target.pause();
          e.target.currentTime = startSeconds || 0;
        };

        if (playPromiseRef.current !== null) {
          playPromiseRef.current.then(() => {
            pauseVideo();
          }).catch(() => {
            pauseVideo();
          });
        } else {
          pauseVideo();
        }
      }}
      onLoadedMetadata={(e: any) => { if (startSeconds) e.target.currentTime = startSeconds; }}
      onTimeUpdate={(e: any) => {
        if (endSeconds && e.target.currentTime >= endSeconds) {
          e.target.currentTime = startSeconds || 0;
          const playPromise = e.target.play();
          if (playPromise !== undefined) {
            playPromise.catch((_err: any) => { });
          }
        }
      }}
    />
  );
};

export default function GuideClient({ guide }: { guide: any }) {
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const [showTrailer, setShowTrailer] = useState(false);
  const [selectedWeaponIdx, setSelectedWeaponIdx] = useState(0);
  const [selectedTeamIdx, setSelectedTeamIdx] = useState(0);
  const [selectedSkillId, setSelectedSkillId] = useState('basicAttack');
  const [isSlowMo, setIsSlowMo] = useState(false);
  const [activeEchoSetIdx, setActiveEchoSetIdx] = useState(0);
  const tabs = ['OVERVIEW', 'SKILLS', 'SEQUENCE', 'WEAPONS', 'TEAMS', 'ECHOES', 'MECHANICS'];
  const content = guide.content || {};

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'WEAPONS') {
      setSelectedWeaponIdx(0);
    }
  };

  const getElementStyles = (element: string) => {
    const el = element?.toLowerCase() || '';
    switch (el) {
      case 'electro': return { color: 'text-purple-500', bg: 'bg-purple-500', icon: <Zap size={18} /> };
      case 'aero': return { color: 'text-emerald-500', bg: 'bg-emerald-500', icon: <Wind size={18} /> };
      case 'fusion': return { color: 'text-red-500', bg: 'bg-red-500', icon: <Flame size={18} /> };
      case 'glacio': return { color: 'text-rose-400', bg: 'bg-rose-400', icon: <Snowflake size={18} /> };
      case 'spectro': return { color: 'text-yellow-500', bg: 'bg-yellow-500', icon: <Sun size={18} /> };
      case 'havoc': return { color: 'text-rose-600', bg: 'bg-rose-600', icon: <Moon size={18} /> };
      default: return { color: 'text-rose-400', bg: 'bg-rose-400', icon: <Crosshair size={18} /> };
    }
  };

  const elementStyle = getElementStyles(guide.element);
  const renderImage = content.foregroundImage || content.images?.transparentRender || content.images?.render || content.images?.avatar || (guide.name.toLowerCase() === 'hiyuki' ? 'https://res.cloudinary.com/ds6dwbk37/image/upload/v1776848040/hiyuki_render__wuthering_waves__by_kabasara_dlr6l4k-fullview_plyuxp.png' : 'https://res.cloudinary.com/ds6dwbk37/image/upload/v1776848040/hiyuki_render__wuthering_waves__by_kabasara_dlr6l4k-fullview_plyuxp.png');

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const bgTextX = useTransform(smoothMouseX, [-1, 1], ['-2%', '2%']);
  const bgTextY = useTransform(smoothMouseY, [-1, 1], ['-2%', '2%']);
  const charX = useTransform(smoothMouseX, [-1, 1], ['2%', '-2%']);
  const charY = useTransform(smoothMouseY, [-1, 1], ['2%', '-2%']);

  const tabVariants: any = {
    hidden: { opacity: 0, x: -60, skewX: -5 },
    visible: {
      opacity: 1, x: 0, skewX: 0,
      transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
    },
    exit: {
      opacity: 0, x: 60, skewX: 5,
      transition: { duration: 0.25, ease: [0.76, 0, 0.24, 1] }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
    const normalizedY = (e.clientY / window.innerHeight) * 2 - 1;
    mouseX.set(normalizedX);
    mouseY.set(normalizedY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const getTrailerUrl = () => {
    let url = content.trailerUrl || content.youtubeVideoId;
    if (!url) return null;
    if (!url.includes('youtube') && !url.includes('youtu.be')) return url;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=0` : url;
  };

  const hasTrailer = !!getTrailerUrl();

  return (
    <main
      className="h-[100dvh] w-full bg-[#f4f4f4] text-gray-900 overflow-hidden font-sans relative flex flex-col selection:bg-slate-800 selection:text-white"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Link href="/?section=characters" className="absolute top-6 left-4 md:left-8 z-50 flex items-center group bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-full px-4 py-2 md:px-5 md:py-2.5 border border-white/10 transition-all duration-300">
        <ChevronLeft size={18} className="text-white group-hover:-translate-x-1 transition-transform duration-300" />
        <span className="ml-1 md:ml-2 text-white font-bold uppercase tracking-widest text-[10px] md:text-xs">RETURN</span>
      </Link>

      <div className={cn(
        "absolute top-6 left-1/2 -translate-x-1/2 w-[85%] md:w-auto max-w-[95%] h-14 md:h-16 bg-black/80 backdrop-blur-2xl rounded-full z-50 flex items-center justify-start md:justify-center px-2 md:px-4 border border-white/10 shadow-2xl overflow-hidden overflow-x-auto no-scrollbar pointer-events-auto transition-all duration-500",
        activeTab === 'SEQUENCE' ? "opacity-20 hover:opacity-100" : "opacity-100"
      )}>
        <div className="flex items-center gap-1 sm:gap-2 no-scrollbar w-full h-full px-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={cn(
                "relative group px-4 py-1.5 md:px-6 md:py-2.5 text-[10px] md:text-sm font-bold tracking-widest transition-all rounded-full flex flex-shrink-0 items-center gap-2 z-10",
                activeTab === tab
                  ? "text-black bg-white shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              )}
            >
              <span>{tab}</span>
              {activeTab === tab && (
                <div className="w-2 h-2 bg-black rounded-full shrink-0 relative flex items-center justify-center ml-1">
                  <span className="absolute w-4 h-4 rounded-full border border-black animate-ping opacity-30" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'OVERVIEW' && (
          <motion.div
            key="overview"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 w-full h-full"
          >
            <div className="absolute inset-0 opacity-[0.15] bg-[radial-gradient(#000_2px,transparent_2px)] bg-[length:32px_32px]" />

            <motion.div
              style={{ x: bgTextX, y: bgTextY }}
              className="absolute top-[8%] left-[-5%] overflow-hidden pointer-events-none w-[150%]"
            >
              <span className="text-[35vw] font-black uppercase tracking-tighter text-transparent stroke-black leading-none break-all opacity-[0.03] [WebkitTextStroke:4px_#000]">
                {guide.name}
              </span>
            </motion.div>

            <div className="absolute top-[20%] left-0 h-[60%] w-12 border-r border-black/10 flex flex-col justify-between items-center py-8 z-10 hidden lg:flex">
              <div className="flex flex-col gap-2 opacity-30">
                <div className="w-1.5 h-1.5 bg-black rounded-full" />
                <div className="w-1.5 h-1.5 bg-black rounded-full" />
                <div className="w-1.5 h-1.5 bg-black rounded-full" />
              </div>
              <span className="text-black/20 font-black tracking-[0.5em] uppercase [writing-mode:vertical-rl] [text-orientation:mixed]">
                WUTHERING WAVES DATA BANK
              </span>
              <div className="text-black/30 font-mono text-xs rotate-[-90deg]">
                V.1.04
              </div>
            </div>

            <motion.div
              initial={{ x: '100%', skewX: -15 }}
              animate={{ x: '5%', skewX: -15 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute top-[-10%] right-[-15%] w-[55%] h-[120%] bg-gradient-to-bl from-slate-900 to-[#0a0a0a] z-0 shadow-[-30px_0_100px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              <div className="absolute inset-0 w-[150%] h-[120%] -top-[10%] -left-[25%] skew-x-[15deg] pointer-events-none">
                <img src={content.images?.splash || content.images?.splashArt || content.cardImage || content.foregroundImage || renderImage} className="absolute inset-0 w-full h-full object-cover object-center mix-blend-overlay opacity-30" alt="" />
              </div>
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
              <div className={cn("absolute inset-y-0 left-0 w-3 opacity-90", elementStyle.bg)} style={{ boxShadow: '0 0 30px currentColor' }} />

              <div className="absolute bottom-[20%] right-[-10%] flex gap-2 opacity-20 rotate-[-15deg]">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    {Array.from({ length: 20 }).map((_, j) => (
                      <div key={j} className="w-4 h-4 border border-white/50" />
                    ))}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              style={{ x: charX, y: charY }}
              className="absolute top-[18%] bottom-[-10%] right-[-5%] lg:right-[0%] w-[100%] lg:w-[70%] pointer-events-none z-20"
            >
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8, type: "spring", stiffness: 40 }}
                className="w-full h-full origin-bottom sm:origin-bottom-right"
              >
                <img
                  src={renderImage}
                  alt={guide.name}
                  style={{
                    transform: `translate(${content.imageOffset?.x || 0}%, ${content.imageOffset?.y || 0}%) scale(${content.imageOffset?.scale || 1})`
                  }}
                  className="w-full h-full object-contain object-bottom drop-shadow-[0_0_60px_rgba(0,0,0,0.5)] lg:object-right-bottom mix-blend-normal"
                />
              </motion.div>
            </motion.div>

            <div className="absolute top-[20%] left-[2%] pointer-events-none opacity-[0.05] z-10 hidden xl:block">
              <svg width="400" height="400" viewBox="0 0 400 400" className="animate-[spin_60s_linear_infinite]">
                <circle cx="200" cy="200" r="180" fill="none" stroke="black" strokeWidth="2" strokeDasharray="10 20" />
                <circle cx="200" cy="200" r="150" fill="none" stroke="black" strokeWidth="1" strokeDasharray="50 100" />
                <circle cx="200" cy="200" r="140" fill="none" stroke="black" strokeWidth="1" />
                <path d="M 20 200 L 380 200" stroke="black" strokeWidth="1" strokeDasharray="5 5" />
                <path d="M 200 20 L 200 380" stroke="black" strokeWidth="1" strokeDasharray="5 5" />
              </svg>
            </div>
            <div className="absolute bottom-[5%] left-[5%] pointer-events-none z-10 hidden md:block">
              <div className="flex gap-1 mb-2">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className={`w-1.5 h-6 ${i % 3 === 0 ? 'bg-black/40' : 'bg-black/10'}`} style={{ height: `${(i * 7 % 20) + 10}px` }} />
                ))}
              </div>
              <p className="font-mono text-[8px] tracking-[0.4em] uppercase text-black/30 mb-2">SYS.SYNC // OK</p>

              <div className="flex items-center gap-4 border-t border-black/10 pt-2 w-64 overflow-hidden [mask-image:linear-gradient(to_right,rgba(0,0,0,1)_80%,transparent_100%)]">
                <div className="whitespace-nowrap animate-[pulse_5s_linear_infinite]">
                  <span className="font-black text-xs uppercase tracking-widest text-black/20">TARGETING PROTOCOL {'//'} {guide.role} {'//'} ENGAGE {'//'} </span>
                </div>
              </div>
            </div>

            <div className="relative z-30 w-full h-full pt-[15vh] pb-12 px-8 lg:px-16 max-w-[95rem] mx-auto pointer-events-none flex flex-col md:flex-row items-center md:items-start justify-start">
              <motion.div
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="flex-1 max-w-xl lg:max-w-2xl xl:max-w-3xl pointer-events-auto"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex flex-col text-[10px] font-mono tracking-[0.3em] text-gray-500 font-bold leading-tight">
                    <span>WUTHERING WAVES ARCHIVES</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="border-l-[3px] border-black pl-2 text-black">FILE: R-004</span>
                    </div>
                  </div>
                </div>

                <h1 className="text-[5rem] lg:text-[7rem] xl:text-[8rem] font-black tracking-tighter text-black leading-[0.85] uppercase mb-4 drop-shadow-sm">
                  {guide.name}
                </h1>

                <div className="flex flex-wrap items-center gap-3 mb-8">
                  <div className={cn("px-5 py-2 font-black text-white text-[11px] tracking-[0.25em] uppercase shadow-md flex items-center gap-2", elementStyle.bg)}>
                    {elementStyle.icon} {guide.element}
                  </div>
                  <div className="px-5 py-2 bg-black text-white font-black text-[11px] tracking-[0.25em] uppercase shadow-md">
                    {guide.role}
                  </div>
                  {hasTrailer && (
                    <button
                      onClick={() => setShowTrailer(true)}
                      className="px-5 py-2 bg-white text-black border-2 border-black font-black text-[11px] tracking-[0.25em] uppercase shadow-[4px_4px_0_0_#000] hover:translate-y-1 hover:shadow-[0_0_0_0_#000] hover:-translate-x-1 transition-all active:bg-gray-100 flex items-center gap-2 group/btn"
                    >
                      <Play size={14} className="fill-black border-none" /> Trailer
                    </button>
                  )}
                </div>

                <div className="relative w-full md:w-[90%] group/desc mb-6">
                  <div className="bg-white/90 backdrop-blur-3xl border border-black/5 group-hover/desc:border-black/20 group-hover/desc:shadow-[0_30px_60px_rgb(0,0,0,0.08)] group-hover/desc:-translate-y-1.5 transition-all duration-500 p-6 md:p-8 rounded-3xl shadow-[0_20px_40px_rgb(0,0,0,0.04)] relative z-10 overflow-hidden cursor-default">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-gray-100 rounded-full blur-3xl -z-10 group-hover/desc:bg-gray-200 transition-colors duration-500" />
                    <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/50 to-transparent group-hover/desc:translate-x-[100%] -translate-x-[100%] transition-transform duration-1000 z-20 pointer-events-none skew-x-[-20deg]" />
                    <p className="text-gray-800 font-bold text-lg leading-relaxed mb-6">
                      <RichText html={content.description} fallback="A powerful resonator specialized in combat." />
                    </p>

                    {content.quote && (
                      <div className="border-l-4 border-gray-900 pl-5 mb-6">
                        <p className="text-gray-500 italic font-medium leading-relaxed">&quot;{content.quote}&quot;</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-6 pt-6 relative group/divider mt-2">
                      <div className="absolute top-0 left-0 w-full h-px bg-black/10" />
                      <div className="absolute top-0 left-1/2 w-0 h-[2px] bg-black group-hover/desc:w-full group-hover/desc:left-0 transition-all duration-700 ease-out" />

                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 mb-1.5 flex items-center gap-1.5"><Target size={12} /> Optimal Echo</h4>
                        <p className="font-bold text-black text-sm">{content.echoes?.mainSet || 'Standard Set'}</p>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 mb-1.5 flex items-center gap-1.5"><Crosshair size={12} /> Stat Priority</h4>
                        <p className="font-bold text-black text-sm">{content.echoes?.statPriority || `${Array.isArray(content.echoes?.cost4) ? content.echoes.cost4.join(' / ') : (content.echoes?.cost4 || 'Crit Rate')} / ${content.echoes?.erRequirement || '120% ER'}`}</p>
                      </div>
                    </div>

                    {/* Skill Upgrade Priority — integrated into card */}
                    {content.skillPriority && content.skillPriority.length > 0 && (
                      <div className="pt-6 mt-2 relative">
                        <div className="absolute top-0 left-0 w-full h-px bg-black/10" />
                        <div className="absolute top-0 left-1/2 w-0 h-[2px] bg-black group-hover/desc:w-full group-hover/desc:left-0 transition-all duration-700 ease-out delay-100" />

                        <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 mb-3 flex items-center gap-1.5">
                          <Activity size={12} /> Skill Upgrade Priority
                        </h4>

                        <div className="flex items-center flex-wrap gap-1.5">
                          {content.skillPriority.map((skill: any, idx: number) => {
                            const p = skill.priority?.toLowerCase();
                            const isHigh = p === 'high';
                            const isMed = p === 'medium';

                            return (
                              <React.Fragment key={idx}>
                                {/* Skill chip */}
                                <div className="group/sp relative">
                                  <div className={cn(
                                    "flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-200 cursor-default",
                                    isHigh
                                      ? "bg-black text-white border-black hover:bg-gray-900 shadow-sm"
                                      : isMed
                                        ? "bg-gray-100 text-black border-black/15 hover:bg-gray-200 hover:border-black/30"
                                        : "bg-white text-gray-500 border-black/8 hover:bg-gray-50 hover:border-black/15"
                                  )}>
                                    <span className={cn(
                                      "text-[9px] font-mono leading-none shrink-0 tabular-nums",
                                      isHigh ? "text-white/40" : "text-black/25"
                                    )}>
                                      {String(idx + 1).padStart(2, '0')}
                                    </span>
                                    <span className="text-[12px] font-bold leading-none whitespace-nowrap">{skill.name}</span>
                                  </div>

                                  {/* Tooltip */}
                                  {skill.reason && (
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-white border border-black/10 rounded-2xl px-4 py-3 shadow-[0_20px_40px_rgb(0,0,0,0.12)] z-50 opacity-0 scale-95 group-hover/sp:opacity-100 group-hover/sp:scale-100 pointer-events-none transition-all duration-200 origin-bottom">
                                      <div className="flex items-center gap-1.5 mb-1.5">
                                        <span className={cn(
                                          "text-[8px] font-black uppercase tracking-[0.2em]",
                                          isHigh ? "text-black" : isMed ? "text-gray-600" : "text-gray-400"
                                        )}>
                                          {isHigh ? '★ MAX PRIORITY' : isMed ? '● HIGH' : '○ NORMAL'}
                                        </span>
                                      </div>
                                      <p className="text-[11px] text-gray-600 font-medium leading-relaxed">{skill.reason}</p>
                                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-white" />
                                    </div>
                                  )}
                                </div>

                                {/* Connector arrow */}
                                {idx < content.skillPriority.length - 1 && (
                                  <span className="text-black/15 text-[10px] font-bold select-none mx-0.5">›</span>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              </motion.div>

              <motion.div
                drag
                dragMomentum={false}
                initial={{ x: content.movablePanel?.x || 30, y: content.movablePanel?.y || 0, opacity: 0 }}
                animate={{ x: content.movablePanel?.x || 0, y: content.movablePanel?.y || 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
                className="hidden xl:flex absolute top-8 right-8 flex-col gap-4 pointer-events-auto z-40 transform-gpu cursor-grab active:cursor-grabbing"
              >
                <div className="bg-white/5 backdrop-blur-2xl border border-white/20 p-6 rounded-[2rem] w-[24rem] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] relative overflow-hidden group/hud">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover/hud:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1 bg-white/20 rounded-full" />

                  <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4 mt-2">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-xl bg-white/10 shadow-inner", elementStyle.color)}>
                        <Target size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-white/50 tracking-widest uppercase mb-0.5">Movable Panel</p>
                        <p className="text-sm font-black font-sans tracking-tight text-white/90">{content.movablePanel?.title || "SYS.DIAGNOSTICS"}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-white/80 tracking-widest bg-white/10 px-2.5 py-1 rounded-md border border-white/10 shadow-inner">v2.0.4</span>
                  </div>

                  <div className="relative z-10">
                    <p className="text-white/80 font-medium text-sm leading-relaxed mb-6">
                      <RichText html={content.movablePanel?.description} fallback={`${guide.name}'s optimal combat efficiency relies on rapid burst sequences and tight rotations. Observe combat flow limits to maximize output.`} />
                    </p>

                    <div className="bg-black/20 rounded-xl p-4 border border-white/5 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold tracking-widest uppercase text-white/50 flex items-center gap-1.5"><Activity size={12} /> Combat Flow</span>
                        <span className="text-[10px] font-bold font-mono text-white/90 bg-white/10 px-2 py-0.5 rounded">{content.movablePanel?.percentage ?? 85}% OPTIMAL</span>
                      </div>
                      <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden shadow-inner">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${content.movablePanel?.percentage ?? 85}%` }}
                          transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
                          className={cn("h-full rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]", elementStyle.bg)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {activeTab === 'SKILLS' && (
          <motion.div
            key="skills"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 pt-28 pb-8 px-4 sm:px-8 max-w-[1500px] mx-auto w-full h-full z-30 flex flex-col"
          >
            <div className="w-full h-full bg-white rounded-3xl border border-slate-200 shadow-[0_20px_60px_rgba(0,0,0,0.08)] flex flex-col lg:flex-row overflow-hidden relative font-sans text-slate-800">
              <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className={cn("absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[140px] opacity-[0.14] mix-blend-multiply transition-colors duration-1000", elementStyle.bg)} />
                <div className={cn("absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[140px] opacity-[0.08] mix-blend-multiply transition-colors duration-1000", elementStyle.bg)} />
                <div className="absolute top-1/2 left-1/4 w-[800px] h-[800px] rounded-full border-[1px] border-slate-200 -translate-y-1/2 rounded-full" />
                <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] rounded-full border-[1px] border-slate-200 -translate-y-1/2 rounded-full" />
              </div>

              <div className="w-full lg:w-[300px] shrink-0 bg-white backdrop-blur-xl border-r border-slate-200 flex flex-col z-20 shadow-[10px_0_30px_-15px_rgba(0,0,0,0.05)] relative">
                <div className="p-6 pb-4 flex items-center gap-4">
                  <div className={cn("w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200 shadow-inner", elementStyle.color)}>
                    <Zap className="w-5 h-5 drop-shadow-[0_0_10px_rgba(currentcolor,0.5)]" fill="currentColor" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-slate-800 tracking-widest uppercase">
                      Combat Kit
                    </h2>
                    <div className={cn("text-[9px] font-bold uppercase tracking-[0.15em] mt-1 opacity-70", elementStyle.color)}>
                      Abilities Overview
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 pb-6 flex flex-col gap-2 scrollbar-none">
                  {[
                    { id: 'basicAttack', label: 'BA', full: 'Basic Attack', icon: <MousePointerClick size={16} strokeWidth={2} /> },
                    { id: 'resonanceSkill', label: 'RS', full: 'Resonance Skill', icon: <Box size={16} strokeWidth={2} /> },
                    { id: 'forteCircuit', label: 'FC', full: 'Forte Circuit', icon: <Layers size={16} strokeWidth={2} /> },
                    { id: 'resonanceLiberation', label: 'RL', full: 'Reson. Lib.', icon: <Asterisk size={16} strokeWidth={2.5} /> },
                    { id: 'introSkill', label: 'IN', full: 'Intro Skill', icon: <LogIn size={16} strokeWidth={2} /> },
                    { id: 'outroSkill', label: 'OUT', full: 'Outro Skill', icon: <LogOut size={16} strokeWidth={2} /> }
                  ].map(skill => {
                    const isActive = selectedSkillId === skill.id;
                    const sData = content.kit?.[skill.id];
                    return (
                      <button
                        key={skill.id}
                        onClick={() => setSelectedSkillId(skill.id)}
                        className={cn(
                          "w-full text-left p-4 rounded-2xl flex items-center gap-4 transition-all duration-300 uppercase tracking-widest text-[11px] font-bold group relative overflow-hidden",
                          isActive
                            ? "bg-slate-100 text-slate-800 shadow-[0_8px_16px_rgba(0,0,0,0.3)] border border-slate-200"
                            : "bg-transparent border border-transparent text-slate-500 hover:bg-white shadow-sm border-slate-200 hover:text-slate-800"
                        )}
                      >
                        {isActive && (
                          <motion.div layoutId="skillActiveSideBg" className={cn("absolute left-0 top-0 bottom-0 w-[3px] shadow-[0_0_10px_currentColor]", elementStyle.bg)} />
                        )}

                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 relative z-10",
                          isActive ? "bg-slate-100 text-slate-800 shadow-inner" : "bg-transparent border border-slate-200 text-slate-500 group-hover:bg-slate-200/50")}>
                          {sData?.icon ? (
                            <img src={sData.icon} alt={skill.full} className={cn("w-5 h-5 object-contain brightness-0 grayscale opacity-80", isActive && "")} />
                          ) : (
                            <span className={cn(isActive && elementStyle.color)}>{skill.icon || skill.label}</span>
                          )}
                        </div>

                        <span className="relative z-10 flex-1">{skill.full}</span>

                        <span className={cn("relative z-10 transition-all duration-300",
                          isActive ? cn("opacity-100 translate-x-0", elementStyle.color) : "opacity-0 -translate-x-2")}>
                          <ChevronRight size={14} />
                        </span>
                      </button>
                    );
                  })}

                  <div className="mt-auto pt-6">
                    <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 relative overflow-hidden">
                      <div className={cn("absolute -top-6 -right-6 w-16 h-16 rounded-full blur-[20px] opacity-20", elementStyle.bg)} />
                      <h4 className={cn("text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mb-3", elementStyle.color)}>
                        <Sparkles size={12} fill="currentColor" /> Quick Tip
                      </h4>
                      <p className="text-xs leading-relaxed text-slate-600 font-medium">
                        {content.kit?.[selectedSkillId]?.quickTip || "Explore different abilities to master " + (guide?.name || "the character") + "'s mechanics."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 lg:p-10 relative flex flex-col z-10 scrollbar-none">

                <div className="max-w-7xl mx-auto w-full flex flex-col xl:flex-row gap-10">
                  <AnimatePresence mode="wait">
                    {(() => {
                      const skillData = content.kit?.[selectedSkillId];
                      if (!skillData || (!skillData.name && !skillData.description && !skillData.video)) return (
                        <motion.div
                          key="empty"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="flex-1 flex flex-col items-center justify-center text-slate-500 font-mono text-xs tracking-[0.2em] uppercase mt-40 text-center"
                        >
                          <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mb-6">
                            <Zap size={24} className="opacity-20" />
                          </div>
                          <div className="text-slate-500 font-bold">Module Offline</div>
                          <div className="text-slate-500 mt-2 text-[10px]">No telemetry available for this module</div>
                        </motion.div>
                      );

                      return (
                        <motion.div
                          key={selectedSkillId}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                          className="flex flex-col xl:flex-row w-full gap-10 lg:items-start"
                        >
                          <div className="flex flex-col flex-1">
                            <div className="mb-8">
                              <div className="flex items-center gap-3 mb-4 opacity-80">
                                <div className={cn("w-3 h-1 rounded-full", elementStyle.bg)} />
                                <span className="font-mono text-[10px] sm:text-[11px] font-bold tracking-[0.25em] uppercase text-slate-500">
                                  {selectedSkillId.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                              </div>

                              <div className="flex items-start gap-5">
                                <div className="shrink-0 w-16 h-16 xl:w-20 xl:h-20 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center shadow-[inset_0_0_10px_rgba(0,0,0,0.02)] relative overflow-hidden group">
                                  <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500", elementStyle.bg)} />
                                  {skillData.icon ? (
                                    <img src={skillData.icon} alt="Skill Icon" className="w-10 h-10 xl:w-12 xl:h-12 object-contain relative z-10 drop-shadow-sm brightness-0 opacity-80" />
                                  ) : (
                                    <div className="text-slate-400 relative z-10 transition-colors duration-500 group-hover:text-slate-600">
                                      {selectedSkillId === 'basicAttack' && <MousePointerClick size={32} strokeWidth={1.5} />}
                                      {selectedSkillId === 'resonanceSkill' && <Box size={32} strokeWidth={1.5} />}
                                      {selectedSkillId === 'forteCircuit' && <Layers size={32} strokeWidth={1.5} />}
                                      {selectedSkillId === 'resonanceLiberation' && <Asterisk size={32} strokeWidth={1.5} />}
                                      {selectedSkillId === 'introSkill' && <LogIn size={32} strokeWidth={1.5} />}
                                      {selectedSkillId === 'outroSkill' && <LogOut size={32} strokeWidth={1.5} />}
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <motion.h4 className="text-4xl sm:text-5xl font-black text-slate-800 tracking-tighter uppercase leading-[1.1] drop-shadow-lg mb-4 text-shadow-sm font-sans flex items-center">
                                    {skillData.name || skillData.title || selectedSkillId}
                                  </motion.h4>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border bg-white shadow-sm border-slate-200 flex items-center gap-1.5 backdrop-blur-md", elementStyle.color.replace("text-", "border-"), elementStyle.color)}>
                                      <Target size={12} /> DMG
                                    </span>
                                    <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border bg-white shadow-sm border-slate-200 flex items-center gap-1.5 backdrop-blur-md", elementStyle.color.replace("text-", "border-"), elementStyle.color)}>
                                      <Zap size={12} /> {guide?.element || 'ICE'}
                                    </span>
                                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-slate-200 bg-white shadow-sm border-slate-200 text-slate-700 backdrop-blur-md">
                                      FORTE ENERGY
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="text-[13px] sm:text-[14px] text-slate-700 leading-[1.9] font-medium whitespace-pre-wrap relative z-10 [text-wrap:pretty] pl-2 xl:pl-4 border-l border-slate-200">
                              {(/<[a-z][\s\S]*>/i.test(skillData.description || '')) ? (
                                <RichText html={skillData.description} />
                              ) : (
                                skillData.description?.split('\n').map((line: string, i: number) => (
                                  <p key={i} className={cn("mb-4", line.startsWith('※') || line.includes('Damage:') ? cn("font-bold text-slate-800", elementStyle.color) : "")}>
                                    {line}
                                  </p>
                                ))
                              )}
                            </div>
                          </div>

                          <div className="w-full xl:w-[50%] shrink-0 flex flex-col gap-6">
                            <div className="flex items-center justify-between px-2">
                              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Play size={12} className={elementStyle.color} fill="currentColor" /> Preview Terminal
                              </h3>
                              <div className="flex items-center gap-1.5">
                                <span className={cn("w-1.5 h-1.5 rounded-full animate-ping", elementStyle.bg)} />
                                <span className="text-[9px] font-mono tracking-widest uppercase text-slate-500">Data Log</span>
                              </div>
                            </div>

                            {skillData.video ? (
                              <div className="relative rounded-3xl overflow-hidden aspect-[16/9] bg-white border border-slate-200 group shadow-[0_20px_40px_-20px_rgba(0,0,0,0.05)]">
                                <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none z-10 mix-blend-multiply shadow-[inset_0_0_30px_rgba(0,0,0,0.1)]", elementStyle.color)} />

                                <div className="w-full h-full relative z-0">
                                  <SkillVideoPlayer
                                    url={skillData.video}
                                    start={skillData.videoStart ? Number(skillData.videoStart) : undefined}
                                    end={skillData.videoEnd ? Number(skillData.videoEnd) : undefined}
                                    playbackRate={isSlowMo ? 0.3 : 1}
                                  />
                                </div>

                                <div className="absolute left-0 bottom-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent z-20 flex items-center justify-between">
                                  <div className="flex gap-2">
                                    <div className={cn("px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase border border-slate-200 flex items-center gap-1.5 bg-white backdrop-blur-xl", elementStyle.color)}>
                                      <Activity size={10} /> Loop
                                    </div>
                                    <button
                                      onClick={() => setIsSlowMo(!isSlowMo)}
                                      className={cn("px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase border text-slate-500 backdrop-blur-xl flex items-center gap-1.5 transition-all outline-none", isSlowMo ? elementStyle.color + " bg-slate-50 border border-slate-200 border-slate-300" : "border-slate-200 bg-white hover:bg-slate-50 border border-slate-200")}
                                    >
                                      <Sparkles size={10} /> Slow Motion
                                    </button>
                                  </div>
                                  {skillData.videoStart && skillData.videoEnd && (
                                    <div className="text-[10px] font-mono tracking-widest text-slate-700 font-bold bg-white px-3 py-1 rounded-full backdrop-blur-xl border border-slate-200">
                                      {skillData.videoStart}s — {skillData.videoEnd}s
                                    </div>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="relative rounded-3xl overflow-hidden aspect-[16/9] bg-slate-50/50 border border-slate-200 flex items-center justify-center flex-col gap-4 text-slate-500 shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]">
                                <Play size={32} className="opacity-20" />
                                <div className="text-xs font-mono tracking-widest uppercase font-bold">No Terminal Data</div>
                              </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 shadow-lg relative overflow-hidden hover:border-slate-200 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all">
                                <div className={cn("absolute -top-10 -right-10 w-24 h-24 rounded-full blur-[30px] opacity-[0.05]", elementStyle.bg)} />
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-4 flex items-center gap-2">
                                  Skill Info
                                </h4>
                                <div className="flex flex-col gap-3">
                                  {(skillData.skillInfo || []).length > 0 ? skillData.skillInfo.map((row: any, i: number) => (
                                    <div key={i} className="flex justify-between items-center text-[11px] font-medium border-b border-slate-200 pb-2 last:border-0 last:pb-0">
                                      <span className="text-slate-500 flex items-center gap-2"><div className="w-1.5 h-1.5 bg-slate-200 rotate-45" /> {typeof (row.label || row.name || row.key || Object.keys(row)[0] || '') === 'object' ? JSON.stringify(row.label || row.name || row.key || Object.keys(row)[0]) : String(row.label || row.name || row.key || Object.keys(row)[0] || '')}</span>
                                      <span className="text-slate-800 uppercase">{typeof (row.value || row.val || Object.values(row)[0] || '') === 'object' ? JSON.stringify(row.value || row.val || Object.values(row)[0]) : String(row.value || row.val || Object.values(row)[0] || '')}</span>
                                    </div>
                                  )) : (
                                    <div className="text-xs text-slate-500 italic">No skill info available.</div>
                                  )}
                                </div>
                              </div>

                              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 shadow-lg relative overflow-hidden hover:border-slate-200 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all">
                                <div className={cn("absolute -top-10 -right-10 w-24 h-24 rounded-full blur-[30px] opacity-[0.05]", elementStyle.bg)} />
                                <div className="flex justify-between items-center mb-4">
                                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-600 flex items-center gap-2">
                                    Level Scaling
                                  </h4>
                                  <span className="text-[9px] font-bold bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-slate-700">Lv. 10</span>
                                </div>
                                <div className="flex flex-col gap-3">
                                  {(skillData.levelScaling || []).length > 0 ? skillData.levelScaling.map((row: any, i: number) => (
                                    <div key={i} className="flex justify-between items-center text-[11px] font-medium border-b border-slate-200 pb-2 last:border-0 last:pb-0">
                                      <span className="text-slate-500 flex items-center gap-2"><div className="w-1.5 h-1.5 bg-slate-200 rotate-45" /> {typeof (row.label || row.name || row.key || Object.keys(row)[0] || '') === 'object' ? JSON.stringify(row.label || row.name || row.key || Object.keys(row)[0]) : String(row.label || row.name || row.key || Object.keys(row)[0] || '')}</span>
                                      <span className="text-slate-800">{typeof (row.value || row.val || Object.values(row)[0] || '') === 'object' ? JSON.stringify(row.value || row.val || Object.values(row)[0]) : String(row.value || row.val || Object.values(row)[0] || '')}</span>
                                    </div>
                                  )) : (
                                    <div className="text-xs text-slate-500 italic">No scaling info available.</div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 shadow-lg hover:border-slate-200 transition-all group">
                              <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-700 transition-colors">
                                Upgrade Priority
                              </h4>
                              <div className="flex items-center gap-3">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Sparkles
                                    key={star}
                                    size={18}
                                    fill="currentColor"
                                    className={cn("transition-all duration-300 scale-100 group-hover:scale-110", star <= (skillData.upgradePriority || 0) ? elementStyle.color + " drop-shadow-[0_0_8px_currentColor]" : "text-slate-700 opacity-50")}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })()}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        {activeTab === 'SEQUENCE' && (
          <motion.div
            key="sequence"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 w-full h-full z-30 pointer-events-none"
          >
            <div className="w-full h-full relative pointer-events-auto flex items-center justify-center">
              <SequenceFracture sequences={content.sequences || []} />
            </div>
          </motion.div>
        )}

                                        {activeTab === 'WEAPONS' && (
          <motion.div
            key="weapons"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 pt-24 pb-6 px-3 sm:px-6 max-w-[1440px] mx-auto w-full h-full z-30"
          >
            <div className="w-full h-full bg-[#f7f4f0] rounded-[2rem] border border-stone-200/80 shadow-[0_30px_80px_-20px_rgba(120,90,60,0.12)] flex overflow-hidden relative font-sans text-stone-800">

              {/* Warm atmospheric background */}
              <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-[700px] h-[700px] bg-amber-100/40 rounded-full blur-[180px] mix-blend-multiply" />
                <div className="absolute bottom-[-20%] left-[-15%] w-[500px] h-[500px] bg-rose-100/30 rounded-full blur-[150px] mix-blend-multiply" />
                <div className="absolute top-[30%] left-[50%] w-[400px] h-[400px] bg-violet-100/20 rounded-full blur-[120px] mix-blend-multiply" />
                <div className="absolute inset-0 opacity-[0.3]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a08060' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
              </div>

              {/* ═══════ Left Sidebar ═══════ */}
              <div className="hidden lg:flex w-[330px] xl:w-[370px] flex-col border-r border-stone-200/60 z-10 relative shrink-0 bg-white/40 backdrop-blur-xl">
                <div className="px-6 pt-8 pb-5 border-b border-stone-200/60">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-stone-100 to-amber-50 flex items-center justify-center border border-stone-200 shadow-sm">
                      <Sword size={18} className="text-amber-700/70" />
                    </div>
                    <div>
                      <h2 className="text-[14px] font-black text-stone-700 uppercase tracking-[0.2em]">Arsenal</h2>
                      <p className="text-[10px] text-stone-400 font-medium tracking-wider mt-0.5">{(content.weapons || []).length} WEAPONS RANKED</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex flex-col gap-2 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-stone-300/50 scrollbar-track-transparent">
                  {(content.weapons || []).map((weapon: any, i: number) => {
                    const isSelected = selectedWeaponIdx === i;
                    const weaponRank = weapon.rank || (weapon.isBis ? 'S+' : (i === 1 ? 'S' : (i === 2 ? 'A' : 'B')));
                    const isSig = weapon.isSignature;
                    const rk: Record<string,{t:string,bg:string,br:string}> = {
                      'S+': {t:'text-amber-700',bg:'from-amber-50 to-orange-50',br:'border-amber-300'},
                      'S':  {t:'text-rose-600',bg:'from-rose-50 to-pink-50',br:'border-rose-300'},
                      'A':  {t:'text-sky-600',bg:'from-sky-50 to-indigo-50',br:'border-sky-300'},
                      'B':  {t:'text-stone-500',bg:'from-stone-50 to-slate-50',br:'border-stone-300'},
                    };
                    const r = rk[weaponRank] || rk['B'];
                    return (
                      <div key={i} onClick={() => setSelectedWeaponIdx(i)}
                        className={cn(
                          "group relative flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all duration-400 border overflow-hidden",
                          isSelected
                            ? `bg-gradient-to-r ${r.bg} ${r.br} shadow-[0_8px_24px_-6px_rgba(160,120,80,0.15)]`
                            : "bg-white/50 border-stone-200/40 hover:bg-white/80 hover:border-stone-200 hover:shadow-[0_4px_16px_-4px_rgba(160,120,80,0.08)]"
                        )}>
                        {isSelected && <div className={cn("absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 rounded-r-full", r.t === 'text-amber-700' ? 'bg-amber-500' : r.t === 'text-rose-600' ? 'bg-rose-500' : r.t === 'text-sky-600' ? 'bg-sky-500' : 'bg-stone-400')} />}

                        {/* Larger weapon thumbnail */}
                        <div className={cn(
                          "w-[82px] h-[82px] rounded-xl flex items-center justify-center relative overflow-hidden shrink-0 transition-all duration-500 border",
                          isSelected ? "border-stone-200 bg-white shadow-md" : "border-stone-100 bg-gradient-to-br from-stone-50 to-white"
                        )}>
                          <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50", isSelected ? r.bg : 'from-stone-50/50 to-transparent')} />
                          {weapon.imageUrl ? (
                            <img src={weapon.imageUrl} alt="" className={cn(
                              "w-[150%] h-[150%] object-contain drop-shadow-[0_4px_12px_rgba(80,50,20,0.2)] transition-all duration-600 -rotate-[25deg]",
                              isSelected ? "opacity-100 scale-[0.6]" : "opacity-50 scale-[0.5] group-hover:opacity-80 group-hover:scale-[0.55]"
                            )} />
                          ) : <Sword size={24} className="text-stone-300" />}
                          {/* Rank corner badge */}
                          <div className={cn("absolute top-0 right-0 px-2 py-0.5 text-[9px] font-black rounded-bl-lg border-l border-b bg-white/90 backdrop-blur-sm shadow-sm", r.t, r.br)}>{weaponRank}</div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 py-1">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            {isSig && <span className="px-1.5 py-0.5 text-[7px] font-black uppercase tracking-widest text-amber-800 bg-amber-100 border border-amber-200 rounded-md leading-none shadow-sm">SIG</span>}
                            {weapon.isBis && !isSig && <span className="px-1.5 py-0.5 text-[7px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md leading-none shadow-sm">BiS</span>}
                          </div>
                          <h3 className={cn("font-bold text-[13px] tracking-wide leading-tight mb-2 truncate transition-colors", isSelected ? "text-stone-800" : "text-stone-400 group-hover:text-stone-700")}>{weapon.name}</h3>
                          <div className="flex items-center">
                            {parseInt(weapon.rarity) === 5 || !weapon.rarity ? (
                              <img src="https://res.cloudinary.com/ds6dwbk37/image/upload/v1775453445/Icon_5_Stars_lczozu.webp" alt="5★" className="h-[11px] w-auto object-contain opacity-70" />
                            ) : parseInt(weapon.rarity) === 4 ? (
                              <img src="https://res.cloudinary.com/ds6dwbk37/image/upload/v1777304405/Icon_4_Stars_vpjpiv.webp" alt="4★" className="h-[11px] w-auto object-contain opacity-70" />
                            ) : (
                              <div className="flex gap-0.5">{[...Array(parseInt(weapon.rarity))].map((_,idx) => <Star key={idx} size={9} className="text-stone-300 fill-stone-200" />)}</div>
                            )}
                          </div>
                        </div>
                        {isSelected && <ChevronRight size={14} className="text-stone-400 shrink-0" />}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Mobile weapon pills */}
              <div className="lg:hidden absolute top-5 left-5 right-14 z-40 flex gap-1.5 overflow-x-auto no-scrollbar">
                {(content.weapons || []).map((weapon: any, i: number) => (
                  <button key={i} onClick={() => setSelectedWeaponIdx(i)} aria-label={`Select ${weapon.name}`}
                    className={cn("shrink-0 px-3 py-1.5 rounded-xl text-[10px] font-bold tracking-wider border transition-all",
                      selectedWeaponIdx === i ? "bg-white text-stone-800 border-stone-300 shadow-md" : "bg-white/40 text-stone-400 border-stone-200/50"
                    )}>{weapon.name?.split(' ').slice(0,2).join(' ')}</button>
                ))}
              </div>

              {/* ═══════ Right Detail Panel ═══════ */}
              <div className="flex-1 relative z-10 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-stone-300/40 scrollbar-track-transparent">
                {content.weapons && content.weapons.length > 0 && (() => {
                  const weapon = content.weapons[selectedWeaponIdx] || content.weapons[0];
                  const isBis = weapon.isBis || selectedWeaponIdx === 0;
                  const rankText = weapon.rank || (isBis ? 'S+' : (selectedWeaponIdx === 1 ? 'S' : (selectedWeaponIdx === 2 ? 'A' : 'B')));
                  const ac: Record<string,{t:string,bg:string,light:string,border:string}> = {
                    'S+': {t:'text-amber-700',bg:'bg-amber-500',light:'bg-amber-100',border:'border-amber-200'},
                    'S':  {t:'text-rose-600',bg:'bg-rose-500',light:'bg-rose-100',border:'border-rose-200'},
                    'A':  {t:'text-sky-600',bg:'bg-sky-500',light:'bg-sky-100',border:'border-sky-200'},
                    'B':  {t:'text-stone-500',bg:'bg-stone-400',light:'bg-stone-100',border:'border-stone-200'},
                  };
                  const a = ac[rankText] || ac['B'];

                  return (
                    <motion.div key={weapon.name} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5,ease:[0.16,1,0.3,1]}} className="relative w-full min-h-full flex flex-col">

                      {/* ── WEAPON SHOWCASE ── */}
                      <div className="relative w-full h-[380px] lg:h-[440px] shrink-0 overflow-hidden flex items-center justify-center bg-gradient-to-b from-white/40 via-[#f7f4f0] to-[#f7f4f0]">
                        {/* Warm glow */}
                        <div className="absolute inset-0 pointer-events-none">
                          <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-[120px] opacity-50 mix-blend-multiply" style={{background:'radial-gradient(circle, rgba(245,215,180,0.6), transparent 65%)'}} />
                          <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 w-[280px] h-[50px] rounded-full blur-[35px] bg-stone-300/25 mix-blend-multiply" />
                          {/* Vertical light beam */}
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-[45%] bg-gradient-to-b from-amber-300/20 to-transparent" />
                        </div>

                        {/* Elegant orbital rings */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-[320px] h-[320px] rounded-full border border-stone-200/30 animate-[spin_80s_linear_infinite]" />
                          <div className="absolute w-[250px] h-[250px] rounded-full border border-dashed border-stone-200/20 animate-[spin_50s_linear_infinite_reverse]" />
                          <div className={cn("absolute w-[180px] h-[180px] rounded-full border opacity-25 animate-[spin_35s_linear_infinite]", a.border)} />
                          <div className="absolute w-[320px] h-[320px] animate-[spin_80s_linear_infinite]">
                            <div className={cn("absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full shadow-sm", a.bg, "opacity-30")} />
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-stone-300/40" />
                          </div>
                        </div>

                        {/* Weapon image */}
                        <div className="relative z-10">
                          {weapon.imageUrl ? (
                            <motion.img
                              initial={{opacity:0,scale:0.8,rotate:(weapon.imageRotate ?? -15)+10}}
                              animate={{opacity:1,scale:1,rotate:weapon.imageRotate ?? -15}}
                              transition={{duration:0.9,ease:"easeOut"}}
                              src={weapon.imageUrl} alt={weapon.name}
                              className="max-w-[320px] lg:max-w-[420px] max-h-[300px] lg:max-h-[370px] object-contain drop-shadow-[0_20px_40px_rgba(80,50,20,0.2)] hover:drop-shadow-[0_25px_50px_rgba(80,50,20,0.3)] transition-[filter] duration-700"
                              style={{transform:`scale(${weapon.imageScale ?? 1}) translate(${weapon.imageX||0}px,${weapon.imageY||0}px)`}}
                            />
                          ) : (
                            <div className="flex flex-col items-center gap-3 opacity-20"><Sword size={72} strokeWidth={0.8} className="text-stone-400" /></div>
                          )}
                        </div>

                        {/* Rank watermark */}
                        <div className="absolute top-6 right-8 lg:top-8 lg:right-12 pointer-events-none">
                          <span className={cn("text-[80px] lg:text-[110px] font-black italic leading-none tracking-tighter opacity-[0.05]", a.t)}>{rankText}</span>
                        </div>

                        {/* Bottom gradient + line */}
                        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#f7f4f0] to-transparent" />
                        <div className="absolute bottom-0 left-10 right-10 lg:left-12 lg:right-12 h-[1px] bg-gradient-to-r from-transparent via-stone-300/50 to-transparent" />
                      </div>

                      {/* ── CONTENT ── */}
                      <div className="relative px-8 lg:px-12 pb-12 pt-6 z-10 flex flex-col gap-6">
                        {/* Badges + Name */}
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            {weapon.isSignature && (
                              <span className="px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-amber-800 bg-gradient-to-r from-amber-100 to-amber-50 border border-amber-200 rounded-lg flex items-center gap-1.5 shadow-sm">
                                <Sparkles size={11} /> SIGNATURE WEAPON
                              </span>
                            )}
                            {weapon.isBis && (
                              <span className="px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-emerald-800 bg-gradient-to-r from-emerald-100 to-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-1.5 shadow-sm">
                                <Star size={11} /> BEST IN SLOT
                              </span>
                            )}
                          </div>
                          <h2 className="font-black text-[36px] lg:text-[46px] text-stone-800 leading-[1.05] tracking-tight mb-4">{weapon.name}</h2>
                          <div className="flex items-center gap-5">
                            <div className="flex items-center gap-2.5 px-4 py-2 bg-white/80 rounded-xl border border-stone-200 shadow-sm">
                              <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-stone-400">Rarity</span>
                              {parseInt(weapon.rarity) === 5 || !weapon.rarity ? (
                                <img src="https://res.cloudinary.com/ds6dwbk37/image/upload/v1775453445/Icon_5_Stars_lczozu.webp" alt="5★" className="h-[14px] w-auto object-contain" />
                              ) : parseInt(weapon.rarity) === 4 ? (
                                <img src="https://res.cloudinary.com/ds6dwbk37/image/upload/v1777304405/Icon_4_Stars_vpjpiv.webp" alt="4★" className="h-[14px] w-auto object-contain" />
                              ) : (
                                [...Array(parseInt(weapon.rarity)||0)].map((_,i) => <Star key={i} size={12} className="text-stone-300 fill-stone-200" />)
                              )}
                            </div>
                            <div className="flex items-center gap-2.5">
                              <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-stone-400">Rank</span>
                              <span className={cn("font-black italic text-[28px] leading-none", a.t)}>{rankText}</span>
                            </div>
                          </div>
                        </div>

                        {/* Stat cards */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="relative bg-white/70 backdrop-blur-md border border-stone-200/80 rounded-2xl p-6 overflow-hidden group/s hover:border-amber-300/60 hover:shadow-[0_8px_24px_-6px_rgba(180,140,60,0.1)] transition-all duration-500">
                            <div className="absolute -top-6 -right-6 w-24 h-24 bg-amber-200/30 rounded-full blur-2xl group-hover/s:bg-amber-200/50 transition-all duration-700 pointer-events-none mix-blend-multiply" />
                            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-amber-400/40 via-amber-300/15 to-transparent scale-x-0 group-hover/s:scale-x-100 origin-left transition-transform duration-500" />
                            <div className="flex items-center gap-2.5 mb-3 relative z-10">
                              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center border border-amber-200/80 shadow-sm"><Crosshair size={15} className="text-amber-600/70" /></div>
                              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Base ATK</span>
                            </div>
                            <span className="text-[34px] font-black text-stone-800 font-mono tracking-tighter leading-none relative z-10">{weapon.baseAtk || '587'}</span>
                          </div>
                          <div className="relative bg-white/70 backdrop-blur-md border border-stone-200/80 rounded-2xl p-6 overflow-hidden group/s hover:border-sky-300/60 hover:shadow-[0_8px_24px_-6px_rgba(60,140,180,0.1)] transition-all duration-500">
                            <div className="absolute -top-6 -right-6 w-24 h-24 bg-sky-200/30 rounded-full blur-2xl group-hover/s:bg-sky-200/50 transition-all duration-700 pointer-events-none mix-blend-multiply" />
                            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-sky-400/40 via-sky-300/15 to-transparent scale-x-0 group-hover/s:scale-x-100 origin-left transition-transform duration-500" />
                            <div className="flex items-center gap-2.5 mb-3 relative z-10">
                              <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center border border-sky-200/80 shadow-sm"><Zap size={15} className="text-sky-600/70" /></div>
                              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 truncate">{weapon.secondaryStat || 'CRIT Rate'}</span>
                            </div>
                            <span className="text-[34px] font-black text-stone-800 font-mono tracking-tighter leading-none relative z-10">{weapon.secondaryStatValue || '24.3%'}</span>
                          </div>
                        </div>

                        {/* Passive */}
                        <div className="relative bg-white/60 backdrop-blur-md border border-stone-200/80 rounded-2xl p-7 overflow-hidden group/p hover:border-stone-300 transition-colors duration-500">
                          <div className="absolute top-0 left-0 w-[3px] h-full bg-gradient-to-b from-amber-400/40 via-amber-300/20 to-transparent rounded-r-full" />
                          <div className="absolute top-0 left-0 w-[3px] h-0 group-hover/p:h-full bg-gradient-to-b from-amber-500 via-amber-400/60 to-amber-300/20 rounded-r-full transition-all duration-700 shadow-[2px_0_12px_rgba(245,158,11,0.2)]" />
                          <div className="flex items-center gap-2.5 mb-4 pl-4">
                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-700/60">Weapon Passive</span>
                            {weapon.passiveName && <><span className="text-stone-300">·</span><span className="text-[11px] font-medium text-stone-400 italic">{weapon.passiveName}</span></>}
                          </div>
                          <p className="text-[14px] text-stone-600 leading-[1.85] font-medium whitespace-pre-wrap pl-4">
                            <RichText html={weapon.passiveDescription || weapon.description} />
                          </p>
                        </div>

                        {/* Reasoning */}
                        {weapon.reasoning && (
                          <div className="relative bg-gradient-to-br from-amber-50/80 via-white/50 to-transparent border border-amber-200/50 rounded-2xl p-7 overflow-hidden">
                            <div className="absolute top-4 right-4 opacity-[0.04]"><Info size={80} className="text-amber-700" /></div>
                            <div className="flex items-center gap-2.5 mb-4">
                              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center border border-amber-200/80 shadow-sm"><Info size={15} className="text-amber-600/70" /></div>
                              <span className="font-black text-amber-700/60 uppercase tracking-[0.2em] text-[11px]">Why This Weapon?</span>
                            </div>
                            <p className="text-[14px] text-stone-500 font-medium leading-[1.85] pl-10 border-l-2 border-amber-200/50">
                              <RichText html={weapon.reasoning} />
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })()}
              </div>

              {/* Close */}
              <button onClick={() => setActiveTab('OVERVIEW')} aria-label="Back to Overview" className="absolute top-5 right-5 text-stone-400 hover:text-stone-600 bg-white/60 hover:bg-white p-2.5 rounded-xl border border-stone-200 transition-all z-40 shadow-sm"><X size={16} /></button>
            </div>
          </motion.div>
        )}

        {activeTab === 'ECHOES' && (
          <motion.div
            key="echoes"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 pt-24 pb-8 px-4 sm:px-8 max-w-[1400px] mx-auto w-full h-full z-30"
          >
            {(() => {
              const echoSets = (content.echoSets && content.echoSets.length > 0)
                ? content.echoSets
                : (content.echoes ? [content.echoes] : []);

              if (echoSets.length === 0) {
                return (
                  <div className="w-full h-full bg-[#fdfafb] rounded-[2rem] border border-rose-100 shadow-2xl flex flex-col items-center justify-center font-sans text-slate-800">
                    <Radar className="w-12 h-12 text-slate-300 mb-4" strokeWidth={1.5} />
                    <h2 className="text-xl font-bold text-slate-500">No Echo Data Available</h2>
                  </div>
                );
              }

              const activeSet = echoSets[activeEchoSetIdx] || echoSets[0];
              const patternString = activeSet.pattern || "4-3-3-1-1";
              const pattern = patternString.split('-').map(Number);
              const totalCost = pattern.reduce((a: any, b: any) => a + b, 0);
              const limitCost = 12;

              const values4 = Array.isArray(activeSet.cost4) ? activeSet.cost4 : (activeSet.cost4 ? [activeSet.cost4] : []);
              const values3 = Array.isArray(activeSet.cost3) ? activeSet.cost3 : (activeSet.cost3 ? [activeSet.cost3] : []);
              const values1 = Array.isArray(activeSet.cost1) ? activeSet.cost1 : (activeSet.cost1 ? [activeSet.cost1] : []);

              return (
                <div className="w-full h-full bg-[#f8f9fa] rounded-[2rem] border border-slate-200 shadow-2xl flex flex-col xl:flex-row overflow-hidden relative font-sans text-slate-800">
                  <div className={cn("absolute top-[-10%] right-[-5%] w-[800px] h-[800px] rounded-full blur-[120px] opacity-20 pointer-events-none mix-blend-multiply transition-colors duration-1000", elementStyle.bg)} />
                  <div className={cn("absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[100px] opacity-20 pointer-events-none -translate-x-1/4 translate-y-1/4 mix-blend-multiply transition-colors duration-1000", elementStyle.bg)} />

                  <div className="w-full xl:w-[60%] border-b xl:border-b-0 xl:border-r border-slate-200/50 p-8 flex flex-col relative z-10 backdrop-blur-3xl overflow-hidden">
                    <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-800 drop-shadow-sm flex items-center gap-4">
                      <div className={cn("p-2.5 rounded-xl bg-slate-50 border shadow-sm", elementStyle.color.replace("text-", "border-"))}>
                        <Fingerprint className={elementStyle.color} strokeWidth={2} size={24} />
                      </div>
                      Echo Loadout
                      <span className={cn("text-[10px] sm:text-xs font-mono font-black tracking-[0.2em] px-4 py-1.5 rounded-full border bg-white/40 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.05)] ml-auto flex items-center gap-2", elementStyle.color, elementStyle.color.replace("text-", "border-"))}>
                        <span className={cn("w-2 h-2 rounded-full animate-pulse", elementStyle.bg)}></span>
                        COST {totalCost}/{limitCost}
                      </span>
                    </h2>

                    <div className="flex-1 min-h-[450px] xl:min-h-0 relative flex items-center justify-center mt-8 [perspective:1000px]">
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="absolute w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.8)_0%,rgba(255,255,255,0)_70%)]" />
                        <div className="w-[320px] sm:w-[480px] h-[320px] sm:h-[480px] rounded-full border-[1px] border-slate-200 absolute animate-[spin_100s_linear_infinite]" />
                        <div className="w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] rounded-full border-[2px] border-slate-200/60 border-dashed absolute animate-[spin_60s_linear_infinite]" />
                        <div className={cn("w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] rounded-full border absolute animate-[spin_40s_linear_infinite_reverse] opacity-30", elementStyle.color.replace("text-", "border-"))} />
                        <div className="w-[100px] sm:w-[150px] h-[100px] sm:h-[150px] rounded-full border-[1px] border-slate-200 absolute opacity-50" />

                        {pattern.map((cost: any, i: any) => {
                          const angle = i * (360 / pattern.length);
                          return (
                            <div key={i} className="absolute origin-bottom -translate-y-1/2 flex flex-col items-center" style={{ height: '300px', transform: `translateY(-50%) rotate(${angle}deg)` }}>
                              <div className={cn("w-[2px] h-full bg-gradient-to-t from-transparent", i === 0 ? `${elementStyle.bg} to-white opacity-80` : "via-slate-200 to-transparent opacity-40")} />
                            </div>
                          )
                        })}
                      </div>

                      {pattern.map((cost: any, idx: any) => {
                        const angle = idx * (360 / pattern.length);
                        const rad = (angle - 90) * (Math.PI / 180);
                        const radius = 100;
                        const smRadius = 160;

                        let nodeSizeClass = "w-14 h-14 sm:w-20 sm:h-20 rounded-2xl";
                        let iconSizeClass = "text-sm sm:text-base";
                        let lblClass = "text-[8px] sm:text-[9px]";
                        if (cost === 4) {
                          nodeSizeClass = "w-24 h-24 sm:w-32 sm:h-32 rounded-3xl border-2";
                          iconSizeClass = "text-xl sm:text-3xl";
                          lblClass = "text-[10px] sm:text-xs uppercase font-black";
                        } else if (cost === 3) {
                          nodeSizeClass = "w-16 h-16 sm:w-24 sm:h-24 rounded-2xl";
                          iconSizeClass = "text-base sm:text-lg";
                          lblClass = "text-[9px] sm:text-[10px]";
                        }

                        const renderNodeLabel = () => {
                          if (cost === 4) return values4.length > 0 ? values4[0]?.split(' ')[0] : '?';
                          if (cost === 3) return values3[0] || '?';
                          if (cost === 1) return values1[0] || '?';
                          return '?';
                        };

                        const NodeInner = ({ isSmall }: { isSmall: boolean }) => (
                          <>
                            <div className={cn(
                              "bg-white/70 backdrop-blur-md shadow-[0_8px_32px_rgba(30,41,59,0.08)] flex flex-col items-center justify-center border z-20 group transition-all duration-300 hover:scale-110 hover:shadow-[0_16px_48px_rgba(30,41,59,0.12)] hover:bg-white relative overflow-hidden",
                              nodeSizeClass,
                              cost === 4 ? `${elementStyle.color.replace("text-", "border-")} shadow-${elementStyle.color}/10` : "border-white/60"
                            )}>
                              <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent pointer-events-none rounded-[inherit]" />

                              <span className={cn("font-black text-slate-800 text-center leading-tight relative z-10 px-2 drop-shadow-sm", iconSizeClass, cost === 4 ? elementStyle.color : "")}>
                                {renderNodeLabel()}
                              </span>
                              <span className={cn("font-mono font-bold mt-1 tracking-widest relative z-10", lblClass, cost === 4 ? elementStyle.color : "text-slate-400")}>
                                Cost {cost}
                              </span>
                            </div>

                            {cost === 4 && (
                              <div className={cn(
                                "mt-4 break-words text-center font-bold px-4 py-1.5 rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.06)] backdrop-blur-md border drop-shadow-sm absolute top-full z-30 transition-all group-hover:-translate-y-1",
                                isSmall ? "text-[10px] w-28" : "text-xs w-40",
                                "bg-white/80 border-white/50 text-slate-700"
                              )}>
                                {activeSet.cost4Name || 'Overlord'}
                              </div>
                            )}
                          </>
                        );

                        return (
                          <div key={idx} className="absolute flex flex-col items-center z-20" style={{ left: `calc(50% + ${Math.cos(rad) * radius}px)`, top: `calc(50% + ${Math.sin(rad) * radius}px)` }}>
                            <div className="hidden sm:flex absolute flex-col items-center group" style={{ left: `calc(50% + ${Math.cos(rad) * smRadius}px)`, top: `calc(50% + ${Math.sin(rad) * smRadius}px)`, transform: 'translate(-50%, -50%)' }}>
                              <NodeInner isSmall={false} />
                            </div>
                            <div className="flex sm:hidden absolute flex-col items-center group" style={{ transform: 'translate(-50%, -50%)' }}>
                              <NodeInner isSmall={true} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="w-full xl:w-[40%] bg-white/40 p-6 lg:p-8 relative z-10 flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent border-l border-white/60">

                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                      <AudioWaveform size={14} className={elementStyle.color} strokeWidth={2.5} /> Recommended Sets
                    </h3>

                    {activeSet.cost4Description && (
                      <div className={cn("mb-6 p-4 rounded-2xl border bg-white/60 backdrop-blur-sm shadow-sm", elementStyle.color.replace("text-", "border-"))}>
                        <h4 className={cn("text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2", elementStyle.color)}>
                          <Dna size={12} strokeWidth={2.5} /> Cost 4 Skill Effect
                        </h4>
                        <p className="text-sm font-medium text-slate-600 leading-relaxed whitespace-pre-wrap">
                          <RichText html={activeSet.cost4Description} />
                        </p>
                      </div>
                    )}

                    <div className="flex flex-col gap-3 mb-8">
                      {echoSets.map((set: any, idx: number) => (
                        <div
                          key={idx}
                          onClick={() => setActiveEchoSetIdx(idx)}
                          className={cn(
                            "rounded-2xl p-4 border transition-all cursor-pointer shadow-sm relative overflow-hidden group",
                            activeEchoSetIdx === idx
                              ? `bg-white ${elementStyle.color.replace("text-", "border-")} ring-2 ring-inset ${elementStyle.color.replace("text-", "ring-") || 'ring-indigo-100'} shadow-md`
                              : "bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-white"
                          )}
                        >
                          {activeEchoSetIdx === idx && (
                            <div className={cn("absolute right-0 top-0 bottom-0 w-2", elementStyle.bg)} />
                          )}
                          <div className="flex justify-between items-start mb-2 pr-4">
                            <h4 className="font-black text-slate-800 tracking-tight text-lg leading-none">{set.name || set.mainSet || 'Standard Set'}</h4>
                            {idx === 0 && (
                              <span className={cn("text-[8px] uppercase tracking-widest font-black px-2 py-0.5 rounded text-white shadow-sm", elementStyle.bg)}>
                                Best Overall
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-medium text-slate-500">
                            <span className={cn("font-bold", elementStyle.color)}>5-Piece:</span> <RichText html={set.mainSetDescription} />
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto">
                      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-2 flex items-center gap-1.5"><ListFilter size={12} /> Main Stat Priority</h4>
                        <ul className="flex flex-col gap-3 flex-1">
                          <li className="flex items-center gap-2">
                            <span className={cn("w-4 h-4 rounded px-[0.2rem] py-0.5 text-[8px] font-black text-white flex items-center justify-center", elementStyle.bg)}>4</span>
                            <span className="text-xs font-bold text-slate-700 leading-tight">{values4.join(' / ')}</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-4 h-4 bg-slate-200 rounded px-[0.2rem] py-0.5 text-[8px] font-black text-slate-600 flex items-center justify-center">3</span>
                            <span className="text-xs font-bold text-slate-700 leading-tight">{values3.join(' / ')}</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-4 h-4 bg-slate-200 rounded px-[0.2rem] py-0.5 text-[8px] font-black text-slate-600 flex items-center justify-center">1</span>
                            <span className="text-xs font-bold text-slate-700 leading-tight">{values1.join(' / ')}</span>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-2 flex items-center gap-1.5"><PieChart size={12} /> Sub Stat Priority</h4>
                        <ul className="flex flex-col gap-2">
                          {(activeSet.substats || activeSet.subStats || []).length > 0 ? (
                            (activeSet.substats || activeSet.subStats).map((st: any, i: number) => (
                              <li key={i} className="flex items-start gap-2">
                                <Focus size={12} className={cn("shrink-0 mt-0.5", i < 2 ? elementStyle.color : "text-slate-400")} />
                                <span className={cn("text-xs leading-tight font-medium", i < 2 ? "text-slate-800 font-bold" : "text-slate-600")}>{st.stat || st.name}</span>
                              </li>
                            ))
                          ) : (
                            <li className="text-xs text-slate-500 italic">No substats provided.</li>
                          )}
                        </ul>
                        {activeSet.erRequirement && (
                          <div className="mt-auto pt-3 flex items-center gap-2 border-t border-slate-100">
                            <Activity size={12} className="text-amber-500 shrink-0" />
                            <span className="text-[10px] font-bold text-slate-600 leading-tight">{activeSet.erRequirement}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            <button onClick={() => setActiveTab('OVERVIEW')} aria-label="Back to Overview" className="absolute top-6 right-8 text-slate-400 hover:text-slate-700 bg-white/50 hover:bg-white p-3 rounded-full backdrop-blur-md border border-slate-200 transition-all z-40 shadow-sm">
              <X size={24} />
            </button>
          </motion.div>
        )}

        {activeTab === 'TEAMS' && (
          <motion.div
            key="teams"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 pt-28 pb-8 px-4 sm:px-8 max-w-[1400px] mx-auto w-full h-full z-30"
          >
            <div className="w-full h-full bg-[#faf8f5] rounded-[2rem] border border-slate-200/60 shadow-2xl flex overflow-hidden relative font-sans text-slate-800">
              <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-100/60 rounded-full blur-[100px] opacity-70 translate-x-1/3 -translate-y-1/4 mix-blend-multiply" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-100/60 rounded-full blur-[100px] opacity-70 -translate-x-1/4 translate-y-1/4 mix-blend-multiply" />
              </div>

              <div className="hidden lg:flex w-[35%] flex-col bg-white/40 backdrop-blur-2xl border-r border-slate-200/60 z-10 p-6 sm:p-8 relative shadow-[10px_0_30px_-15px_rgba(0,0,0,0.05)]">
                <div className="flex items-center gap-3 mb-8 ml-1">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-200">
                    <Users className="text-emerald-600" size={16} />
                  </div>
                  <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest drop-shadow-sm">
                    Team Compositions
                  </h2>
                </div>
                <div className="flex-1 flex flex-col space-y-4 pb-6 pr-2 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-200 scrollbar-track-transparent">
                  {(content.teams || []).map((team: any, i: number) => {
                    const isSelected = selectedTeamIdx === i;
                    const isOptimal = team.isOptimal || team.name.toLowerCase().includes('optimal') || team.name.toLowerCase().includes('premium');

                    return (
                      <div
                        key={i}
                        onClick={() => setSelectedTeamIdx(i)}
                        className={`group relative h-[100px] rounded-2xl flex flex-col justify-center transition-all duration-500 cursor-pointer overflow-hidden border p-4 gap-2 ${isSelected
                          ? 'border-emerald-300 bg-white shadow-[0_10px_25px_-5px_rgba(16,185,129,0.15)] scale-[1.02] z-10'
                          : 'border-slate-200/50 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-sm hover:-translate-y-0.5'
                          }`}
                      >
                        {isSelected && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1/2 rounded-r-md bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                        )}

                        {isOptimal && (
                          <div className={`absolute top-0 right-0 px-2 py-0.5 rounded-bl-lg border-b border-l flex items-center gap-1 z-20 ${isSelected ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-100 border-slate-200'}`}>
                            <Star size={8} className={isSelected ? 'fill-emerald-500 text-emerald-500' : 'fill-slate-400 text-slate-400'} />
                            <span className={`text-[8px] font-black uppercase tracking-wider ${isSelected ? 'text-emerald-700' : 'text-slate-500'}`}>Optimal</span>
                          </div>
                        )}

                        <div className="relative z-20 pl-2">
                          <h3 className={`font-bold text-sm tracking-wide leading-tight truncate ${isSelected ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-900 transition-colors'}`}>{team.name}</h3>
                          <p className={`text-[10px] uppercase tracking-widest mt-1 truncate ${isSelected ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>{team.version || 'General Composition'}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex-1 relative z-10 p-8 lg:p-12 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent flex flex-col pt-10 pb-24">
                {content.teams && content.teams.length > 0 && (
                  (() => {
                    const team = content.teams[selectedTeamIdx] || content.teams[0];
                    const isOptimal = team.isOptimal || team.name.toLowerCase().includes('optimal') || team.name.toLowerCase().includes('premium');

                    return (
                      <motion.div
                        key={selectedTeamIdx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col min-h-full relative w-full pb-24"
                      >
                        <div className="mb-10">
                          <div className="flex flex-wrap gap-2 mb-4">
                            {isOptimal && (
                              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded border border-emerald-200 flex items-center gap-1.5 shadow-sm">
                                <Star size={12} className="fill-emerald-600 text-emerald-600" /> OPTIMAL TEAM
                              </span>
                            )}
                          </div>
                          <h2 className="font-sans font-black text-[38px] lg:text-[46px] text-slate-900 leading-[1.1] mb-2 tracking-tight drop-shadow-sm">{team.name}</h2>
                          <p className="text-emerald-600 font-mono text-sm tracking-widest uppercase font-bold">{team.version || 'Current Meta'}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 w-full xl:w-[90%] shrink-0">
                          {team.characters?.map((char: any, idx: number) => (
                            <div key={idx} className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden group hover:border-emerald-200 hover:shadow-xl transition-all duration-300 shadow-sm">
                              <div className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center bg-slate-50/50 rounded-bl-xl border-l border-b border-slate-100">
                                <span className="text-[10px] font-mono text-slate-400 font-bold">0{idx + 1}</span>
                              </div>

                              <div className="w-24 h-24 sm:w-32 sm:h-32 mb-4 relative z-10 shrink-0">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-emerald-100 to-transparent p-[3px]">
                                  <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center shadow-inner">
                                    {char.imageUrl || char.image ? (
                                      <img src={char.imageUrl || char.image} alt={char.name} className="w-full h-[120%] object-cover object-top group-hover:scale-110 transition-transform duration-700 mix-blend-normal" />
                                    ) : (
                                      <Users size={32} className="text-slate-300" />
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="text-center relative z-10 w-full">
                                <h3 className="font-black text-xl text-slate-800 tracking-wide truncate">{char.name}</h3>
                                <p className="text-xs uppercase tracking-[0.2em] text-emerald-600 mt-2 font-bold truncate">{char.role}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {team.description && (
                          <div className="z-10 w-full xl:w-[90%] bg-white/70 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xl relative overflow-hidden shrink-0">
                            <div className="absolute left-0 top-0 w-1.5 h-full bg-gradient-to-b from-emerald-400 to-teal-500" />
                            <div className="flex items-center gap-2 mb-4">
                              <Activity size={18} className="text-emerald-600" />
                              <span className="font-black text-emerald-700 uppercase tracking-widest text-xs">Synergy Analysis</span>
                            </div>
                            <p className="text-sm md:text-base text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">
                              <RichText html={team.description} />
                            </p>
                          </div>
                        )}
                      </motion.div>
                    );
                  })()
                )}
              </div>

              <button onClick={() => setActiveTab('OVERVIEW')} aria-label="Back to Overview" className="absolute top-6 right-8 text-slate-400 hover:text-slate-700 bg-white/50 hover:bg-white p-3 rounded-full backdrop-blur-md border border-slate-200 transition-all z-40 shadow-sm">
                <X size={24} />
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === 'MECHANICS' && (
          <motion.div
            key="mechanics"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 pt-28 pb-8 px-4 sm:px-8 max-w-7xl mx-auto w-full h-full"
          >
            <div className="h-full bg-white rounded-[2rem] p-6 sm:p-10 shadow-2xl border border-slate-100/50 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent relative group/mech-container">
              <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-100">
                <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter flex items-center gap-4 text-slate-800">
                  <div className={`p-3 rounded-2xl bg-slate-50 border border-slate-100/80 shadow-sm ${elementStyle.color}`}>
                    <Workflow strokeWidth={2.5} size={28} />
                  </div>
                  MECHANICS
                </h2>

                <button
                  onClick={() => setActiveTab('OVERVIEW')}
                  aria-label="Back to Overview"
                  className="text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 p-3 rounded-full border border-slate-200/60 transition-all shadow-sm"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-8 relative z-0">
                {content.combatMechanics?.map((mech: any, i: number) => {
                  const mType = (mech.type || '').toLowerCase();
                  const Icon = mType === 'combo' ? Swords : mType === 'utility' ? Zap : mType === 'core' ? Hexagon : Target;

                  return (
                    <div key={i} className="bg-white border text-left border-slate-100 p-6 sm:p-8 rounded-[1.5rem] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-500 group overflow-hidden relative flex flex-col lg:flex-row gap-8 items-start">
                      <div className={`absolute left-0 top-0 w-1.5 h-full ${elementStyle.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-l-[1.5rem]`} />

                      <div className="flex-1 w-full space-y-5 relative z-10">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 group-hover:${elementStyle.bg} group-hover:border-transparent group-hover:text-white text-slate-400 flex items-center justify-center transition-all duration-500 shadow-sm`}>
                            <Icon size={22} strokeWidth={2.5} />
                          </div>
                          <div>
                            <p className={`text-[10px] uppercase tracking-[0.2em] font-bold mb-1 ${elementStyle.color}`}>{mech.type || "CORE MECHANIC"}</p>
                            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-800 group-hover:text-slate-900 transition-colors">{mech.title}</h3>
                          </div>
                        </div>

                        <p className="text-slate-500 leading-relaxed text-sm sm:text-base max-w-2xl whitespace-pre-wrap pl-1 sm:pl-0">
                          <RichText html={mech.description} />
                        </p>
                      </div>

                      <div className={`w-full lg:w-[400px] overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 shrink-0 relative transition-all duration-700 h-[220px] lg:h-[160px] lg:group-hover:h-[240px] flex items-center justify-center group-hover:shadow-2xl group-hover:ring-4 ${elementStyle.color.replace('text-', 'ring-').replace('500', '500/20')}`}>
                        <MechanicVideoFeed mechanic={mech} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      <AnimatePresence>
        {showTrailer && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 sm:p-8 md:p-12"
            onClick={() => setShowTrailer(false)}
          >
            <div
              className="relative w-full max-w-6xl aspect-video bg-black rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1),inset_0_0_0_1px_rgba(255,255,255,0.1)]"
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute top-4 right-4 z-10 flex items-center gap-4">
                <div className="px-4 py-1.5 bg-black/50 backdrop-blur-md rounded-full border border-white/10 text-white/50 text-xs font-bold uppercase tracking-widest">
                  CLASSIFIED TRAILER RECORD
                </div>
                <button
                  onClick={() => setShowTrailer(false)}
                  aria-label="Close Trailer"
                  className="w-10 h-10 bg-white/10 hover:bg-white text-white hover:text-black rounded-full flex items-center justify-center transition-colors border border-white/20 hover:scale-105 active:scale-95"
                >
                  ×
                </button>
              </div>
              {hasTrailer ? (
                <iframe
                  src={getTrailerUrl()!}
                  title="Resonator Trailer"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white/50">
                  <div className="w-24 h-24 mb-6 rounded-full border border-white/10 flex items-center justify-center relative">
                    <span className="absolute w-full h-full border border-white/20 rounded-full animate-ping" />
                    <Play className="opacity-50" size={32} />
                  </div>
                  <p className="font-mono text-sm tracking-[0.3em] uppercase">No visual record found</p>
                  <p className="font-sans text-xs text-white/30 mt-2 max-w-xs text-center leading-relaxed">The trailer video for this resonator hasn&apos;t been uploaded to the archives yet.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
