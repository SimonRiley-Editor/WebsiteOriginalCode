"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sword, ChevronRight, Star } from 'lucide-react';
import { GuideContent } from '@/types/guide';

interface BuildSelectorProps {
  weapons: GuideContent['weapons'];
}

export function BuildSelector({ weapons }: BuildSelectorProps) {
  const [selectedWeapon, setSelectedWeapon] = useState(weapons[0]);

  if (!weapons || weapons.length === 0) return null;

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between border-b border-white/10 pb-4">
        <h2 className="text-2xl font-display font-bold tracking-widest uppercase flex items-center gap-3">
          <Sword className="text-white" />
          Weapon Loadout
        </h2>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3 space-y-3">
          {weapons.map((w, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedWeapon(w)}
              className={`w-full text-left px-5 py-4 clip-tactical-sm border transition-all duration-300 flex items-center justify-between group
                ${selectedWeapon.name === w.name
                  ? 'bg-white/10 border-white/50 text-white shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]'
                  : 'bg-black/40 border-white/10 text-gray-500 hover:border-white/30 hover:text-gray-300 hover:bg-white/5'
                }`}
            >
              <div className="flex flex-col">
                <span className="font-bold text-sm tracking-widest font-display uppercase">{w.name}</span>
                <div className="flex gap-2 mt-1">
                  {w.isSignature && <span className="text-[10px] text-[var(--color-gold)] font-mono">SIGNATURE</span>}
                  {w.isBis && <span className="text-[10px] text-[var(--color-teal)] font-mono">BEST IN SLOT</span>}
                </div>
              </div>
              <ChevronRight size={16} className={`transition-transform duration-300 ${selectedWeapon.name === w.name ? 'text-[var(--color-teal)] translate-x-1' : 'opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0'}`} />
            </button>
          ))}
        </div>

        <div className="w-full md:w-2/3">
          <AnimatePresence mode="wait">
            {selectedWeapon && (
              <motion.div
                key={selectedWeapon.name}
                initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(8px)' }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className={`clip-tactical p-8 relative overflow-hidden border min-h-[220px] flex flex-col justify-center
                  ${selectedWeapon.rarity === 5 ? 'bg-[var(--color-gold)]/5 border-[var(--color-gold)]/50 shadow-[0_0_30px_rgba(255,215,0,0.1)]' : 
                    selectedWeapon.rarity === 4 ? 'bg-purple-500/5 border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.1)]' : 
                    'bg-blue-500/5 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.1)]'}
                `}
              >
                <div className="absolute inset-0 holographic-overlay opacity-40 mix-blend-overlay" />

                <div className="relative z-10 flex justify-between items-start">
                  <div className="w-full pr-8">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <span className={`text-[10px] font-mono px-2.5 py-1 clip-tactical-sm tracking-widest font-bold flex items-center gap-1
                        ${selectedWeapon.rarity === 5 ? 'bg-[var(--color-gold)] text-black' : 
                          selectedWeapon.rarity === 4 ? 'bg-purple-500 text-white' : 
                          'bg-blue-500 text-white'}
                      `}>
                        {selectedWeapon.rarity} <Star size={10} className={selectedWeapon.rarity === 5 ? "fill-black" : "fill-white"} />
                      </span>
                      <span className="text-[10px] font-mono text-gray-400 tracking-widest border border-white/10 px-2 py-0.5">LVL 90</span>
                      {(selectedWeapon.type || selectedWeapon.weaponType) && (
                        <span className="text-[10px] font-mono text-cyan-400 tracking-widest border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5">
                          {(selectedWeapon.type || selectedWeapon.weaponType)?.toUpperCase()}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-3xl font-display font-bold text-white mb-2 tracking-wide uppercase">{selectedWeapon.name}</h3>
                    
                    {selectedWeapon.specialNote && (
                      <div className="mb-4 p-3 bg-white/5 border border-white/10 rounded-md text-sm text-gray-300 font-mono italic">
                        <span className="text-cyan-400 font-bold not-italic mr-2">NOTE:</span>
                        {selectedWeapon.specialNote}
                      </div>
                    )}

                    {selectedWeapon.bestFor && (
                      <div className="mb-6 p-3 bg-cyan-950/30 border border-cyan-500/20 rounded-md text-sm text-cyan-50 font-mono">
                        <span className="text-cyan-400 font-bold mr-2">BEST FOR:</span>
                        {selectedWeapon.bestFor}
                      </div>
                    )}

                    <div className="flex gap-10 mb-6">
                      <div>
                        <span className="block text-[10px] font-mono text-gray-500 mb-1.5 tracking-widest">BASE ATK</span>
                        <span className="text-3xl font-bold text-white font-display">{selectedWeapon.baseAtk}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-mono text-gray-500 mb-1.5 tracking-widest">SECONDARY STAT</span>
                        <span className="text-3xl font-bold text-[var(--color-teal)] font-display">
                          {selectedWeapon.secondaryStat} {selectedWeapon.secondaryStatValue}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">{selectedWeapon.passiveName}</h4>
                      <p className="text-sm text-gray-400 leading-relaxed">{selectedWeapon.passiveDescription}</p>
                    </div>
                  </div>

                  <div className="hidden sm:block absolute right-[-20px] top-1/2 -translate-y-1/2 opacity-10 rotate-12 scale-150 pointer-events-none">
                    <Sword size={200} strokeWidth={1} className={
                      selectedWeapon.rarity === 5 ? 'text-[var(--color-gold)]' : 
                      selectedWeapon.rarity === 4 ? 'text-purple-500' : 
                      'text-blue-500'
                    } />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
