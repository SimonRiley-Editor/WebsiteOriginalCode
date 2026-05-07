"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const MacOSDock = ({ items, activeSection, setActiveSection }: any) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isHoveredArea, setIsHoveredArea] = useState(false);

  return (
    <div 
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100]"
      onMouseEnter={() => setIsHoveredArea(true)}
      onMouseLeave={() => {
        setIsHoveredArea(false);
        setHoveredIndex(null);
      }}
    >
      <motion.div 
        animate={{ 
          y: isHoveredArea ? 0 : 24,
          scale: isHoveredArea ? 1 : 0.85,
          opacity: isHoveredArea ? 1 : 0.6,
        }}
        initial={{ y: 50, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="flex items-end gap-2 md:gap-3 px-4 py-3 rounded-[2rem] bg-white/30 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-colors duration-300 hover:bg-white/50 h-[72px]"
      >
        {items.map((item: any, i: number) => {
          const isHovered = hoveredIndex === i;
          const isNeighbor = hoveredIndex !== null && Math.abs(hoveredIndex - i) === 1;
          
          let scale = 1;
          if (isHovered) scale = 1.35;
          else if (isNeighbor) scale = 1.15;

          const isActive = activeSection === item.id;

          return (
            <div key={item.id} className="relative flex justify-center items-end h-full">
              <motion.button
                onClick={() => setActiveSection(item.id)}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                animate={{ 
                   scale: isHovered ? 1.25 : isNeighbor ? 1.1 : 1, 
                   y: isHovered ? -8 : isNeighbor ? -4 : 0,
                }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                className={`relative flex items-center justify-center rounded-[1.25rem] w-12 h-12 origin-bottom
                  ${isActive 
                    ? 'bg-[#1C1C1E]/95 shadow-[0_4px_12px_rgba(0,0,0,0.3)] border-[#333333] text-[#D4AF37]' 
                    : 'bg-white/60 hover:bg-white/90 border-white/50 shadow-sm text-gray-600'} 
                  ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} border backdrop-blur-md overflow-visible`}
                disabled={item.disabled}
              >
                <div className={`transition-colors duration-300 w-full h-full flex items-center justify-center ${isActive ? 'drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]' : ''}`}>
                  {item.icon}
                </div>
                
                {isActive && (
                  <motion.div 
                      layoutId="activeTabDot"
                      className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#D4AF37] rounded-full shadow-[0_0_8px_rgba(212,175,55,0.6)]" 
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  />
                )}
              </motion.button>
              
              <AnimatePresence>
                {isHovered && isHoveredArea && (
                  <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute -top-14 px-3 py-1.5 bg-gray-900/90 backdrop-blur-md rounded-lg text-xs font-semibold text-white shadow-xl whitespace-nowrap pointer-events-none z-50 flex items-center gap-2 border border-gray-700"
                  >
                      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />}
                      {item.label}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};
