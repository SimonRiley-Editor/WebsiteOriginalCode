"use client";
import { motion } from 'motion/react';
import { Zap } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative pt-20 pb-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-[var(--color-teal)] rounded-full mix-blend-overlay opacity-20 blur-[80px] pointer-events-none"
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="w-14 h-14 clip-tactical-sm bg-[var(--color-teal)]/10 border border-[var(--color-teal)]/50 flex items-center justify-center text-[var(--color-teal)] relative holographic-overlay">
            <Zap size={28} />
          </div>
          <div className="text-left">
            <p className="text-[var(--color-teal)] text-xs font-mono tracking-[0.2em] uppercase">Electro / Broadblade</p>
            <p className="text-gray-400 text-sm font-mono uppercase tracking-wider mt-1">Main DPS</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          {/* Glitch text effect behind */}
          <h1 className="absolute -top-1 -left-1 text-7xl md:text-[10rem] font-display font-bold tracking-tighter leading-none uppercase text-[var(--color-teal)] opacity-30 blur-[2px] select-none">
            CALCHARO
          </h1>
          <h1 className="absolute top-1 left-1 text-7xl md:text-[10rem] font-display font-bold tracking-tighter leading-none uppercase text-[var(--color-gold)] opacity-30 blur-[2px] select-none">
            CALCHARO
          </h1>
          <h1 className="relative text-7xl md:text-[10rem] font-display font-bold tracking-tighter leading-none uppercase text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40">
            CAL<span className="text-[var(--color-teal)]">CHARO</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 1 }}
          className="mt-10 max-w-2xl text-lg text-gray-400 font-light tracking-wide"
        >
          A tactical overview of optimal combat rotations, echo configurations, and weapon synergies for maximum field output.
        </motion.p>
      </div>
    </section>
  );
}
