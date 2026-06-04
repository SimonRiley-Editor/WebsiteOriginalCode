"use client";
import React, { useEffect, useState, useRef, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';

/* ─────────────────────────────────────────────
   3D Crystal Core — nested wireframe geometry
   ───────────────────────────────────────────── */
const CrystalCore = memo(({ intensity }: { intensity: number }) => {
  const faces = useMemo(() => {
    // Create an octahedron-like wireframe with 3 interlocking squares
    const planes = [
      { rx: 0, ry: 0, rz: 0 },
      { rx: 60, ry: 0, rz: 0 },
      { rx: 0, ry: 60, rz: 0 },
      { rx: 60, ry: 60, rz: 0 },
      { rx: 0, ry: 0, rz: 60 },
      { rx: 30, ry: 45, rz: 15 },
    ];
    return planes;
  }, []);

  const glowIntensity = 8 + intensity * 20;
  const borderOpacity = 0.2 + intensity * 0.6;

  return (
    <div
      className="relative w-[120px] h-[120px] md:w-[160px] md:h-[160px]"
      style={{
        perspective: '600px',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Outer crystal shell — slow rotation */}
      <div
        className="absolute inset-0"
        style={{
          transformStyle: 'preserve-3d',
          animation: `core-rotate ${12 - intensity * 6}s linear infinite`,
        }}
      >
        {faces.map((face, i) => (
          <div
            key={i}
            className="absolute inset-[10%] border transition-all duration-500"
            style={{
              transform: `rotateX(${face.rx}deg) rotateY(${face.ry}deg) rotateZ(${face.rz}deg)`,
              borderColor: `rgba(251, 191, 36, ${borderOpacity})`,
              boxShadow: `inset 0 0 ${glowIntensity}px rgba(251,191,36,${intensity * 0.15}), 0 0 ${glowIntensity}px rgba(251,191,36,${intensity * 0.1})`,
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'visible',
            }}
          />
        ))}
      </div>

      {/* Inner crystal core — faster counter-rotation */}
      <div
        className="absolute inset-[25%]"
        style={{
          transformStyle: 'preserve-3d',
          animation: `core-rotate-reverse ${8 - intensity * 3}s linear infinite`,
        }}
      >
        {[0, 45, 90].map((rz, i) => (
          <div
            key={i}
            className="absolute inset-0 border transition-all duration-500"
            style={{
              transform: `rotateZ(${rz}deg) rotateX(45deg)`,
              borderColor: `rgba(239, 68, 68, ${0.15 + intensity * 0.4})`,
              boxShadow: `0 0 ${glowIntensity * 0.8}px rgba(239,68,68,${intensity * 0.12})`,
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'visible',
            }}
          />
        ))}

        {/* Innermost diamond */}
        <div
          className="absolute inset-[15%] rotate-45 border transition-all duration-300"
          style={{
            borderColor: `rgba(255, 255, 255, ${0.3 + intensity * 0.5})`,
            boxShadow: `0 0 ${10 + intensity * 30}px rgba(251,191,36,${0.2 + intensity * 0.4}), inset 0 0 ${5 + intensity * 15}px rgba(251,191,36,${intensity * 0.3})`,
            backgroundColor: `rgba(251,191,36,${intensity * 0.05})`,
          }}
        />
      </div>

      {/* Central energy point */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300"
        style={{
          width: `${4 + intensity * 8}px`,
          height: `${4 + intensity * 8}px`,
          backgroundColor: `rgba(251,191,36,${0.6 + intensity * 0.4})`,
          boxShadow: `0 0 ${10 + intensity * 30}px rgba(251,191,36,${0.4 + intensity * 0.5}), 0 0 ${20 + intensity * 60}px rgba(251,191,36,${intensity * 0.3}), 0 0 ${40 + intensity * 80}px rgba(239,68,68,${intensity * 0.15})`,
        }}
      />
    </div>
  );
});
CrystalCore.displayName = 'CrystalCore';

/* ─────────────────────────────────────────────
   Orbital Rings — 3D tilted rotating rings
   ───────────────────────────────────────────── */
const OrbitalRings = memo(({ intensity }: { intensity: number }) => {
  const rings = [
    { size: 220, md: 300, anim: 'orbit-ring-1', dur: 8, color: 'rgba(251,191,36,', dotCount: 8 },
    { size: 180, md: 250, anim: 'orbit-ring-2', dur: 12, color: 'rgba(239,68,68,', dotCount: 6 },
    { size: 260, md: 350, anim: 'orbit-ring-3', dur: 15, color: 'rgba(255,255,255,', dotCount: 4 },
  ];

  return (
    <>
      {rings.map((ring, ri) => (
        <div
          key={ri}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            width: `clamp(${ring.size}px, 40vw, ${ring.md}px)`,
            height: `clamp(${ring.size}px, 40vw, ${ring.md}px)`,
            transformStyle: 'preserve-3d',
            animation: `${ring.anim} ${ring.dur - intensity * 3}s linear infinite`,
          }}
        >
          {/* Ring border */}
          <div
            className="absolute inset-0 rounded-full border transition-all duration-500"
            style={{
              borderColor: `${ring.color}${0.1 + intensity * 0.2})`,
              borderWidth: '1px',
              borderStyle: ri === 1 ? 'dashed' : 'solid',
            }}
          />

          {/* Orbiting dots on this ring */}
          {[...Array(ring.dotCount)].map((_, di) => {
            const angle = (360 / ring.dotCount) * di;
            return (
              <div
                key={di}
                className="absolute top-1/2 left-1/2 w-full h-0"
                style={{
                  transform: `rotate(${angle}deg)`,
                  transformOrigin: '0 0',
                }}
              >
                <div
                  className="absolute rounded-full transition-all duration-300"
                  style={{
                    width: `${2 + intensity * 3}px`,
                    height: `${2 + intensity * 3}px`,
                    left: '50%',
                    top: '-1px',
                    transform: 'translateX(-50%)',
                    backgroundColor: `${ring.color}${0.3 + intensity * 0.6})`,
                    boxShadow: `0 0 ${4 + intensity * 8}px ${ring.color}${intensity * 0.5})`,
                  }}
                />
              </div>
            );
          })}
        </div>
      ))}
    </>
  );
});
OrbitalRings.displayName = 'OrbitalRings';

/* ─────────────────────────────────────────────
   Floating Particle Field — ambient 3D depth
   ───────────────────────────────────────────── */
const ParticleField = memo(() => {
  const [particles, setParticles] = useState<Array<{
    x: number; y: number; size: number; delay: number; dur: number; opacity: number;
  }>>([]);

  useEffect(() => {
    setParticles(
      [...Array(35)].map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 5,
        dur: Math.random() * 4 + 3,
        opacity: Math.random() * 0.4 + 0.1,
      }))
    );
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-amber-400"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animation: `particle-float ${p.dur}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
});
ParticleField.displayName = 'ParticleField';

