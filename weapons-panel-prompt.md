# Antigravity Prompt — Port "Punk Weapons Panel" into my existing website

You are working inside my **existing production website**. I want you to integrate a new, redesigned **Weapons Panel** (aggressive diagonal punk aesthetic, red + black + ember) that REPLACES my current weapons panel UI.

My site already has an **admin panel** where I (the admin) manage weapons: name, image, type, rank, rarity, base ATK, crit rate, passive name, passive description, "why this weapon" reasoning, tagline. The new panel **MUST render that admin-managed data dynamically** — do NOT hardcode the sample weapons array shown below.

---

## STEP 1 — Inspect my project before writing any code

Before changing anything, open my repo and confirm:

1. **Framework**: Next.js (App Router / Pages Router), Vite + React Router, Remix, TanStack Start, Astro, etc.?
2. **Tailwind version**: v3 (`tailwind.config.js` + `@tailwind base;`) or v4 (`@import "tailwindcss"` in a single CSS file)?
3. **shadcn/ui**: present? `components.json` and `src/components/ui/*`?
4. **Where the current weapons panel lives**: which route file and component renders it today?
5. **How weapons data is fetched** from the admin source — Supabase / Prisma / Drizzle / REST API / server action / React Query hook / context provider. Find the exact `Weapon` shape (field names, types, where the image URL lives).
6. **Image handling**: do I use `next/image`, plain `<img>`, or a CDN wrapper?

Report what you found in 5–8 lines, then proceed.

---

## STEP 2 — Integration plan

1. Create `src/components/WeaponsPanel.tsx` (or the equivalent path in my project) using the **template at the bottom of this file**, but refactored to:

   ```ts
   export function WeaponsPanel({
     weapons,
     fallbackImage,
   }: {
     weapons: Weapon[];          // dynamic, from my admin data source
     fallbackImage?: string;     // used when a weapon has no image
   })
   ```

   - Remove the hardcoded `weapons` array.
   - Map my admin schema → the internal `Weapon` type. If field names differ (e.g. `attack` vs `baseAtk`), do the mapping in the parent page, NOT inside `WeaponsPanel`.
   - Use each weapon's admin-uploaded image (`weapon.imageUrl` or whatever the field is). Fall back to `fallbackImage` if missing.
   - Sort weapons by rank: `S+` → `S` → `A` → `B`.
   - Handle empty / loading / error states gracefully (skeletons or a friendly empty message — match my existing patterns).
   - **Keep ALL** ARIA labels, keyboard handlers (↑↓←→), focus rings, hover states, count-up animations, marquee, tilt, slash-in, pulse-glow.

2. **Wire the parent page** (the route currently rendering the old panel) to pass real admin data:

   ```tsx
   const { data: weapons } = useWeapons(); // your existing hook/query
   return <WeaponsPanel weapons={weapons ?? []} fallbackImage="/placeholder-weapon.png" />;
   ```

3. **Merge CSS tokens carefully** to avoid clashing with my brand colors:
   - If my project already defines `--primary`, `--accent`, `--ring`, etc., **DO NOT overwrite them**.
   - Instead, add **namespaced** tokens (`--weapons-blood`, `--weapons-ember`, `--weapons-bone`, `--weapons-ink`) and update the component to use them via `bg-[var(--weapons-blood)]` etc., OR scope the original tokens under a `.weapons-scope` wrapper class on the panel root.
   - Add the keyframes (`float`, `slash-in`, `marquee`, `pulse-glow`) to my global stylesheet only if they don't already exist.
   - Add the Google Fonts (`Anton`, `Inter`, `JetBrains Mono`) to my `<head>` / root layout only if not already loaded.

4. **Framework-specific gotchas**:
   - Next.js App Router with Server Components → add `"use client"` at the top of `WeaponsPanel.tsx` (it uses `useState`, `useEffect`, mouse events).
   - If I use `next/image`, swap the `<img>` for `<Image>` and pass real `width`/`height` (the template uses 896×1280 for the hero render).
   - If I'm on **Tailwind v3**, add the keyframes + custom colors to `tailwind.config.js` `theme.extend` instead of `@theme inline`.

5. **No new dependencies**. No new ORMs, data libs, or animation libs. No changes to my admin panel UI or DB schema.

---

## STEP 3 — Verification (do this before declaring done)

