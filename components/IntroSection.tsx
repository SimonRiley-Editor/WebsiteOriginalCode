import React, { useEffect, useRef, memo } from 'react';
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from 'motion/react';
import { Twitter, Linkedin, Youtube, Twitch, Cpu, Globe, Layers, Home, Lock } from 'lucide-react';

// Memoized particle system to prevent re-rendering on mouse move
const Particles = memo(() => {
  const [mounted, setMounted] = React.useState(false);
  const [particles, setParticles] = React.useState<any[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setParticles([...Array(30)].map(() => ({
      xRatio: Math.random(),
      yRatio: Math.random(),
      opacityOffset: Math.random(),
      scaleOffset: Math.random(),
      yEndOffset: Math.random(),
      opEndOffset: Math.random(),
      durOffset: Math.random()
    })));
  }, []);

  if (!mounted || particles.length === 0) {
    return <div className="absolute inset-0 z-0 pointer-events-none"></div>;
  }

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      {particles.map((p, i) => (
        <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{ 
                x: p.xRatio * window.innerWidth, 
                y: p.yRatio * window.innerHeight,
                opacity: p.opacityOffset * 0.5 + 0.1,
                scale: p.scaleOffset * 2 
            }}
            animate={{
                y: [null, p.yEndOffset * -150 - 50],
                opacity: [null, p.opEndOffset * 0.8 + 0.2, 0]
            }}
            transition={{
                duration: p.durOffset * 15 + 10,
                repeat: Infinity,
                ease: "linear"
            }}
        />
      ))}
    </div>
  );
});
Particles.displayName = 'Particles';

const GrimVeilLogo = () => (
  <div className="absolute top-4 left-4 md:top-8 md:left-8 z-50 pointer-events-auto">
    <div className="relative group cursor-pointer flex items-center gap-4">
      <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Glass Container */}
      <div className="relative w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-2xl md:rounded-3xl md:backdrop-blur-md bg-black/60 md:bg-white/5 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden transition-all duration-500 group-hover:bg-white/10 group-hover:border-purple-500/30 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]">
        
        {/* Inner Glare */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50"></div>
        
        {/* Monogram SVG */}
        <svg viewBox="0 0 100 100" className="w-8 h-8 md:w-11 md:h-11 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
          <defs>
            <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#9333ea" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Outer circle */}
          <circle cx="50" cy="50" r="45" fill="none" stroke="url(#logo-grad)" strokeWidth="1.5" strokeDasharray="2 6" className="animate-[spin_20s_linear_infinite] opacity-50" />
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white/20" />
          
          {/* G */}
          <path d="M 50 25 C 32 25 25 38 25 50 C 25 62 32 75 50 75 C 62 75 72 68 74 60 L 62 60 C 58 68 55 68 50 68 C 38 68 36 55 36 50 C 36 45 38 32 50 32 C 58 32 62 38 62 38 L 74 30 C 74 30 62 25 50 25 Z" fill="url(#logo-grad)" />
          
          {/* V */}
          <path d="M 45 45 L 60 80 L 75 45 L 68 45 L 60 68 L 52 45 Z" fill="#fff" filter="url(#glow)" />
          
          {/* Center Star */}
          <path d="M 50 40 L 52 48 L 60 50 L 52 52 L 50 60 L 48 52 L 40 50 L 48 48 Z" fill="#a855f7" filter="url(#glow)" className="animate-pulse" />
        </svg>
      </div>
      
      {/* Title next to logo on hover */}
      <div className="hidden md:flex flex-col opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
          <span className="font-black text-2xl tracking-[0.2em] text-white leading-none uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" style={{ fontFamily: 'var(--font-cinzel), serif' }}>GRIMVEIL</span>
          <span className="text-[10px] tracking-[0.3em] text-purple-400 uppercase mt-1" style={{ fontFamily: 'var(--font-cinzel), serif' }}>Guide School</span>
      </div>
    </div>
  </div>
);

const SocialSidebar = () => (
  <div className="absolute left-4 md:left-6 lg:left-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-6 z-30 pointer-events-auto">
    <SocialIcon icon={<Twitter size={20} strokeWidth={1.5} />} href="https://x.com/saintontas" />
    <SocialIcon icon={<Youtube size={22} strokeWidth={1.5} />} href="https://www.youtube.com/@saintontas" />
    <SocialIcon icon={<Twitch size={20} strokeWidth={1.5} />} href="https://www.twitch.tv/saintontas" />
  </div>
);

const SocialIcon = ({ icon, href = "#" }: { icon: React.ReactNode, href?: string }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="relative flex items-center justify-center text-white/50 hover:text-white transition-all duration-300 hover:scale-110">
    <div className="relative z-10">{icon}</div>
  </a>
);

