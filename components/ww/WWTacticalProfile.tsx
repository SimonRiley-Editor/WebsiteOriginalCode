import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface TacticalContentProps {
  activeGuide: any;
  accentColor: string;
  activeRole: string;
  activeWeapon: string;
  powerLevel: string;
  bestForOptions: string[];
  statHP: string;
  statATK: string;
  statDEF: string;
  statCritRate: string;
  statCritDmg: string;
  hpWidth: string;
  atkWidth: string;
  defWidth: string;
}

export const WWTacticalProfile: React.FC<TacticalContentProps> = ({ 
  activeGuide, accentColor, activeRole, activeWeapon, powerLevel, 
  bestForOptions, statHP, statATK, statDEF, statCritRate, statCritDmg, 
  hpWidth, atkWidth, defWidth 
}) => {
  return (
    <AnimatePresence mode="wait">
        <motion.div 
            key={`profile-${activeGuide?.id}`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-[340px] flex flex-col gap-2 mt-0 lg:-mt-8 relative z-20 scale-[0.75] md:scale-[0.80] origin-top-right xl:scale-[0.85] 2xl:scale-95"
        >
            {/* Role Card / System Header */}
            <div className="bg-white/80 backdrop-blur-2xl rounded-2xl p-5 lg:p-6 border border-gray-100 shadow-[0_4px_24px_rgb(0,0,0,0.04)] relative overflow-hidden group">
                {/* Tactical visual accents */}
                <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none"></div>
                <div className="absolute -right-6 -top-6 w-24 h-24 border border-gray-200 rounded-full opacity-20 group-hover:scale-110 transition-transform duration-700"></div>
                <div className="absolute right-4 top-4 w-12 h-12 border border-gray-200 rounded-full opacity-20 animate-[spin_10s_linear_infinite]"></div>

                <div className="flex items-center justify-between mb-5">
                    <p className="text-[10px] font-black tracking-[0.2em] text-gray-800 uppercase flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: accentColor }}></span>
                        TACTICAL PROFILE
                    </p>
                    <span className="text-[9px] font-mono tracking-widest text-gray-400 border border-gray-200 px-1.5 py-0.5 rounded-sm">SY.99%</span>
                </div>

                <div className="flex justify-between items-start mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                           <h3 className="text-2xl lg:text-3xl tracking-widest font-black font-display text-gray-900 uppercase leading-none">{activeRole}</h3>
                           <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor }}></div>
                        </div>
                        <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500 border-l-2 pl-2" style={{ borderColor: accentColor }}>
                            {activeWeapon} special
                        </span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-xs font-bold text-gray-400">RANK</span>
                        <span className="text-4xl font-black tracking-tighter" style={{ color: accentColor, textShadow: `0 0 20px ${accentColor}40` }}>{powerLevel}</span>
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Synergy Protocol</p>
                    <div className="flex flex-wrap gap-1.5">
                        {bestForOptions.map((tag: string, i: number) => (
                           <span key={`tag-${i}`} className="text-[10px] bg-gray-100/80 text-gray-700 px-2 py-1 rounded-[4px] font-semibold tracking-wide border border-gray-200/50 shrink-0">{tag}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Animated Stats Card */}
            <div className="bg-white/80 backdrop-blur-2xl rounded-2xl p-5 lg:p-6 border border-gray-100 shadow-[0_4px_24px_rgb(0,0,0,0.04)] relative">
                <div className="flex justify-between items-end mb-4">
                    <p className="text-[10px] font-black tracking-[0.2em] text-gray-800 uppercase flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: accentColor }}></span>
                        COMBAT METRICS
                    </p>
                    <span className="font-mono text-[9px] text-gray-400">LV.90 MAX</span>
                </div>

                <div className="flex flex-col gap-3.5 mt-4">
                    {/* HP Bar */}
                    <div className="flex flex-col gap-1">
                         <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider">
                             <span className="text-gray-500">HP / Base</span>
                             <span className="text-gray-900">{statHP}</span>
                         </div>
                         <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                             <motion.div initial={{ width: 0 }} animate={{ width: hpWidth }} transition={{ duration: 1, delay: 0.1 }} className="h-full rounded-full" style={{ backgroundColor: accentColor }}></motion.div>
                         </div>
                    </div>
                    
                    {/* ATK Bar */}
                    <div className="flex flex-col gap-1">
                         <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider">
                             <span className="text-gray-500">ATK / Offense</span>
                             <span className="text-gray-900">{statATK}</span>
                         </div>
                         <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                             <motion.div initial={{ width: 0 }} animate={{ width: atkWidth }} transition={{ duration: 1, delay: 0.2 }} className="h-full rounded-full" style={{ backgroundColor: accentColor }}></motion.div>
                         </div>
                    </div>

                    {/* DEF Bar */}
                    <div className="flex flex-col gap-1">
                         <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider">
                             <span className="text-gray-500">DEF / Defense</span>
                             <span className="text-gray-900">{statDEF}</span>
                         </div>
                         <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                             <motion.div initial={{ width: 0 }} animate={{ width: defWidth }} transition={{ duration: 1, delay: 0.3 }} className="h-full rounded-full" style={{ backgroundColor: accentColor }}></motion.div>
                         </div>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-100 border-dashed">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">CRIT.RATE</span>
                        <span className="text-sm font-black text-gray-900">{statCritRate}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">CRIT.DMG</span>
                        <span className="text-sm font-black text-gray-900">{statCritDmg}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    </AnimatePresence>
  );
};
