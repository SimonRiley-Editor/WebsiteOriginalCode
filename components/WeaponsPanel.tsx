"use client";

import { useEffect, useRef, useState, useCallback, type MouseEvent } from "react";
import Image from "next/image";

/* ─── Types ──────────────────────────────────────────────────────── */

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
  // Damage comparison data
  atkPercent?: number;
  dmgBonusPercent?: number;
  critScalingPercent?: number;
  totalDamageIndex?: number;
  passiveBuffPercent?: number;
};

/* ─── Fallback damage data ───────────────────────────────────────── */
// Used when admin hasn't filled in damage fields yet
function getDamageDefaults(rank: Weapon["rank"], idx: number) {
  const presets: Record<Weapon["rank"], { atk: number; dmg: number; crit: number; total: number; passive: number }> = {
    "S+": { atk: 42, dmg: 32, crit: 58, total: 100, passive: 14.2 },
    S: { atk: 38, dmg: 28, crit: 48, total: 87, passive: 10.5 },
    A: { atk: 35, dmg: 22, crit: 40, total: 74, passive: 7.8 },
    B: { atk: 30, dmg: 18, crit: 32, total: 62, passive: 5.2 },
  };
  const p = presets[rank] || presets["B"];
  return {
    atkPercent: p.atk - idx * 2,
    dmgBonusPercent: p.dmg - idx,
    critScalingPercent: p.crit - idx * 1.5,
    totalDamageIndex: p.total - idx * 4,
    passiveBuffPercent: p.passive - idx * 1.2,
  };
}

function getWeaponDamage(w: Weapon, idx: number) {
  const d = getDamageDefaults(w.rank, idx);
  return {
    atk: w.atkPercent ?? d.atkPercent,
    dmg: w.dmgBonusPercent ?? d.dmgBonusPercent,
    crit: w.critScalingPercent ?? d.critScalingPercent,
    total: w.totalDamageIndex ?? d.totalDamageIndex,
    passiveBuff: w.passiveBuffPercent ?? d.passiveBuffPercent,
  };
}

/* ─── Style tokens ───────────────────────────────────────────────── */

const tierStyles: Record<Weapon["rank"], { chip: string; text: string; glow: string }> = {
  "S+": { chip: "bg-weapons-primary text-weapons-primary-foreground", text: "text-weapons-primary", glow: "var(--color-weapons-blood)" },
  S: { chip: "bg-weapons-accent text-weapons-accent-foreground", text: "text-weapons-accent", glow: "var(--color-weapons-ember)" },
  A: { chip: "bg-weapons-bone text-weapons-ink", text: "text-weapons-bone", glow: "var(--color-weapons-bone)" },
  B: { chip: "bg-weapons-muted text-weapons-muted-foreground", text: "text-weapons-muted-foreground", glow: "oklch(0.5 0 0)" },
};

/* ─── SVG Icons ──────────────────────────────────────────────────── */