const RightNav = ({ activeBgIndex, setActiveBgIndex }: { activeBgIndex: number, setActiveBgIndex: (index: number) => void }) => (
  <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 z-30 pointer-events-auto hidden md:flex group">
    <div className="absolute right-[120%] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none mr-2">
       <span className="text-[10px] font-mono tracking-[0.2em] text-white/40 whitespace-nowrap uppercase">THEME</span>
    </div>
    
    <div className="relative w-[1px] h-20 bg-gradient-to-t from-[#ef4444]/30 via-amber-500/30 to-transparent overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-amber-400 before:to-transparent before:animate-[fall_3s_linear_infinite]"></div>
    
    {[0, 1].map((index) => (
      <div key={index} onClick={() => setActiveBgIndex(index)} className="p-2 cursor-pointer transition-transform hover:scale-125">
        <NavDot active={activeBgIndex === index} />
      </div>
    ))}

    <div className="relative w-[1px] h-20 bg-gradient-to-b from-[#ef4444]/30 via-amber-500/30 to-transparent overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-amber-400 before:to-transparent before:animate-[fall_3s_linear_infinite]"></div>
    
    <div className="text-[10px] font-mono tracking-[0.3em] text-[#ef4444]/60 origin-top-right rotate-90 translate-y-[120px] whitespace-nowrap hidden md:block uppercase absolute top-full">System Node</div>
  </div>
);

const NavDot = ({ active }: { active?: boolean }) => (
  <div className={`group relative cursor-pointer p-2 ${active ? '' : 'opacity-50 hover:opacity-100'} transition-opacity`}>
    <div className="absolute inset-0 bg-[#ef4444]/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-300 blur-sm"></div>
    <div className={`rounded-sm rotate-45 relative z-10 transition-all ${active ? 'w-[6px] h-[6px] bg-[#ef4444] shadow-[0_0_10px_#ef4444]' : 'w-[4px] h-[4px] border border-amber-300 group-hover:bg-[#ef4444] group-hover:border-[#ef4444] group-hover:w-[6px] group-hover:h-[6px]'}`}></div>
    {active && (
      <div className="absolute inset-[4px] border border-[#ef4444]/50 rounded-sm rotate-45 animate-ping opacity-50 pointer-events-none" />
    )}
  </div>
);

