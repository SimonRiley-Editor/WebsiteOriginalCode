"use client";
import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
import Link from 'next/link';
import { 
  Crosshair, 
  ChevronLeft, 
  Snowflake, 
  Swords, 
  ShieldAlert, 
  Zap, 
  Users, 
  Target, 
  Activity,
  Clock,
  Plus,
  ChevronsUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function HiyukiGuidePage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const scrollY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  // Mouse Parallax Logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { currentTarget, clientX, clientY } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const springConfig = { damping: 30, stiffness: 100, mass: 2 };
  const bgX = useSpring(useTransform(mouseX, [-0.5, 0.5], ["-3%", "3%"]), springConfig);
  const bgY = useSpring(useTransform(mouseY, [-0.5, 0.5], ["-3%", "3%"]), springConfig);
  
  const cardRotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
  const cardRotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig);
  const cardX = useSpring(useTransform(mouseX, [-0.5, 0.5], ["-15px", "15px"]), springConfig);
  const cardY = useSpring(useTransform(mouseY, [-0.5, 0.5], ["-15px", "15px"]), springConfig);
  
  const textX = useSpring(useTransform(mouseX, [-0.5, 0.5], ["-5px", "5px"]), springConfig);
  const textY = useSpring(useTransform(mouseY, [-0.5, 0.5], ["-5px", "5px"]), springConfig);

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans selection:bg-[var(--accent-color)] selection:text-black pb-24">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[var(--bg-primary)]/80 backdrop-blur-md border-b border-[var(--text-primary)]/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Crosshair className="text-[var(--accent-color)]" />
            <span className="font-akira text-xl tracking-widest">SAINTONTAS</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-xs font-mono text-[var(--text-primary)]/70 tracking-widest">
            <Link href="/" className="hover:text-[var(--text-primary)] transition-colors">DATABASE</Link>
            <Link href="/tier-list" className="hover:text-[var(--text-primary)] transition-colors">TIER LIST</Link>
            <Link href="/" className="hover:text-[var(--text-primary)] transition-colors">RESOURCES</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link href="/" className="inline-flex items-center gap-2 text-[var(--text-primary)]/50 hover:text-[var(--accent-color)] transition-colors font-mono text-sm mb-8">
          <ChevronLeft size={16} />
          MAIN PAGE
        </Link>

        {/* Hero Section */}
        <div 
          ref={heroRef} 
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative rounded-2xl overflow-hidden bg-[var(--bg-secondary)]/20 border border-[var(--text-primary)]/10 mb-16 h-[400px] flex items-center perspective-1000"
          style={{ perspective: 1000 }}
        >
          <motion.div 
            style={{ y: scrollY, x: bgX, scale: 1.1 }} 
            className="absolute inset-0 w-full h-[120%] -top-[10%] z-0"
          >
            <img 
              src="https://res.cloudinary.com/ds6dwbk37/image/upload/v1775468497/HE0Zn6QXAAA7LOS_xmutua.jpg" 
              alt="Hiyuki Background" 
              className="w-full h-full object-cover opacity-40"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-primary)] via-[var(--bg-primary)]/90 to-transparent z-0 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent z-0 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 p-8 md:p-12 w-full pointer-events-none">
            <motion.div 
              style={{ rotateX: cardRotateX, rotateY: cardRotateY, x: cardX, y: cardY }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-48 h-48 md:w-64 md:h-64 shrink-0 rounded-xl overflow-hidden border-2 border-[var(--accent-color)] pointer-events-auto cursor-pointer transition-all duration-300"
            >
              <img 
                src="https://res.cloudinary.com/ds6dwbk37/image/upload/v1775460610/Hiyuki_Card_cmwra3.webp" 
                alt="Hiyuki" 
                className="w-full h-full object-cover object-[center_30%]"
              />
            </motion.div>
            
            <motion.div 
              style={{ x: textX, y: textY }}
              className="flex-1 space-y-4 text-center md:text-left pointer-events-auto"
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap items-center justify-center md:justify-start gap-3"
              >
                <span className="px-3 py-1 bg-[#60A5FA]/20 text-[#60A5FA] border border-[#60A5FA]/30 rounded-full text-xs font-bold tracking-widest flex items-center gap-1.5">
                  <Snowflake size={14} /> GLACIO
                </span>
                <span className="px-3 py-1 bg-[var(--text-primary)]/10 text-[var(--text-primary)] border border-[var(--text-primary)]/20 rounded-full text-xs font-bold tracking-widest flex items-center gap-1.5">
                  <Swords size={14} /> MAIN DPS
                </span>
                <span className="px-3 py-1 bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 rounded-full text-xs font-bold tracking-widest">
                  5 STAR
                </span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-akira font-bold tracking-tight text-[var(--text-primary)]"
              >
                HIYUKI
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-[var(--text-primary)]/70 max-w-2xl leading-relaxed"
              >
                A premium 5-star Glacio Resonator and a miko from Startorch Academy. She specializes in a unique Glacio Chafe mechanic to deliver massive burst damage.
              </motion.p>
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Mechanics & Teams */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Combat Mechanics */}
            <section id="mechanics" className="relative rounded-2xl p-6 md:p-8 overflow-hidden border border-white/5 bg-[var(--bg-secondary)]/50 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
              <div className="flex items-center gap-3 mb-8 relative z-10">
                <Zap className="text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" size={24} />
                <h2 className="text-2xl font-akira tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">COMBAT MECHANICS</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                {/* Glacio Chafe - Cyan Theme */}
                <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl shadow-[0_4px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)] hover:-translate-y-2 transition-all duration-500 hover:shadow-[0_8px_32px_rgba(6,182,212,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] hover:border-cyan-400/50 min-h-[240px] flex flex-col justify-end p-6">
                  {/* Background Image */}
                  <div className="absolute inset-0 z-0">
                    <img src="https://res.cloudinary.com/ds6dwbk37/image/upload/v1775476358/Rover_Countdown_2026-02-03_lwyhwl.webp" alt="Glacio Chafe Background" className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700 mix-blend-luminosity" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-secondary)] via-[var(--bg-secondary)]/80 to-transparent" />
                    <div className="absolute inset-0 bg-cyan-900/20 mix-blend-overlay group-hover:bg-cyan-500/20 transition-colors duration-500" />
                  </div>
                  
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-4 border border-cyan-400/30 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-[0_0_15px_rgba(6,182,212,0.2)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.6)]">
                      <Snowflake className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-akira text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500 mb-2 tracking-wide">GLACIO CHAFE</h3>
                    <p className="text-sm text-slate-300 leading-relaxed max-w-md mb-4">
                      Her attacks apply stacking debuffs. At 10 stacks, the enemy is frozen and takes significantly amplified damage.
                    </p>
                    {/* Progress Visualization */}
                    <div className="flex gap-1.5 mt-auto">
                      {[...Array(10)].map((_, i) => (
                        <div key={i} className="h-1.5 flex-1 rounded-full bg-white/10 overflow-hidden">
                          <motion.div 
                            className="h-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                            initial={{ width: "0%" }}
                            whileInView={{ width: "100%" }}
                            transition={{ duration: 0.2, delay: i * 0.1 }}
                            viewport={{ once: true }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Dual-Form Stance - Cyan Theme */}
                <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl shadow-[0_4px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)] hover:-translate-y-2 transition-all duration-500 hover:shadow-[0_8px_32px_rgba(6,182,212,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] hover:border-cyan-400/50 min-h-[240px] flex flex-col justify-end p-6">
                  {/* Background Image */}
                  <div className="absolute inset-0 z-0">
                    <img src="https://res.cloudinary.com/ds6dwbk37/image/upload/v1775476354/Void_Storm_vixx23.webp" alt="Dual-Form Stance Background" className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700 mix-blend-luminosity" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-secondary)] via-[var(--bg-secondary)]/80 to-transparent" />
                    <div className="absolute inset-0 bg-cyan-900/20 mix-blend-overlay group-hover:bg-cyan-500/20 transition-colors duration-500" />
                  </div>

                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-4 border border-cyan-400/30 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500 shadow-[0_0_15px_rgba(6,182,212,0.2)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.6)]">
                      <Swords className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-akira text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500 mb-2 tracking-wide">DUAL-FORM STANCE</h3>
                    <p className="text-sm text-slate-300 leading-relaxed max-w-md">
                      Transitions between a standard stance and an enhanced &quot;white form&quot; where sword strikes transform into long-range waves.
                    </p>
                  </div>
                </div>

                {/* Resource Management - Cyan Theme */}
                <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl shadow-[0_4px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)] hover:-translate-y-2 transition-all duration-500 hover:shadow-[0_8px_32px_rgba(6,182,212,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] hover:border-cyan-400/50 min-h-[240px] flex flex-col justify-end p-6">
                  {/* Background Image */}
                  <div className="absolute inset-0 z-0">
                    <img src="https://res.cloudinary.com/ds6dwbk37/image/upload/v1775475828/Tidelost_Forest_e8chmq.webp" alt="Resource Management Background" className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700 mix-blend-luminosity" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-secondary)] via-[var(--bg-secondary)]/80 to-transparent" />
                    <div className="absolute inset-0 bg-cyan-900/20 mix-blend-overlay group-hover:bg-cyan-500/20 transition-colors duration-500" />
                  </div>

                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-4 border border-cyan-400/30 group-hover:scale-110 transition-all duration-500 shadow-[0_0_15px_rgba(6,182,212,0.2)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.6)]">
                      <Activity className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-akira text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500 mb-2 tracking-wide">RESOURCE MANAGEMENT</h3>
                    <p className="text-sm text-slate-300 leading-relaxed max-w-md mb-4">
                      Manages Mind, Chill, and IAI to trigger explosive frostbite damage.
                    </p>
                    {/* Interactive Resource Bars */}
                    <div className="space-y-2 mt-auto">
                      {['Mind', 'Chill', 'IAI'].map((res, i) => (
                        <div key={res} className="flex items-center gap-3">
                          <span className="text-[10px] font-mono text-cyan-200/70 w-8">{res}</span>
                          <div className="h-1 flex-1 rounded-full bg-white/10 overflow-hidden">
                            <motion.div 
                              className="h-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                              initial={{ width: "0%" }}
                              whileInView={{ width: `${80 - i * 15}%` }}
                              transition={{ duration: 1, delay: i * 0.2, ease: "easeOut" }}
                              viewport={{ once: true }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Utility & Control - Gold Theme */}
                <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl shadow-[0_4px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)] hover:-translate-y-2 transition-all duration-500 hover:shadow-[0_8px_32px_rgba(245,158,11,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] hover:border-amber-400/50 min-h-[240px] flex flex-col justify-end p-6">
                  {/* Background Image */}
                  <div className="absolute inset-0 z-0">
                    <img src="https://res.cloudinary.com/ds6dwbk37/image/upload/v1775475828/Homeland_Satellite_itqqpm.webp" alt="Utility & Control Background" className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700 mix-blend-luminosity" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-secondary)] via-[var(--bg-secondary)]/80 to-transparent" />
                    <div className="absolute inset-0 bg-amber-900/20 mix-blend-overlay group-hover:bg-amber-500/20 transition-colors duration-500" />
                  </div>

                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mb-4 border border-amber-400/30 group-hover:scale-110 transition-all duration-500 shadow-[0_0_15px_rgba(245,158,11,0.2)] group-hover:shadow-[0_0_25px_rgba(245,158,11,0.6)] relative">
                      <Clock className="w-6 h-6 text-amber-400 relative z-10" />
                      <div className="absolute inset-0 rounded-xl border border-amber-400/50 scale-100 opacity-0 group-hover:animate-ping" />
                    </div>
                    <h3 className="text-xl font-akira text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-500 mb-2 tracking-wide">UTILITY & CONTROL</h3>
                    <p className="text-sm text-slate-300 leading-relaxed max-w-md">
                      Possesses a time-stop mechanic during her enhanced forte and can pull in mobs for superior crowd control.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Team Compositions */}
            <section id="teams" className="relative rounded-2xl p-6 md:p-8 overflow-hidden border border-white/5 bg-[var(--bg-secondary)]/50 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
              <div className="flex items-center gap-3 mb-2 relative z-10">
                <Users className="text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" size={24} />
                <h2 className="text-2xl font-akira tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">TEAM COMPOSITIONS</h2>
              </div>
              <p className="text-sm text-slate-400 mb-8 relative z-10">
                Hiyuki&apos;s effectiveness is tied to how fast her team can build Glacio Chafe stacks.
              </p>

              <div className="space-y-8 relative z-10">
                {/* Standard Team */}
                <div className="group relative rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-colors duration-500">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="font-akira text-lg tracking-wide text-white">STANDARD TEAM</h3>
                      <p className="text-xs font-mono text-cyan-400/70">CURRENT META</p>
                    </div>
                  </div>
                  
                  <div className="relative flex flex-col md:flex-row gap-4 items-center justify-between">
                    {/* SVG Connection Lines (Desktop only) */}
                    <svg className="absolute top-1/2 left-0 w-full h-24 -translate-y-1/2 hidden md:block pointer-events-none z-0" style={{ overflow: 'visible' }}>
                      <path d="M 150 48 Q 250 48 350 48" fill="none" stroke="url(#cyan-gradient)" strokeWidth="2" strokeDasharray="6 6" className="animate-[dash_20s_linear_infinite]" />
                      <path d="M 450 48 Q 550 48 650 48" fill="none" stroke="url(#purple-gradient)" strokeWidth="2" strokeDasharray="6 6" className="animate-[dash_20s_linear_infinite]" />
                      <defs>
                        <linearGradient id="cyan-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="rgba(6,182,212,0.8)" />
                          <stop offset="100%" stopColor="rgba(6,182,212,0.2)" />
                        </linearGradient>
                        <linearGradient id="purple-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="rgba(168,85,247,0.8)" />
                          <stop offset="100%" stopColor="rgba(168,85,247,0.2)" />
                        </linearGradient>
                      </defs>
                    </svg>

                    {/* Character 1 */}
                    <div className="relative z-10 flex-1 w-full bg-[var(--bg-secondary)]/80 backdrop-blur-md border border-cyan-500/30 rounded-xl p-4 flex items-center gap-4 hover:scale-105 transition-transform duration-300 shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:shadow-[0_0_25px_rgba(6,182,212,0.3)]">
                      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-cyan-400 shrink-0 relative">
                         <img src="https://res.cloudinary.com/ds6dwbk37/image/upload/v1775469473/HFDG1e9bAAAPRyH_jd6gyk.png" alt="Hiyuki" className="w-full h-full object-cover object-top" />
                         <div className="absolute inset-0 rounded-full border border-cyan-300/50 mix-blend-overlay" />
                      </div>
                      <div>
                        <span className="block font-bold text-cyan-400 text-lg drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">HIYUKI</span>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Main DPS</span>
                      </div>
                    </div>

                    {/* Character 2 */}
                    <div className="relative z-10 flex-1 w-full bg-[var(--bg-secondary)]/80 backdrop-blur-md border border-purple-500/30 rounded-xl p-4 flex items-center gap-4 hover:scale-105 transition-transform duration-300 shadow-[0_0_15px_rgba(168,85,247,0.15)] hover:shadow-[0_0_25px_rgba(168,85,247,0.3)]">
                      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-purple-400 shrink-0 relative">
                        <img src="https://res.cloudinary.com/ds6dwbk37/image/upload/v1775469415/Resonator_Chisa_rup4it.webp" alt="Chisa" className="w-full h-full object-cover object-top" />
                        <div className="absolute inset-0 rounded-full border border-purple-300/50 mix-blend-overlay" />
                      </div>
                      <div>
                        <span className="block font-bold text-purple-400 text-lg drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]">CHISA</span>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Chafe Builder</span>
                      </div>
                    </div>

                    {/* Character 3 */}
                    <div className="relative z-10 flex-1 w-full bg-[var(--bg-secondary)]/80 backdrop-blur-md border border-emerald-500/30 rounded-xl p-4 flex items-center gap-4 hover:scale-105 transition-transform duration-300 shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_25px_rgba(16,185,129,0.3)]">
                      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-emerald-400 shrink-0 relative">
                        <img src="https://res.cloudinary.com/ds6dwbk37/image/upload/v1775469720/Resonator_Shorekeeper_yh3iff.webp" alt="Shorekeeper" className="w-full h-full object-cover object-top" />
                        <div className="absolute inset-0 rounded-full border border-emerald-300/50 mix-blend-overlay" />
                      </div>
                      <div>
                        <span className="block font-bold text-emerald-400 text-lg drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">SHOREKEEPER</span>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Buffer / Healer</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Optimal Future Team */}
                <div className="group relative rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-900/10 to-transparent p-6 hover:bg-cyan-900/20 transition-colors duration-500 overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" />
                  <div className="absolute top-0 left-0 w-1 h-full bg-cyan-400 rounded-l-2xl shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                  
                  <div className="flex items-center justify-between mb-8 relative z-10">
                    <div>
                      <h3 className="font-akira text-lg tracking-wide text-cyan-400 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">OPTIMAL FUTURE TEAM</h3>
                      <p className="text-xs font-mono text-cyan-400/70">VERSION 3.4+</p>
                    </div>
                  </div>
                  
                  <div className="relative flex flex-col md:flex-row gap-4 items-center justify-between z-10 opacity-80 hover:opacity-100 transition-opacity duration-300">
                    {/* Character 1 */}
                    <div className="flex-1 w-full bg-[var(--bg-secondary)]/60 backdrop-blur-md border border-cyan-500/30 rounded-xl p-4 flex items-center gap-4 hover:scale-105 transition-transform duration-300">
                      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-cyan-400 shrink-0">
                         <img src="https://res.cloudinary.com/ds6dwbk37/image/upload/v1775469473/HFDG1e9bAAAPRyH_jd6gyk.png" alt="Hiyuki" className="w-full h-full object-cover object-top grayscale-[30%]" />
                      </div>
                      <div>
                        <span className="block font-bold text-cyan-400 text-lg">HIYUKI</span>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Main DPS</span>
                      </div>
                    </div>

                    {/* Character 2 */}
                    <div className="flex-1 w-full bg-[var(--bg-secondary)]/60 backdrop-blur-md border border-blue-500/30 rounded-xl p-4 flex items-center gap-4 hover:scale-105 transition-transform duration-300">
                      <div className="w-14 h-14 rounded-full bg-blue-900/40 border-2 border-blue-400 shrink-0 flex items-center justify-center">
                        <Snowflake size={24} className="text-blue-400" />
                      </div>
                      <div>
                        <span className="block font-bold text-blue-400 text-lg">LUCILLA</span>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Condensation Sub-DPS</span>
                      </div>
                    </div>

                    {/* Character 3 */}
                    <div className="flex-1 w-full bg-[var(--bg-secondary)]/60 backdrop-blur-md border border-white/10 rounded-xl p-4 flex items-center gap-4 hover:scale-105 transition-transform duration-300">
                      <div className="w-14 h-14 rounded-full bg-white/5 border-2 border-white/20 shrink-0 flex items-center justify-center">
                        <ShieldAlert size={24} className="text-white/50" />
                      </div>
                      <div>
                        <span className="block font-bold text-white/80 text-lg">HEALER</span>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Flex Support</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </div>

          {/* Right Column: Weapons & Echoes */}
          <div className="space-y-8">
            
            {/* Echoes & Stats */}
            <section id="echoes" className="relative rounded-2xl p-6 md:p-8 overflow-hidden border border-white/5 bg-[var(--bg-secondary)]/50 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <Target className="text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" size={24} />
                <h2 className="text-2xl font-akira tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">ECHOES & STATS</h2>
              </div>
              
              <div className="space-y-8 relative z-10">
                <div>
                  <h3 className="text-sm font-mono text-slate-400 mb-3 tracking-widest flex items-center gap-2">
                    <div className="w-1 h-4 bg-cyan-400 rounded-full" /> BEST SETS
                  </h3>
                  <div className="bg-white/[0.03] p-4 rounded-xl border border-white/10 border-l-4 border-l-cyan-400 hover:bg-white/[0.05] transition-colors shadow-[0_4px_15px_rgba(0,0,0,0.2)]">
                    <span className="font-bold text-cyan-400 block mb-1 text-lg drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">Freezing Frost (Glacio)</span>
                    <span className="text-sm text-slate-300 leading-relaxed">Standard BiS. Newer sets focusing on Resonance Liberation Damage or Tune Break are also highly recommended.</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-mono text-slate-400 mb-3 tracking-widest flex items-center gap-2">
                    <div className="w-1 h-4 bg-purple-400 rounded-full" /> MAIN STATS
                  </h3>
                  <div className="space-y-3">
                    {/* Cost 4 */}
                    <div className="bg-white/[0.02] p-3.5 rounded-xl border border-white/5 hover:border-purple-500/30 transition-colors group">
                      <div className="flex items-center gap-3 mb-2.5">
                        <div className="w-6 h-6 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs border border-purple-500/30 shadow-[0_0_8px_rgba(168,85,247,0.3)]">4</div>
                        <span className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">Cost 4 (Overlord / Calamity)</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 ml-9">
                        <span className="px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-xs font-medium text-purple-300">Crit Rate</span>
                        <span className="text-slate-500 text-[10px] uppercase font-bold">or</span>
                        <span className="px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-xs font-medium text-purple-300">Crit DMG</span>
                      </div>
                    </div>
                    
                    {/* Cost 3 */}
                    <div className="bg-white/[0.02] p-3.5 rounded-xl border border-white/5 hover:border-cyan-500/30 transition-colors group">
                      <div className="flex items-center gap-3 mb-2.5">
                        <div className="w-6 h-6 rounded bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs border border-cyan-500/30 shadow-[0_0_8px_rgba(6,182,212,0.3)]">3</div>
                        <span className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">Cost 3 (Elite)</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 ml-9">
                        <span className="px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-xs font-medium text-cyan-300">Glacio DMG</span>
                        <span className="text-slate-500 text-[10px] uppercase font-bold">or</span>
                        <span className="px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-xs font-medium text-cyan-300">Energy Regen %</span>
                      </div>
                    </div>

                    {/* Cost 1 */}
                    <div className="bg-white/[0.02] p-3.5 rounded-xl border border-white/5 hover:border-emerald-500/30 transition-colors group">
                      <div className="flex items-center gap-3 mb-2.5">
                        <div className="w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.3)]">1</div>
                        <span className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">Cost 1 (Common)</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 ml-9">
                        <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-300">ATK %</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-3 italic flex items-center gap-2">
                    <Zap size={12} className="text-amber-400" /> At least 120% Energy Regen is ideal.
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-mono text-slate-400 mb-3 tracking-widest flex items-center gap-2">
                    <div className="w-1 h-4 bg-amber-400 rounded-full" /> SUB-STAT PRIORITY
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <div className="group relative">
                      <span className="px-3 py-1.5 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-full text-xs font-bold cursor-help transition-all hover:bg-cyan-500/30 hover:shadow-[0_0_10px_rgba(6,182,212,0.4)]">1. CRIT RATE/DMG</span>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-[var(--bg-secondary)] border border-white/10 rounded-lg text-[10px] text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-xl">
                        Crucial for maximizing burst damage output.
                      </div>
                    </div>
                    <div className="group relative">
                      <span className="px-3 py-1.5 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full text-xs font-bold cursor-help transition-all hover:bg-purple-500/30 hover:shadow-[0_0_10px_rgba(168,85,247,0.4)]">2. RES LIB DMG</span>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-[var(--bg-secondary)] border border-white/10 rounded-lg text-[10px] text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-xl">
                        Boosts the damage of her ultimate ability.
                      </div>
                    </div>
                    <div className="group relative">
                      <span className="px-3 py-1.5 bg-white/5 text-white border border-white/20 rounded-full text-xs font-bold cursor-help transition-all hover:bg-white/10">3. ATK%</span>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-[var(--bg-secondary)] border border-white/10 rounded-lg text-[10px] text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-xl">
                        General damage scaling.
                      </div>
                    </div>
                    <div className="group relative">
                      <span className="px-3 py-1.5 bg-white/5 text-slate-400 border border-white/10 rounded-full text-xs font-bold cursor-help transition-all hover:bg-white/10">4. ER%</span>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-[var(--bg-secondary)] border border-white/10 rounded-lg text-[10px] text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-xl">
                        Needed to reach the 120% threshold.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Skill Priority */}
            <section id="skills" className="space-y-6 relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <ChevronsUp className="text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)] relative z-10" size={28} />
                  <div className="absolute inset-0 bg-purple-400 blur-md opacity-50 animate-pulse" />
                </div>
                <h2 className="text-2xl font-akira tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">SKILL PRIORITY</h2>
              </div>

              <div className="bg-[var(--bg-secondary)]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.5)] space-y-4">
                {/* Priority 1 */}
                <div className="group relative flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 transition-all duration-300 hover:bg-cyan-500/5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-[var(--bg-secondary)] font-bold text-sm shadow-[0_0_10px_rgba(6,182,212,0.5)] shrink-0">
                    1
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-bold text-sm group-hover:text-cyan-400 transition-colors">Forte Circuit</h4>
                    <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Glacio Chafe</p>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_5px_rgba(6,182,212,0.8)]" />
                </div>

                {/* Priority 2 */}
                <div className="group relative flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 transition-all duration-300 hover:bg-purple-500/5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-fuchsia-600 flex items-center justify-center text-[var(--bg-secondary)] font-bold text-sm shadow-[0_0_10px_rgba(168,85,247,0.5)] shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-bold text-sm group-hover:text-purple-400 transition-colors">Resonance Liberation</h4>
                    <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Ultimate</p>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_5px_rgba(168,85,247,0.8)]" />
                </div>

                {/* Priority 3 */}
                <div className="group relative flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all duration-300 hover:bg-emerald-500/5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-[var(--bg-secondary)] font-bold text-sm shadow-[0_0_10px_rgba(52,211,153,0.5)] shrink-0">
                    3
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-bold text-sm group-hover:text-emerald-400 transition-colors">Resonance Skill</h4>
                    <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Active Ability</p>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.8)]" />
                </div>

                {/* Priority 4 */}
                <div className="group relative flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-amber-500/30 transition-all duration-300 hover:bg-amber-500/5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-[var(--bg-secondary)] font-bold text-sm shadow-[0_0_10px_rgba(251,191,36,0.5)] shrink-0">
                    4
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-bold text-sm group-hover:text-amber-400 transition-colors">Basic Attack</h4>
                    <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Normal Combos</p>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_5px_rgba(251,191,36,0.8)]" />
                </div>

                {/* Priority 5 */}
                <div className="group relative flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-slate-500/30 transition-all duration-300 hover:bg-slate-500/5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-[var(--bg-secondary)] font-bold text-sm shadow-[0_0_10px_rgba(148,163,184,0.5)] shrink-0">
                    5
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-bold text-sm group-hover:text-slate-300 transition-colors">Intro Skill</h4>
                    <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Switch In</p>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 shadow-[0_0_5px_rgba(148,163,184,0.8)]" />
                </div>
              </div>
            </section>

          </div>
        </div>

        {/* Weapons (Full Width) */}
        <div className="mt-12 relative z-10">
          <section id="weapons" className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="relative">
                <ShieldAlert className="text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] relative z-10" size={28} />
                <div className="absolute inset-0 bg-cyan-400 blur-md opacity-50 animate-pulse" />
              </div>
              <h2 className="text-2xl font-akira tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">WEAPONS</h2>
            </div>

            {/* BiS Weapon */}
            <div className="relative rounded-3xl overflow-hidden group border border-cyan-500/30 bg-[var(--bg-secondary)]/60 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_32px_rgba(6,182,212,0.2)] transition-all duration-500 hover:-translate-y-1">
              {/* Animated Background Glow */}
              <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent group-hover:animate-[spin_4s_linear_infinite] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="absolute top-0 right-0 bg-gradient-to-l from-cyan-500 to-blue-600 text-[var(--bg-secondary)] text-[10px] font-bold px-6 py-2 rounded-bl-2xl z-20 tracking-widest shadow-[0_0_15px_rgba(6,182,212,0.8)]">
                BEST IN SLOT
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-secondary)] via-[var(--bg-secondary)]/90 to-transparent z-10" />
              <img 
                src="https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=1200&q=80" 
                alt="Scorching Frost" 
                className="absolute inset-0 w-full h-full object-cover object-center opacity-30 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700 mix-blend-luminosity"
              />
              
              <div className="relative z-20 p-8 md:p-12 flex flex-col lg:flex-row gap-12 items-center lg:items-start">
                <div className="flex-1 space-y-8">
                  <div>
                    <h3 className="font-akira text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500 mb-3 drop-shadow-md">Scorching Frost</h3>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1.5 rounded bg-cyan-500/20 border border-cyan-500/30 text-xs font-mono text-cyan-300 tracking-widest uppercase">Signature</span>
                      <span className="text-xs font-mono text-slate-400 tracking-widest uppercase">5★ Katana</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-8 py-6 border-y border-white/10 bg-white/[0.02] rounded-2xl px-8 backdrop-blur-sm max-w-2xl">
                    <div>
                      <span className="block text-xs font-mono text-slate-400 mb-2 flex items-center gap-1.5"><Zap size={14} className="text-slate-400"/> BASE ATK</span>
                      <span className="font-bold text-3xl text-white">587</span>
                    </div>
                    <div className="w-px bg-white/10" />
                    <div>
                      <span className="block text-xs font-mono text-slate-400 mb-2 flex items-center gap-1.5"><Target size={14} className="text-cyan-400"/> SECONDARY STAT</span>
                      <span className="font-bold text-3xl text-cyan-400 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">CRIT DMG 48.6%</span>
                    </div>
                  </div>

                  <div className="space-y-4 bg-[var(--bg-secondary)]/40 p-6 rounded-2xl border border-white/5 max-w-3xl">
                    <span className="text-sm font-bold tracking-widest text-cyan-400/80 flex items-center gap-2">
                      <div className="w-2 h-2 bg-cyan-400 rotate-45 shadow-[0_0_5px_rgba(6,182,212,0.8)]" />
                      WEAPON SKILL: FROSTBITE
                    </span>
                    <ul className="text-base space-y-4 text-slate-300">
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2.5 shrink-0 shadow-[0_0_5px_rgba(6,182,212,0.8)]" />
                        <span>Increases ATK by <strong className="text-white drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">12%</strong></span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2.5 shrink-0 shadow-[0_0_5px_rgba(6,182,212,0.8)]" />
                        <span>Grants <strong className="text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">28% Glacio DMG Bonus</strong> when applying &quot;Glacio Chafe&quot;</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2.5 shrink-0 shadow-[0_0_5px_rgba(6,182,212,0.8)]" />
                        <span>Resonance Liberation ignores <strong className="text-white drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">8% of target&apos;s DEF</strong> for 6s</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Alternative Weapons Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Alternative 1: Emerald of Genesis */}
              <div className="group relative bg-[var(--bg-secondary)]/60 backdrop-blur-xl border border-white/10 hover:border-amber-400/50 rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_8px_32px_rgba(245,158,11,0.15)] overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/5 blur-3xl rounded-full group-hover:bg-amber-500/20 transition-colors duration-500" />
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/0 group-hover:from-amber-500/5 group-hover:to-transparent transition-colors duration-500" />
                
                <div className="relative z-10 flex flex-col h-full space-y-6">
                  {/* Header */}
                  <div>
                    <h4 className="font-bold text-white group-hover:text-amber-400 transition-colors text-xl mb-2">Emerald of Genesis</h4>
                    <span className="inline-block px-3 py-1 rounded bg-amber-500/20 border border-amber-500/30 text-xs font-mono text-amber-400">5★ SWORD</span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-400 leading-relaxed">
                    A standard 5-star weapon often considered best-in-slot or second-best-in-slot for many sword users due to its high base attack and crit rate. It is highly versatile, providing Energy Regen and Attack buffs, making it suitable for characters like Havoc Rover and Changli.
                  </p>

                  {/* Stats Row */}
                  <div className="flex gap-6 py-3 border-y border-white/10 bg-white/[0.02] rounded-xl px-4">
                    <div>
                      <span className="block text-[10px] font-mono text-slate-400 mb-1">BASE ATK</span>
                      <span className="font-bold text-xl text-white">587</span>
                    </div>
                    <div className="w-px bg-white/10" />
                    <div>
                      <span className="block text-[10px] font-mono text-slate-400 mb-1">CRIT RATE</span>
                      <span className="font-bold text-xl text-amber-400 drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]">24.3%</span>
                    </div>
                  </div>

                  {/* Passive */}
                  <div className="bg-[var(--bg-secondary)]/40 p-5 rounded-xl border border-white/5 mt-auto">
                    <span className="text-xs font-bold tracking-widest text-amber-400/80 flex items-center gap-2 mb-3">
                      <div className="w-1.5 h-1.5 bg-amber-400 rotate-45 shadow-[0_0_5px_rgba(245,158,11,0.8)]" />
                      PASSIVE: FRIGID BLADE
                    </span>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Increases Energy Regen. When the Resonance Skill is released, it increases ATK, which can be stacked up to 2 times.
                    </p>
                  </div>
                </div>
              </div>

              {/* Alternative 2: Commando of Conviction */}
              <div className="group relative bg-[var(--bg-secondary)]/60 backdrop-blur-xl border border-white/10 hover:border-purple-400/50 rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_8px_32px_rgba(168,85,247,0.15)] overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/5 blur-3xl rounded-full group-hover:bg-purple-500/20 transition-colors duration-500" />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:to-transparent transition-colors duration-500" />
                
                <div className="relative z-10 flex flex-col h-full space-y-6">
                  {/* Header */}
                  <div>
                    <h4 className="font-bold text-white group-hover:text-purple-400 transition-colors text-xl mb-2">Commando of Conviction</h4>
                    <span className="inline-block px-3 py-1 rounded bg-purple-500/20 border border-purple-500/30 text-xs font-mono text-purple-400">4★ SWORD</span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-400 leading-relaxed">
                    A 4-star weapon designed to commemorate the Midnight Rangers&apos; courage. It is a strong F2P-friendly, or &quot;budget&quot; option, frequently used for its easy-to-activate passive to boost attack.
                  </p>

                  {/* Passive */}
                  <div className="bg-[var(--bg-secondary)]/40 p-5 rounded-xl border border-white/5 mt-auto">
                    <span className="text-xs font-bold tracking-widest text-purple-400/80 flex items-center gap-2 mb-3">
                      <div className="w-1.5 h-1.5 bg-purple-400 rotate-45 shadow-[0_0_5px_rgba(168,85,247,0.8)]" />
                      PASSIVE: UNYIELDING
                    </span>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      When the Intro Skill is cast, it increases ATK by 15% (up to 30% at rank 5) for 15 seconds.
                    </p>
                  </div>

                  {/* Best For */}
                  <div className="flex items-start gap-3 pt-2 border-t border-white/5">
                    <Target size={16} className="text-purple-400 mt-0.5 shrink-0" />
                    <p className="text-xs text-slate-400 leading-relaxed">
                      <strong className="text-slate-300">Best For:</strong> Characters who rely on frequent character switching (intro skills) and for general, consistent damage boosting.
                    </p>
                  </div>
                </div>
              </div>

              {/* Alternative 3: Lumingloss */}
              <div className="group relative bg-[var(--bg-secondary)]/60 backdrop-blur-xl border border-white/10 hover:border-purple-400/50 rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_8px_32px_rgba(168,85,247,0.15)] overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/5 blur-3xl rounded-full group-hover:bg-purple-500/20 transition-colors duration-500" />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:to-transparent transition-colors duration-500" />
                
                <div className="relative z-10 flex flex-col h-full space-y-6">
                  {/* Header */}
                  <div>
                    <h4 className="font-bold text-white group-hover:text-purple-400 transition-colors text-xl mb-2">Lumingloss</h4>
                    <span className="inline-block px-3 py-1 rounded bg-purple-500/20 border border-purple-500/30 text-xs font-mono text-purple-400">4★ SWORD</span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-400 leading-relaxed">
                    A ceremonial sword used by the Jinzhou Magistrate of Huanglong, recognized by its golden ginkgo leaf pattern. It is considered a solid 4-star option for Havoc Rover, providing strong buffs to Basic and Heavy attacks.
                  </p>

                  {/* Passive */}
                  <div className="bg-[var(--bg-secondary)]/40 p-5 rounded-xl border border-white/5 mt-auto">
                    <span className="text-xs font-bold tracking-widest text-purple-400/80 flex items-center gap-2 mb-3">
                      <div className="w-1.5 h-1.5 bg-purple-400 rotate-45 shadow-[0_0_5px_rgba(168,85,247,0.8)]" />
                      PASSIVE ABILITY
                    </span>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Increases Basic Attack Damage and Heavy Attack Damage for 10 seconds after using a Resonance Skill.
                    </p>
                  </div>

                  {/* Best For */}
                  <div className="flex items-start gap-3 pt-2 border-t border-white/5">
                    <Target size={16} className="text-purple-400 mt-0.5 shrink-0" />
                    <p className="text-xs text-slate-400 leading-relaxed">
                      <strong className="text-slate-300">Best For:</strong> Characters who use their Resonance Skill often to buff their basic/heavy attack damage (e.g., Havoc Rover).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
