"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

interface ClickEffect {
  id: number;
  x: number;
  y: number;
}

export function ClickFeedback() {
  const [clicks, setClicks] = useState<ClickEffect[]>([]);

  useEffect(() => {
    let idCounter = 0;
    
    const handleClick = (e: MouseEvent) => {
      // Don't show feedback for right clicks
      if (e.button !== 0) return;
      
      const newClick: ClickEffect = {
        id: idCounter++,
        x: e.clientX,
        y: e.clientY,
      };
      
      setClicks((prev) => [...prev, newClick]);
      
      setTimeout(() => {
        setClicks((prev) => prev.filter((c) => c.id !== newClick.id));
      }, 500); // Effect duration
    };

    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden">
      <AnimatePresence>
        {clicks.map((click) => (
          <motion.div
            key={click.id}
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute rounded-full border-2 border-cyan-400 bg-cyan-400/20 shadow-[0_0_15px_rgba(34,211,238,0.5)]"
            style={{
              left: click.x - 8,
              top: click.y - 8,
              width: 16,
              height: 16,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