const InteractiveNode = ({ title, active, onClick, isCenter, icon: Icon, locked }: { title: string, active?: boolean, onClick: () => void, isCenter?: boolean, icon: any, locked?: boolean }) => {
  return (
    <div className={`relative group cursor-pointer pointer-events-auto z-30 flex-shrink-0 flex items-center justify-center active:scale-95 transition-transform duration-200 ${locked ? 'cursor-not-allowed' : ''}`} onClick={locked ? undefined : onClick}>
        
        {/* Glow effect behind the node */}
        <div className={`absolute inset-0 rounded-full bg-amber-400/0 ${locked ? 'group-hover:bg-red-500/20' : 'group-hover:bg-amber-400/30'} blur-[20px] transition-colors duration-500`}></div>

        {/* The Node Rings - Hexagonal/Diamond */}
        <div className="relative flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rotate-45 transition-transform duration-500 group-hover:scale-110">
            
            {/* Outer Target Reticle (Snaps in on hover) */}
            <div className={`absolute inset-[-12px] md:inset-[-16px] border border-amber-400/0 ${locked ? 'group-hover:border-red-500/40' : 'group-hover:border-[#ef4444]/40'} rounded-full transition-all duration-500 scale-150 group-hover:scale-100 opacity-0 group-hover:opacity-100`}>
                {/* Crosshair pips */}
                <div className={`absolute top-[-2px] left-1/2 -translate-x-1/2 w-[2px] h-[4px] ${locked ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-[#ef4444] shadow-[0_0_8px_#ef4444]'}`}></div>
                <div className={`absolute bottom-[-2px] left-1/2 -translate-x-1/2 w-[2px] h-[4px] ${locked ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-[#ef4444] shadow-[0_0_8px_#ef4444]'}`}></div>
                <div className={`absolute left-[-2px] top-1/2 -translate-y-1/2 w-[4px] h-[2px] ${locked ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-[#ef4444] shadow-[0_0_8px_#ef4444]'}`}></div>
                <div className={`absolute right-[-2px] top-1/2 -translate-y-1/2 w-[4px] h-[2px] ${locked ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-[#ef4444] shadow-[0_0_8px_#ef4444]'}`}></div>
            </div>

            {/* Corner Bracket Accents (Animate outward on hover) */}
            <div className={`absolute inset-[-6px] md:inset-[-8px] border-t-2 border-l-2 pointer-events-none transition-all duration-700 ${isCenter ? 'border-amber-400/40 group-hover:border-white group-hover:scale-125' : locked ? 'border-red-500/20 group-hover:border-red-500/80 group-hover:scale-125' : 'border-white/20 group-hover:border-amber-400/80 group-hover:scale-125'}`}></div>
            <div className={`absolute inset-[-6px] md:inset-[-8px] border-b-2 border-r-2 pointer-events-none transition-all duration-700 ${isCenter ? 'border-amber-400/40 group-hover:border-white group-hover:scale-125' : locked ? 'border-red-500/20 group-hover:border-red-500/80 group-hover:scale-125' : 'border-white/20 group-hover:border-amber-400/80 group-hover:scale-125'}`}></div>

            {/* Spinning Dashed Ring */}
            <div className={`absolute inset-0 border pointer-events-none scale-[1.3] border-dashed transition-all duration-700 animate-[spin_10s_linear_infinite] group-hover:animate-[spin_3s_linear_infinite] ${isCenter ? 'border-[#ef4444]/60' : locked ? 'border-red-500/30 group-hover:border-red-500/60' : 'border-white/20 group-hover:border-amber-400/60'}`}></div>
            
            {/* Inner fill */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center md:backdrop-blur-md transition-all duration-500 overflow-hidden ${isCenter ? 'bg-[#0a0a0a]/90 border-[2px] border-[#ef4444] shadow-[0_0_20px_rgba(239,68,68,0.4)] group-hover:shadow-[0_0_40px_rgba(239,68,68,0.8)] group-hover:border-white group-hover:bg-[#2a0a0a]/80' : locked ? 'bg-red-950/40 border-[1px] border-red-500/40 group-hover:bg-red-950/80 group-hover:border-red-500 group-hover:shadow-[0_0_25px_rgba(239,68,68,0.6)]' : 'bg-[#0a0a0a]/60 border-[1px] border-white/40 group-hover:bg-amber-950/60 group-hover:border-amber-400 group-hover:shadow-[0_0_25px_rgba(251,191,36,0.6)]'}`}>
                
                {/* Sonar Scanline effect on hover */}
                <div className={`absolute inset-0 bg-gradient-to-tr from-transparent ${locked ? 'via-red-500/40' : 'via-[#ef4444]/40'} to-transparent translate-x-[-150%] skew-x-[-45deg] group-hover:animate-[shimmer_1.2s_ease-in-out_infinite]`}></div>
                
                <div className="rotate-[-45deg] relative z-10 w-full h-full flex items-center justify-center">
                    {locked ? (
                        <Lock size={14} strokeWidth={2} className="text-red-400/70 group-hover:text-red-400 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_#ef4444] transition-all duration-300" />
                    ) : (
                        <Icon size={isCenter ? 16 : 14} strokeWidth={isCenter ? 2.5 : 2} className={`transition-all duration-300 ${isCenter ? 'text-[#ef4444] group-hover:text-white group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_#ffffff]' : 'text-white/70 group-hover:text-amber-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_#fbbf24]'}`} />
                    )}
                </div>
            </div>
            
            {/* Blinking Connection Point */}
            <div className={`absolute -bottom-4 -right-4 w-1.5 h-1.5 rounded-sm transition-all duration-500 shadow-[0_0_8px_currentColor] ${isCenter ? 'bg-[#ef4444] text-[#ef4444] animate-pulse' : locked ? 'bg-red-500/30 text-red-500/30 group-hover:bg-red-400 group-hover:text-red-400 group-hover:animate-[pulse_1s_ease-in-out_infinite]' : 'bg-white/30 text-white/30 group-hover:bg-amber-400 group-hover:text-amber-400 group-hover:animate-[pulse_1s_ease-in-out_infinite]'}`}></div>
        </div>

        {/* Title Container */}
        <div className="absolute top-[100%] left-1/2 -translate-x-1/2 flex flex-col items-center mt-4 md:mt-6 group-hover:mt-8 md:group-hover:mt-10 w-[200px] pointer-events-none transition-all duration-500">
            
            {/* Small tech data on hover */}
            <div className={`text-[6px] md:text-[7px] ${locked ? 'text-red-500/0 group-hover:text-red-400/80' : 'text-[#ef4444]/0 group-hover:text-[#ef4444]/80'} font-mono tracking-[0.2em] transition-all duration-300 -translate-y-3 group-hover:-translate-y-1 uppercase h-4 flex items-center`}>
               <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">{locked ? 'WIP / LOCKED' : 'RESONATING...'}</span>
            </div>
            
            <div className={`flex items-center gap-1 text-[9px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] font-sans uppercase transition-all duration-500 whitespace-nowrap ${isCenter ? 'text-[#ef4444] font-bold drop-shadow-[0_0_10px_rgba(239,68,68,0.6)] group-hover:text-white group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]' : locked ? 'text-red-500/70 font-semibold group-hover:text-red-400 group-hover:drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'text-neutral-400 font-semibold group-hover:text-amber-300 group-hover:drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]'}`}>
                {/* Animated Brackets */}
                <span className={`text-amber-500/0 ${isCenter ? 'group-hover:text-[#ef4444]' : locked ? 'group-hover:text-red-400' : 'group-hover:text-amber-400'} transition-all duration-300 -translate-x-2 group-hover:translate-x-0`}>[</span>
                {title}
                <span className={`text-amber-500/0 ${isCenter ? 'group-hover:text-[#ef4444]' : locked ? 'group-hover:text-red-400' : 'group-hover:text-amber-400'} transition-all duration-300 translate-x-2 group-hover:translate-x-0`}>]</span>
            </div>
            
            {/* Underscore decorative line */}
            <div className={`w-0 group-hover:w-[30px] h-[1px] mt-2 transition-all duration-500 ${isCenter ? 'bg-[#ef4444]/80 shadow-[0_0_8px_#ef4444]' : locked ? 'bg-red-500/80 shadow-[0_0_8px_#ef4444]' : 'bg-amber-400/80 shadow-[0_0_8px_#fbbf24]'} `}></div>
        </div>
    </div>
  );
};

const NavIconButton = ({ icon: Icon, active, onClick }: { icon: any, active?: boolean, onClick: () => void }) => {
    return (
        <div className="relative flex flex-col items-center">
            <button 
                onClick={onClick}
                className={`w-[44px] h-[44px] rounded-full flex items-center justify-center transition-all duration-300 ${active ? 'bg-white/5 text-amber-400' : 'bg-transparent text-white/50 hover:text-white hover:bg-white/10'}`}
            >
                <Icon size={20} strokeWidth={active ? 2 : 1.5} />
            </button>
            {active && (
                <div className="absolute -bottom-1 flex justify-center w-full">
                    <div className="w-1 h-1 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]"></div>
                </div>
            )}
        </div>
    )
}

export const IntroSection = ({ setActiveSection, onExplore }: { setActiveSection: (s: string) => void, onExplore: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeBgIndex, setActiveBgIndex] = React.useState(0);
  const [latestVideoId, setLatestVideoId] = React.useState("N-5rOF_j9nI");
  
  useEffect(() => {
    fetch('/api/youtube-latest')
      .then(res => res.json())
      .then(data => {
        if (data.videoId) {
          setLatestVideoId(data.videoId);
        }
      })
      .catch(console.error);
  }, []);
  
  const backgrounds = [
    { webm: "https://res.cloudinary.com/ds6dwbk37/video/upload/v1777215636/videoplayback_rqjtx9.webm", mp4: "https://res.cloudinary.com/ds6dwbk37/video/upload/v1777215636/videoplayback_rqjtx9.mp4" },
    { webm: "https://res.cloudinary.com/ds6dwbk37/video/upload/v1777614809/Backround2_jaagxt.webm", mp4: "" }
  ];
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth out mouse movements
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  
  // Create parallax values for background layers
  const bgX = useTransform(springX, [-1, 1], [-20, 20]);
  const bgY = useTransform(springY, [-1, 1], [-20, 20]);
  
  // Parallax for midground (nodes)
  const midX = useTransform(springX, [-1, 1], [-10, 10]);
  const midY = useTransform(springY, [-1, 1], [-10, 10]);
  
  // Parallax for text (foreground)
  const fgX = useTransform(springX, [-1, 1], [-5, 5]);
  const fgY = useTransform(springY, [-1, 1], [-5, 5]);
  
  const planetX = useTransform(springX, [-1, 1], [-40, 40]);
  const planetY = useTransform(springY, [-1, 1], [-15, 15]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      // Using requestAnimationFrame to debounce visually could help, 
      // but framer-motion handles requestAnimationFrame internally with useMotionValue updates.
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      // Calculate normalized mouse position from -1 to 1
      const x = ((e.clientX - left) / width) * 2 - 1;
      const y = ((e.clientY - top) / height) * 2 - 1;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div ref={containerRef} className="w-full h-screen min-h-[800px] relative flex flex-col bg-[#0a0a0a] overflow-hidden font-sans text-white selection:bg-amber-500/30">
      
      {/* Background Video with Parallax */}
      <motion.div style={{ x: bgX, y: bgY }} className="absolute -inset-10 z-0 pointer-events-none transform-gpu will-change-transform">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none md:mix-blend-screen z-10"></div>
          {backgrounds.map((bg, idx) => (
             <video
               key={idx}
               autoPlay
               loop
               muted
               playsInline
               className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${activeBgIndex === idx ? 'opacity-100' : 'opacity-0'}`}
             >
               <source src={bg.webm} type="video/webm" />
               {bg.mp4 && <source src={bg.mp4} type="video/mp4" />}
             </video>
          ))}
          {/* Dark overlay just for video */}
          <div className="absolute inset-0 bg-black/75 z-0" />
          
          {/* Center node radial highlight */}
          <div className="absolute top-[65%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-gradient-to-b from-amber-900/10 via-amber-500/10 to-transparent rounded-full blur-[80px] pointer-events-none"></div>
      </motion.div>
      
      <GrimVeilLogo />
      <Particles />
      <SocialSidebar />
      <RightNav activeBgIndex={activeBgIndex} setActiveBgIndex={setActiveBgIndex} />

      <div className="relative z-10 w-full h-full mx-auto flex-1 flex flex-col justify-between pt-8 md:pt-16 px-4 md:px-8 pointer-events-none">
          
          {/* Header Texts with Parallax */}
          <motion.div style={{ x: fgX, y: fgY }} className="text-center w-full z-20 pb-4 relative mt-[-2vh] md:mt-[-4vh] pointer-events-auto flex flex-col items-center transform-gpu">
              
              {/* Decorative Tech Header */}
              <motion.div 
                 initial={{ opacity: 0, y: -20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 1 }}
                 className="flex flex-col items-center justify-center gap-2 mb-4 md:mb-6 opacity-80"
              >
                  <div className="flex items-center gap-4">
                      <div className="w-16 md:w-24 h-[1px] bg-gradient-to-r from-transparent to-amber-400/80"></div>
                      <div className="flex gap-1.5">
                          <div className="w-1.5 h-1.5 md:w-2 md:h-2 rotate-45 bg-amber-400"></div>
                          <div className="w-1.5 h-1.5 md:w-2 md:h-2 rotate-45 border border-amber-400"></div>
                      </div>
                      <span className="text-[9px] md:text-[11px] tracking-[0.4em] md:tracking-[0.5em] text-amber-300 font-bold uppercase bg-amber-400/20 px-3 py-1 border border-amber-400/30 md:backdrop-blur-md shadow-[0_0_10px_rgba(251,191,36,0.2)]">Guide Maker</span>
                      <div className="flex gap-1.5">
                          <div className="w-1.5 h-1.5 md:w-2 md:h-2 rotate-45 border border-amber-400"></div>
                          <div className="w-1.5 h-1.5 md:w-2 md:h-2 rotate-45 bg-amber-400"></div>
                      </div>
                      <div className="w-16 md:w-24 h-[1px] bg-gradient-to-l from-transparent to-amber-400/80"></div>
                  </div>
              </motion.div>

              <motion.div 
                 initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                 animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                 transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                 className="relative inline-flex flex-col items-center justify-center font-bold text-[2rem] md:text-[3.5rem] lg:text-[5rem] text-white leading-none select-none my-4 md:my-0 group/title cursor-default min-w-[200px] md:min-w-[300px] transition-all duration-700"
              >
                  <h1 className="relative z-10 flex items-center justify-center w-full h-full my-auto transition-transform duration-700">
                     <span className="flex items-end justify-center w-full h-full opacity-90 group-hover/title:opacity-100 group-hover/title:tracking-[0.1em] transition-all duration-700 ease-out uppercase drop-shadow-lg font-black" style={{ fontFamily: 'var(--font-cinzel), serif', letterSpacing: '0.1em' }}>
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">GRIM</span>
                        <span className="relative text-purple-400 font-bold" style={{ textShadow: '0 0 20px rgba(168,85,247,0.8), 0 0 40px rgba(168,85,247,0.4)', margin: '0 0.02em' }}>
                           V
                           <span className="absolute inset-0 text-purple-300 blur-[4px] animate-[pulse_2s_ease-in-out_infinite] pointer-events-none select-none md:mix-blend-screen hidden md:inline" style={{ textShadow: 'none' }}>V</span>
                        </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">EIL</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-purple-400 to-indigo-600 ml-2 text-[1.25rem] md:text-[2.25rem] lg:text-[3.25rem] leading-[0.8] mb-[2px] md:mb-[4px]">.GG</span>
                     </span>
                  </h1>

                  {/* Clean framing lines */}
                  <div className="absolute top-0 left-0 w-8 h-[2px] bg-white/20 group-hover/title:bg-white/60 transition-colors duration-500"></div>
                  <div className="absolute top-0 left-0 w-[2px] h-8 bg-white/20 group-hover/title:bg-white/60 transition-colors duration-500"></div>
                  
                  <div className="absolute bottom-0 right-0 w-8 h-[2px] bg-white/20 group-hover/title:bg-white/60 transition-colors duration-500"></div>
                  <div className="absolute bottom-0 right-0 w-[2px] h-8 bg-white/20 group-hover/title:bg-white/60 transition-colors duration-500"></div>
              </motion.div>

              <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                 className="mt-4 md:mt-8 mx-auto drop-shadow-2xl px-4 flex flex-col items-center z-30"
              >
                 <div className="relative flex items-center justify-center gap-2 md:gap-4 w-full">
                     {/* Left Bracket */}
                     <motion.div 
                         initial={{ opacity: 0, x: 20 }}
                         animate={{ opacity: 1, x: 0 }}
                         transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
                         className="text-amber-500/60 text-lg md:text-3xl font-light select-none"
                     >
                         [
                     </motion.div>
                     
                     <div className="relative overflow-hidden py-3 md:py-4 px-4 md:px-8 bg-gradient-to-b from-amber-900/40 to-[#0a0a0a]/80 border-y border-amber-400/40 md:backdrop-blur-xl shadow-[0_0_20px_rgba(0,0,0,0.8)]">
                         <motion.p 
                             initial={{ opacity: 0, filter: 'blur(5px)' }}
                             animate={{ opacity: 1, filter: 'blur(0px)' }}
                             transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                             className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-sans text-[8px] md:text-[10.5px] tracking-[0.25em] sm:tracking-[0.35em] md:tracking-[0.45em] uppercase leading-[2.2em] font-medium text-center"
                         >
                             Creator, Wuthering Waves Guide Expert, and<br className="hidden md:block" />
                             Architect of the <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-white to-amber-300 relative inline-block drop-shadow-[0_0_15px_rgba(251,191,36,0.8)] ml-1 md:ml-2">GRIMVEIL.GG</span>
                         </motion.p>
                         
                         {/* Cool sweeping scanner line */}
                         <motion.div 
                             className="absolute top-0 bottom-0 w-[40px] md:w-[60px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent skew-x-[-25deg]"
                             animate={{ left: ['-100%', '200%'] }}
                             transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity, repeatDelay: 4 }}
                         />
                     </div>

                     {/* Right Bracket */}
                     <motion.div 
                         initial={{ opacity: 0, x: -20 }}
                         animate={{ opacity: 1, x: 0 }}
                         transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
                         className="text-amber-500/60 text-lg md:text-3xl font-light select-none"
                     >
                         ]
                     </motion.div>
                 </div>
                 
                 {/* Below Subtitle Accents */}
                 <motion.div 
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 0.6, scaleX: 1 }}
                    transition={{ duration: 1.5, delay: 1.5, ease: "easeOut" }}
                    className="mt-6 md:mt-8 flex items-center justify-center gap-3 w-full max-w-[300px]"
                 >
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-amber-400/50 to-amber-400/80"></div>
                    <div className="flex gap-2">
                        <div className="h-1 w-1 rotate-45 bg-amber-400"></div>
                        <div className="h-2 w-2 rotate-45 border border-amber-400"></div>
                        <div className="h-1 w-1 rotate-45 bg-amber-400"></div>
                    </div>
                    <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-amber-400/50 to-amber-400/80"></div>
                 </motion.div>
              </motion.div>
          </motion.div>

          {/* Abstract Nodes Interface */}
          <motion.div 
             style={{ x: midX, y: midY }}
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 2, delay: 0.8 }}
             className="relative w-full pointer-events-none flex-1 flex flex-col justify-end pb-[15vh] md:pb-[25vh] transform-gpu"
          >
              {/* Vertical Laser Downward from central dot removed */}
              
              {/* Horizontal Intersection / The Road */}
              <div className="absolute top-[55%] left-1/2 -translate-x-1/2 w-[95vw] sm:w-[90vw] md:w-[85vw] max-w-5xl flex items-center justify-center -translate-y-1/2 z-20">
                  
                  {/* Left Node (Interactive Map) */}
                  <div className="relative group/node z-30">
                      <InteractiveNode 
                         title="INTERACTIVE MAP" 
                         icon={Globe}
                         onClick={() => setActiveSection('map')} 
                      />
                  </div>

                  {/* Road from Left to Center */}
                  <div className="flex-1 relative flex items-center justify-center h-[20px] mx-1 sm:mx-2 md:mx-4 group cursor-pointer">
                      
                      {/* Sub-surface Glow */}
                      <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-[#ef4444]/10 blur-[10px] transition-colors duration-500"></div>

                      {/* Thin fiber optic track */}
                      <div className="absolute w-full h-[2px] bg-amber-900/40 relative flex items-center shadow-[0_0_10px_rgba(251,191,36,0.1)] group-hover:bg-[#ef4444]/30 transition-colors duration-500 overflow-hidden">
                          
                          {/* High-speed optic light pulse 1 */}
                          <motion.div 
                             className="absolute h-[1px] bg-white w-[20px] shadow-[0_0_10px_#fff,0_0_15px_#fbbf24] rounded-full z-20"
                             animate={{ left: ['-10%', '110%'] }}
                             transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
                          />
                          {/* High-speed optic light pulse 2 */}
                          <motion.div 
                             className="absolute h-[2px] bg-[#ef4444] w-[10px] shadow-[0_0_10px_#ef4444,0_0_15px_#ef4444] rounded-full z-20"
                             animate={{ left: ['-10%', '110%'] }}
                             transition={{ duration: 1.2, repeat: Infinity, ease: 'linear', delay: 0.6 }}
                          />
                          
                          {/* Data packets (Binary/Hex elements) floating along */}
                          <motion.div 
                              className="absolute w-[4px] h-[4px] rounded-full bg-amber-300 shadow-[0_0_5px_#fbbf24] z-10"
                              animate={{ left: ['-5%', '105%'], scale: [1, 1.5, 1], opacity: [0, 1, 0] }}
                              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
                          />
                      </div>
                      
                      {/* Nodes floating over track */}
                      <div className="w-full h-full flex justify-between absolute items-center px-[20%] opacity-40 group-hover:opacity-100 z-20 pointer-events-none transition-opacity duration-300">
                         <div className="w-2 h-2 border border-amber-400 rounded-full bg-[#0a0a0a] shadow-[0_0_8px_currentColor]">
                             <div className="absolute inset-[-4px] border border-amber-400/50 rounded-full animate-ping"></div>
                         </div>
                         <div className="w-2 h-2 bg-amber-400 rounded-full shadow-[0_0_12px_currentColor]"></div>
                      </div>
                  </div>

                  {/* Center Node (CHARACTERS) + Branch */}
                  <div className="relative group/node z-30 flex flex-col items-center">
                      <InteractiveNode 
                         title="CHARACTERS" 
                         isCenter 
                         icon={Cpu}
                         onClick={() => setActiveSection('characters')} 
                      />
                      
                      {/* Sub-branch upward to COMING SOON */}
                      <div className="absolute bottom-[100%] left-1/2 -translate-x-1/2 flex flex-col-reverse items-center pb-12 md:pb-16 z-50 group/soon cursor-not-allowed">
                          
                          {/* Connection line */}
                          <div className="w-[1px] h-[40px] md:h-[60px] bg-gradient-to-t from-[#ef4444]/40 via-red-500/20 to-transparent relative group-hover/soon:from-red-500/60 transition-colors duration-500">
                             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-1 h-4 bg-red-500/50 blur-[2px] opacity-0 group-hover/soon:opacity-100 group-hover/soon:animate-pulse"></div>
                          </div>
                          
                          {/* Floating Hologram Data Card */}
                          <div className="relative flex flex-col items-center justify-center -mb-2 group-hover/soon:-translate-y-2 transition-transform duration-500 scale-90 md:scale-100">
                              
                              <div className="relative px-5 py-2.5 border border-red-500/30 bg-[#0a0202]/80 md:backdrop-blur-xl rounded-sm overflow-hidden group-hover/soon:border-red-500/80 group-hover/soon:shadow-[0_0_25px_rgba(239,68,68,0.3)] transition-all">
                                  {/* Corner accents */}
                                  <div className="absolute top-0 right-0 w-2 h-2 border-b border-l border-red-500/80"></div>
                                  <div className="absolute bottom-0 left-0 w-2 h-2 border-t border-r border-red-500/80"></div>
                                  
                                  {/* Warning Stripes Background */}
                                  <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,#ef4444_5px,#ef4444_10px)] pointer-events-none"></div>

                                  <div className="flex items-center gap-3 relative z-10">
                                      <Lock size={12} className="text-red-500 group-hover/soon:text-red-400 group-hover/soon:animate-bounce" />
                                      <span className="text-[10px] md:text-[11px] font-mono tracking-[0.3em] text-red-100 uppercase whitespace-nowrap font-bold drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]">
                                          COMING SOON
                                      </span>
                                  </div>
                              </div>
                              <div className="text-[7px] md:text-[8px] font-mono text-red-500 mt-2 tracking-[0.4em] uppercase">
                                  [ MODULE LOCKED ]
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Road from Center to Right */}
                  <div className="flex-1 relative flex items-center justify-center h-[20px] mx-1 sm:mx-2 md:mx-4 group cursor-pointer">
                      
                      {/* Sub-surface Glow */}
                      <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-[#ef4444]/10 blur-[10px] transition-colors duration-500"></div>

                      {/* Thin fiber optic track */}
                      <div className="absolute w-full h-[2px] bg-amber-900/40 relative flex items-center shadow-[0_0_10px_rgba(251,191,36,0.1)] group-hover:bg-[#ef4444]/30 transition-colors duration-500 overflow-hidden">
                          
                          {/* High-speed optic light pulse 1 */}
                          <motion.div 
                             className="absolute h-[1px] bg-white w-[20px] shadow-[0_0_10px_#fff,0_0_15px_#fbbf24] rounded-full z-20"
                             animate={{ left: ['110%', '-10%'] }}
                             transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
                          />
                          {/* High-speed optic light pulse 2 */}
                          <motion.div 
                             className="absolute h-[2px] bg-[#ef4444] w-[10px] shadow-[0_0_10px_#ef4444,0_0_15px_#ef4444] rounded-full z-20"
                             animate={{ left: ['110%', '-10%'] }}
                             transition={{ duration: 1.2, repeat: Infinity, ease: 'linear', delay: 0.6 }}
                          />
                          
                          {/* Data packets floating along */}
                          <motion.div 
                              className="absolute w-[4px] h-[4px] rounded-full bg-amber-300 shadow-[0_0_5px_#fbbf24] z-10"
                              animate={{ left: ['105%', '-5%'], scale: [1, 1.5, 1], opacity: [0, 1, 0] }}
                              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
                          />
                      </div>
                      
                      {/* Nodes floating over track */}
                      <div className="w-full h-full flex justify-between absolute items-center px-[20%] opacity-40 group-hover:opacity-100 z-20 pointer-events-none transition-opacity duration-300">
                         <div className="w-2 h-2 bg-amber-400 rounded-full shadow-[0_0_12px_currentColor]"></div>
                         <div className="w-2 h-2 border border-amber-400 rounded-full bg-[#0a0a0a] shadow-[0_0_8px_currentColor]">
                             <div className="absolute inset-[-4px] border border-amber-400/50 rounded-full animate-ping"></div>
                         </div>
                      </div>
                  </div>

                  {/* Right Node */}
                  <div className="relative group/node z-30">
                      <InteractiveNode 
                         title="TIER LIST" 
                         icon={Layers}
                         onClick={() => setActiveSection('tierlist')}
                         locked={true}
                      />
                  </div>
              </div>

              {/* Laser connecting center node to planet */}
              <div className="absolute top-[55%] bottom-[-50vh] left-1/2 -translate-x-1/2 flex flex-col items-center pt-[35px] md:pt-[45px]">
                 <div className="w-[1px] h-[60vh] bg-gradient-to-b from-amber-400/80 to-amber-400/20 z-10 relative overflow-hidden">
                 </div>
              </div>
          </motion.div>
          
          <div className="w-full h-[5vh] md:h-[10vh] shrink-0 pointer-events-none"></div>
      </div>

      {/* The bottom UI slice */}
      <motion.div 
        style={{ x: planetX, y: planetY }} 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[100vw] sm:w-[90vw] md:w-[70vw] lg:w-[60vw] max-w-[900px] h-[100px] md:h-[140px] hover:h-[350px] md:hover:h-[500px] translate-y-1/2 hover:translate-y-[5%] flex justify-center z-50 group cursor-pointer transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu"
      >
          {/* Atmospheric Glow */}
          <div className="absolute top-[-5px] left-1/2 -translate-x-1/2 w-[60%] h-[30px] rounded-[100%] bg-amber-400/20 group-hover:bg-[#ef4444]/20 blur-[20px] z-20 md:mix-blend-screen transition-colors duration-700"></div>
          <div className="absolute top-[0px] left-1/2 -translate-x-1/2 w-[40%] h-[10px] rounded-[100%] bg-white/30 blur-[10px] z-30 md:mix-blend-screen group-hover:opacity-0 transition-opacity duration-700"></div>
          
          {/* Planet Body Curved Outline morphing to Screen */}
          <div className="absolute inset-0 rounded-[100%] group-hover:rounded-[30px] overflow-hidden bg-[#0f0f0f]/95 group-hover:bg-[#181818]/95 md:backdrop-blur-xl border-t-[1.5px] border-amber-400/30 group-hover:border-[1px] group-hover:border-amber-500/40 shadow-[0_0_30px_rgba(251,191,36,0.1)] group-hover:shadow-[0_0_80px_rgba(251,191,36,0.15)] flex flex-col items-center pt-[15px] md:pt-[20px] transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-auto group-hover:border-b-0">
              
              {/* Highlight along the rim */}
              <div className="absolute w-[80%] h-1 bg-gradient-to-r from-transparent via-amber-300 group-hover:via-amber-400 to-transparent opacity-80 blur-[2px] top-[0px] left-1/2 -translate-x-1/2 transition-colors duration-700"></div>
              
              {/* Interactive Module on the planet surface */}
              <div className="relative flex flex-col items-center opacity-70 group-hover:opacity-100 transition-opacity duration-300 z-40">
                  <div className="flex gap-4 mb-2 group-hover:mb-4 transition-all duration-500">
                     <div className="w-[20px] md:w-[30px] h-[2px] bg-amber-900 group-hover:bg-amber-500 transition-colors duration-500 rounded-full shadow-[0_0_5px_transparent] group-hover:shadow-[0_0_8px_#fbbf24]"></div>
                     <div className="w-[10px] h-[2px] bg-amber-900 group-hover:bg-white transition-colors duration-500 rounded-full shadow-[0_0_5px_transparent] group-hover:shadow-[0_0_8px_white]"></div>
                     <div className="w-[20px] md:w-[30px] h-[2px] bg-amber-900 group-hover:bg-[#ef4444] transition-colors duration-500 rounded-full shadow-[0_0_5px_transparent] group-hover:shadow-[0_0_8px_#ef4444]"></div>
                  </div>
                  
                  <div className="flex flex-col items-center transform transition-transform duration-500">
                      <div className="text-[9px] md:text-[10px] font-mono tracking-[0.4em] text-amber-800 group-hover:text-white transition-colors duration-500 uppercase flex items-center gap-2 relative h-4">
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-2 group-hover:translate-x-0 absolute right-full mr-2 text-amber-400">[</span>
                          
                          <div className="relative flex justify-center items-center h-full w-[120px] md:w-[150px]">
                              <span className="absolute transition-all duration-500 group-hover:opacity-0 group-hover:-translate-y-4">LATEST VIDEO</span>
                              <span className="absolute transition-all duration-500 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 text-amber-200 drop-shadow-[0_0_5px_#fbbf24] whitespace-nowrap">LATEST VIDEO</span>
                          </div>

                          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-2 group-hover:translate-x-0 absolute left-full ml-2 text-amber-400">]</span>
                      </div>
                  </div>
              </div>

              {/* Video Reveal Section */}
              <div className="w-[85%] md:w-[90%] max-w-[700px] mt-4 md:mt-8 aspect-video rounded-xl md:rounded-2xl overflow-hidden border border-amber-500/20 opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-1000 delay-200 relative shadow-[0_0_0_rgba(0,0,0,0)] group-hover:shadow-[0_0_40px_rgba(251,191,36,0.15)] bg-black/50 z-30 pointer-events-auto">
                  {/* Embedded Video Placeholder / Video Tag */}
                  <iframe 
                      className="w-full h-full absolute inset-0 pointer-events-none group-hover:pointer-events-auto transition-all"
                      src={`https://www.youtube.com/embed/${latestVideoId}?autoplay=0&mute=1&loop=1&controls=1&rel=0&vq=hd1080`}
                      title="Latest Video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                  ></iframe>
                  {/* Subtle overlay so it looks sci-fi */}
                  <div className="absolute inset-0 bg-neutral-950/10 md:mix-blend-overlay pointer-events-none"></div>
                  {/* Scanline overlay for video */}
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] pointer-events-none md:mix-blend-overlay opacity-50 hidden md:block"></div>
              </div>
              
              {/* Radar rings spreading on hover */}
              <div className="absolute top-[10px] md:top-[20px] left-1/2 -translate-x-1/2 w-[150px] md:w-[200px] h-[150px] md:h-[200px] border border-amber-500/0 group-hover:border-white/5 rounded-full scale-[0.2] group-hover:scale-[2] opacity-0 group-hover:opacity-50 transition-all duration-[2s] ease-out pointer-events-none"></div>
              
              {/* Scanning light origin beam */}
              <div className="absolute top-0 left-1/2 w-[1px] md:w-[2px] h-[40px] md:h-[60px] bg-gradient-to-b from-amber-400 to-transparent -translate-x-1/2 opacity-0 group-hover:opacity-40 group-hover:animate-[ping_2s_ease-in-out_infinite] pointer-events-none blur-[1px]"></div>
          </div>
      </motion.div>
    </div>
  );
};

