import React from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { LayoutGrid, Twitter, Youtube, Twitch } from 'lucide-react';
import { ELEMENTS } from '@/lib/data/wwData';

interface SidebarProps {
  selectedElement: string;
  setSelectedElement: (val: string) => void;
  setSelectedIndex: (val: number) => void;
}

export const WWSidebar: React.FC<SidebarProps> = ({ selectedElement, setSelectedElement, setSelectedIndex }) => {
  return (
       <motion.div 
            className="group/sidebar relative left-0 top-0 bg-[#FAFAFC] md:bg-[#FAFAFC]/95 md:backdrop-blur-xl text-gray-800 z-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)] border-r border-[#E2E4EB]/60 h-full flex flex-col overflow-hidden transition-[width,min-width] duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] w-[88px] min-w-[88px] hover:w-[260px] hover:min-w-[260px] shrink-0"
       >
           <div className="w-[260px] min-w-[260px] h-full flex flex-col items-start relative pb-6 pointer-events-auto">
               
               <div className="pt-10 pb-8 flex items-center h-[100px] w-full relative border-b border-gray-100/50 px-[20px]">
                    <div className="flex items-center gap-[16px] w-full relative">
                        <div className="w-12 h-12 group-hover/sidebar:w-10 group-hover/sidebar:h-10 rounded-xl group-hover/sidebar:rounded-full flex items-center justify-center bg-gray-100 shadow-md border border-gray-200/50 overflow-hidden transition-all duration-300 shrink-0 relative z-10">
                            <img src="https://res.cloudinary.com/ds6dwbk37/image/upload/v1777200649/channels4_profile_whsfqf_igz3gu.png" alt="GrimVeil" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 whitespace-nowrap overflow-hidden pointer-events-none group-hover/sidebar:pointer-events-auto">
                            <h1 className="font-black text-[22px] tracking-[0.2em] text-gray-900 leading-none" style={ { textShadow: "0 2px 10px rgba(0,0,0,0.05)", fontFamily: 'var(--font-cinzel), serif' } }>GRIMVEIL</h1>
                            <h2 className="font-bold text-[10px] tracking-[0.3em] text-gray-400 uppercase mt-1 pl-1" style={ { fontFamily: 'var(--font-cinzel), serif' } }>Guide School</h2>
                        </div>
                    </div>
                </div>

               <div className="flex-1 overflow-y-auto w-full no-scrollbar flex flex-col pt-8 px-4 gap-2">
                  <div className="flex flex-col mb-2">
                      <button title="Action"
                         onClick={() => { setSelectedElement('all'); setSelectedIndex(0); } }
                         className={`w-full flex items-center justify-start pl-[20px] py-[14px] rounded-xl relative transition-all duration-300 group ${selectedElement === 'all' ? 'bg-[#1C1D24] shadow-lg border-transparent scale-100' : 'bg-transparent hover:bg-gray-100'}`}
                      >
                         <div className="flex items-center gap-[22px]">
                            <LayoutGrid size={18} className={selectedElement === 'all' ? 'text-[#FF4C5A]' : 'text-gray-400 group-hover:text-gray-600 transition-colors'} />
                            <span className={`text-[12px] font-cinzel tracking-widest uppercase font-bold transition-all duration-300 whitespace-nowrap ${selectedElement === 'all' ? 'text-white' : 'text-gray-600 group-hover:text-gray-900'} opacity-0 group-hover/sidebar:opacity-100 transition-all duration-300 group-hover/sidebar:delay-100`}>ALL ELEMENTS</span>
                         </div>
                      </button>
                  </div>

                  <div className="flex flex-col gap-1">
                      {ELEMENTS.map(el => (
                         <button
                            key={el.id}
                            onClick={() => { setSelectedElement(el.id); setSelectedIndex(0); } }
                            className={`w-full flex items-center justify-start pl-[20px] py-[14px] rounded-xl relative transition-all duration-300 group ${selectedElement === el.id ? 'bg-[#1C1D24] shadow-lg border-transparent scale-100' : 'bg-transparent hover:bg-gray-100'}`}
                            style={ {
                               boxShadow: selectedElement === el.id ? `0 8px 24px -8px ${el.color}60` : undefined,
                            } }
                         >
                            <div className="flex items-center gap-[22px]">
                                <img src={el.imgSrc || undefined} alt={el.name} className={`w-[18px] h-[18px] object-contain transition-all duration-300 ${selectedElement === el.id ? 'opacity-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] brightness-0 invert' : 'opacity-60 group-hover:opacity-80 grayscale group-hover:grayscale-0'}`} />
                                <span className={`text-[12px] font-cinzel tracking-widest uppercase font-bold transition-all duration-300 whitespace-nowrap ${selectedElement === el.id ? 'text-white' : 'text-gray-600 group-hover:text-gray-900'} opacity-0 group-hover/sidebar:opacity-100 transition-all duration-300 group-hover/sidebar:delay-100`}>{el.name}</span>
                            </div>
                         </button>
                      ))}
                  </div>
               </div>
               
               <div className="w-full px-4 mt-auto">
                   <div className="w-full rounded-xl transition-colors duration-300 group-hover/sidebar:bg-white group-hover/sidebar:border group-hover/sidebar:border-gray-100 group-hover/sidebar:shadow-sm">
                       <div className="px-4 py-4 pt-5">
                           <p className="text-[10px] font-bold tracking-widest text-[#6B7280] uppercase mb-4 opacity-0 group-hover/sidebar:opacity-100 transition-all duration-300 group-hover/sidebar:delay-100 whitespace-nowrap">
                               SOCIAL
                           </p>
                           <div className="flex flex-col gap-1">
                               <Link href="https://x.com/saintontas" target="_blank" rel="noopener noreferrer" className="flex items-center justify-start pl-1 py-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-500 hover:text-gray-900 group">
                                   <div className="w-[20px] flex justify-center"><Twitter size={15} className="group-hover:text-[#1DA1F2] transition-colors" /></div>
                                   <span className="text-[11px] ml-[20px] font-semibold tracking-wide opacity-0 group-hover/sidebar:opacity-100 transition-all duration-300 group-hover/sidebar:delay-100 whitespace-nowrap">Twitter</span>
                               </Link>
                               <Link href="https://www.youtube.com/@saintontas" target="_blank" rel="noopener noreferrer" className="flex items-center justify-start pl-1 py-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-500 hover:text-gray-900 group">
                                   <div className="w-[20px] flex justify-center"><Youtube size={15} className="group-hover:text-[#FF0000] transition-colors" /></div>
                                   <span className="text-[11px] ml-[20px] font-semibold tracking-wide opacity-0 group-hover/sidebar:opacity-100 transition-all duration-300 group-hover/sidebar:delay-100 whitespace-nowrap">Youtube</span>
                               </Link>
                               <Link href="https://www.twitch.tv/saintontas" target="_blank" rel="noopener noreferrer" className="flex items-center justify-start pl-1 py-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-500 hover:text-gray-900 group">
                                   <div className="w-[20px] flex justify-center"><Twitch size={15} className="group-hover:text-[#9146FF] transition-colors" /></div>
                                   <span className="text-[11px] ml-[20px] font-semibold tracking-wide opacity-0 group-hover/sidebar:opacity-100 transition-all duration-300 group-hover/sidebar:delay-100 whitespace-nowrap">Twitch</span>
                               </Link>
                           </div>
                       </div>
                   </div>
               </div>
           </div>
       </motion.div>
  );
};
