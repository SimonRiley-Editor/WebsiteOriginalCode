"use client";
import { motion } from 'motion/react';
import { ArrowRight, Zap, Shield, Crosshair, RefreshCw } from 'lucide-react';

const rotationSteps = [
  { id: 1, action: "Intro Skill", icon: Zap, type: "entry" },
  { id: 2, action: "Resonance Skill", icon: Crosshair, type: "damage" },
  { id: 3, action: "Heavy Attack", icon: Shield, type: "build" },
  { id: 4, action: "Liberation", icon: RefreshCw, type: "ultimate" },
  { id: 5, action: "Outro Skill", icon: ArrowRight, type: "exit" },
];

export function RotationTimeline() {
  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between border-b border-white/10 pb-4">
        <h2 className="text-2xl font-display font-bold tracking-widest uppercase flex items-center gap-3">
          <RefreshCw className="text-[var(--color-gold)]" />
          Optimal Rotation
        </h2>
      </div>

      <div className="relative py-8 overflow-x-auto hide-scrollbar">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-y-1/2 z-0" />

        <div className="flex items-center justify-between min-w-[650px] relative z-10 px-4">
          {rotationSteps.map((step, idx) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, type: "spring", stiffness: 200, damping: 20 }}
              className="flex flex-col items-center gap-5 group relative"
            >
              {/* Connection node glow */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/5 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className={`w-16 h-16 clip-tactical flex items-center justify-center transition-all duration-500 relative z-10
                ${step.type === 'ultimate' ? 'bg-[var(--color-gold)]/10 border-[var(--color-gold)]/50 text-[var(--color-gold)] shadow-[0_0_20px_rgba(212,175,55,0.2)] group-hover:bg-[var(--color-gold)]/20 group-hover:scale-110' :
                  step.type === 'entry' || step.type === 'exit' ? 'bg-black border-white/20 text-gray-400 group-hover:border-white/50 group-hover:text-white' :
                  'bg-[var(--color-teal)]/5 border-[var(--color-teal)]/30 text-[var(--color-teal)] group-hover:bg-[var(--color-teal)]/20 group-hover:border-[var(--color-teal)] group-hover:scale-110'}
                border`}
              >
                <step.icon size={24} strokeWidth={1.5} />
              </div>
              <div className="text-center">
                <span className="block text-[10px] font-mono text-gray-500 mb-1 tracking-widest">PHASE 0{step.id}</span>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-300 group-hover:text-white transition-colors">{step.action}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
