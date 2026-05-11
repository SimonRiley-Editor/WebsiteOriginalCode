'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Zero-latency position for the main cursor
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Fast-trailing ring
  const ringX = useSpring(mouseX, { damping: 35, stiffness: 800, mass: 0.06 });
  const ringY = useSpring(mouseY, { damping: 35, stiffness: 800, mass: 0.06 });

  const handleMove = useCallback((e: MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  }, [mouseX, mouseY]);

  useEffect(() => {
    setMounted(true);

    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    window.addEventListener('mousemove', handleMove, { passive: true });

    const onDown = () => setIsClicking(true);
    const onUp = () => setIsClicking(false);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    const onEnter = () => setIsVisible(true);
    const onLeave = () => setIsVisible(false);
    document.documentElement.addEventListener('mouseenter', onEnter);
    document.documentElement.addEventListener('mouseleave', onLeave);

    if (window.matchMedia('(pointer: fine)').matches) {
      setIsVisible(true);
    }

    const interactiveSelector = 'a, button, input, select, textarea, [role="button"], .cursor-pointer, label[for], summary, [onclick], [tabindex]:not([tabindex="-1"])';

    const onMouseOver = (e: MouseEvent) => {
      const target = (e.target as Element)?.closest?.(interactiveSelector);
      if (target) setIsHovering(true);
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = (e.target as Element)?.closest?.(interactiveSelector);
      const related = (e.relatedTarget as Element)?.closest?.(interactiveSelector);
      if (target && target !== related) setIsHovering(false);
    };

    document.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseout', onMouseOut, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.documentElement.removeEventListener('mouseenter', onEnter);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
    };
  }, [handleMove]);

  if (!mounted || isTouchDevice) return null;

  return (
    <>
      {/* ─── MAIN CURSOR: sharp pointer blade, zero latency ─── */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[10000]"
        style={{ x: mouseX, y: mouseY }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ opacity: { duration: 0.15 } }}
      >
        <motion.div
          animate={{
            scale: isClicking ? 0.8 : isHovering ? 1.1 : 1,
            rotate: isHovering ? 10 : 0,
          }}
          transition={{ type: 'spring', damping: 22, stiffness: 500, mass: 0.1 }}
          style={{
            marginLeft: -1,
            marginTop: -1,
            filter: isHovering
              ? 'drop-shadow(0 2px 8px rgba(6, 182, 212, 0.5))'
              : 'drop-shadow(0 2px 5px rgba(0, 0, 0, 0.2))',
            transition: 'filter 0.2s ease',
          }}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Main pointer blade — tip at (1,1) aligns with real cursor position */}
            <motion.path
              d="M1 1L10 22L13.5 13.5L22 10L1 1Z"
              animate={{
                fill: isHovering ? '#06b6d4' : '#0f172a',
                stroke: isHovering ? '#67e8f9' : '#ffffff',
              }}
              transition={{ duration: 0.15 }}
              strokeWidth="1.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* Inner edge highlight for depth */}
            <motion.path
              d="M3.5 4L8.5 18L11.5 12L18 9L3.5 4Z"
              animate={{
                fill: isHovering ? 'rgba(103, 232, 249, 0.25)' : 'rgba(255, 255, 255, 0.12)',
              }}
              transition={{ duration: 0.15 }}
            />
          </svg>
        </motion.div>
      </motion.div>

      {/* ─── TRAILING RING: expands on hover ─── */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{ x: ringX, y: ringY }}
        animate={{ opacity: isVisible ? (isHovering ? 1 : 0.5) : 0 }}
        transition={{ opacity: { duration: 0.2 } }}
      >
        <motion.div
          animate={{
            width: isClicking ? 24 : isHovering ? 44 : 32,
            height: isClicking ? 24 : isHovering ? 44 : 32,
            borderColor: isHovering
              ? 'rgba(6, 182, 212, 0.4)'
              : 'rgba(15, 23, 42, 0.12)',
            borderWidth: isHovering ? 1.5 : 1,
          }}
          transition={{
            type: 'spring',
            damping: 20,
            stiffness: 350,
            mass: 0.08,
          }}
          style={{
            position: 'absolute',
            borderRadius: '50%',
            borderStyle: 'solid',
            transform: 'translate(-50%, -50%)',
            backgroundColor: isHovering
              ? 'rgba(6, 182, 212, 0.05)'
              : 'transparent',
            boxShadow: isHovering
              ? '0 0 20px rgba(6, 182, 212, 0.12), inset 0 0 8px rgba(6, 182, 212, 0.06)'
              : 'none',
          }}
        />
      </motion.div>
    </>
  );
}
