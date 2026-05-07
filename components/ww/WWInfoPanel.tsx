import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { LayoutGrid, Play, ChevronRight } from 'lucide-react';

interface InfoPanelProps {
  activeGuide: any;
  showAnimation: boolean;
  setShowAnimation: (val: boolean) => void;
  accentColor: string;
  faction: string;
  description: string;
}

export const WWInfoPanel: React.FC<InfoPanelProps> = ({ activeGuide, showAnimation, setShowAnimation, accentColor, faction, description }) => {
  return (
    <AnimatePresence mode="wait">
        <motion.div 
            key={`info-${activeGuide?.id}`}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-[420px] flex flex-col pt-2 scale-[0.75] md:scale-[0.80] origin-top-left xl:scale-[0.85] 2xl:scale-95 pointer-events-auto"
        >
            {/* Animation Toggle */}
            {activeGuide?.content?.spine && (
                <button
                    onClick={(e) => { e.stopPropagation(); setShowAnimation(!showAnimation); }}
                    className="bg-black/60 hover:bg-black/80 border border-white/20 text-white/90 text-sm px-4 py-2 rounded-full backdrop-blur-md transition-all self-start flex items-center gap-2 mb-6 pointer-events-auto"
                >
                    {showAnimation ? <LayoutGrid className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {showAnimation ? 'View Static Render' : 'View 2D Animation'}
                </button>
            )}
            <span className="font-bold tracking-widest text-xs uppercase mb-1" style={{ color: accentColor }}>
                {faction}
            </span>
            <div className="flex items-end gap-3 mb-4">
                <h2 className="text-6xl lg:text-7xl font-display font-black text-gray-900 tracking-tight uppercase leading-[0.85] drop-shadow-sm">
                    {activeGuide?.name}
                </h2>
                <div className="text-3xl mb-1" style={{ color: accentColor }}>
                    {activeGuide?.element === 'fusion' ? '🔥' : activeGuide?.element === 'glacio' ? '❄️' : activeGuide?.element === 'electro' ? '⚡' : '✧'}
                </div>
            </div>
            
            <div className="flex items-center gap-3 mb-6">
                <div className="border rounded-md px-3 py-1 text-sm font-bold bg-white shadow-sm flex items-center gap-2" style={{ borderColor: accentColor, color: accentColor }}>
                    <span className="uppercase tracking-wider font-cinzel">{activeGuide?.element || 'Element'}</span>
                </div>
            </div>

            <p className="text-gray-500 hover:text-gray-900 transition-colors duration-300 leading-relaxed mb-6 flex-1 text-sm lg:text-base font-medium">
                {description}
            </p>

            <div className="flex flex-col gap-3 max-w-[320px] mb-8">
                <Link 
                     href={`/guides/${activeGuide.slug || activeGuide.id}`}
                     className="group relative w-full flex items-center justify-between px-6 py-4 rounded-xl text-white text-sm font-bold tracking-wider shadow-lg transition-all duration-300 hover:scale-[1.03] outline-none overflow-visible" 
                     style={{ backgroundColor: accentColor, boxShadow: `0 8px 20px -8px ${accentColor}` }}
                >
                    <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                         {/* Inner top highlight */}
                         <div className="absolute inset-x-0 top-0 h-[1px] bg-white opacity-40"></div>
                         <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-white/20 to-transparent"></div>
                         <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>
                    </div>
                    <div className="absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-md pointer-events-none" style={{ backgroundColor: accentColor }}></div>
                    <span className="relative z-10 drop-shadow-sm">VIEW GUIDE</span> 
                    <ChevronRight size={18} className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link href="/tier-list" className="group relative w-full flex items-center justify-between px-6 py-4 rounded-xl text-gray-800 bg-white/95 backdrop-blur-xl border border-white text-sm font-bold tracking-wider transition-all duration-300 hover:scale-[1.02] outline-none shadow-[0_4px_20px_rgb(0,0,0,0.05),inset_0_2px_0_rgba(255,255,255,1)]">
                    <span className="relative z-10">TIER LIST</span> 
                    <LayoutGrid size={18} className="relative z-10 text-gray-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-gray-600" />
                    <div className="absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm pointer-events-none border border-white/50"></div>
                </Link>
            </div>
        </motion.div>
    </AnimatePresence>
  );
};