function IconCrosshair({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="22" y1="12" x2="18" y2="12" /><line x1="6" y1="12" x2="2" y2="12" /><line x1="12" y1="6" x2="12" y2="2" /><line x1="12" y1="22" x2="12" y2="18" />
    </svg>
  );
}
function IconFlame({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}
function IconSpark({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
function IconTarget({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  );
}
function IconShield({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

/* ─── Hooks ───────────────────────────────────────────────────────── */

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

function useCountUpFloat(target: number, decimals = 1, duration = 600) {
  const scale = Math.pow(10, decimals);
  const animated = useCountUp(Math.round(target * scale), duration);
  return (animated / scale).toFixed(decimals);
}

/* ─── Main Component ─────────────────────────────────────────────── */

export function WeaponsPanel({ weapons, fallbackImage = "" }: { weapons: Weapon[], fallbackImage?: string }) {
  const [activeId, setActiveId] = useState<string>(weapons[0]?.id || "");
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [passiveActive, setPassiveActive] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  if (!weapons || weapons.length === 0) {
    return <div className="p-8 text-center text-white">No weapons data available.</div>;
  }

  const baselineWeapon = weapons[0];
  const active = weapons.find((w) => w.id === activeId) || weapons[0];
  const previewed = weapons.find((w) => w.id === (hoverId ?? activeId)) || weapons[0];
  const tier = tierStyles[previewed.rank] || tierStyles["B"];

  // Get damage data
  const baselineIdx = 0;
  const activeIdx = weapons.findIndex((w) => w.id === active.id);
  const baselineDmg = getWeaponDamage(baselineWeapon, baselineIdx);
  const activeDmg = getWeaponDamage(active, activeIdx);

  // Calculate delta (with passive consideration)
  const activeTotal = passiveActive
    ? activeDmg.total * (1 + activeDmg.passiveBuff / 100)
    : activeDmg.total;
  const baselineTotal = baselineDmg.total;
  const deltaPercent = baselineTotal > 0
    ? ((activeTotal - baselineTotal) / baselineTotal) * 100
    : 0;
  const isBaseline = active.id === baselineWeapon.id;

  // Passive-adjusted bar values
  const activeAtk = passiveActive ? activeDmg.atk * (1 + activeDmg.passiveBuff / 300) : activeDmg.atk;
  const activeDmgBonus = passiveActive ? activeDmg.dmg * (1 + activeDmg.passiveBuff / 200) : activeDmg.dmg;
  const activeCrit = passiveActive ? activeDmg.crit * (1 + activeDmg.passiveBuff / 250) : activeDmg.crit;
  const barMax = Math.max(baselineDmg.atk + baselineDmg.dmg + baselineDmg.crit, activeAtk + activeDmgBonus + activeCrit, 100);

  // Toggle passive handler
  const handlePassiveToggle = useCallback(() => {
    setPassiveActive((p) => !p);
    setAnimKey((k) => k + 1);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const idx = weapons.findIndex((w) => w.id === activeId);
      if (idx === -1) return;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        const newId = weapons[(idx + 1) % weapons.length].id;
        setActiveId(newId);
        setPassiveActive(false);
        setAnimKey((k) => k + 1);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        const newId = weapons[(idx - 1 + weapons.length) % weapons.length].id;
        setActiveId(newId);
        setPassiveActive(false);
        setAnimKey((k) => k + 1);
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
                "Crit DMG Optimized", "Echo Resonance", "★ S+ Class", "◆ Damage Comparison"].map((t) => (
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
            {weapons.map((w, wIdx) => {
              const isActive = w.id === activeId;
              const isHover = w.id === hoverId;
              const t = tierStyles[w.rank] || tierStyles["B"];
              const wDmg = getWeaponDamage(w, wIdx);
              const wDelta = baselineTotal > 0 ? ((wDmg.total - baselineTotal) / baselineTotal) * 100 : 0;
              const isWBaseline = w.id === baselineWeapon.id;
              return (
                <li key={w.id} role="presentation">
                  <button
                    id={`weapon-${w.id}`}
                    type="button"
                    role="option"
                    aria-selected={!!(isActive)}
                    aria-label={`${w.name}, ${w.type}, rank ${w.rank}, rarity ${w.rarity} of 5${isActive ? ", currently selected" : ""}`}
                    onClick={() => { setActiveId(w.id); setPassiveActive(false); setAnimKey((k) => k + 1); }}
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
                      <div className="flex items-center gap-2">
                        {/* Mini delta badge in sidebar */}
                        {!isWBaseline && (
                          <span
                            className={[
                              "font-mono text-[9px] px-1.5 py-0.5 tracking-wider",
                              wDelta >= 0
                                ? "text-[var(--color-weapons-delta-up)] bg-[var(--color-weapons-delta-up)]/10"
                                : "text-[var(--color-weapons-delta-down)] bg-[var(--color-weapons-delta-down)]/10",
                            ].join(" ")}
                          >
                            {wDelta >= 0 ? "+" : ""}{wDelta.toFixed(1)}%
                          </span>
                        )}
                        {isWBaseline && (
                          <span className="font-mono text-[9px] px-1.5 py-0.5 tracking-wider text-[var(--color-weapons-delta-neutral)] bg-[var(--color-weapons-delta-neutral)]/10">
                            BASE
                          </span>
                        )}
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
                          style={{ transitionDelay: `${i * 40}ms` }}
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
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, var(--color-weapons-bone) 0 2px, transparent 2px 14px)",
            }}
          />
          <div
            aria-hidden
            className="absolute -top-16 -right-16 size-[420px] rounded-full blur-[120px] pointer-events-none transition-colors duration-700"
            style={{ backgroundColor: tier.glow, opacity: 0.25 }}
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

              {/* ═══ DELTA METRIC ═══ */}
              <DeltaMetric
                deltaPercent={deltaPercent}
                isBaseline={isBaseline}
                passiveActive={passiveActive}
                animKey={animKey}
              />

              {/* Stat Grid - Tactical */}
              <div className="relative mt-6 grid grid-cols-2 gap-4">
                <TacticalStatCard
                  icon={<IconFlame className="text-weapons-primary" />}
                  label="Base ATK"
                  value={active.baseAtk}
                  suffix=""
                  accent="primary"
                />
                <TacticalStatCard
                  icon={<IconCrosshair className="text-weapons-accent" />}
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
                        style={{ transitionDelay: `${i * 60}ms` }}
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

          {/* ═══ DAMAGE COMPARISON SECTION ═══ */}
          <div className="relative border-t border-weapons-border bg-weapons-background/40 p-8 lg:p-12">
            {/* Section header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <IconTarget className="text-weapons-primary" />
                <h3 className="font-mono text-[10px] tracking-[0.3em] uppercase text-weapons-primary">
                  // Damage Breakdown
                </h3>
              </div>
              <div className="flex items-center gap-4">
                {/* Legend */}
                <div className="hidden sm:flex items-center gap-4 font-mono text-[9px] tracking-wider uppercase text-weapons-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 bg-[var(--color-weapons-bar-atk)]" />ATK%
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 bg-[var(--color-weapons-bar-dmg)]" />DMG Bonus
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 bg-[var(--color-weapons-bar-crit)]" />Crit
                  </span>
                </div>
              </div>
            </div>

            {/* Stacked Bar Charts */}
            <DamageBarComparison
              baselineName={baselineWeapon.name}
              baselineAtk={baselineDmg.atk}
              baselineDmg={baselineDmg.dmg}
              baselineCrit={baselineDmg.crit}
              activeName={active.name}
              activeAtk={activeAtk}
              activeDmgBonus={activeDmgBonus}
              activeCrit={activeCrit}
              barMax={barMax}
              isBaseline={isBaseline}
              animKey={animKey}
            />

            {/* Passive Toggle */}
            <PassiveToggle
              passiveName={active.passiveName}
              passiveActive={passiveActive}
              onToggle={handlePassiveToggle}
              buffPercent={activeDmg.passiveBuff}
            />

            {/* Tactical stat readout grid */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-px bg-weapons-border/30">
              <MicroStat icon={<IconFlame />} label="ATK%" value={activeAtk.toFixed(1)} />
              <MicroStat icon={<IconSpark />} label="DMG%" value={activeDmgBonus.toFixed(1)} />
              <MicroStat icon={<IconCrosshair />} label="CRIT" value={activeCrit.toFixed(1)} />
              <MicroStat icon={<IconShield />} label="TOTAL" value={activeTotal.toFixed(1)} highlight />
            </div>
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

/* ─── Delta Metric Badge ─────────────────────────────────────────── */

function DeltaMetric({ deltaPercent, isBaseline, passiveActive, animKey }: {
  deltaPercent: number;
  isBaseline: boolean;
  passiveActive: boolean;
  animKey: number;
}) {
  const displayVal = useCountUpFloat(Math.abs(deltaPercent), 1, 500);
  const isUp = deltaPercent > 0.05;
  const isDown = deltaPercent < -0.05;

  return (
    <div
      key={animKey}
      className="relative mt-8 p-5 border border-weapons-border bg-weapons-background/60 animate-[fade-in_0.3s_ease-out]"
      style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)" }}
    >
      {/* Grid wireframe background */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(var(--color-weapons-bone) 1px, transparent 1px), linear-gradient(90deg, var(--color-weapons-bone) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="relative flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-weapons-muted-foreground">
            vs Baseline
          </span>
        </div>
        <div className="flex-1" />
        {isBaseline ? (
          <div className="flex items-center gap-3">
            <span
              className="font-mono text-xs tracking-[0.15em] uppercase px-3 py-1"
              style={{ color: "var(--color-weapons-delta-neutral)", backgroundColor: "color-mix(in oklch, var(--color-weapons-delta-neutral) 12%, transparent)" }}
            >
              ◆ BASELINE
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span
              className="font-mono text-3xl sm:text-4xl tracking-tight font-bold animate-[number-pop_0.3s_ease-out]"
              style={{
                color: isUp ? "var(--color-weapons-delta-up)" : isDown ? "var(--color-weapons-delta-down)" : "var(--color-weapons-delta-neutral)",
                textShadow: isUp
                  ? "0 0 20px color-mix(in oklch, var(--color-weapons-delta-up) 40%, transparent)"
                  : isDown
                    ? "0 0 20px color-mix(in oklch, var(--color-weapons-delta-down) 40%, transparent)"
                    : "none",
              }}
            >
              {isUp ? "+" : isDown ? "-" : ""}{displayVal}%
            </span>
            <span
              className="font-mono text-[9px] uppercase tracking-[0.2em] max-w-[80px] leading-tight"
              style={{ color: isUp ? "var(--color-weapons-delta-up)" : isDown ? "var(--color-weapons-delta-down)" : "var(--color-weapons-delta-neutral)" }}
            >
              OVERALL OUTPUT
            </span>
          </div>
        )}
      </div>
      {passiveActive && !isBaseline && (
        <div className="relative mt-2 flex items-center gap-2">
          <span className="size-1.5 bg-[var(--color-weapons-delta-up)] animate-pulse rounded-full" />
          <span className="font-mono text-[9px] text-[var(--color-weapons-delta-up)] tracking-wider uppercase">
            Passive buff active
          </span>
        </div>
      )}
    </div>
  );
}

/* ─── Damage Bar Comparison ──────────────────────────────────────── */

function DamageBarComparison({
  baselineName, baselineAtk, baselineDmg, baselineCrit,
  activeName, activeAtk, activeDmgBonus, activeCrit,
  barMax, isBaseline, animKey,
}: {
  baselineName: string; baselineAtk: number; baselineDmg: number; baselineCrit: number;
  activeName: string; activeAtk: number; activeDmgBonus: number; activeCrit: number;
  barMax: number; isBaseline: boolean; animKey: number;
}) {
  const pct = (v: number) => `${Math.max(0, (v / barMax) * 100)}%`;

  return (
    <div className="space-y-5">
      {/* Baseline bar (ghost) */}
      <div className="group">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-weapons-muted-foreground flex items-center gap-2">
            <span className="size-1 bg-weapons-muted-foreground/40 rotate-45" />
            {baselineName}
            <span className="text-[var(--color-weapons-delta-neutral)] ml-1">BASELINE</span>
          </span>
          <span className="font-mono text-[10px] text-weapons-muted-foreground">
            {(baselineAtk + baselineDmg + baselineCrit).toFixed(1)}
          </span>
        </div>
        <div className="relative h-7 bg-weapons-background/60 border border-weapons-border/40 overflow-hidden">
          {/* Ghost segments - dashed outline style */}
          <div className="absolute inset-0 flex">
            <div
              className="h-full border-r border-dashed border-weapons-border/60 transition-all duration-700"
              style={{ width: pct(baselineAtk), background: "color-mix(in oklch, var(--color-weapons-bar-atk) 15%, transparent)" }}
            />
            <div
              className="h-full border-r border-dashed border-weapons-border/60 transition-all duration-700"
              style={{ width: pct(baselineDmg), background: "color-mix(in oklch, var(--color-weapons-bar-dmg) 15%, transparent)" }}
            />
            <div
              className="h-full transition-all duration-700"
              style={{ width: pct(baselineCrit), background: "color-mix(in oklch, var(--color-weapons-bar-crit) 15%, transparent)" }}
            />
          </div>
          {/* Outline edges */}
          <div className="absolute inset-0 flex pointer-events-none">
            <div className="h-full border-r-2 border-[var(--color-weapons-bar-atk)]/30" style={{ width: pct(baselineAtk) }} />
            <div className="h-full border-r-2 border-[var(--color-weapons-bar-dmg)]/30" style={{ width: pct(baselineDmg) }} />
          </div>
        </div>
      </div>

      {/* Active bar (solid) */}
      <div className="group">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-weapons-foreground flex items-center gap-2">
            <span className="size-1 bg-weapons-primary rotate-45" />
            {activeName}
            {isBaseline && <span className="text-[var(--color-weapons-delta-neutral)] ml-1">BASELINE</span>}
          </span>
          <span className="font-mono text-[10px] text-weapons-foreground font-bold">
            {(activeAtk + activeDmgBonus + activeCrit).toFixed(1)}
          </span>
        </div>
        <div
          key={animKey}
          className="relative h-7 bg-weapons-background/60 border border-weapons-border overflow-hidden"
        >
          <div
            className="absolute inset-0 flex origin-left"
            style={{ animation: "bar-extend 0.6s cubic-bezier(0.16, 1, 0.3, 1) both" }}
          >
            <div
              className="h-full relative transition-all duration-500"
              style={{ width: pct(activeAtk), background: "var(--color-weapons-bar-atk)" }}
            >
              <span className="absolute inset-0 flex items-center justify-center font-mono text-[8px] text-white/80 tracking-wider">
                {activeAtk >= 8 ? `${activeAtk.toFixed(0)}%` : ""}
              </span>
            </div>
            <div
              className="h-full relative transition-all duration-500"
              style={{ width: pct(activeDmgBonus), background: "var(--color-weapons-bar-dmg)" }}
            >
              <span className="absolute inset-0 flex items-center justify-center font-mono text-[8px] text-black/70 tracking-wider">
                {activeDmgBonus >= 8 ? `${activeDmgBonus.toFixed(0)}%` : ""}
              </span>
            </div>
            <div
              className="h-full relative transition-all duration-500"
              style={{ width: pct(activeCrit), background: "var(--color-weapons-bar-crit)" }}
            >
              <span className="absolute inset-0 flex items-center justify-center font-mono text-[8px] text-white/80 tracking-wider">
                {activeCrit >= 8 ? `${activeCrit.toFixed(0)}%` : ""}
              </span>
            </div>
          </div>
          {/* Ghost overlay of baseline for direct visual comparison */}
          {!isBaseline && (
            <div className="absolute inset-0 pointer-events-none">
              <div
                className="h-full border-r-2 border-dashed opacity-50"
                style={{
                  width: pct(baselineAtk + baselineDmg + baselineCrit),
                  borderColor: "var(--color-weapons-bone)",
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile legend */}
      <div className="flex sm:hidden items-center gap-4 font-mono text-[9px] tracking-wider uppercase text-weapons-muted-foreground mt-2">
        <span className="flex items-center gap-1.5">
          <span className="size-2 bg-[var(--color-weapons-bar-atk)]" />ATK%
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 bg-[var(--color-weapons-bar-dmg)]" />DMG
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 bg-[var(--color-weapons-bar-crit)]" />Crit
        </span>
      </div>
    </div>
  );
}

/* ─── Passive Toggle ─────────────────────────────────────────────── */

function PassiveToggle({
  passiveName,
  passiveActive,
  onToggle,
  buffPercent,
}: {
  passiveName: string;
  passiveActive: boolean;
  onToggle: () => void;
  buffPercent: number;
}) {
  return (
    <div className="mt-8 relative">
      <div className="flex items-center gap-2 mb-3">
        <IconShield className="text-weapons-muted-foreground" />
        <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-weapons-muted-foreground">
          Conditional Passive
        </span>
      </div>
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={passiveActive}
        aria-label={`Toggle passive: ${passiveName}. Currently ${passiveActive ? "active" : "inactive"}`}
        className={[
          "group w-full text-left p-4 border transition-all duration-300 cursor-pointer",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-weapons-ring focus-visible:ring-offset-2 focus-visible:ring-offset-weapons-background",
          passiveActive
            ? "border-[var(--color-weapons-delta-up)]/50 bg-[var(--color-weapons-delta-up)]/5"
            : "border-weapons-border bg-weapons-background/40 hover:border-weapons-primary/40",
        ].join(" ")}
        style={passiveActive ? { animation: "toggle-snap 0.2s ease-out" } : undefined}
      >
        <div className="flex items-center gap-4">
          {/* Brutalist toggle switch */}
          <div
            className={[
              "relative w-12 h-6 border-2 transition-all duration-300 flex items-center shrink-0",
              passiveActive
                ? "border-[var(--color-weapons-delta-up)] bg-[var(--color-weapons-delta-up)]/20"
                : "border-weapons-border bg-weapons-background",
            ].join(" ")}
          >
            <div
              className={[
                "absolute size-4 transition-all duration-300",
                passiveActive
                  ? "left-[calc(100%-18px)] bg-[var(--color-weapons-delta-up)]"
                  : "left-[2px] bg-weapons-muted-foreground",
              ].join(" ")}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={[
                "font-mono text-xs uppercase tracking-wider transition-colors",
                passiveActive ? "text-[var(--color-weapons-delta-up)]" : "text-weapons-foreground",
              ].join(" ")}>
                {passiveName}
              </span>
              <span className={[
                "font-mono text-[9px] px-1.5 py-0.5 tracking-wider transition-all",
                passiveActive
                  ? "text-[var(--color-weapons-delta-up)] bg-[var(--color-weapons-delta-up)]/10"
                  : "text-weapons-muted-foreground bg-weapons-border/30",
              ].join(" ")}>
                {passiveActive ? "MAX STACKS" : "INACTIVE"}
              </span>
            </div>
            <span className="font-mono text-[9px] text-weapons-muted-foreground mt-0.5 block">
              {passiveActive
                ? `+${buffPercent.toFixed(1)}% total damage when active`
                : "Click to simulate buff activation"
              }
            </span>
          </div>
          {/* Buff indicator */}
          {passiveActive && (
            <span className="font-mono text-sm font-bold text-[var(--color-weapons-delta-up)] animate-[number-pop_0.3s_ease-out] shrink-0">
              +{buffPercent.toFixed(1)}%
            </span>
          )}
        </div>
      </button>
    </div>
  );
}

/* ─── Micro Stat Cell ────────────────────────────────────────────── */

function MicroStat({ icon, label, value, highlight }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className={[
      "flex items-center gap-3 p-4 bg-weapons-card transition-colors group cursor-default",
      highlight ? "hover:bg-weapons-primary/10" : "hover:bg-weapons-background/60",
    ].join(" ")}>
      <span className={highlight ? "text-weapons-primary" : "text-weapons-muted-foreground"}>
        {icon}
      </span>
      <div>
        <span className="block font-mono text-[8px] uppercase tracking-[0.2em] text-weapons-muted-foreground">
          {label}
        </span>
        <span className={[
          "font-mono text-lg tracking-tight transition-transform group-hover:translate-x-0.5",
          highlight ? "text-weapons-primary font-bold" : "text-weapons-foreground",
        ].join(" ")}>
          {value}
        </span>
      </div>
    </div>
  );
}

/* ─── Tactical Stat Card ─────────────────────────────────────────── */

function TacticalStatCard({
  icon,
  label,
  value,
  suffix,
  accent,
  decimals = 0,
}: {
  icon: React.ReactNode;
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
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, oklch(0.97 0.01 80 / 0.06) 0 1px, transparent 1px 8px)",
        }}
      />
      <div className="relative flex items-center gap-2 mb-2">
        {icon}
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

/* ─── Hero Image ─────────────────────────────────────────────────── */

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
      }}
      onMouseLeave={() => {
        setHovering(false);
        if (imageWrapperRef.current) {
          imageWrapperRef.current.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
        }
      }}
      className="relative min-h-[320px] lg:min-h-[460px] grid place-items-center [perspective:1200px] cursor-grab active:cursor-grabbing rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-weapons-ring focus-visible:ring-offset-2 focus-visible:ring-offset-weapons-card"
    >
      <div
        aria-hidden
        className="absolute inset-0 m-auto size-[80%] rounded-full bg-weapons-primary/20 blur-3xl transition-all duration-500"
        style={{ transform: hovering ? "scale(1.15)" : "scale(1)" }}
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

/* ─── Detail Block ───────────────────────────────────────────────── */

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
      <p className="relative text-sm leading-relaxed text-weapons-muted-foreground max-w-prose" dangerouslySetInnerHTML={{ __html: body || "" }}></p>
    </div>
  );
}

/* ─── Corner Bracket ─────────────────────────────────────────────── */

function Corner({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`absolute size-4 border-t-2 border-l-2 border-weapons-primary/60 ${className}`}
    />
  );
}
