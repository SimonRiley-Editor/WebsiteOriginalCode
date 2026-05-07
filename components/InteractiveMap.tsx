"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const InteractiveMap = () => {
    return (
        <div className="w-full h-full flex-1 relative font-sans flex flex-col bg-[#0a0a0a]">
            {/* Interactive Map via iframe */}
            <iframe 
                src="https://wuthering.gg/map"
                className="w-full h-full flex-1 border-none relative z-10"
                title="Wuthering Waves Interactive Map"
                allow="fullscreen"
            />
            
            {/* Ambient Background Grid for loading state visibility behind iframe */}
            <div className="absolute inset-0 pointer-events-none z-0 opacity-10"
                 style={{ 
                     backgroundImage: 'linear-gradient(to right, #06b6d4 1px, transparent 1px), linear-gradient(to bottom, #06b6d4 1px, transparent 1px)',
                     backgroundSize: '40px 40px',
                 }}
            />
        </div>
    );
};