/* ─────────────────────────────────────────────
   Energy Ripple — expanding concentric rings
   ───────────────────────────────────────────── */
const EnergyRipples = memo(({ active }: { active: boolean }) => {
  if (!active) return null;
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
      {[0, 0.6, 1.2].map((delay, i) => (
        <div
          key={i}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
          style={{
            width: '100px',
            height: '100px',
            animation: `energy-ripple 2s ease-out ${delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
});
EnergyRipples.displayName = 'EnergyRipples';

/* ─────────────────────────────────────────────
   Geometric Iris — 6-panel aperture transition
   ───────────────────────────────────────────── */
const IrisPanel = ({ index, total, isOpen }: { index: number; total: number; isOpen: boolean }) => {
  const angle = (360 / total) * index;
  // Each panel slides outward along its radial direction
  const rad = (angle * Math.PI) / 180;
  const translateX = Math.cos(rad) * 120; // vw%
  const translateY = Math.sin(rad) * 120;

  // Build clip-path for a triangular slice
  const halfAngle = 360 / total / 2;
  const startAngle = angle - halfAngle;
  const endAngle = angle + halfAngle;

  const toXY = (a: number, r: number) => {
    const rr = (a * Math.PI) / 180;
    return `${50 + r * Math.cos(rr)}% ${50 + r * Math.sin(rr)}%`;
  };

  const clipPath = `polygon(50% 50%, ${toXY(startAngle, 150)}, ${toXY(endAngle, 150)})`;

  return (
    <motion.div
      className="absolute inset-0"
      style={{ clipPath, backgroundColor: '#0a0a0a' }}
      initial={{ x: 0, y: 0, opacity: 1 }}
      animate={
        isOpen
          ? { x: `${translateX}vw`, y: `${translateY}vh`, opacity: 0 }
          : { x: 0, y: 0, opacity: 1 }
      }
      transition={{
        duration: 0.9,
        delay: isOpen ? index * 0.06 : 0,
        ease: [0.76, 0, 0.24, 1],
      }}
    >
      {/* Glowing edge line along the leading edge of each panel */}
      {isOpen && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(${angle + 90}deg, transparent 40%, rgba(251,191,36,0.4) 49%, rgba(251,191,36,0.8) 50%, rgba(251,191,36,0.4) 51%, transparent 60%)`,
            animation: 'iris-glow-line 0.6s ease-out forwards',
          }}
        />
      )}
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   Radial Burst Lines — converging energy
   ───────────────────────────────────────────── */
const RadialLines = memo(({ intensity }: { intensity: number }) => {
  const lineCount = 12;
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
      {[...Array(lineCount)].map((_, i) => {
        const angle = (360 / lineCount) * i;
        return (
          <div
            key={i}
            className="absolute origin-center transition-all duration-500"
            style={{
              width: '1px',
              height: `${40 + intensity * 80}px`,
              background: `linear-gradient(to bottom, rgba(251,191,36,${0.05 + intensity * 0.15}), transparent)`,
              top: '50%',
              left: '50%',
              transform: `rotate(${angle}deg) translateY(-${60 + intensity * 30}px)`,
            }}
          />
        );
      })}
    </div>
  );
});
RadialLines.displayName = 'RadialLines';

/* ─────────────────────────────────────────────
   Corner Decorations — tactical frame accents
   ───────────────────────────────────────────── */
const CornerDecorations = memo(({ visible }: { visible: boolean }) => {
  const corners = [
    { pos: 'top-6 left-6 md:top-10 md:left-10', border: 'border-t border-l' },
    { pos: 'top-6 right-6 md:top-10 md:right-10', border: 'border-t border-r' },
    { pos: 'bottom-6 left-6 md:bottom-10 md:left-10', border: 'border-b border-l' },
    { pos: 'bottom-6 right-6 md:bottom-10 md:right-10', border: 'border-b border-r' },
  ];

  return (
    <>
      {corners.map((c, i) => (
        <motion.div
          key={i}
          className={`absolute ${c.pos} w-8 h-8 md:w-12 md:h-12 ${c.border} border-amber-400/30 pointer-events-none`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={visible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
    </>
  );
});
CornerDecorations.displayName = 'CornerDecorations';

/* ═════════════════════════════════════════════
   MAIN COMPONENT — GlitchIntro (Resonance Core)
   ═════════════════════════════════════════════ */
export const GlitchIntro = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<
    'awakening' | 'charging' | 'resonance' | 'iris-open' | 'done'
  >('awakening');
  const onCompleteRef = useRef(onComplete);
  const hasStarted = useRef(false);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    let p = 0;

    // Phase 1: Awakening (0-1.5s) — structure fades in
    // Progress starts after a brief pause
    timeouts.push(
      setTimeout(() => {
        setPhase('charging');

        // Phase 2: Charging — progress climbs
        const interval = setInterval(() => {
          p += 1;
          if (p >= 100) {
            clearInterval(interval);
            setProgress(100);

            // Phase 3: Resonance Lock
            timeouts.push(
              setTimeout(() => {
                setPhase('resonance');
              }, 200)
            );

            // Phase 4: Iris opens
            timeouts.push(
              setTimeout(() => {
                setPhase('iris-open');
              }, 900)
            );

            // Phase 5: Complete
            timeouts.push(
              setTimeout(() => {
                setPhase('done');
                onCompleteRef.current();
              }, 2200)
            );
          } else {
            setProgress(p);
          }
        }, 22);

        timeouts.push({ [Symbol.toPrimitive]: () => 0 } as any); // placeholder
        return () => clearInterval(interval);
      }, 800)
    );

    return () => {
      timeouts.forEach((t) => clearTimeout(t));
    };
  }, []);

  const intensity = progress / 100;
  const isIrisOpen = phase === 'iris-open' || phase === 'done';
  const showContent = phase !== 'done';

  if (!showContent) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
      {/* ── Geometric Iris Panels ── */}
      {[...Array(6)].map((_, i) => (
        <IrisPanel key={i} index={i} total={6} isOpen={isIrisOpen} />
      ))}

      {/* ── Background Layer (behind iris) ── */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{ opacity: isIrisOpen ? 0 : 1 }}
      >
        {/* Subtle radial gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.04)_0%,transparent_70%)]" />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(251,191,36,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* ── Main Content (Core + UI) ── */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: isIrisOpen ? 0 : 1,
          scale: isIrisOpen ? 1.2 : 1,
        }}
        transition={{ duration: isIrisOpen ? 0.6 : 1.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Particle Field */}
        <ParticleField />

        {/* Radial energy lines */}
        <RadialLines intensity={intensity} />

        {/* Orbital Rings in 3D */}
        <div
          className="relative flex items-center justify-center"
          style={{ perspective: '800px', transformStyle: 'preserve-3d' }}
        >
          <OrbitalRings intensity={intensity} />

          {/* 3D Crystal Core */}
          <motion.div
            style={{ animation: `crystal-pulse 2.5s ease-in-out infinite` }}
            animate={{
              rotateY: phase === 'resonance' ? [0, 15, -15, 0] : 0,
              scale: phase === 'resonance' ? [1, 1.15, 1] : 1,
            }}
            transition={{
              duration: phase === 'resonance' ? 0.5 : 0,
              ease: 'easeInOut',
            }}
          >
            <CrystalCore intensity={intensity} />
          </motion.div>

          {/* Energy ripples on resonance */}
          <EnergyRipples active={phase === 'resonance'} />
        </div>

        {/* ── Progress Counter ── */}
        <motion.div
          className="mt-10 md:mt-14 flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {/* Number display */}
          <div className="relative">
            <span
              className="text-6xl md:text-8xl font-bold tracking-[0.15em] tabular-nums transition-all duration-200"
              style={{
                fontFamily: 'var(--font-cinzel), serif',
                color: progress >= 100 ? '#fbbf24' : '#f5f0e8',
                textShadow:
                  progress >= 100
                    ? '0 0 30px rgba(251,191,36,0.8), 0 0 60px rgba(251,191,36,0.4), 0 0 100px rgba(239,68,68,0.2)'
                    : `0 0 ${8 + intensity * 25}px rgba(251,191,36,${0.2 + intensity * 0.5}), 0 0 ${20 + intensity * 40}px rgba(251,191,36,${intensity * 0.2})`,
              }}
            >
              {progress.toString().padStart(2, '0')}
            </span>
          </div>

          {/* Progress bar */}
          <div className="relative w-[180px] md:w-[240px] h-[2px] bg-white/10 overflow-hidden rounded-full">
            <motion.div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                background:
                  'linear-gradient(90deg, rgba(251,191,36,0.4), rgba(251,191,36,0.9), rgba(239,68,68,0.7))',
                boxShadow: '0 0 10px rgba(251,191,36,0.5)',
              }}
              transition={{ duration: 0.05 }}
            />
            {/* Scanning dot on progress bar */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-amber-400"
              style={{
                left: `${progress}%`,
                boxShadow: '0 0 8px rgba(251,191,36,0.8), 0 0 16px rgba(251,191,36,0.4)',
              }}
            />
          </div>

          {/* Status text */}
          <AnimatePresence mode="wait">
            {phase !== 'iris-open' && phase !== 'done' && (
              <motion.div
                key={phase}
                className="flex flex-col items-center gap-1.5"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
              >
                <p
                  className="text-[10px] md:text-xs tracking-[0.4em] font-medium uppercase"
                  style={{
                    fontFamily: 'var(--font-jetbrains-mono, monospace)',
                    color:
                      phase === 'resonance'
                        ? 'rgba(251,191,36,0.9)'
                        : 'rgba(245,240,232,0.5)',
                  }}
                >
                  {phase === 'awakening' && 'Initializing Core...'}
                  {phase === 'charging' && 'Channeling Resonance...'}
                  {phase === 'resonance' && '◈ Resonance Locked ◈'}
                </p>

                {/* Animated separator line */}
                <motion.div
                  className="h-[1px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"
                  animate={{
                    width: ['40px', '80px', '40px'],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* ── Corner Decorations ── */}
      <CornerDecorations visible={phase !== 'done' && !isIrisOpen} />

      {/* ── Ambient light flash on resonance ── */}
      <AnimatePresence>
        {phase === 'resonance' && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.15, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              background:
                'radial-gradient(circle at center, rgba(251,191,36,0.3) 0%, transparent 60%)',
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
