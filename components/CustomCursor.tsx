'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Use extremely responsive spring physics so it feels 60fps/144fps smooth but avoids the raw React state lag.
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 600, mass: 0.1 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    
    if (window.matchMedia('(pointer: coarse)').matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsTouchDevice(true);
      return;
    }

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    const handleInteractableEnter = () => setIsHovering(true);
    const handleInteractableLeave = () => setIsHovering(false);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);

    if (window.matchMedia('(pointer: fine)').matches) {
      setIsVisible(true);
    }

    const setupInteractiveElements = () => {
      // Find all clickable/interactive elements
      const interactables = document.querySelectorAll(
        'a, button, input, select, textarea, [role="button"], .cursor-pointer'
      );
      interactables.forEach((el) => {
        el.addEventListener('mouseenter', handleInteractableEnter);
        el.addEventListener('mouseleave', handleInteractableLeave);
      });
    };

    setupInteractiveElements();

    // Catch newly added elements
    const observer = new MutationObserver(setupInteractiveElements);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      observer.disconnect();

      const interactables = document.querySelectorAll(
        'a, button, input, select, textarea, [role="button"], .cursor-pointer'
      );
      interactables.forEach((el) => {
        el.removeEventListener('mouseenter', handleInteractableEnter);
        el.removeEventListener('mouseleave', handleInteractableLeave);
      });
    };
  }, [cursorX, cursorY]);

  if (!mounted || isTouchDevice) {
    return null; // Ensure matching hydration on SSR and don't render on touch mobile devices
  }

  // Base Colors (HEX)
  // Default Dot: #0F172A (slate-900)
  // Hover Circle: #0F172A at 8% opacity + subtle border
  
  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[10000] overflow-visible"
      style={{
        x: smoothX,
        y: smoothY,
      }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isClicking ? 0.9 : isHovering ? 1.15 : 1,
        rotate: isHovering ? 8 : 0,
        color: isHovering ? '#06b6d4' : '#1e293b', // cyan-500 on hover, slate-800 default
      }}
      transition={{
        scale: { type: 'spring', damping: 20, stiffness: 450 },
        rotate: { type: 'spring', damping: 20, stiffness: 450 },
        color: { duration: 0.15 },
      }}
    >
      <div 
        className="relative" 
        style={{ 
          // Offset so the pointer tip (1, 1) perfectly aligns exactly under the mouse coordinate (0, 0)
          left: '-1px', 
          top: '-1px',
          filter: isHovering 
            ? 'drop-shadow(0px 4px 10px rgba(6, 182, 212, 0.4))' 
            : 'drop-shadow(0px 3px 6px rgba(15, 23, 42, 0.2))',
          transition: 'filter 0.2s ease-out'
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            // A sharp, angled modern blade shape
            d="M1 1 L16.5 6.5 L10.5 10.5 L6.5 16.5 L1 1Z" 
            fill="currentColor" 
            stroke="white" 
            strokeWidth="1.5" 
            strokeLinejoin="round" 
            strokeLinecap="round"
          />
        </svg>
      </div>
    </motion.div>
  );
}