- Run typecheck + build. Fix any errors.
- Open the page in the browser preview.
- Confirm: sidebar lists my real admin weapons (not the sample ones); editing a weapon in admin reflects on the public panel after refresh; the hero image shows the admin-uploaded picture; arrow keys cycle selection; hover preview works; no console errors; no missing fonts; no broken images; existing brand colors elsewhere on the site are unchanged.

Report what you verified in a short checklist.

---

## REFERENCE — Source files to port

### `src/styles.css` (Tailwind v4 — adapt to v3 if needed)

Add to `:root`:

```css
:root {
  --blood: oklch(0.62 0.24 25);
  --ember: oklch(0.78 0.18 65);
  --bone:  oklch(0.97 0.01 80);
  --ink:   oklch(0.10 0.005 25);
}
```

Add inside `@theme inline { ... }` (Tailwind v4) — or `theme.extend.colors` / `fontFamily` / `keyframes` / `animation` in v3 config:

```css
--color-blood: var(--blood);
--color-ember: var(--ember);
--color-bone:  var(--bone);
--color-ink:   var(--ink);

--font-display: 'Anton', 'Inter', sans-serif;
--font-sans:    'Inter', sans-serif;
--font-mono:    'JetBrains Mono', monospace;

--ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);

--animate-float:       float 5s ease-in-out infinite;
--animate-slash-in:    slash-in 0.7s var(--ease-out-expo) both;
--animate-marquee:     marquee 24s linear infinite;
--animate-pulse-glow:  pulse-glow 2.4s ease-in-out infinite;
```

Keyframes (global):

```css
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(-6deg); }
  50%      { transform: translateY(-18px) rotate(-4deg); }
}
@keyframes slash-in {
  from { opacity: 0; transform: translateX(-40px) skewX(-12deg); }
  to   { opacity: 1; transform: translateX(0)     skewX(-12deg); }
}
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 0 0  oklch(0.62 0.24 25 / 0.5); }
  50%      { box-shadow: 0 0 0 14px oklch(0.62 0.24 25 / 0); }
}
```

Fonts (in `<head>` / root layout):

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;900&family=JetBrains+Mono:wght@400;500&display=swap"
/>
```

---

### `src/components/WeaponsPanel.tsx` — REFERENCE TEMPLATE

> Refactor this so it accepts `weapons: Weapon[]` and `fallbackImage?: string` as props. Remove the hardcoded array. Replace `weaponHero` import with `weapon.imageUrl ?? fallbackImage`. Keep everything else.

```tsx
import { useEffect, useRef, useState, type MouseEvent } from "react";
import weaponHero from "@/assets/weapon-hero.png"; // <- REMOVE; use prop instead

type Weapon = {
  id: string;
  name: string;
  type: string;
  rank: "S+" | "S" | "A" | "B";
  rarity: number;
  baseAtk: number;
  critRate: string;
  passiveName: string;
  passive: string;
  reasoning: string;
  tagline: string;
  imageUrl?: string; // <- ADD when refactoring
};

const weapons: Weapon[] = [
  {
    id: "frostburn",
    name: "Frostburn",
    type: "Pyro / Greatsword",
    rank: "S+",
    rarity: 5,
    baseAtk: 587,
    critRate: "24.3%",
    passiveName: "Frigid Blade",
    passive: "Increases ATK by 12%. When the wielder applies Glacio Chafe, Glacio DMG is amplified by 28%, and Resonance Liberation DMG ignores 10% of the target's DEF for 6 seconds.",
    reasoning: "DEF Shred is the rarest and most powerful stat in the game. Since Hiyuki's burst window is 100% Liberation DMG, this acts as a direct total damage multiplier.",
    tagline: "Forged in the last eruption of the Volcanic Shrine.",
  },
  // ...sample data — DELETE when refactoring to props
];

const tierStyles: Record<Weapon["rank"], { chip: string; text: string; glow: string }> = {
  "S+": { chip: "bg-primary text-primary-foreground", text: "text-primary",         glow: "oklch(0.62 0.24 25)" },
  S:    { chip: "bg-accent text-accent-foreground",   text: "text-accent",          glow: "oklch(0.78 0.18 65)" },
  A:    { chip: "bg-bone text-ink",                   text: "text-bone",            glow: "oklch(0.97 0.01 80)" },
  B:    { chip: "bg-muted text-muted-foreground",     text: "text-muted-foreground", glow: "oklch(0.5 0 0)" },
};

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

