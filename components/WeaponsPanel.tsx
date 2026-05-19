"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Image from "next/image";

export type Weapon = {
  id: string;
  name: string;
  type: string;
  rank: "S+" | "S" | "A" | "B";
  rarity: number;
  baseAtk: number;
  secondaryStatName: string;
  secondaryStatValue: string;
  passiveName: string;
  passive: string;
  reasoning: string;
  tagline: string;
  imageUrl?: string;
  isSignature?: boolean;
  isBis?: boolean;
};

const tierStyles: Record<Weapon["rank"], { chip: string; text: string; glow: string }> = {
  "S+": { chip: "bg-weapons-primary text-weapons-primary-foreground", text: "text-weapons-primary", glow: "var(--color-weapons-blood)" },
  S:   { chip: "bg-weapons-accent text-weapons-accent-foreground",   text: "text-weapons-accent",  glow: "var(--color-weapons-ember)" },
  A:   { chip: "bg-weapons-bone text-weapons-ink",                   text: "text-weapons-bone",    glow: "var(--color-weapons-bone)" },
  B:   { chip: "bg-weapons-muted text-weapons-muted-foreground",     text: "text-weapons-muted-foreground", glow: "oklch(0.5 0 0)" },
};

// Animated number counter
function useCountUp(target: number, duration = 600) {
  const [val, setVal] = useState(target);
  const fromRef = useRef(target);
  useEffect(() => {
    const from = fromRef.current;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(from + (target - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

export function WeaponsPanel({ weapons, fallbackImage = "" }: { weapons: Weapon[], fallbackImage?: string }) {
  const [activeId, setActiveId] = useState<string>(weapons[0]?.id || "");
  const [hoverId, setHoverId] = useState<string | null>(null);

  if (!weapons || weapons.length === 0) {
    return <div className="p-8 text-center text-white">No weapons data available.</div>;
  }

  const active = weapons.find((w) => w.id === activeId) || weapons[0];
  const previewed = weapons.find((w) => w.id === (hoverId ?? activeId)) || weapons[0];
  const tier = tierStyles[previewed.rank] || tierStyles["B"];

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const idx = weapons.findIndex((w) => w.id === activeId);
      if (idx === -1) return;
      
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        setActiveId(weapons[(idx + 1) % weapons.length].id);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        setActiveId(weapons[(idx - 1 + weapons.length) % weapons.length].id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeId, weapons]);

  return (
    <div className="weapons-scope min-h-screen bg-weapons-background text-weapons-foreground font-sans selection:bg-weapons-primary/40 selection:text-weapons-bone">
      {/* Top punk marquee */}
      <div className="border-y border-weapons-primary/40 bg-weapons-primary/10 overflow-hidden" aria-hidden="true">
        <div className="flex animate-[marquee_28s_linear_infinite] whitespace-nowrap py-2 font-display text-sm tracking-[0.3em] uppercase text-weapons-primary [animation-play-state:running] hover:[animation-play-state:paused]">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex shrink-0 gap-8 pr-8">
              {["Arsenal v4.1", "★ Tier List Updated", "Patch 2.4 Live", "Best in Slot", "Meta Report",
                "Crit DMG Optimized", "Echo Resonance", "★ S+ Class"].map((t) => (
                <span key={t} className="flex items-center gap-3">
                  <span className="size-1.5 rounded-full bg-weapons-primary inline-block" />
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1500px] px-6 py-10 lg:py-14 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
        {/* SIDEBAR */}
        <aside className="flex flex-col gap-4" aria-labelledby="arsenal-heading">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-weapons-primary">// Arsenal</p>
              <h2 id="arsenal-heading" className="font-display text-3xl tracking-tight uppercase mt-1">
                Weapons<span className="text-weapons-primary" aria-hidden="true">.</span>
              </h2>
            </div>
            <span className="font-mono text-xs text-weapons-muted-foreground">
              <kbd className="px-1.5 py-0.5 border border-weapons-border mr-1">↑↓</kbd>
              {weapons.length} ranked
            </span>
          </div>

          <ul
            className="flex flex-col gap-3"
            role="listbox"
            aria-label="Ranked weapons. Use arrow keys to cycle, Enter to select."
            aria-activedescendant={`weapon-${activeId}`}
            onMouseLeave={() => setHoverId(null)}
          >
            {weapons.map((w) => {
              const isActive = w.id === activeId;
              const isHover = w.id === hoverId;
              const t = tierStyles[w.rank] || tierStyles["B"];
              return (
                <li key={w.id} role="presentation">
                  <button
                    id={`weapon-${w.id}`}
                    type="button"
                    role="option"
                    aria-selected={!!(isActive)}
                    aria-label={`${w.name}, ${w.type}, rank ${w.rank}, rarity ${w.rarity} of 5${isActive ? ", currently selected" : ""}`}
                    onClick={() => setActiveId(w.id)}
                    onMouseEnter={() => setHoverId(w.id)}
                    onFocus={() => setHoverId(w.id)}
                    onBlur={() => setHoverId(null)}
                    className={[
                      "group relative w-full text-left p-4 transition-all duration-300 overflow-hidden",
                      "border border-weapons-border bg-weapons-card cursor-pointer",
                      "[clip-path:polygon(0_0,100%_0,100%_calc(100%-14px),calc(100%-14px)_100%,0_100%)]",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-weapons-ring focus-visible:ring-offset-2 focus-visible:ring-offset-weapons-background",
                      isActive
                        ? "ring-2 ring-weapons-primary -translate-y-0.5 shadow-[8px_8px_0_0_var(--color-weapons-blood)]"
                        : "hover:border-weapons-primary/60 hover:-translate-y-1 hover:translate-x-1 hover:shadow-[6px_6px_0_0_oklch(0.62_0.24_25/0.6)]",
                    ].join(" ")}
                  >
                    {/* Diagonal sweep on hover */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-weapons-primary/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
                    />
                    {/* Active accent bar */}
                    <span
                      aria-hidden
                      className={[
                        "absolute left-0 top-0 h-full w-1 bg-weapons-primary transition-transform duration-300 origin-top",
                        isActive ? "scale-y-100" : "scale-y-0 group-hover:scale-y-100",
                      ].join(" ")}
                    />
                    <div className="relative flex items-center justify-between mb-1.5">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-weapons-muted-foreground transition-colors group-hover:text-weapons-bone">
                        {w.type}
                      </span>
                      <span
                        className={[
                          "font-display text-[11px] px-2 py-0.5 tracking-widest transition-transform duration-300",
                          t.chip,
                          "[clip-path:polygon(8%_0,100%_0,92%_100%,0_100%)]",
                          isHover || isActive ? "scale-110" : "",
                        ].join(" ")}
                      >
                        {w.rank}
                      </span>
                    </div>
                    <h3
                      className={[
                        "relative font-display text-2xl tracking-tight uppercase leading-none transition-all duration-300",
                        isActive || isHover ? "text-weapons-primary skew-x-[-6deg]" : "group-hover:translate-x-1",
                      ].join(" ")}
                    >
                      {w.name}
                    </h3>
                    <div className="relative mt-2 flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          style={ { transitionDelay: `${i * 40}ms` } }
                          className={[
                            "size-1.5 rotate-45 transition-all",
                            i < w.rarity ? "bg-weapons-accent" : "bg-weapons-border",
                            (isHover || isActive) && i < w.rarity ? "scale-150 shadow-[0_0_8px_var(--color-weapons-ember)]" : "",
                          ].join(" ")}
                        />
                      ))}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>

          <p className="font-mono text-[10px] text-weapons-muted-foreground mt-2 leading-relaxed">
            // Hover to preview · Click to lock · Use arrow keys to cycle
          </p>
        </aside>

        {/* MAIN PANEL */}
        <main
          key={active.id}
          aria-label={`Details for ${active.name}`}
          aria-live="polite"
          className="relative overflow-hidden border border-weapons-border bg-weapons-card animate-[fade-in_0.4s_ease-out]"
        >
          {/* Diagonal punk background */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.06] pointer-events-none transition-opacity duration-500"
            style={ {
              backgroundImage:
                "repeating-linear-gradient(135deg, var(--color-weapons-bone) 0 2px, transparent 2px 14px)",
            } }
          />
          <div
            aria-hidden
            className="absolute -top-16 -right-16 size-[420px] rounded-full blur-[120px] pointer-events-none transition-colors duration-700"
            style={ { backgroundColor: tier.glow, opacity: 0.25 } }
          />

          {/* HERO ROW */}
          <div className="relative grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 p-8 lg:p-12">
            <div className="relative">
              <span
                aria-hidden
                className="absolute -top-6 -left-2 font-display text-[14rem] leading-none tracking-tighter text-weapons-primary/15 select-none pointer-events-none italic transition-transform duration-500"
              >
                {active.rank}
              </span>

              <div className="relative flex items-center gap-2 mb-5">
                {active.isSignature && (
                  <span className="px-3 py-1 bg-weapons-primary text-weapons-primary-foreground font-mono text-[10px] tracking-[0.25em] uppercase animate-[pulse-glow_2.4s_ease-in-out_infinite]">
                    Signature
                  </span>
                )}
                {active.isBis && (
                  <span className="px-3 py-1 border border-weapons-accent text-weapons-accent font-mono text-[10px] tracking-[0.25em] uppercase transition-colors hover:bg-weapons-accent hover:text-weapons-accent-foreground cursor-default">
                    Best in Slot
                  </span>
                )}
                <span className="ml-auto font-mono text-[10px] text-weapons-muted-foreground hidden sm:inline">
                  ID · #{active.id.toUpperCase()}
                </span>
              </div>

              <h1 className="relative font-display uppercase leading-[0.85] tracking-tighter text-7xl md:text-8xl xl:text-[8.5rem]">
                <span className="block animate-[slash-in_0.7s_var(--ease-out-expo)_both]">
                  {active.name.split(" ")[0]}
                </span>
                {active.name.split(" ").slice(1).join(" ") && (
                  <span className="block text-weapons-primary italic skew-x-[-8deg] animate-[slash-in_0.7s_var(--ease-out-expo)_0.1s_both]">
                    {active.name.split(" ").slice(1).join(" ")}
                  </span>
                )}
              </h1>

              <p className="relative mt-6 max-w-md text-weapons-muted-foreground italic border-l-2 border-weapons-primary pl-4">
                {active.tagline}
              </p>

              <div className="relative mt-8 grid grid-cols-2 gap-4">
                <StatCard label="Base ATK" value={active.baseAtk} suffix="" accent="primary" />
                <StatCard
                  label={active.secondaryStatName || "Sec. Stat"}
                  value={parseFloat(active.secondaryStatValue) || 0}
                  suffix={active.secondaryStatValue?.includes("%") ? "%" : ""}
                  accent="accent"
                  decimals={active.secondaryStatValue?.includes(".") ? 1 : 0}
                />
              </div>

              <div className="relative mt-6 flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2 group cursor-default">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-weapons-muted-foreground">Rarity</span>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        style={ { transitionDelay: `${i * 60}ms` } }
                        className={[
                          "size-2 rotate-45 transition-transform",
                          i < active.rarity ? "bg-weapons-accent group-hover:scale-125" : "bg-weapons-border",
                        ].join(" ")}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-weapons-muted-foreground">Rank</span>
                  <span className={`font-display italic text-2xl ${tier.text}`}>
                    {active.rank}
                  </span>
                </div>
              </div>
            </div>

            {/* Weapon image with tilt */}
            <WeaponHeroImage name={active.name} src={active.imageUrl || fallbackImage} />
          </div>

          {/* DETAILS ROW */}
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-px bg-weapons-border border-t border-weapons-border">
            <DetailBlock label="Weapon Passive" title={active.passiveName} body={active.passive} tone="primary" />
            <DetailBlock label="Why this Weapon" title="Meta Analysis" body={active.reasoning} tone="accent" />
          </div>
        </main>
      </div>
    </div>
  );
}

function WeaponHeroImage({ name, src }: { name: string; src: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r || !imageWrapperRef.current) return;
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    requestAnimationFrame(() => {
      if (imageWrapperRef.current) {
        imageWrapperRef.current.style.transform = `rotateX(${py * -16}deg) rotateY(${px * 20}deg) scale(1.05)`;
      }
    });
  };

  return (
    <div
      ref={ref}
      role="img"
      aria-label={`${name} weapon render. Move pointer to tilt in 3D.`}
      tabIndex={0}
      onMouseMove={onMove}
      onMouseEnter={() => setHovering(true)}
      onFocus={() => setHovering(true)}
      onBlur={() => {
        setHovering(false);
        if (imageWrapperRef.current) {
          imageWrapperRef.current.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
        }
      } }
      onMouseLeave={() => {
        setHovering(false);
        if (imageWrapperRef.current) {
          imageWrapperRef.current.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
        }
      } }
      className="relative min-h-[320px] lg:min-h-[460px] grid place-items-center [perspective:1200px] cursor-grab active:cursor-grabbing rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-weapons-ring focus-visible:ring-offset-2 focus-visible:ring-offset-weapons-card"
    >
      <div
        aria-hidden
        className="absolute inset-0 m-auto size-[80%] rounded-full bg-weapons-primary/20 blur-3xl transition-all duration-500"
        style={ { transform: hovering ? "scale(1.15)" : "scale(1)" } }
      />
      {src && (
        <div 
          ref={imageWrapperRef} 
          className="relative z-10 h-full max-h-[520px] w-auto transition-transform duration-200 ease-out will-change-transform"
        >
          <Image
            src={src}
            alt={name}
            width={896}
            height={1280}
            className="w-full h-full object-contain drop-shadow-[0_20px_40px_var(--color-weapons-blood)] animate-float pointer-events-none"
          />
        </div>
      )}
      <Corner className="top-0 left-0" />
      <Corner className="top-0 right-0 rotate-90" />
      <Corner className="bottom-0 right-0 rotate-180" />
      <Corner className="bottom-0 left-0 -rotate-90" />
    </div>
  );
}

function StatCard({
  label,
  value,
  suffix,
  accent,
  decimals = 0,
}: {
  label: string;
  value: number;
  suffix: string;
  accent: "primary" | "accent";
  decimals?: number;
}) {
  const color = accent === "primary" ? "text-weapons-primary" : "text-weapons-accent";
  const bar = accent === "primary" ? "bg-weapons-primary" : "bg-weapons-accent";
  const animated = useCountUp(Math.round(value * 10 ** decimals), 700);
  const display = (animated / 10 ** decimals).toFixed(decimals);
  return (
    <div className="group relative border border-weapons-border bg-weapons-background/40 p-5 cursor-default transition-all duration-300 hover:-translate-y-1 hover:border-weapons-primary/60 hover:bg-weapons-background/70 [clip-path:polygon(0_0,100%_0,100%_calc(100%-16px),calc(100%-16px)_100%,0_100%)]">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={ {
          backgroundImage:
            "repeating-linear-gradient(135deg, oklch(0.97 0.01 80 / 0.06) 0 1px, transparent 1px 8px)",
        } }
      />
      <div className="relative flex items-center gap-2 mb-2">
        <span className={`size-2 ${bar} transition-transform group-hover:scale-150`} />
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-weapons-muted-foreground">
          {label}
        </span>
      </div>
      <p className={`relative font-display text-5xl tracking-tighter ${color} transition-transform group-hover:translate-x-1`}>
        {display}
        <span className="text-2xl ml-1 opacity-70">{suffix}</span>
      </p>
    </div>
  );
}

function DetailBlock({
  label,
  title,
  body,
  tone,
}: {
  label: string;
  title: string;
  body: string;
  tone: "primary" | "accent";
}) {
  const color = tone === "primary" ? "text-weapons-primary" : "text-weapons-accent";
  const dot = tone === "primary" ? "bg-weapons-primary" : "bg-weapons-accent";
  return (
    <div className="group relative bg-weapons-card p-8 transition-all duration-300 hover:bg-weapons-background/60 cursor-default overflow-hidden">
      <span
        aria-hidden
        className={`absolute left-0 top-0 h-full w-0.5 ${dot} scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-500`}
      />
      <div className="relative flex items-center gap-2 mb-3">
        <span className={`size-1.5 ${dot} transition-transform group-hover:scale-150`} />
        <span className={`font-mono text-[10px] uppercase tracking-[0.3em] ${color}`}>{label}</span>
      </div>
      <h4 className="relative font-display text-2xl uppercase tracking-tight mb-3 transition-transform group-hover:translate-x-1">
        {title}
      </h4>
      <p className="relative text-sm leading-relaxed text-weapons-muted-foreground max-w-prose" dangerouslySetInnerHTML={{ __html: body || "" } }></p>
    </div>
  );
}

function Corner({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`absolute size-4 border-t-2 border-l-2 border-weapons-primary/60 ${className}`}
    />
  );
}
