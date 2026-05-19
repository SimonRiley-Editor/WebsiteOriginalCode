import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutGrid, Compass } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { ELEMENTS, fallbackGuides, getSafeField } from '@/lib/data/wwData';
import { WWSidebar } from '@/components/ww/WWSidebar';
import { WWInfoPanel } from '@/components/ww/WWInfoPanel';
import { WWTacticalProfile } from '@/components/ww/WWTacticalProfile';
import { WWInsightBar } from '@/components/ww/WWInsightBar';
import { WWRosterModal } from '@/components/ww/WWRosterModal';
import { WWProsConsModal } from '@/components/ww/WWProsConsModal';

const HiyukiSpinePlayer = dynamic(() => import('@/components/HiyukiSpinePlayer'), {
  ssr: false,
});

export const WutheringWavesUI = ({ guides, loading }: { guides: any[], loading: boolean }) => {
  const [selectedElement, setSelectedElement] = useState<string>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);
  const [activeInsightTab, setActiveInsightTab] = useState<'assessment' | 'proscons'>('assessment');
  const [isProsConsModalOpen, setIsProsConsModalOpen] = useState(false);
  const [isRosterModalOpen, setIsRosterModalOpen] = useState(false);
  const isMobile = useIsMobile();

  const safeGuides = guides?.length ? guides : fallbackGuides;
  
  const filteredGuides = selectedElement === 'all' 
     ? safeGuides 
     : safeGuides.filter(g => g.element?.toLowerCase() === selectedElement);

  const activeGuide = filteredGuides.length > 0
     ? filteredGuides[Math.min(selectedIndex, filteredGuides.length - 1)] 
     : null;

  if (!activeGuide) {
      return (
          <div className="w-full h-svh bg-[#FAFAFC] relative flex flex-col items-center justify-center p-8 text-center text-gray-400 font-sans overflow-hidden">
               <div className="absolute inset-0 pointer-events-none z-0 opacity-20" 
                    style={ { backgroundImage: 'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' } } 
               />
               <motion.div 
                    initial={{ opacity: 0, scale: 0.95 } }
                    animate={{ opacity: 1, scale: 1 } }
                    className="relative z-10 flex flex-col items-center bg-white/80 md:bg-white/50 md:backdrop-blur-3xl border border-white/60 p-12 rounded-3xl shadow-[0_4px_24px_rgb(0,0,0,0.02)]"
               >
                   <Compass size={48} strokeWidth={1} className="text-gray-300 mb-6 animate-[spin_10s_linear_infinite]" />
                   <h2 className="font-display font-black text-2xl text-gray-800 tracking-widest uppercase mb-2">No Signal Detected</h2>
                   <p className="text-sm text-gray-500 font-medium mb-8 max-w-[280px]">We couldn&apos;t locate any resonators matching this elemental resonance.</p>
                   
                   <button title="Action" 
                       onClick={() => setSelectedElement('all')}
                       className="group relative flex items-center gap-3 px-8 py-4 bg-gray-900 text-white text-[11px] font-black tracking-[0.2em] uppercase rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5"
                   >
                       <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
                       <span className="relative z-10">Reset Frequency</span>
                       <LayoutGrid size={14} className="relative z-10 opacity-70 group-hover:opacity-100 transition-opacity" />
                   </button>
               </motion.div>
          </div>
      );
  }
  
  const currentElementObj = ELEMENTS.find(e => e.id === activeGuide?.element?.toLowerCase()) || ELEMENTS.find(e => e.id === 'glacio');
  const accentColor = currentElementObj?.color || '#F87171'; // Default to fusion red

  const roleOverviewData = activeGuide?.content?.roleOverview || {};
  const activeRole = roleOverviewData.role || getSafeField(activeGuide, ['role', 'class']) || 'MAIN DPS';
  const activeWeapon = roleOverviewData.weapon || getSafeField(activeGuide, ['weapon', 'weapontype']) || 'LAMENT';
  const bestForOptions = roleOverviewData.bestFor?.length ? roleOverviewData.bestFor : ['Sustained Damage', 'AoE Damage', `${activeGuide?.element || 'Fusion'} Teams`];
  
  const faction = 'RESONATOR'; // User requested to replace Startoch Academy everywhere with RESONATOR
  const description = getSafeField(activeGuide, ['description', 'summary', 'overview', 'info']) || 'A brilliant and confident operator. She balances elegant combat techniques with explosive damage output.';
  
  const prosList = activeGuide?.content?.pros || ['High damage output', 'Easy to play', 'Excellent AoE Capabilities'];
  const consList = activeGuide?.content?.cons || ['Requires field time', 'Relies on Resonance Liberation', 'Squishy base stats'];
  
  const cStats = activeGuide?.content?.stats || {};
  const statHP = cStats.hp?.toString() || getSafeField(activeGuide, ['hp'])?.toString() || '10,825';
  const statATK = cStats.atk?.toString() || getSafeField(activeGuide, ['atk'])?.toString() || '412';
  const statDEF = cStats.def?.toString() || getSafeField(activeGuide, ['def'])?.toString() || '1,238';
  const statCritRate = cStats.critRate?.toString() || getSafeField(activeGuide, ['critRate', 'crit_rate'])?.toString() || '24.3%';
  const parseStat = (statStr: string | number) => parseInt(String(statStr).replace(/,/g, "")) || 0;
  const hpWidth = Math.min(100, Math.max(10, (parseStat(statHP) / 20000) * 100)) + "%";
  const atkWidth = Math.min(100, Math.max(10, (parseStat(statATK) / 2500) * 100)) + "%";
  const defWidth = Math.min(100, Math.max(10, (parseStat(statDEF) / 1500) * 100)) + "%";
  const statCritDmg = cStats.critDmg?.toString() || getSafeField(activeGuide, ['critDmg', 'crit_dmg'])?.toString() || '150.0%';
  const powerLevel = cStats.powerLevel?.toString() || getSafeField(activeGuide, ['powerLevel', 'power_level'])?.toString() || 'S+';
  const powerLevelText = cStats.powerLevelText || getSafeField(activeGuide, ['powerLevelText']) || `${activeGuide?.name || 'This resonator'} is highly valued in the current meta, bringing exceptional tactical efficiency to optimal team compositions. Their rating reflects theoretical peak performance with flawless combat rotations.`;

  if (loading) {
    return (
      <div className="w-full h-svh flex items-center justify-center bg-[#FAFAFC]">
         <div className="w-12 h-12 rounded-full border-b-2 border-gray-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-svh bg-[#FAFAFC] relative overflow-hidden font-sans text-gray-800 flex">
       {/* Global Light Grid Overlay */}
       <div className="absolute inset-0 pointer-events-none z-0 opacity-20" 
            style={ { backgroundImage: 'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' } } 
       />

       {/* Left Sidebar Menu */}
       <WWSidebar 
         selectedElement={selectedElement} 
         setSelectedElement={setSelectedElement} 
         setSelectedIndex={setSelectedIndex} 
       />

       {/* Main Content Area */}
       <div className="w-[calc(100vw-88px)] min-w-[calc(100vw-88px)] shrink-0 relative flex flex-col overflow-hidden h-full">
           
           {/* Global Background Image */}
           <div className="absolute inset-0 z-0 pointer-events-none">
                <Image 
                    src="https://res.cloudinary.com/ds6dwbk37/image/upload/f_auto,q_auto/v1777021473/Gemini_Generated_Image_1861z51861z51861_rljygl.png" 
                    alt="Global Background" 
                    className="w-full h-full object-cover opacity-60"
                    fill
                    sizes="100vw"
                    priority
                />
               <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-[#F2F3F5]/90 pointer-events-none"></div>
           </div>

           {/* Background Clean Layout */}
           <AnimatePresence>
                <motion.div 
                    key={`glow-${activeGuide?.id}`}
                    initial={{ opacity: 0 } }
                    animate={{ opacity: 1 } }
                    exit={{ opacity: 0 } }
                    transition={{ duration: 1 } }
                    className="absolute inset-0 z-0 pointer-events-none overflow-hidden transform-gpu"
               >
                   {/* Left gradient mask over image */}
                   <div className="absolute top-0 left-0 bottom-0 w-full max-w-[800px] pointer-events-none" style={ {
                        background: `linear-gradient(90deg, #FAFAFC 0%, transparent 100%)`,
                   } } />
                   
                   {/* Color tint based on element */}
                    <div className="absolute inset-0 pointer-events-none opacity-20 md:mix-blend-overlay" style={ { backgroundColor: accentColor } } />

                   {/* Giant Decorative Element Icon Behind Character */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%] opacity-[0.03] pointer-events-none md:mix-blend-multiply scale-[1.5] md:blur-[4px] hidden md:block">
                        <img src={currentElementObj?.imgSrc || undefined} alt="Element Background" className="w-[900px] h-auto object-contain" />
                    </div>

                   {/* A very soft glow near the character */}
                    <div 
                         className="absolute top-1/2 left-1/2 -translate-x-1/3 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[140px] opacity-15 pointer-events-none md:mix-blend-color hidden md:block"
                         style={ { backgroundColor: accentColor } }
                    />
               </motion.div>
           </AnimatePresence>

           {/* Giant Background Typography */}
           <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none overflow-hidden select-none pb-[5%]">
              <AnimatePresence mode="wait">
                  <motion.h1 
                     key={`bg-text-${activeGuide?.id}`}
                     initial={{ scale: 0.95, opacity: 0 } }
                     animate={{ scale: 1, opacity: 0.02 } }
                     exit={{ scale: 1.05, opacity: 0 } }
                     transition={{ duration: 0.8 } }
                     className="font-display font-black text-[12vw] sm:text-[14vw] md:text-[16vw] lg:text-[18vw] tracking-tighter text-gray-900 whitespace-nowrap leading-none"
                  >
                     {activeGuide?.name?.toUpperCase() || 'UNKNOWN'}
                  </motion.h1>
              </AnimatePresence>
           </div>

           {/* Top Info Header */}
           <div className="w-full px-8 py-8 flex justify-between items-start z-20 relative pointer-events-none">
               {/* Character Roster Selector */}
               <div className="pointer-events-auto">
                    <button 
                        onClick={() => setIsRosterModalOpen(true)}
                         className="group flex items-center gap-3 p-2 pr-5 bg-black/90 md:bg-black/80 md:backdrop-blur-md rounded-2xl shadow-xl border border-white/10 hover:border-white/30 transition-all duration-300 text-left"
                    >
                        <div className="w-12 h-12 rounded-xl overflow-hidden relative">
                            <Image src={activeGuide?.content?.images?.avatar || activeGuide?.content?.cardImage || activeGuide?.content?.foregroundImage || activeGuide?.imageUrl || '/placeholder.png'} className="object-cover object-top" alt={activeGuide?.name || 'Avatar'} fill sizes="48px" unoptimized />
                        </div>
                        <div className="flex flex-col items-start leading-tight">
                            <p className="text-[9px] text-gray-400 font-bold tracking-[0.2em] uppercase mb-0.5">Current Roster</p>
                            <p className="text-sm text-white font-black tracking-widest uppercase">{activeGuide?.name}</p>
                        </div>
                        <LayoutGrid size={16} className="text-gray-400 ml-4 group-hover:text-white transition-colors" />
                    </button>
               </div>

               {/* Top Right Logo/Faction */}
               <div className="text-right flex items-center gap-4 pointer-events-auto">
                   <div>
                       <p className="text-[10px] tracking-widest text-gray-500 uppercase font-black">{faction}</p>
                       <p className="text-2xl font-display font-black tracking-widest text-gray-800 uppercase">{activeGuide?.name}</p>
                   </div>
                   <div className="w-12 h-12 border-2 border-gray-300 rounded-full flex items-center justify-center opacity-60 bg-white shadow-sm">
                       <LayoutGrid size={24} className="text-gray-800" />
                   </div>
               </div>
           </div>

           {/* Central Character Splashes */}
           <div className="absolute inset-0 z-10 pointer-events-none flex justify-center pb-[10px] lg:pb-[20px] h-full items-end">
               <AnimatePresence mode="wait">
                   {activeGuide && (
                       <motion.div
                           key={`splash-wrap-${activeGuide.id}`}
                           initial={{ opacity: 0, scale: 1.05, y: 20 } }
                           animate={{ opacity: 1, scale: 1, y: 0 } }
                           exit={{ opacity: 0, scale: 1.02, y: -20 } }
                           transition={{ duration: 0.6, ease: "easeOut" } }
                           className="h-[85%] lg:h-[95%] w-full flex justify-center items-end transform-gpu will-change-transform"
                       >
                           <div className="relative h-full transition-transform duration-500 ease-out group/char cursor-pointer pointer-events-auto flex justify-center w-full">
                                {activeGuide?.content?.spine && !isMobile ? (
                                  <>
                                    {showAnimation && (
                                      <div 
                                          className="h-full transition-all duration-700 ease-out origin-bottom group-hover/char:-translate-y-2 group-hover/char:scale-[1.02] pointer-events-auto relative w-full flex justify-center transform-gpu"
                                          style={ { 
                                              maskImage: 'linear-gradient(to top, transparent 2%, black 25%)',
                                              transform: `translate(${activeGuide.content?.spine?.offset?.x || 0}%, ${activeGuide.content?.spine?.offset?.y || 0}%) scale(${activeGuide.content?.spine?.offset?.scale || 1.1})`,
                                              width: '800px',
                                              paddingBottom: '0',
                                          } }
                                      >
                                          <HiyukiSpinePlayer 
                                              skelUrl={activeGuide.content?.spine?.skelUrl}
                                              atlasUrl={activeGuide.content?.spine?.atlasUrl}
                                              textures={activeGuide.content?.spine?.textures}
                                              animation={activeGuide.content?.spine?.animation}
                                              skin={activeGuide.content?.spine?.skin}
                                              viewport={activeGuide.content?.spine?.viewport}
                                          />
                                      </div>
                                    )}
                                    {!showAnimation && (
                                      <img
                                          src={activeGuide.content?.foregroundImage || activeGuide.content?.cardImage || activeGuide.imageUrl || undefined}
                                          alt={activeGuide.name}
                                          className={`h-full w-auto max-w-[none] object-contain object-bottom transition-all duration-700 ease-out origin-bottom group-hover/char:drop-shadow-[0_15px_35px_rgba(255,255,255,0.4)] group-hover/char:-translate-y-2 group-hover/char:scale-[1.02] pointer-events-auto cursor-pointer`}
                                          style={ { 
                                              maskImage: 'linear-gradient(to top, transparent 2%, black 25%)',
                                              transform: `translate(${activeGuide.content?.imageOffset?.x || 0}%, ${activeGuide.content?.imageOffset?.y || 0}%) scale(${activeGuide.content?.imageOffset?.scale || 1})`,
                                          } }
                                      />
                                    )}
                                  </>
                                ) : (
                                    <img
                                        src={activeGuide.content?.foregroundImage || activeGuide.content?.cardImage || activeGuide.imageUrl || undefined}
                                        alt={activeGuide.name}
                                        className={`h-full w-auto max-w-[none] object-contain object-bottom transition-all duration-700 ease-out origin-bottom group-hover/char:drop-shadow-[0_15px_35px_rgba(255,255,255,0.4)] group-hover/char:-translate-y-2 group-hover/char:scale-[1.02] ${activeGuide.content?.foregroundImage ? 'pointer-events-auto cursor-pointer' : 'pointer-events-none'}`}
                                        style={ { 
                                            maskImage: 'linear-gradient(to top, transparent 2%, black 25%)',
                                            transform: `translate(${activeGuide.content?.imageOffset?.x || 0}%, ${activeGuide.content?.imageOffset?.y || 0}%) scale(${activeGuide.content?.imageOffset?.scale || 1})`
                                        } }
                                    />
                                )}
                            </div>
                       </motion.div>
                   )}
               </AnimatePresence>
           </div>

           {/* Mid Section Layout (Left Info, Right Module) */}
           <div className="flex-1 flex w-full justify-between items-start px-8 lg:px-12 relative z-20 pb-2 mt-2 min-h-0 pointer-events-none">
               {/* LEFT INFO PANEL */}
               <WWInfoPanel 
                 activeGuide={activeGuide}
                 showAnimation={showAnimation}
                 setShowAnimation={setShowAnimation}
                 accentColor={accentColor}
                 faction={faction}
                 description={description}
                 isMobile={isMobile}
               />

               {/* RIGHT TACTICAL PROFILE MODULE */}
               <WWTacticalProfile
                 activeGuide={activeGuide}
                 accentColor={accentColor}
                 activeRole={activeRole}
                 activeWeapon={activeWeapon}
                 powerLevel={powerLevel}
                 bestForOptions={bestForOptions}
                 statHP={statHP}
                 statATK={statATK}
                 statDEF={statDEF}
                 statCritRate={statCritRate}
                 statCritDmg={statCritDmg}
                 hpWidth={hpWidth}
                 atkWidth={atkWidth}
                 defWidth={defWidth}
               />
           </div>

           {/* BOTTOM SECTION */}
           <div className="w-full px-8 lg:px-12 relative z-30 pb-4 lg:pb-8 flex flex-col gap-6 mt-auto scale-[0.75] pt-0 md:scale-[0.80] origin-bottom xl:scale-[0.85] 2xl:scale-95">
               {/* 2. COMBAT INSIGHT BAR */}
               <WWInsightBar
                 activeGuide={activeGuide}
                 accentColor={accentColor}
                 activeInsightTab={activeInsightTab}
                 setActiveInsightTab={setActiveInsightTab}
                 powerLevel={powerLevel}
                 powerLevelText={powerLevelText}
                 prosList={prosList}
                 consList={consList}
                 setIsProsConsModalOpen={setIsProsConsModalOpen}
               />
           </div>
       </div>

       {/* Pros & Cons Modal Overlay */}
       <WWProsConsModal 
         isProsConsModalOpen={isProsConsModalOpen}
         setIsProsConsModalOpen={setIsProsConsModalOpen}
         activeGuide={activeGuide}
         prosList={prosList}
         consList={consList}
       />

       {/* Roster Selection Modal */}
       <WWRosterModal
         isRosterModalOpen={isRosterModalOpen}
         setIsRosterModalOpen={setIsRosterModalOpen}
         filteredGuides={filteredGuides}
         activeGuide={activeGuide}
         setSelectedIndex={setSelectedIndex}
       />
    </div>
  );
};