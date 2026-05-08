"use client";
import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { Youtube, Gamepad2, ChevronRight, ChevronLeft, Zap, Wind, Flame, Database, Crosshair, Activity, Twitter, Twitch, Snowflake, Sun, Moon, Users, Star, MapPin } from 'lucide-react';
import { ProductCard, ElementType } from '@/components/ui/cards-1';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

import { MacOSDock } from '@/components/macos-dock';
import { WutheringWavesUI } from '@/components/WutheringWavesUI';
import { InteractiveMap } from '@/components/InteractiveMap';
import { IntroSection } from '@/components/IntroSection';
import { House, BookOpen } from 'lucide-react';

import { GlitchIntro } from '@/components/GlitchIntro';
import { BeginnerGuide } from '@/components/BeginnerGuide';

import { TierListView } from '@/components/TierListView';

const InitialLoader = ({ onComplete }: { onComplete: () => void }) => {
  return <GlitchIntro onComplete={onComplete} />;
};

const TierListPlaceholder = () => (
  <div className="w-full flex-1 flex items-center justify-center bg-[#0a0a0f]">
      <div className="flex flex-col items-center justify-center p-12 bg-[#151520] rounded-3xl border border-white/10 max-w-lg text-center shadow-[0_0_30px_rgba(255,255,255,0.05)]">
          <Star size={64} className="text-[#06b6d4] mb-6 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
          <h2 className="text-3xl font-akira font-bold text-white mb-4 tracking-wider">Tier List</h2>
          <p className="text-[#8F8FA3] font-mono text-sm tracking-widest uppercase">System In Development. Please wait for the next iteration cycle.</p>
      </div>
  </div>
);

import { ErrorBoundary } from '@/components/ErrorBoundary';

const SECTION_ORDER = ['intro', 'guide', 'characters', 'tierlist', 'map'];

export default function LandingPage() {
  const [guides, setGuides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('intro');
  const [prevSection, setPrevSection] = useState('intro');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const section = params.get('section');
      if (section && SECTION_ORDER.includes(section)) {
        setActiveSection(section);
        setInitialLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const fetchGuides = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('guides')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (!error && data) {
        setGuides(data.filter(g => g.content?.is_published === true));
      }
      setLoading(false);
    };

    fetchGuides();
  }, []);

  const handleSectionChange = (next: string) => {
    setPrevSection(activeSection);
    setActiveSection(next);
  };

  const triggerCharacterPortal = () => handleSectionChange('characters');

  // Direction: +1 = going forward (slide left), -1 = going back (slide right)
  const direction = SECTION_ORDER.indexOf(activeSection) >= SECTION_ORDER.indexOf(prevSection) ? 1 : -1;

  const slideVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir * 50, filter: 'blur(4px)' }),
    center: { opacity: 1, x: 0, filter: 'blur(0px)' },
    exit: (dir: number) => ({ opacity: 0, x: dir * -50, filter: 'blur(4px)' }),
  };

  const transition = { duration: 0.38, ease: [0.4, 0, 0.2, 1] };

  const dockItems = [
      { id: 'intro', label: 'Home', icon: <House size={20} /> },
      // { id: 'guide', label: 'Beginner Guide', icon: <BookOpen size={20} /> },
      { id: 'characters', label: 'Characters', icon: <Users size={20} /> },
      { id: 'tierlist', label: 'Tier List', icon: <Star size={20} /> },
      { id: 'map', label: 'Interactive Map', icon: <MapPin size={20} /> },
  ];

  return (
    <>
      <AnimatePresence>
        {initialLoading && <InitialLoader key="loader" onComplete={() => setInitialLoading(false)} />}
      </AnimatePresence>
      <main className="h-[100dvh] w-full bg-[#f3f4f6] text-[#1A1A1A] font-sans selection:bg-cyan-200 overflow-hidden flex flex-col relative">
        
        {/* Active Section Content */}
        <div className="flex-1 w-full relative z-20 overflow-hidden flex flex-col">
          <AnimatePresence mode="wait" custom={direction}>
            {activeSection === 'intro' && (
              <motion.div
                key="intro"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
                className="absolute inset-0 flex flex-col"
              >
                <IntroSection setActiveSection={handleSectionChange} onExplore={triggerCharacterPortal} />
              </motion.div>
            )}
            {activeSection === 'guide' && (
              <motion.div
                key="guide"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
                className="absolute inset-0 flex flex-col"
              >
                <ErrorBoundary>
                  <BeginnerGuide />
                </ErrorBoundary>
              </motion.div>
            )}
            {activeSection === 'characters' && (
              <motion.div
                key="characters"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
                className="absolute inset-0 flex flex-col"
              >
                <WutheringWavesUI guides={guides} loading={loading} />
              </motion.div>
            )}
            {activeSection === 'tierlist' && (
              <motion.div
                key="tierlist"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
                className="absolute inset-0 flex flex-col"
              >
                <TierListPlaceholder />
              </motion.div>
            )}
            {activeSection === 'map' && (
              <motion.div
                key="map"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
                className="absolute inset-0 flex flex-col"
              >
                <InteractiveMap />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mac OS Style Navigation Dock */}
        {activeSection !== 'intro' && (
          <MacOSDock items={dockItems} activeSection={activeSection} setActiveSection={handleSectionChange} />
        )}
      </main>
    </>
  );
}
