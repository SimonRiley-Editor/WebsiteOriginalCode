"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronDown, SlidersHorizontal, Download, Star, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Character, mockCharacters, tiersConfig } from '@/lib/data/tierListData';

export function TierListView() {
  const [selectedChar, setSelectedChar] = useState<Character | null>(mockCharacters[0] || null);

  return (
    <div className="w-full text-white bg-[#0A0A10] h-full flex flex-col pt-24 px-8 pb-12 overflow-y-auto no-scrollbar">
      <div className="max-w-[1400px] w-full mx-auto flex flex-col xl:flex-row gap-6">
        
        {/* Main List Section */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold tracking-wide text-white uppercase flex items-center gap-2">
                Character Tier List
              </h1>
              <p className="text-[#8F8FA3] text-sm mt-1">
                Comprehensive rankings of all characters based on their performance in the current meta.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex rounded-md p-1 bg-[#151520] border border-white/5">
                <button title="Action" className="px-4 py-2 text-xs font-semibold rounded bg-[#3D2952] text-[#E0C2FF] transition-colors">
                  TIER VIEW
                </button>
                <button className="px-4 py-2 text-xs font-semibold rounded hover:bg-white/5 text-[#8F8FA3] transition-colors">
                  GRID VIEW
                </button>
              </div>
              <button className="px-4 py-2 flex items-center gap-2 text-xs font-semibold rounded-md border border-white/5 bg-[#151520] text-[#8F8FA3] hover:text-white transition-colors">
                HOW WE RANK
              </button>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <div className="relative flex-1 min-w-[200px] max-w-[400px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8F8FA3]" />
              <input
                type="text"
                placeholder="Search characters..."
                className="w-full pl-9 pr-4 py-2.5 bg-[#151520] border border-white/5 rounded-md text-sm text-white placeholder:text-[#4A4A68] focus:outline-none focus:border-[#6C5B8B] transition-colors"
              />
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#151520] border border-white/5 rounded-md text-sm text-[#8F8FA3] cursor-pointer hover:border-[#6C5B8B] transition-colors">
              <span className="text-[#4A4A68]">Sort by:</span>
              <span className="text-white ml-2">Tier</span>
              <ChevronDown size={14} className="ml-4" />
            </div>

            <button className="ml-auto px-4 py-2.5 flex items-center gap-2 text-sm font-semibold rounded-md border border-[#3D2952] bg-[#151520] text-[#E0C2FF] hover:bg-[#3D2952]/50 transition-colors">
              <Download size={14} /> Export Tier List
            </button>
          </div>

          {/* Tier Rows */}
          <div className="flex flex-col gap-8 bg-[#151520] p-6 rounded-xl border border-white/5">
            {tiersConfig.map(tierLine => {
              const rowChars = mockCharacters.filter(c => c.tier === tierLine.id);
              if (rowChars.length === 0) return null;

              return (
                <div key={tierLine.id} className="flex flex-col lg:flex-row gap-6 lg:gap-8 pb-8 border-b border-white/5 last:border-0 last:pb-0">
                  {/* Tier Label */}
                  <div className="w-[140px] shrink-0">
                    <h2 className="text-5xl font-display font-bold leading-none" style={ { color: tierLine.color } }>
                      {tierLine.id}
                    </h2>
                    <h3 className="text-xs font-semibold tracking-wider uppercase mt-4 mb-2" style={ { color: tierLine.color } }>
                      {tierLine.title}
                    </h3>
                    <p className="text-[11px] text-[#8F8FA3] leading-relaxed pr-4">
                      {tierLine.desc}
                    </p>
                  </div>

                  {/* Character Grid */}
                  <div className="flex-1 flex flex-wrap gap-4 items-start">
                    {rowChars.map(char => {
                      const isSelected = selectedChar?.id === char.id;
                      return (
                        <div 
                          key={char.id}
                          onClick={() => setSelectedChar(char)}
                          className={cn(
                            "group cursor-pointer relative flex flex-col rounded-xl overflow-hidden transition-all duration-300",
                            isSelected 
                              ? "border-2 border-[#E0C2FF] shadow-[0_0_15px_rgba(224,194,255,0.3)]" 
                              : "border border-transparent hover:border-white/20"
                          )}
                          style={ { 
                            width: "100px", 
                            height: "135px",
                            borderColor: isSelected ? '#E0C2FF' : `${tierLine.color}40`, // 40 is hex opacity
                            borderWidth: isSelected ? '2px' : '1px'
                          } }
                        >
                          <div className="relative flex-1 w-full overflow-hidden">
                            <img 
                              src={char.imageUrl} 
                              alt={char.name} 
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                            />
                            {/* Inner gradient at the bottom of the image for blending if needed */}
                            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#151520] to-transparent" />
                            
                            {/* Element Badge (top left) */}
                            <div className="absolute top-1 left-1 w-5 h-5 rounded overflow-hidden flex items-center justify-center bg-black/50 backdrop-blur-md">
                              <div className="w-2 h-2 rounded-full" style={ { backgroundColor: tierLine.color } } />
                            </div>
                            
                            {/* Weapon Badge (top right, just an icon or small box) */}
                            <div className="absolute top-1 right-1 w-5 h-5 rounded overflow-hidden flex items-center justify-center bg-black/50 backdrop-blur-md">
                              <span className="text-[10px] text-white/70 font-serif">W</span>
                            </div>
                          </div>
                          
                          {/* Bottom info area */}
                          <div className="h-[46px] w-full bg-[#151520] flex flex-col items-center justify-center pb-1">
                            <span className="text-[11px] font-semibold text-white tracking-wide">
                              {char.name}
                            </span>
                            <div className="flex gap-[2px] mt-0.5">
                              {[...Array(char.stars)].map((_, i) => (
                                <Star key={i} size={8} fill={tierLine.color} style={ { color: tierLine.color } } />
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between mt-6 text-sm text-[#4A4A68]">
            <div className="flex gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded border border-[#2A2A3C] hover:text-white transition-colors px-2">&lt;</button>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-[#3D2952] text-[#E0C2FF] border border-[#6C5B8B]">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-[#2A2A3C] hover:text-white transition-colors">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-[#2A2A3C] hover:text-white transition-colors">3</button>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-[#2A2A3C] hover:text-white transition-colors">4</button>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-[#2A2A3C] hover:text-white transition-colors">5</button>
              <span className="w-8 h-8 flex items-center justify-center">...</span>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-[#2A2A3C] hover:text-white transition-colors">9</button>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-[#2A2A3C] hover:text-white transition-colors px-2">&gt;</button>
            </div>
            
            <div className="flex items-center gap-4">
              <span>Showing 1-24 of 210</span>
              <div className="flex items-center gap-2 px-3 py-1.5 border border-[#2A2A3C] rounded">
                <span>24 / page</span>
                <ChevronDown size={14} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Info Panel */}
        {selectedChar && (
          <div className="xl:w-[340px] shrink-0 sticky top-24 h-max bg-[#12121A] border border-white/5 rounded-2xl overflow-hidden flex flex-col">
            <div className="relative h-[300px] w-full">
              <img 
                src={selectedChar.imageUrl} 
                alt={selectedChar.name} 
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12121A] via-transparent to-transparent opacity-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12121A] via-[#12121A]/20 to-transparent" />
              
              {/* Badge top-left */}
              <div className="absolute top-4 left-4 px-2 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-[#E0C2FF] tracking-wider uppercase">
                {selectedChar.tier} TIER
              </div>
              
              {/* Star / Save action */}
              <button className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 backdrop-blur border border-white/10 text-white hover:bg-white/10 transition-colors">
                <Star size={14} />
              </button>
            </div>

            <div className="p-6 pt-0 flex flex-col gap-6 relative z-10 -mt-6">
              
              <div>
                <h2 className="text-3xl font-display font-bold text-white mb-1">
                  {selectedChar.name}
                </h2>
                <div className="flex gap-1 mb-4">
                  {[...Array(selectedChar.stars)].map((_, i) => (
                    <Star key={i} size={14} fill="#FF4D4D" className="text-[#FF4D4D]" />
                  ))}
                </div>
                
                <div className="flex items-center gap-6 text-sm text-[#8F8FA3] font-medium border-b border-white/5 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-sm bg-white/5 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                    </div>
                    {selectedChar.element}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-sm bg-white/5 flex items-center justify-center font-serif italic text-xs">
                      W
                    </div>
                    {selectedChar.weapon}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                {selectedChar.roles.map(role => (
                  <span key={role} className="px-3 py-1 rounded-full bg-[#3D2952]/40 text-[#E0C2FF] text-[10px] font-bold uppercase tracking-wider border border-[#3D2952]">
                    {role}
                  </span>
                ))}
              </div>

              <div className="space-y-4">
                {selectedChar.bestWeapons && selectedChar.bestWeapons.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-[#8F8FA3] uppercase tracking-wider mb-2">Recommended Weapons</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedChar.bestWeapons.map((wpn, i) => (
                        <div key={i} className="px-3 py-1.5 rounded bg-[#151520] border border-white/5 text-xs text-[#E0C2FF] font-medium">
                          {wpn}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedChar.bestEchoes && selectedChar.bestEchoes.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-[#8F8FA3] uppercase tracking-wider mb-2">Recommended Echo Sets</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedChar.bestEchoes.map((echo, i) => (
                        <div key={i} className="px-3 py-1.5 rounded bg-[#151520] border border-white/5 text-xs text-white font-medium">
                          {echo}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <h3 className="text-xs font-bold text-[#8F8FA3] uppercase tracking-wider mb-3 mt-4">Strengths</h3>
                  <ul className="space-y-2">
                    {selectedChar.strengths.map((str, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#D4D4E8]">
                        <span className="text-[#C084FC] mt-0.5">•</span> {str}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xs font-bold text-[#8F8FA3] uppercase tracking-wider mb-3">Weaknesses</h3>
                  <ul className="space-y-2">
                    {selectedChar.weaknesses.map((wk, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#D4D4E8]">
                        <span className="text-[#FF4D4D] mt-0.5">•</span> {wk}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {selectedChar.bestWith.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-[#8F8FA3] uppercase tracking-wider mb-3">Best With</h3>
                  <div className="flex gap-3">
                    {selectedChar.bestWith.map((id, index) => {
                      const peer = mockCharacters.find(c => c.id === id);
                      if (!peer) return null;
                      return (
                        <div key={index} className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 relative group cursor-pointer">
                          <img src={peer.imageUrl} alt={peer.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <Link href={`/characters/${selectedChar.name.toLowerCase()}`} className="w-full mt-2 group relative overflow-hidden rounded-lg bg-[#2A1B38] border border-[#482F63] px-4 py-3 flex items-center justify-center gap-2 transition-all hover:border-[#B28BE0] hover:shadow-[0_0_20px_rgba(178,139,224,0.3)]">
                <span className="relative z-10 text-xs font-bold text-[#E0C2FF] uppercase tracking-wider">
                  View Full Guide
                </span>
                <ArrowRight size={14} className="relative z-10 text-[#E0C2FF] group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#482F63]/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