export function WeaponsPanel(/* { weapons, fallbackImage }: Props */) {
  const [activeId, setActiveId] = useState<string>(weapons[0].id);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const active = weapons.find((w) => w.id === activeId)!;
  const previewed = weapons.find((w) => w.id === (hoverId ?? activeId))!;
  const tier = tierStyles[previewed.rank];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const idx = weapons.findIndex((w) => w.id === activeId);
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
  }, [activeId]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/40 selection:text-bone">
      {/* Top punk marquee */}
      <div className="border-y border-primary/40 bg-primary/10 overflow-hidden" aria-hidden="true">
        <div className="flex animate-[marquee_28s_linear_infinite] whitespace-nowrap py-2 font-display text-sm tracking-[0.3em] uppercase text-primary hover:[animation-play-state:paused]">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex shrink-0 gap-8 pr-8">
              {["Arsenal v4.1", "★ Tier List Updated", "Patch 2.4 Live", "Best in Slot",
                "Meta Report", "Crit DMG Optimized", "Echo Resonance", "★ S+ Class"].map((t) => (
                <span key={t} className="flex items-center gap-3">
                  <span className="size-1.5 rounded-full bg-primary inline-block" />
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1500px] px-6 py-10 lg:py-14 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
        {/* SIDEBAR — clipped buttons, hover sweep, accent bar, rarity diamonds */}
        <aside className="flex flex-col gap-4" aria-labelledby="arsenal-heading">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-primary">// Arsenal</p>
              <h2 id="arsenal-heading" className="font-display text-3xl tracking-tight uppercase mt-1">
                Weapons<span className="text-primary" aria-hidden>.</span>
              </h2>
            </div>
            <span className="font-mono text-xs text-muted-foreground">
              <kbd className="px-1.5 py-0.5 border border-border mr-1">↑↓</kbd>
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
              const isHover  = w.id === hoverId;
              const t = tierStyles[w.rank];
              return (
                <li key={w.id} role="presentation">
                  <button
                    id={`weapon-${w.id}`}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    aria-label={`${w.name}, ${w.type}, rank ${w.rank}, rarity ${w.rarity} of 5${isActive ? ", currently selected" : ""}`}
                    onClick={() => setActiveId(w.id)}
                    onMouseEnter={() => setHoverId(w.id)}
                    onFocus={() => setHoverId(w.id)}
                    onBlur={() => setHoverId(null)}
                    className={[
                      "group relative w-full text-left p-4 transition-all duration-300 overflow-hidden",
                      "border border-border bg-card cursor-pointer",
                      "[clip-path:polygon(0_0,100%_0,100%_calc(100%-14px),calc(100%-14px)_100%,0_100%)]",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      isActive
                        ? "ring-2 ring-primary -translate-y-0.5 shadow-[8px_8px_0_0_oklch(0.62_0.24_25)]"
                        : "hover:border-primary/60 hover:-translate-y-1 hover:translate-x-1 hover:shadow-[6px_6px_0_0_oklch(0.62_0.24_25/0.6)]",
                    ].join(" ")}
                  >
                    <span aria-hidden className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
                    <span aria-hidden className={["absolute left-0 top-0 h-full w-1 bg-primary transition-transform duration-300 origin-top",
                      isActive ? "scale-y-100" : "scale-y-0 group-hover:scale-y-100"].join(" ")} />
                    <div className="relative flex items-center justify-between mb-1.5">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground group-hover:text-bone">{w.type}</span>
                      <span className={["font-display text-[11px] px-2 py-0.5 tracking-widest transition-transform duration-300", t.chip,
                        "[clip-path:polygon(8%_0,100%_0,92%_100%,0_100%)]",
                        (isHover || isActive) ? "scale-110" : ""].join(" ")}>{w.rank}</span>
                    </div>
                    <h3 className={["relative font-display text-2xl tracking-tight uppercase leading-none transition-all duration-300",
                      (isActive || isHover) ? "text-primary skew-x-[-6deg]" : "group-hover:translate-x-1"].join(" ")}>{w.name}</h3>
                    <div className="relative mt-2 flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} style={{ transitionDelay: `${i * 40}ms` }}
                          className={["size-1.5 rotate-45 transition-all",
                            i < w.rarity ? "bg-accent" : "bg-border",
                            (isHover || isActive) && i < w.rarity ? "scale-150 shadow-[0_0_8px_oklch(0.78_0.18_65)]" : ""].join(" ")} />
                      ))}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>

          <p className="font-mono text-[10px] text-muted-foreground mt-2">
            // Hover to preview · Click to lock · Use arrow keys to cycle
          </p>
        </aside>

        {/* MAIN PANEL — diagonal hatched bg, glow blob, slash-in headline, count-up stats, tilt image, two detail blocks */}
        <main key={active.id} aria-label={`Details for ${active.name}`} aria-live="polite"
          className="relative overflow-hidden border border-border bg-card animate-[fade-in_0.4s_ease-out]">
          <div aria-hidden className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{ backgroundImage: "repeating-linear-gradient(135deg, var(--bone) 0 2px, transparent 2px 14px)" }} />
          <div aria-hidden className="absolute -top-16 -right-16 size-[420px] rounded-full blur-[120px] pointer-events-none"
            style={{ backgroundColor: tier.glow, opacity: 0.25 }} />

          <div className="relative grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 p-8 lg:p-12">
            <div className="relative">
              <span aria-hidden className="absolute -top-6 -left-2 font-display text-[14rem] leading-none tracking-tighter text-primary/15 select-none pointer-events-none italic">
                {active.rank}
              </span>
              <div className="relative flex items-center gap-2 mb-5">
                <span className="px-3 py-1 bg-primary text-primary-foreground font-mono text-[10px] tracking-[0.25em] uppercase animate-[pulse-glow_2.4s_ease-in-out_infinite]">Signature</span>
                <span className="px-3 py-1 border border-accent text-accent font-mono text-[10px] tracking-[0.25em] uppercase hover:bg-accent hover:text-accent-foreground cursor-default">Best in Slot</span>
                <span className="ml-auto font-mono text-[10px] text-muted-foreground hidden sm:inline">ID · #{active.id.toUpperCase()}</span>
              </div>
              <h1 className="relative font-display uppercase leading-[0.85] tracking-tighter text-7xl md:text-8xl xl:text-[8.5rem]">
                <span className="block animate-[slash-in_0.7s_var(--ease-out-expo)_both]">{active.name.split(" ")[0]}</span>
                {active.name.split(" ").slice(1).join(" ") && (
                  <span className="block text-primary italic skew-x-[-8deg] animate-[slash-in_0.7s_var(--ease-out-expo)_0.1s_both]">
                    {active.name.split(" ").slice(1).join(" ")}
                  </span>
                )}
              </h1>
              <p className="relative mt-6 max-w-md text-muted-foreground italic border-l-2 border-primary pl-4">{active.tagline}</p>

              <div className="relative mt-8 grid grid-cols-2 gap-4">
                <StatCard label="Base ATK"  value={active.baseAtk} suffix=""  accent="primary" />
                <StatCard label="Crit Rate" value={parseFloat(active.critRate)} suffix="%" accent="accent" decimals={1} />
              </div>

              <div className="relative mt-6 flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2 group cursor-default">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Rarity</span>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} style={{ transitionDelay: `${i * 60}ms` }}
                        className={["size-2 rotate-45 transition-transform",
                          i < active.rarity ? "bg-accent group-hover:scale-125" : "bg-border"].join(" ")} />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Rank</span>
                  <span className={`font-display italic text-2xl ${tierStyles[active.rank].text}`}>{active.rank}</span>
                </div>
              </div>
            </div>

            <WeaponHeroImage name={active.name} src={/* active.imageUrl ?? fallbackImage */ ""} />
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-px bg-border border-t border-border">
            <DetailBlock label="Weapon Passive"   title={active.passiveName} body={active.passive}   tone="primary" />
            <DetailBlock label="Why this Weapon"  title="Meta Analysis"      body={active.reasoning} tone="accent"  />
          </div>
        </main>
      </div>
    </div>
  );
}

