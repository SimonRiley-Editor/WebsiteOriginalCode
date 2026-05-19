import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Plus, Minus } from 'lucide-react';

interface InsightBarProps {
  activeGuide: any;
  accentColor: string;
  activeInsightTab: 'assessment' | 'proscons';
  setActiveInsightTab: (val: 'assessment' | 'proscons') => void;
  powerLevel: string;
  powerLevelText: string;
  prosList: string[];
  consList: string[];
  setIsProsConsModalOpen: (val: boolean) => void;
}

export const WWInsightBar: React.FC<InsightBarProps> = ({ 
  activeGuide, accentColor, activeInsightTab, setActiveInsightTab,
  powerLevel, powerLevelText, prosList, consList, setIsProsConsModalOpen 
}) => {
  return (
    <AnimatePresence mode="wait">
        <motion.div 
            key={`insight-${activeGuide?.id}`}
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' } }
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' } }
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' } }
            transition={{ duration: 0.5, delay: 0.2 } }
            className="w-full bg-white/90 md:bg-white/40 md:backdrop-blur-3xl border border-white/60 rounded-3xl p-6 relative flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-stretch group/insight hover:-translate-y-1 transition-all duration-500 overflow-visible transform-gpu will-change-transform" style={ { boxShadow: `0 0 50px -10px ${accentColor}40, inset 0 2px 20px rgba(255,255,255,0.8)` } }
        >
            {/* Top Glow Edge */}
            <div className="absolute top-0 left-0 right-0 h-[2px] opacity-100 z-20 overflow-hidden rounded-t-3xl">
                <div className="w-full h-full" style={ { background: `linear-gradient(90deg, transparent, ${accentColor}, white, ${accentColor}, transparent)` } }></div>
            </div>
            <div className="absolute top-0 left-[15%] w-32 h-[4px] blur-[4px] opacity-100 z-20 pointer-events-none md:mix-blend-screen hidden md:block" style={ { backgroundColor: accentColor } }></div>
            <div className="absolute top-0 left-[15%] w-16 h-[2px] blur-[1px] opacity-100 z-20 pointer-events-none bg-white"></div>
            <div className="absolute top-0 right-[25%] w-48 h-[6px] blur-[6px] opacity-80 z-20 pointer-events-none md:mix-blend-screen hidden md:block" style={ { backgroundColor: accentColor } }></div>
            <div className="absolute top-0 right-[25%] w-20 h-[2px] blur-[1px] opacity-100 z-20 pointer-events-none bg-white"></div>
            <div className="absolute inset-0 rounded-3xl opacity-20 bg-gradient-to-t from-transparent to-white pointer-events-none"></div>

            {/* Background Glows */}
            <div className="absolute -left-10 -top-10 w-40 h-40 blur-[50px] opacity-10 rounded-full transition-all duration-700 group-hover/insight:scale-150 group-hover/insight:opacity-20" style={ { backgroundColor: accentColor } }></div>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 blur-[50px] opacity-[0.03] rounded-full bg-black transition-all duration-700 group-hover/insight:scale-150 group-hover/insight:opacity-10"></div>
            
            {/* Animated shine effect */}
            <div className="absolute top-0 -inset-full h-full w-[250%] z-0 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover/insight:opacity-100 group-hover/insight:translate-x-[100%] transition-all duration-1000 ease-in-out" />

            {/* Tab Switcher */}
            <div className="absolute -top-[1px] left-[10%] flex gap-8 z-30 pointer-events-auto">
                <button 
                    onClick={() => setActiveInsightTab('assessment')}
                    className={`pt-3 pb-2 text-[10px] font-black tracking-[0.15em] uppercase transition-all duration-300 border-t-[3px] ${activeInsightTab === 'assessment' ? 'text-gray-900 border-gray-900 drop-shadow-sm' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
                >
                    Assessment
                </button>
                <button 
                    onClick={() => setActiveInsightTab('proscons')}
                    className={`pt-3 pb-2 text-[10px] font-black tracking-[0.15em] uppercase transition-all duration-300 border-t-[3px] ${activeInsightTab === 'proscons' ? 'text-gray-900 border-gray-900 drop-shadow-sm' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
                >
                    Pros & Cons
                </button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-stretch relative z-10 w-full pt-6 min-h-[120px]">
                {activeInsightTab === 'assessment' && (
                    <>
                        {/* Rank Badge */}
                        <div className="flex flex-col items-center justify-center min-w-[120px] relative z-10 pb-4 md:pb-0 transition-transform duration-500 group-hover/insight:scale-105">
                            <span className="text-[10px] font-bold tracking-[0.1em] text-gray-800 uppercase mb-1 transition-colors duration-300">COMBAT ASSESSMENT</span>
                            <div className="relative">
                                <span className="text-5xl font-black tracking-tighter md:mix-blend-multiply drop-shadow-sm transition-transform duration-500" style={ { color: accentColor } }>{powerLevel}</span>
                                <span className="absolute inset-0 text-5xl font-black tracking-tighter blur-[12px] opacity-0 md:mix-blend-multiply transition-opacity duration-500 group-hover/insight:opacity-80 group-hover/insight:animate-pulse hidden md:block" style={ { color: accentColor } }>{powerLevel}</span>
                                <span className="absolute inset-x-0 bottom-1 h-[2px] bg-current opacity-0 group-hover/insight:opacity-20 transition-opacity duration-500 translate-y-2 group-hover/insight:translate-y-0" style={ { color: accentColor } }></span>
                            </div>
                        </div>

                        {/* Summary Text */}
                        <div className="hidden md:flex flex-col items-center justify-center mx-2 shrink-0">
                            <div className="w-px h-10" style={ { background: `linear-gradient(to bottom, transparent, ${accentColor}40)` } }></div>
                            <div className="w-1.5 h-1.5 rotate-45 my-2" style={ { border: `1px solid ${accentColor}80` } }></div>
                            <div className="w-px h-10" style={ { background: `linear-gradient(to top, transparent, ${accentColor}40)` } }></div>
                        </div>
                        <div className="flex-[1.5] flex flex-col justify-center relative z-10 pb-4 md:pb-0 min-w-[200px] group/summary">
                            <p className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase mb-2 flex items-center gap-1.5 opacity-70 transition-all duration-300 group-hover/summary:opacity-100 group-hover/summary:translate-x-1">
                                <MapPin size={12} className="text-gray-400 transition-colors duration-300 group-hover/summary:text-gray-900"/> OVERVIEW
                            </p>
                            <p className="text-[13px] font-medium text-gray-600 leading-relaxed transition-colors duration-300 group-hover/summary:text-gray-900">
                                {powerLevelText}
                            </p>
                        </div>
                    </>
                )}
                {activeInsightTab === 'proscons' && (
                    <div className="flex w-full cursor-pointer group/modal relative" onClick={() => setIsProsConsModalOpen(true)} title="Click to expand Pros & Cons">
                        <div className="absolute inset-0 -mx-4 -my-2 bg-black/5 rounded-xl opacity-0 group-hover/modal:opacity-100 transition-opacity z-0 pointer-events-none" />
                        {/* Pros Column */}
                        <div className="hidden md:flex flex-col items-center justify-center mx-2 shrink-0">
                            <div className="w-px h-10" style={ { background: `linear-gradient(to bottom, transparent, ${accentColor}40)` } }></div>
                            <div className="w-1.5 h-1.5 rotate-45 my-2" style={ { border: `1px solid ${accentColor}80` } }></div>
                            <div className="w-px h-10" style={ { background: `linear-gradient(to top, transparent, ${accentColor}40)` } }></div>
                        </div>
                        <div className="flex-1 flex flex-col justify-center relative z-10 min-w-[140px] group/pros">
                            <p className="text-[10px] font-black tracking-[0.2em] text-green-500 uppercase mb-3 flex items-center gap-1.5 transition-transform duration-300 group-hover/pros:translate-x-1 drop-shadow-sm">
                                <Plus size={12} className="transition-transform duration-300 group-hover/pros:rotate-90 group-hover/pros:scale-125" /> <span className="font-light text-[rgb(0,180,255)]">TACTICAL</span> <span className="text-[rgb(0,180,255)] font-black">ADVANTAGES</span>
                            </p>
                            <ul className="space-y-2 overflow-hidden max-h-[70px] pr-2 pointer-events-none" style={ { scrollbarWidth: "thin", scrollbarColor: "#4ADE80 transparent" } }>
                                {prosList.map((pro: string, i: number) => (
                                    <li key={`pro-${i}`} className="text-[11px] text-gray-600 font-bold leading-tight flex items-start gap-2 hover:text-gray-900 transition-colors group/item">
                                        <span className="w-1 h-3 border-l-[3px] mt-0.5 shrink-0 border-green-400 transition-all duration-300 group-hover/item:h-4 group-hover/item:shadow-[0_0_8px_rgba(74,222,128,0.5)]"/> 
                                        <span className="transition-transform duration-300 group-hover/item:translate-x-0.5 min-w-0 flex-1 break-words ">{pro}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Cons Column */}
                        <div className="hidden md:flex flex-col items-center justify-center mx-2 shrink-0">
                            <div className="w-px h-10" style={ { background: `linear-gradient(to bottom, transparent, ${accentColor}40)` } }></div>
                            <div className="w-1.5 h-1.5 rotate-45 my-2" style={ { border: `1px solid ${accentColor}80` } }></div>
                            <div className="w-px h-10" style={ { background: `linear-gradient(to top, transparent, ${accentColor}40)` } }></div>
                        </div>
                        <div className="flex-1 flex flex-col justify-center relative z-10 min-w-[140px] group/cons pl-0 md:pl-4">
                            <p className="text-[10px] font-black tracking-[0.2em] text-red-500 uppercase mb-3 flex items-center gap-1.5 transition-transform duration-300 group-hover/cons:translate-x-1 drop-shadow-sm">
                                <Minus size={12} className="transition-transform duration-300 group-hover/cons:scale-125" /> <span className="font-light text-red-500">KNOWN</span> <span className="text-red-500">LIABILITIES</span>
                            </p>
                            <ul className="space-y-2 overflow-hidden max-h-[70px] pr-2 pointer-events-none" style={ { scrollbarWidth: "thin", scrollbarColor: "#F87171 transparent" } }>
                                {consList.map((con: string, i: number) => (
                                    <li key={`con-${i}`} className="text-[11px] text-gray-600 font-bold leading-tight flex items-start gap-2 hover:text-gray-900 transition-colors group/item">
                                        <span className="w-1 h-3 border-l-[3px] mt-0.5 shrink-0 border-red-400 transition-all duration-300 group-hover/item:h-4 group-hover/item:shadow-[0_0_8px_rgba(248,113,113,0.5)]"/> 
                                        <span className="transition-transform duration-300 group-hover/item:translate-x-0.5 min-w-0 flex-1 break-words ">{con}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    </AnimatePresence>
  );
};
