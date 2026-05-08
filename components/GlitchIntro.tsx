"use client";
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const GlitchIntro = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "complete" | "fade-text" | "shrinking" | "splitting">("loading");
  const onCompleteRef = useRef(onComplete);
  const hasStarted = useRef(false);

  // Keep the ref current without triggering the effect
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    // Prevent re-running if the effect already started (e.g. parent re-renders)
    if (hasStarted.current) return;
    hasStarted.current = true;

    let p = 0;
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const interval = setInterval(() => {
      p += 1;
      if (p >= 100) {
        clearInterval(interval);
        setProgress(100);
        setPhase("complete");
        
        timeouts.push(setTimeout(() => {
          setPhase("fade-text");
        }, 500));
        
        timeouts.push(setTimeout(() => {
          setPhase("shrinking");
        }, 1100));

        timeouts.push(setTimeout(() => {
          setPhase("splitting");
        }, 1500));

        timeouts.push(setTimeout(() => {
          onCompleteRef.current();
        }, 2500));
      } else {
        setProgress(p);
      }
    }, 20); 
    return () => {
      clearInterval(interval);
      timeouts.forEach(t => clearTimeout(t));
    };
  }, []); // empty deps — runs exactly once

  // Main Circle properties
  const radius = 130;
  const stroke = 2;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const showText = phase === "loading" || phase === "complete";
  const circleScale = (phase === "shrinking" || phase === "splitting") ? 0 : 1;
  const bgSplit = phase === "splitting";

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center overflow-hidden">
      
      {/* Top half background with glowing shutter edge */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[50.5vh] bg-[#030108] border-b border-purple-500/0 shadow-[0_0_0_rgba(168,85,247,0)]"
        animate={{ 
          y: bgSplit ? "-100%" : "0%",
          borderColor: bgSplit ? "rgba(168,85,247,0.5)" : "rgba(168,85,247,0)",
          boxShadow: bgSplit ? "0 10px 40px rgba(168,85,247,0.4)" : "0 0px 0px rgba(168,85,247,0)"
        }}
        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
      />
      
      {/* Bottom half background with glowing shutter edge */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[50.5vh] bg-[#030108] border-t border-cyan-500/0 shadow-[0_0_0_rgba(6,182,212,0)]"
        animate={{ 
          y: bgSplit ? "100%" : "0%",
          borderColor: bgSplit ? "rgba(6,182,212,0.5)" : "rgba(6,182,212,0)",
          boxShadow: bgSplit ? "0 -10px 40px rgba(6,182,212,0.4)" : "0 0px 0px rgba(6,182,212,0)"
        }}
        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* The Orbital Container */}
        <motion.div
          animate={{
            scale: circleScale,
            opacity: bgSplit ? 0 : 1
          }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          className="relative flex items-center justify-center w-[300px] h-[300px]"
        >
          {/* Outer Dashed Rotating Ring */}
          <motion.svg
            height={radius * 2 + 40}
            width={radius * 2 + 40}
            className="absolute"
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          >
            <circle
              stroke="rgba(168, 85, 247, 0.3)" // purple
              strokeDasharray="4 8"
              fill="transparent"
              strokeWidth="1"
              r={normalizedRadius + 20}
              cx={radius + 20}
              cy={radius + 20}
            />
          </motion.svg>

          {/* Inner Dotted Rotating Ring */}
          <motion.svg
            height={radius * 2 - 30}
            width={radius * 2 - 30}
            className="absolute"
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          >
            <circle
              stroke="rgba(34, 211, 238, 0.3)" // cyan
              strokeDasharray="40 10 5 10"
              fill="transparent"
              strokeWidth="1.5"
              r={normalizedRadius - 15}
              cx={radius - 15}
              cy={radius - 15}
            />
          </motion.svg>

          {/* Main Progress Ring */}
          <svg
            height={radius * 2}
            width={radius * 2}
            className="absolute transform -rotate-90 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]"
          >
            <defs>
              <linearGradient id="progressGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c084fc" /> {/* Purple */}
                <stop offset="100%" stopColor="#22d3ee" /> {/* Cyan */}
              </linearGradient>
            </defs>
            <circle
              stroke="rgba(255,255,255,0.03)"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            <circle
              stroke="url(#progressGlow)" 
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={circumference + ' ' + circumference}
              style={{ strokeDashoffset }}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              className="transition-all duration-75 ease-linear"
            />
          </svg>

          {/* Number */}
          <AnimatePresence>
            {showText && (
              <motion.span
                initial={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(12px)', scale: 1.1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-7xl md:text-[5.5rem] text-white font-bold tracking-wider"
                style={{ 
                  fontFamily: 'var(--font-cinzel)',
                  textShadow: '0 0 20px rgba(168,85,247,0.6), 0 0 40px rgba(34,211,238,0.4)'
                }}
              >
                {progress.toString().padStart(2, '0')}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Thematic Loading Text */}
        <AnimatePresence>
          {showText && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.4 }}
              className="absolute -bottom-24 flex flex-col items-center gap-1"
            >
              <p className="text-[10px] text-cyan-400/80 tracking-[0.3em] font-medium font-mono uppercase">
                Establishing Resonance...
              </p>
              <motion.div 
                className="w-12 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"
                animate={{ width: ["20px", "60px", "20px"], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
