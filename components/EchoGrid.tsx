"use client";
import { motion } from 'motion/react';
import { Activity } from 'lucide-react';

const echoes = [
  { id: 1, cost: 4, name: "Thundering Mephis", mainStat: "Crit Rate %", type: "main" },
  { id: 2, cost: 3, name: "Flautist", mainStat: "Electro DMG %", type: "sub" },
  { id: 3, cost: 3, name: "Violet-Feathered Heron", mainStat: "Electro DMG %", type: "sub" },
  { id: 4, cost: 1, name: "Vanguard Void", mainStat: "ATK %", type: "sub" },
  { id: 5, cost: 1, name: "Fission Junrock", mainStat: "ATK %", type: "sub" },
];

export function EchoGrid() {
  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between border-b border-white/10 pb-4">
        <h2 className="text-2xl font-display font-bold tracking-widest uppercase flex items-center gap-3">
          <Activity className="text-[var(--color-teal)]" />
          Echo Config
        </h2>
        <span className="text-[10px] font-mono text-[var(--color-teal)] bg-[var(--color-teal)]/10 px-3 py-1.5 clip-tactical-sm tracking-widest border border-[var(--color-teal)]/20">
          SONATA: VOID THUNDER
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="col-span-2 clip-tactical glass-panel-teal p-6 relative holographic-overlay group cursor-pointer transition-all duration-500 hover:bg-[var(--color-teal)]/10 hover:border-[var(--color-teal)]/40"
        >
          <div className="absolute top-0 right-0 bg-[var(--color-teal)] text-black text-[10px] font-bold px-4 py-1.5 clip-tactical-reverse tracking-widest">
            COST 4
          </div>
          <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-[var(--color-teal)] transition-colors font-display tracking-wide">{echoes[0].name}</h3>
          <p className="text-xs text-[var(--color-teal)] font-mono mb-6 tracking-widest opacity-80">MAIN ECHO</p>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="bg-black/60 px-4 py-3 clip-tactical-sm border border-white/5 min-w-[140px]">
              <span className="block text-[10px] text-gray-500 mb-1 tracking-widest">MAIN STAT</span>
              <span className="text-[var(--color-gold)] font-bold tracking-wide">{echoes[0].mainStat}</span>
            </div>
            <div className="bg-black/60 px-4 py-3 clip-tactical-sm border border-white/5 flex-1">
              <span className="block text-[10px] text-gray-500 mb-1 tracking-widest">SUBSTAT PRIORITY</span>
              <span className="text-sm text-gray-300 tracking-wide">Crit DMG &gt; Crit Rate &gt; ATK% &gt; ER</span>
            </div>
          </div>
        </motion.div>

        {echoes.slice(1).map((echo, idx) => (
          <motion.div
            key={echo.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ scale: 1.03, y: -2 }}
            className="clip-tactical glass-panel p-5 relative group cursor-pointer hover:border-[var(--color-teal)]/40 hover:bg-white/5 transition-all duration-300"
          >
             <div className="absolute top-0 right-0 bg-white/10 text-white text-[10px] font-bold px-3 py-1 clip-tactical-reverse tracking-widest group-hover:bg-[var(--color-teal)]/20 group-hover:text-[var(--color-teal)] transition-colors">
              COST {echo.cost}
            </div>
            <h3 className="text-sm font-bold text-gray-200 mb-4 pr-10 font-display tracking-wide leading-tight h-10">{echo.name}</h3>
            <div className="bg-black/60 px-3 py-2 clip-tactical-sm border border-white/5 group-hover:border-[var(--color-teal)]/20 transition-colors">
              <span className="block text-[9px] text-gray-500 mb-0.5 tracking-widest">MAIN STAT</span>
              <span className="text-[var(--color-teal)] font-bold text-sm tracking-wide">{echo.mainStat}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
