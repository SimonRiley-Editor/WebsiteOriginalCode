import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus } from 'lucide-react';

interface Props {
  isProsConsModalOpen: boolean;
  setIsProsConsModalOpen: (val: boolean) => void;
  activeGuide: any;
  prosList: string[];
  consList: string[];
}

export const WWProsConsModal: React.FC<Props> = ({ isProsConsModalOpen, setIsProsConsModalOpen, activeGuide, prosList, consList }) => {
  return (
    <AnimatePresence>
        {isProsConsModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }} 
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-[#FAFAFC]/80 backdrop-blur-sm"
                    onClick={() => setIsProsConsModalOpen(false)}
                />
                <motion.div 
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="relative w-full max-w-[1200px] bg-white rounded-3xl shadow-[0_40px_100px_rgba(0,0,0,0.15)] ring-1 ring-gray-200/50 z-10 pointer-events-auto overflow-hidden flex flex-col max-h-[90vh]"
                >
                    {/* Tech-inspired decorative top border */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#10B981] via-[rgb(0,180,255)] to-[#EF4444]" />
                    
                    {/* Header Section */}
                    <div className="relative px-8 md:px-12 pt-10 pb-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-gray-50/80 border-b border-gray-100 shrink-0">
                        <button 
                            onClick={() => setIsProsConsModalOpen(false)}
                            className="absolute top-8 right-8 p-3 bg-white shadow-sm rounded-full border border-gray-100 hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all text-gray-500 hover:text-gray-900"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex items-center gap-4 mb-3">
                            <div className="w-1.5 h-8 bg-gray-900 rounded-sm" />
                            <h2 className="text-3xl font-black tracking-tight text-gray-900 uppercase">Tactical Assessment</h2>
                        </div>
                        <p className="text-base font-medium text-gray-500 flex items-center gap-3 ml-5">
                            <span className="text-gray-800 font-bold px-2 py-0.5 bg-gray-200/70 rounded">{activeGuide?.name || "Resonator"}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-400" /> 
                            <span>Strengths & Weaknesses</span>
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-200 overflow-hidden flex-1 min-h-0">
                        {/* Pros Column */}
                        <div className="bg-white p-8 md:p-12 flex flex-col group/pros overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "#10B981 transparent" }}>
                            <div className="flex items-center gap-4 mb-10 pb-5 border-b border-gray-100">
                                <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 border border-green-100 shadow-inner">
                                    <Plus size={24} className="transition-transform duration-500 group-hover/pros:rotate-90 group-hover/pros:scale-110" /> 
                                </div>
                                <div>
                                    <p className="text-[10px] font-black tracking-[0.25em] text-green-600/80 uppercase mb-1">Tactical</p>
                                    <h3 className="text-xl font-black tracking-tight text-gray-900 uppercase">Advantages</h3>
                                </div>
                            </div>
                            <ul className="space-y-6">
                                {prosList.map((pro: string, i: number) => (
                                    <li key={`pro-modal-${i}`} className="text-lg text-gray-600 font-medium leading-relaxed flex items-start gap-5 group/item">
                                        <div className="mt-2.5 shrink-0 relative flex items-center justify-center">
                                            <span className="absolute w-4 h-4 bg-green-100 rounded-full scale-0 group-hover/item:scale-100 transition-transform duration-300" />
                                            <span className="relative w-2 h-2 rounded-full bg-green-500 shadow-[0_0_12px_rgba(16,185,129,0.6)] group-hover/item:scale-110 transition-transform duration-300"/> 
                                        </div>
                                        <span className="group-hover/item:text-gray-900 transition-colors">{pro}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Cons Column */}
                        <div className="bg-white p-8 md:p-12 flex flex-col group/cons overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "#EF4444 transparent" }}>
                            <div className="flex items-center gap-4 mb-10 pb-5 border-b border-gray-100">
                                <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 border border-red-100 shadow-inner">
                                    <Minus size={24} className="transition-transform duration-500 group-hover/cons:scale-125" /> 
                                </div>
                                <div>
                                    <p className="text-[10px] font-black tracking-[0.25em] text-red-600/80 uppercase mb-1">Known</p>
                                    <h3 className="text-xl font-black tracking-tight text-gray-900 uppercase">Liabilities</h3>
                                </div>
                            </div>
                            <ul className="space-y-6">
                                {consList.map((con: string, i: number) => (
                                    <li key={`con-modal-${i}`} className="text-lg text-gray-600 font-medium leading-relaxed flex items-start gap-5 group/item">
                                        <div className="mt-2.5 shrink-0 relative flex items-center justify-center w-4 h-4">
                                            <span className="absolute inset-0 bg-red-100 rounded-full scale-0 group-hover/item:scale-100 transition-transform duration-300" />
                                            <span className="relative w-2 h-0.5 bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)] group-hover/item:scale-x-125 transition-transform duration-300" />
                                        </div>
                                        <span className="group-hover/item:text-gray-900 transition-colors">{con}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
  );
};
