"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

const LOGO_URL = "https://res.cloudinary.com/ds6dwbk37/image/upload/v1778159044/8fa2d0fb-caed-43b9-ae62-34280c5fc4e9_th5xnm.png";

export const GlitchIntro = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let p = 0;
    const interval = setInterval(() => {
      p += 100 / (3000 / 30);
      if (p >= 100) {
        clearInterval(interval);
        setProgress(100);
        setTimeout(() => setDone(true), 400);
        setTimeout(onComplete, 1200);
      } else {
        setProgress(Math.floor(p));
      }
    }, 30);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-[#07030E] flex flex-col items-center justify-center overflow-hidden"
      animate={{ opacity: done ? 0 : 1 }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
    >
      {/* Logo with shimmer clip reveal */}
      <div className="relative mb-16">
        {/* Glow behind logo */}
        <motion.div
          className="absolute inset-0 blur-[60px] rounded-full bg-purple-700 opacity-0"
          animate={{ opacity: done ? 0 : [0, 0.45, 0.3] }}
          transition={{ duration: 2, times: [0, 0.5, 1], ease: 'easeOut' }}
        />

        {/* Logo fades + scales in */}
        <motion.img
          src={LOGO_URL}
          alt="Grimveil"
          className="w-32 h-32 md:w-44 md:h-44 object-contain relative z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: 'backOut', delay: 0.2 }}
          style={{
            filter: 'drop-shadow(0 0 18px rgba(168,85,247,0.8)) drop-shadow(0 0 50px rgba(109,40,217,0.4)) brightness(1.15)',
            mixBlendMode: 'lighten',
          }}
        />
      </div>

      {/* Site name */}
      <motion.p
        className="text-white/50 text-xs tracking-[0.5em] uppercase font-light mb-10"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        GrimVeil Guide
      </motion.p>

      {/* Thin progress bar */}
      <div className="w-48 md:w-64 h-[2px] bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-purple-500 via-violet-400 to-purple-300"
          style={{ width: `${progress}%`, boxShadow: '0 0 10px rgba(168,85,247,0.8)' }}
          transition={{ ease: 'linear' }}
        />
      </div>

      {/* Progress number */}
      <motion.p
        className="text-white/30 text-xs font-mono mt-3 tabular-nums"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        {progress}%
      </motion.p>
    </motion.div>
  );
};
