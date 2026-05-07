"use client";

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { HeroSection } from '@/components/HeroSection';
import { EchoGrid } from '@/components/EchoGrid';
import { RotationTimeline } from '@/components/RotationTimeline';
import { BuildSelector } from '@/components/BuildSelector';

export default function CalcharoPage() {
  return (
    <main className="min-h-screen bg-[var(--color-charcoal)] text-white font-sans selection:bg-[var(--color-teal)] selection:text-black overflow-hidden relative">
      {/* Background ambient glow */}
      <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[var(--color-teal)] opacity-5 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[var(--color-gold)] opacity-5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10 space-y-12">
        <Link href="/" className="inline-flex items-center gap-2 text-[var(--color-teal)] font-mono text-xs tracking-widest hover:text-white transition-colors">
          <ChevronLeft size={16} /> BACK TO MAIN PAGE
        </Link>
        
        <HeroSection />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7 space-y-24">
            <BuildSelector weapons={[
              { name: 'Verdant Summit', rarity: 5, type: 'Broadblade', description: '', passiveName: '', passiveDescription: '', baseAtk: 587, secondaryStat: 'Crit DMG', secondaryStatValue: '48.6%', isSignature: true, weaponType: 'Broadblade' },
              { name: 'Autumntrace', rarity: 4, type: 'Broadblade', description: '', passiveName: '', passiveDescription: '', baseAtk: 412, secondaryStat: 'Crit Rate', secondaryStatValue: '20.2%', weaponType: 'Broadblade' },
              { name: 'Broadblade#41', rarity: 4, type: 'Broadblade', description: '', passiveName: '', passiveDescription: '', baseAtk: 412, secondaryStat: 'Energy Regen', secondaryStatValue: '32.3%', weaponType: 'Broadblade' },
            ]} />
            <RotationTimeline />
          </div>
          <div className="lg:col-span-5">
            <EchoGrid />
          </div>
        </div>
      </div>
    </main>
  );
}
