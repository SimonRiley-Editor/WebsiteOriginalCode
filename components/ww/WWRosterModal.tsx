import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { ELEMENTS } from '@/lib/data/wwData';

interface RosterModalProps {
  isRosterModalOpen: boolean;
  setIsRosterModalOpen: (val: boolean) => void;
  filteredGuides: any[];
  activeGuide: any;
  setSelectedIndex: (idx: number) => void;
}

export const WWRosterModal: React.FC<RosterModalProps> = ({
  isRosterModalOpen, setIsRosterModalOpen, filteredGuides, activeGuide, setSelectedIndex
}) => {
  return (
    <AnimatePresence>
        {isRosterModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12">
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }} 
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-md"
                    onClick={() => setIsRosterModalOpen(false)}
                />
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="relative w-full max-w-5xl h-[80vh] bg-[#121318] rounded-3xl shadow-[0_40px_100px_rgba(0,0,0,0.5)] border border-white/10 z-10 pointer-events-auto overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-8 border-b border-white/10 shrink-0 relative overflow-hidden">
                         {/* Decorative background for header */}
                         <div className="absolute inset-0 opacity-10 bg-gradient-to-r from-transparent via-[#FF4C5A] to-transparent pointer-events-none" />
                         
                         <div className="relative z-10">
                             <h2 className="text-2xl font-display font-black tracking-widest text-white uppercase mb-1">Select Resonator</h2>
                             <p className="text-xs font-mono tracking-widest text-gray-400 uppercase">{filteredGuides.length} Operators Available</p>
                         </div>
                         
                         <button 
                            onClick={() => setIsRosterModalOpen(false)}
                            className="relative z-10 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                         >
                            <X size={20} />
                         </button>
                    </div>
                    
                    {/* Roster Grid */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-8" style={{ scrollbarWidth: 'thin', scrollbarColor: '#333 transparent' }}>
                         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                            {filteredGuides.map((g, idx) => (
                                <button 
                                    key={g.id} 
                                    onClick={() => {
                                        setSelectedIndex(idx);
                                        setIsRosterModalOpen(false);
                                    }}
                                    className={`group relative aspect-[3/4] rounded-2xl overflow-hidden transition-all duration-300 ${activeGuide?.id === g.id ? 'ring-2 ring-white scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'hover:scale-105 hover:ring-2 hover:ring-white/50 opacity-70 hover:opacity-100 grayscale hover:grayscale-0'}`}
                                >
                                    <img src={g.content?.images?.avatar || g.content?.cardImage || g.content?.foregroundImage || g.imageUrl || undefined} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={g.name} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent flex flex-col justify-end p-3 sm:p-4">
                                        <p className="text-[10px] sm:text-xs text-left text-white font-black tracking-widest uppercase truncate">{g.name}</p>
                                        <div className="w-4 h-0.5 mt-1 rounded-full group-hover:w-full transition-all duration-300" style={{ backgroundColor: ELEMENTS.find(e => e.id === g.element?.toLowerCase())?.color || '#F87171' }} />
                                    </div>
                                </button>
                            ))}
                         </div>
                    </div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
  );
};