/* WeaponHeroImage: tilts on mousemove, floats, glow halo, corner brackets.
   Refactor `src` to come from prop (admin-uploaded image URL).            */
function WeaponHeroImage({ name, src }: { name: string; src: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const px = (e.clientX - r.left) / r.width  - 0.5;
    const py = (e.clientY - r.top)  / r.height - 0.5;
    setTilt({ x: py * -16, y: px * 20 });
  };

  return (
    <div ref={ref} role="img" aria-label={`${name} weapon render. Move pointer to tilt in 3D.`}
      tabIndex={0} onMouseMove={onMove}
      onMouseEnter={() => setHovering(true)}
      onFocus={() => setHovering(true)}
      onBlur={()  => { setHovering(false); setTilt({ x: 0, y: 0 }); }}
      onMouseLeave={() => { setHovering(false); setTilt({ x: 0, y: 0 }); }}
      className="relative min-h-[320px] lg:min-h-[460px] grid place-items-center [perspective:1200px] cursor-grab active:cursor-grabbing rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card">
      <div aria-hidden className="absolute inset-0 m-auto size-[80%] rounded-full bg-primary/20 blur-3xl transition-all duration-500"
        style={{ transform: hovering ? "scale(1.15)" : "scale(1)" }} />
      <img src={src} alt="" aria-hidden width={896} height={1280}
        className="relative z-10 h-full max-h-[520px] w-auto object-contain drop-shadow-[0_20px_40px_oklch(0.62_0.24_25/0.45)] transition-transform duration-200 ease-out animate-float will-change-transform"
        style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hovering ? 1.05 : 1})` }} />
      <Corner className="top-0 left-0" />
      <Corner className="top-0 right-0 rotate-90" />
      <Corner className="bottom-0 right-0 rotate-180" />
      <Corner className="bottom-0 left-0 -rotate-90" />
    </div>
  );
}

function StatCard({ label, value, suffix, accent, decimals = 0 }:
  { label: string; value: number; suffix: string; accent: "primary" | "accent"; decimals?: number }) {
  const color = accent === "primary" ? "text-primary" : "text-accent";
  const bar   = accent === "primary" ? "bg-primary"   : "bg-accent";
  const animated = useCountUp(Math.round(value * 10 ** decimals), 700);
  const display  = (animated / 10 ** decimals).toFixed(decimals);
  return (
    <div className="group relative border border-border bg-background/40 p-5 cursor-default transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:bg-background/70 [clip-path:polygon(0_0,100%_0,100%_calc(100%-16px),calc(100%-16px)_100%,0_100%)]">
      <span aria-hidden className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ backgroundImage: "repeating-linear-gradient(135deg, oklch(0.97 0.01 80 / 0.06) 0 1px, transparent 1px 8px)" }} />
      <div className="relative flex items-center gap-2 mb-2">
        <span className={`size-2 ${bar} transition-transform group-hover:scale-150`} />
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</span>
      </div>
      <p className={`relative font-display text-5xl tracking-tighter ${color} transition-transform group-hover:translate-x-1`}>
        {display}<span className="text-2xl ml-1 opacity-70">{suffix}</span>
      </p>
    </div>
  );
}

function DetailBlock({ label, title, body, tone }:
  { label: string; title: string; body: string; tone: "primary" | "accent" }) {
  const color = tone === "primary" ? "text-primary" : "text-accent";
  const dot   = tone === "primary" ? "bg-primary"   : "bg-accent";
  return (
    <div className="group relative bg-card p-8 transition-all duration-300 hover:bg-background/60 cursor-default overflow-hidden">
      <span aria-hidden className={`absolute left-0 top-0 h-full w-0.5 ${dot} scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-500`} />
      <div className="relative flex items-center gap-2 mb-3">
        <span className={`size-1.5 ${dot} transition-transform group-hover:scale-150`} />
        <span className={`font-mono text-[10px] uppercase tracking-[0.3em] ${color}`}>{label}</span>
      </div>
      <h4 className="relative font-display text-2xl uppercase tracking-tight mb-3 transition-transform group-hover:translate-x-1">{title}</h4>
      <p className="relative text-sm leading-relaxed text-muted-foreground max-w-prose">{body}</p>
    </div>
  );
}

function Corner({ className = "" }: { className?: string }) {
  return <span aria-hidden className={`absolute size-4 border-t-2 border-l-2 border-primary/60 ${className}`} />;
}
```

---

## Final reminders for Antigravity

- Do **not** invent fields. Map my real admin schema; ask me if a field isn't obvious.
- Do **not** touch unrelated routes, auth, or the admin panel.
- Do **not** overwrite my brand colors — namespace if there's any clash.
- Keep accessibility intact: ARIA labels, keyboard nav, focus rings, `aria-live` on the main panel.
- After done: short verification checklist + screenshot of the new panel.
