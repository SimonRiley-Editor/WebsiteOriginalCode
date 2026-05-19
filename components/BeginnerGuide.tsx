"use client";
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate, MotionValue } from 'motion/react';
import { Activity, Radio, Waves, ShieldAlert, Cpu, Orbit, X, Maximize, Target, Layers } from 'lucide-react';

const guideCategories = [
  {
    id: 'resonance',
    chapter: '001',
    phonetic: 'FREQUENCY.01',
    shortName: 'TIPS',
    title: 'Awakening the Sound',
    icon: <Activity size={24} strokeWidth={1.5} />,
    image: 'https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?auto=format&fit=crop&w=1200&q=80',
    x: -300, y: -200,
    frequency: '432 Hz',
    color: '#f43f5e', // Rose
    content: {
      description: 'The world is shaped by sound. Understand how your resonance interacts with the frequencies around you.',
      sections: [
        { title: 'Tuning', text: 'Align your frequency with the world to unlock hidden paths and reveal Lament remnants.' },
        { title: 'Waypoints', text: 'Nexus nodes act as anchor points in the chaotic soundscape. Synchronize to fast travel.' },
        { title: 'Terminal Status', text: 'Monitor your physical and mental degradation when traversing high-Lament zones.' }
      ]
    }
  },
  {
    id: 'combat',
    chapter: '002',
    phonetic: 'OVERTONE.02',
    shortName: 'COMBAT',
    title: 'Echomancy Tactics',
    icon: <Target size={24} strokeWidth={1.5} />,
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    x: 200, y: -250,
    frequency: '528 Hz',
    color: '#f59e0b', // Amber
    content: {
      description: 'Engage Tacet Discords by manipulating soundwaves into devastating physical attacks.',
      sections: [
        { title: 'Concerto Effects', text: 'Switching Resonators at maximum concerto energy triggers powerful intro and outro skills.' },
        { title: 'Evasion & Counter', text: "Perfectly timed dodges and parries disrupt the enemy's frequency, opening them to fatal strikes." },
        { title: 'Forte Circuit', text: 'Each Resonator possesses a unique Forte. Master its rhythm to maximize damage output.' }
      ]
    }
  },
  {
    id: 'echoes',
    chapter: '003',
    phonetic: 'ABSORPTION.03',
    shortName: 'ECHOES',
    title: 'Harvesting the Lament',
    icon: <Waves size={24} strokeWidth={1.5} />,
    image: 'https://images.unsplash.com/photo-1502014822147-1aedfb0676a0?auto=format&fit=crop&w=1200&q=80',
    x: 450, y: 150,
    frequency: '639 Hz',
    color: '#8b5cf6', // Violet
    content: {
      description: 'Absorb the residual frequencies of defeated Tacet Discords to wield their power.',
      sections: [
        { title: 'Data Bank', text: 'Level up your Data Bank to increase the rarity and drop rates of Echoes.' },
        { title: 'Sonata Effects', text: 'Equip Echoes of the same set to trigger powerful passive resonances.' },
        { title: 'Phantom Skills', text: 'The main equipped Echo grants you an active combat skill or transformation.' }
      ]
    }
  },
  {
    id: 'world',
    chapter: '004',
    phonetic: 'DISSONANCE.04',
    shortName: 'FREE REWARDS',
    title: 'Surviving the Anomaly',
    icon: <ShieldAlert size={24} strokeWidth={1.5} />,
    image: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1200&q=80',
    x: -150, y: 300,
    frequency: '852 Hz',
    color: '#10b981', // Emerald
    content: {
      description: 'The Lament is a catastrophic event that warped reality. Tread carefully in corrupted zones.',
      sections: [
        { title: 'Tacet Fields', text: 'High-density anomalies where powerful Discords spawn. Clear them for upgrade materials.' },
        { title: 'Etheric Sea', text: 'Areas where gravity and time are distorted. Use your glider and grapple to navigate.' },
        { title: 'Retroact Rain', text: 'A phenomenon that forces past echoes to manifest. Visibility and movement are impaired.' }
      ]
    }
  },
  {
    id: 'gacha',
    chapter: '005',
    phonetic: 'CONVENING.05',
    shortName: 'GACHA SYSTEM',
    title: 'Summoning Resonators',
    icon: <Orbit size={24} strokeWidth={1.5} />,
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
    x: -550, y: 50,
    frequency: '963 Hz',
    color: '#ec4899', // Pink
    content: {
      description: 'Use Astrites and Tides to draw new Resonators and Weapons from the Sea of Information.',
      sections: [
        { title: 'Radiant Tides', text: 'Used for limited-time event convenes. Prioritize your Astrites here.' },
        { title: 'Lustrous Tides', text: 'Used for the standard convene. Only use the free ones you acquire.' },
        { title: 'Pity System', text: 'Hard pity exists at 80 pulls. A 50/50 system governs the limited character banner.' }
      ]
    }
  },
  {
    id: 'endgame',
    chapter: '006',
    phonetic: 'ILLUSIVE.06',
    shortName: 'DEPTHS',
    title: 'The Tower of Adversity',
    icon: <Cpu size={24} strokeWidth={1.5} />,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    x: 650, y: -50,
    frequency: '1024 Hz',
    color: '#0ea5e9', // Sky
    content: {
      description: 'Descend into the darkest parts of the soundscape for the ultimate challenge.',
      sections: [
        { title: 'Vigor System', text: 'Resonators lose Vigor as they clear zones. You must build multiple distinct teams.' },
        { title: 'Hazard Zone', text: 'The rotating late-game content. Requires perfectly tuned Echoes and precise execution.' },
        { title: 'Hologram Tactics', text: 'Fight scaled-up, aggressive versions of world bosses with new attack patterns.' }
      ]
    }
  }
];

const mapResidents = [
  { id: '1', name: 'JINZHOU', distance: '9954 KHZ', code: 'FREQ-02', x: -200, y: -600, status: 'STABLE' },
  { id: '2', name: 'HUANGLONG', distance: '4781 KHZ', code: 'FREQ-06', x: -500, y: -300, status: 'STABLE' },
  { id: '3', name: 'LAHAI ROI', distance: '7320 KHZ', code: 'FREQ-01', x: 200, y: -700, status: 'CRITICAL' },
  { id: '4', name: 'RINASCITA', distance: '1681 KHZ', code: 'FREQ-14', x: 50, y: -50, status: 'UNKNOWN' },
  { id: '5', name: 'CENTRAL PLAINS', distance: '1674 KHZ', code: 'FREQ-09', x: 100, y: 550, status: 'STABLE' },
  { id: '6', name: 'PORT CITY OF GUIXU', distance: '9762 KHZ', code: 'FREQ-08', x: -450, y: 400, status: 'CORRUPTED' },
  { id: '7', name: 'DIM FOREST', distance: '10007 KHZ', code: 'FREQ-94', x: -900, y: 600, status: 'WARNING' },
  { id: '8', name: "WHINING AIX'S MIRE", distance: '2698 KHZ', code: 'FREQ-03', x: 600, y: -150, status: 'CORRUPTED' },
  { id: '9', name: 'WUMING BAY', distance: '8444 KHZ', code: 'FREQ-90', x: 1100, y: 250, status: 'STABLE' },
  { id: '10', name: "TIGER'S MAW", distance: '504 KHZ', code: 'FREQ-11', x: 1000, y: 800, status: 'WARNING' },
  { id: '11', name: 'GORGES OF SPIRITS', distance: '7823 KHZ', code: 'FREQ-94', x: -1100, y: -100, status: 'CRITICAL' },
];

const pseudoRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

const AliveBackground = ({ activeColor, isDropped, mouseX, mouseY }: { activeColor: string, isDropped: boolean, mouseX: MotionValue<number>, mouseY: MotionValue<number> }) => {
  const spotlightX = useTransform(mouseX, [-20, 20], ['10%', '90%']);
  const spotlightY = useTransform(mouseY, [-20, 20], ['10%', '90%']);
  const backgroundGradient = useMotionTemplate`radial-gradient(circle at ${spotlightX} ${spotlightY}, ${activeColor} 0%, transparent 50%)`;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none md:mix-blend-screen transition-all duration-1000 bg-[#020202]">
       
       <motion.div 
         className="absolute -inset-[100%] opacity-40"
         style={{ background: backgroundGradient }}
         animate={{
           scale: isDropped ? [1, 1.05, 1] : [1, 1.1, 0.95, 1.1, 1]
         }}
         transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
       />
       
       <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] md:mix-blend-overlay hidden md:block" />
       
       {[...Array(10)].map((_, i) => (
         <motion.div
           key={i}
           className="absolute rounded-full filter blur-[50px] md:mix-blend-screen hidden md:block"
           style={{
             background: activeColor,
             width: pseudoRandom(i) * 400 + 200,
             height: pseudoRandom(i + 1) * 400 + 200,
             left: `${pseudoRandom(i + 2) * 100}%`,
             top: `${pseudoRandom(i + 3) * 100}%`,
           }}
           animate={{
             x: [0, pseudoRandom(i + 4) * 200 - 100, 0],
             y: [0, pseudoRandom(i + 5) * 200 - 100, 0],
             opacity: isDropped ? [0.02, 0.1, 0.02] : [0.05, 0.2, 0.05],
           }}
           transition={{
             duration: 20 + pseudoRandom(i + 6) * 10,
             repeat: Infinity,
             ease: "easeInOut"
           }}
         />
       ))}

       {/* Grid overlay that moves with mouse */}
       <motion.div 
         className="absolute inset-[0] opacity-5"
         style={{
            backgroundImage: `linear-gradient(to right, ${activeColor} 1px, transparent 1px), linear-gradient(to bottom, ${activeColor} 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
            x: useTransform(mouseX, [-20, 20], ['-40px', '40px']),
            y: useTransform(mouseY, [-20, 20], ['-40px', '40px']),
         }}
       />
    </div>
  )
}

const DataStream = () => {
   const [lines, setLines] = useState<string[]>([]);
   
   useEffect(() => {
     const interval = setInterval(() => {
       const newLine = `0x${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0').toUpperCase()} // SYNC ${(Math.random() * 100).toFixed(2)}%`;
       setLines(prev => [...prev.slice(-10), newLine]);
     }, 300);
     return () => clearInterval(interval);
   }, []);

   return (
     <div className="flex flex-col gap-1 text-[8px] font-mono opacity-80 text-right">
        {lines.map((line, i) => (
           <motion.div 
             key={i}
             initial={{ opacity: 0, x: 10 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.2 }}
           >
             {line}
           </motion.div>
        ))}
     </div>
   )
}

const HzValue = () => {
    const [hz, setHz] = useState('1500');
    useEffect(() => {
        const interval = setInterval(() => {
            setHz((Math.random() * 2000 + 1000).toFixed(0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    return <>{hz}</>;
}

export const BeginnerGuide = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const selectedCategory = guideCategories.find(c => c.id === selectedId);
  const activeColor = selectedCategory?.color || hoveredRegion || '#ffffff';
  
  const isDropped = selectedId !== null;

  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);
  
  const springConfig = { damping: 40, stiffness: 60, mass: 1 };
  const mouseX = useSpring(rawMouseX, springConfig);
  const mouseY = useSpring(rawMouseY, springConfig);

  const mapX = useTransform(mouseX, [-20, 20], [50, -50]);
  const mapY = useTransform(mouseY, [-20, 20], [50, -50]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDropped) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const xOffset = (clientX - innerWidth / 2) / 40;
    const yOffset = (clientY - innerHeight / 2) / 40;
    rawMouseX.set(xOffset);
    rawMouseY.set(yOffset);
  };

  return (
    <div 
      className="flex-1 w-full h-full bg-[#020202] relative overflow-hidden font-mono text-zinc-300 select-none transition-colors duration-1000" 
      ref={containerRef}
      onMouseMove={handleMouseMove}
    >
      <AliveBackground activeColor={activeColor} isDropped={isDropped} mouseX={mouseX} mouseY={mouseY} />

      <div className="absolute inset-0 flex items-center justify-center p-8" style={{ perspective: "1200px" }}>
        
        {/* The map container that drops into 3D on selection */}
        <motion.div
           animate={{
             rotateX: isDropped ? 55 : 0,
             rotateZ: isDropped ? -25 : 0,
             scale: isDropped ? 0.6 : 1,
             y: isDropped ? "20%" : 0,
             x: isDropped ? "-10%" : 0,
             opacity: isDropped ? 0.3 : 1
           }}
           transition={{ duration: 1.2, type: "spring", damping: 25, stiffness: 100 }}
           className="relative w-full h-full flex items-center justify-center"
           style={{ transformStyle: "preserve-3d" }}
        >
          <motion.div
             drag={!isDropped}
             dragConstraints={{ left: -1000, right: 1000, top: -1000, bottom: 1000 }}
             dragElastic={0.05}
             whileTap={{ cursor: isDropped ? "default" : "grabbing" }}
             className={`relative w-0 h-0 ${isDropped ? "pointer-events-none cursor-default" : "cursor-crosshair group"}`}
             style={{ transformStyle: "preserve-3d" }}
          >
            <motion.div 
               style={{ x: isDropped ? 0 : mapX, y: isDropped ? 0 : mapY, transformStyle: "preserve-3d" }}
               className="absolute w-0 h-0 flex items-center justify-center"
            >
              {/* Dynamic Grid / Web */}
              <svg className="absolute w-[3000px] h-[3000px] left-[-1500px] top-[-1500px] pointer-events-none overflow-visible opacity-50">
                 <defs>
                   <linearGradient id="webGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                     <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
                     <stop offset="50%" stopColor="rgba(255,255,255,0.3)" />
                     <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
                   </linearGradient>
                 </defs>

                 {/* Floor Grid */}
                 <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                   <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
                   <circle cx="0" cy="0" r="1.5" fill="rgba(255,255,255,0.15)" />
                 </pattern>
                 <rect width="3000" height="3000" fill="url(#grid)" />

                 {/* Geometric connection web */}
                 {guideCategories.map((cat, i) => (
                    guideCategories.map((otherCat, j) => {
                      if (i >= j) return null;
                      const dist = Math.hypot(cat.x - otherCat.x, cat.y - otherCat.y);
                      if (dist > 800) return null; // Don't connect nodes that are too far apart
                      return (
                        <g key={`web-${i}-${j}`}>
                          <motion.line 
                            x1={1500 + cat.x} y1={1500 + cat.y}
                            x2={1500 + otherCat.x} y2={1500 + otherCat.y}
                            stroke="url(#webGradient)"
                            strokeWidth="1"
                            opacity={0.15}
                          />
                          {/* Animated particle travelling along line */}
                          <motion.circle 
                            r="2"
                            fill="white"
                            style={{ filter: "drop-shadow(0 0 5px white)" }}
                            animate={{
                               cx: [1500 + cat.x, 1500 + otherCat.x],
                               cy: [1500 + cat.y, 1500 + otherCat.y],
                               opacity: [0, 1, 0]
                            }}
                            transition={{
                               duration: 3 + pseudoRandom(i+j)*2,
                               repeat: Infinity,
                               ease: "easeInOut",
                               delay: pseudoRandom(i)*3
                            }}
                          />
                        </g>
                      )
                    })
                 ))}

                 {/* Central polygon connecting all items */}
                 <motion.polygon 
                   points={guideCategories.map(c => `${1500 + c.x},${1500 + c.y}`).join(' ')}
                   fill="rgba(255,255,255,0.01)"
                   stroke="rgba(255,255,255,0.05)"
                   strokeWidth="1"
                 />
              </svg>

              {/* Resident Frequencies */}
              {mapResidents.map((resident, i) => (
                 <motion.div
                   key={resident.id}
                   className="absolute flex flex-col items-center justify-center group/node -translate-x-1/2 -translate-y-1/2"
                   initial={{ x: resident.x, y: resident.y, z: 0 }}
                   animate={{ y: [resident.y - 5, resident.y + 5, resident.y - 5], z: 0 }}
                   transition={{ duration: 4 + pseudoRandom(i) * 2, repeat: Infinity, ease: "easeInOut" }}
                   onMouseEnter={() => setHoveredNode(resident.id)}
                   onMouseLeave={() => setHoveredNode(null)}
                   style={{ transformStyle: "preserve-3d" }}
                 >
                    <div className={`relative w-[3px] h-[3px] rounded-full transition-all duration-300 bg-white`}>
                       <motion.div 
                         className="absolute inset-0 rounded-full bg-white opacity-50"
                         animate={{ scale: [1, 5], opacity: [0.8, 0] }}
                         transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                       />
                    </div>
                    {/* Projection Line underneath */}
                    <motion.div 
                       className="absolute top-[1.5px] w-px bg-white/20 origin-top"
                       animate={{ height: isDropped ? 200 : 0 }}
                       transition={{ duration: 1 }}
                       style={{ rotateX: -90, z: -100 }}
                    />

                    <div className={`absolute left-4 top-0 min-w-max flex flex-col transition-all duration-300 ${hoveredNode === resident.id ? 'opacity-100 translate-x-1' : 'opacity-30'}`}>
                       <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold tracking-widest text-zinc-200">{resident.name}</span>
                       </div>
                    </div>
                 </motion.div>
              ))}

              {/* Major Categories */}
              {guideCategories.map((cat, i) => {
                 const isHovered = hoveredRegion === cat.color;
                 const isActive = selectedId === cat.id;

                  return (
                   <motion.div
                     key={cat.id}
                     className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                     initial={{ x: cat.x, y: cat.y }}
                     animate={{ 
                       y: [cat.y - 12, cat.y + 12, cat.y - 12],
                     }}
                     transition={{ 
                       y: { duration: 5 + pseudoRandom(i) * 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 },
                     }}
                     style={{ transformStyle: "preserve-3d", zIndex: (isHovered || isActive) ? 100 : 1 }}
                   >
                     {/* Stable Invisible Hitbox */}
                     <div 
                         className="absolute w-40 h-40 cursor-pointer z-50 rounded-full"
                         onClick={() => setSelectedId(cat.id)}
                         onMouseEnter={() => setHoveredRegion(cat.color)}
                         onMouseLeave={() => setHoveredRegion(null)}
                     />

                     {/* Rotating Visuals */}
                     <motion.div
                         className="relative flex items-center justify-center pointer-events-none"
                         animate={{ 
                           rotateX: (isHovered && !isDropped) ? 60 : isActive ? 90 : 0,
                           rotateZ: (isHovered && !isDropped) ? 45 : isActive ? 45 : 0,
                           z: isHovered && !isActive ? 50 : isActive ? 200 : 0
                         }}
                         transition={{ 
                           default: { duration: 0.6, type: "spring", damping: 20 }
                         }}
                         style={{ transformStyle: "preserve-3d" }}
                     >
                      {/* Vertical Projection Line (only visible in 3D states) */}
                      <motion.div 
                        className="absolute w-px origin-top pointer-events-none"
                        style={{ backgroundColor: cat.color, rotateX: -90 }}
                        animate={{ height: (isHovered || isDropped) ? 300 : 0, opacity: isHovered ? 0.5 : isDropped ? 0.2 : 0 }}
                        transition={{ duration: 0.5 }}
                      />

                      {/* 3D Stacked Tech Rings when hovered */}
                      <AnimatePresence>
                         {(isHovered || isActive) && [...Array(4)].map((_, layerIdx) => (
                           <motion.div 
                             key={`layer-${layerIdx}`}
                             className="absolute w-24 h-24 border rounded-full pointer-events-none"
                             style={{ 
                               borderColor: `${cat.color}40`, 
                               borderRightColor: cat.color,
                               transformStyle: 'preserve-3d'
                             }}
                             initial={{ z: 0, opacity: 0 }}
                             animate={{ 
                               z: layerIdx * -25, 
                               opacity: 1 - layerIdx * 0.2,
                               rotate: layerIdx % 2 === 0 ? 360 : -360
                             }}
                             exit={{ z: 0, opacity: 0 }}
                             transition={{ 
                               z: { duration: 0.4, delay: layerIdx * 0.05, type: 'spring' },
                               rotate: { duration: 8 + layerIdx * 2, repeat: Infinity, ease: "linear" }
                             }}
                           />
                         ))}
                      </AnimatePresence>

                      {/* 2D Rings when not hovered */}
                      <motion.div 
                         className="absolute w-24 h-24 border rounded-full transition-all duration-300 pointer-events-none"
                         style={{ borderColor: `${cat.color}40`, borderTopColor: cat.color }}
                         animate={{ rotate: 360, opacity: (isHovered || isActive) ? 0 : 1 }}
                         transition={{ rotate: { duration: 8, repeat: Infinity, ease: "linear" } }}
                      />
                      <motion.div 
                         className="absolute w-20 h-20 border rounded-full transition-all duration-300 pointer-events-none"
                         style={{ borderColor: `${cat.color}30`, borderLeftColor: cat.color }}
                         animate={{ rotate: -360, opacity: (isHovered || isActive) ? 0 : 1 }}
                         transition={{ rotate: { duration: 12, repeat: Infinity, ease: "linear" } }}
                      />

                      {/* Core Hub containing Icon (3D) */}
                      <motion.div 
                        className="relative w-20 h-20 flex items-center justify-center transition-all duration-300 z-10"
                        style={{ transformStyle: "preserve-3d" }}
                        animate={{ 
                          translateZ: (isHovered || isActive) ? 80 : 0,
                          rotateX: isHovered ? 20 : 60,
                          rotateZ: isHovered ? -10 : 45,
                        }}
                        transition={{ type: "spring", damping: 12, stiffness: 80 }}
                      >
                         {/* Deep 3D Pillar Extrusion */}
                         {(isHovered || isActive) && [...Array(8)].map((_, layerIdx) => (
                           <motion.div 
                              key={`ext-${layerIdx}`}
                              className="absolute w-16 h-16 pointer-events-none md:backdrop-blur-sm"
                              style={{ 
                                backgroundColor: layerIdx === 0 ? cat.color : `${cat.color}10`,
                                border: `1px solid ${cat.color}40`,
                                boxShadow: layerIdx === 0 ? `0 0 20px ${cat.color}` : 'none',
                                clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                              }}
                              initial={{ translateZ: 0, opacity: 0 }}
                              animate={{ 
                                translateZ: -layerIdx * 10, 
                                opacity: 1 - layerIdx * 0.1,
                                scale: 1 - layerIdx * 0.05
                              }}
                              transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
                           />
                         ))}

                         {/* Base 2D Shape when not hovered */}
                         {!(isHovered || isActive) && (
                           <div 
                              className="absolute w-16 h-16 pointer-events-none"
                              style={{ 
                                backgroundColor: `${cat.color}20`,
                                border: `1px solid ${cat.color}80`,
                                boxShadow: `0 0 10px ${cat.color}50`,
                                clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                              }}
                           />
                         )}
                         
                         {/* Centered glowing icon floating above the geometric shape */}
                         <motion.div 
                           className="relative rounded-full bg-black/50 p-2 border md:backdrop-blur-md"
                           style={{ 
                             color: cat.color, 
                             borderColor: `${cat.color}50`,
                             textShadow: isHovered ? `0 0 20px ${cat.color}, 0 0 40px ${cat.color}` : 'none' 
                           }}
                           animate={{ 
                             translateZ: isHovered ? 40 : 10, 
                             scale: isHovered ? 1.4 : 1,
                             rotateZ: isHovered ? 10 : -45, // Counteract parent rotation partially
                             rotateX: isHovered ? -20 : -60
                           }}
                           transition={{ type: "spring", damping: 15 }}
                         >
                           {cat.icon}
                         </motion.div>
                      </motion.div>

                      {/* Floating Label */}
                      <motion.div 
                         className="absolute top-16 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none w-max"
                         animate={{ 
                           rotateX: (isHovered && !isDropped) ? -60 : isActive ? -90 : 0, 
                           rotateZ: (isHovered && !isDropped) ? -45 : isActive ? -45 : 0, 
                           translateZ: (isHovered || isActive) ? 40 : 0,
                           y: (isHovered || isActive) ? 40 : 0
                         }}
                         transition={{ duration: 0.5, type: "spring" }}
                      >
                         <span className="text-[9px] mb-1 font-bold" style={{ color: cat.color }}>{cat.frequency}</span>
                         <div className="bg-[#050505]/90 md:backdrop-blur-md border px-3 py-1 rounded-sm" style={{ borderColor: `${cat.color}80`, boxShadow: `0 4px 20px ${cat.color}40` }}>
                            <span className="text-sm font-bold tracking-widest" style={{ color: cat.color, textShadow: `0 0 10px ${cat.color}80` }}>{cat.shortName}</span>
                         </div>
                      </motion.div>
                   </motion.div>
                   </motion.div>
                 )
              })}

            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Detail Overlay Drawer ("Building the site" effect) */}
      <AnimatePresence>
        {selectedId && selectedCategory && (
          <motion.div 
            className="absolute inset-0 z-50 flex items-center justify-center p-4 md:p-12 pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Tech-build Modal Container */}
            <motion.div
               className="relative w-full max-w-6xl h-full max-h-[850px] flex flex-col md:flex-row overflow-hidden"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
            >
               {/* Site Building Background Effect */}
               <motion.div 
                 className="absolute inset-0 bg-[#050505]/95 md:bg-[#050505]/90 md:backdrop-blur-2xl border flex"
                 style={{ borderColor: `${selectedCategory.color}50`, boxShadow: `0 0 80px ${selectedCategory.color}20` }}
                 initial={{ clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)" }}
                 animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
                 transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
               />

               {/* Decorative Tech Borders Building Up */}
               <motion.div 
                 className="absolute top-0 left-0 border-t-2 border-l-2 m-2 opacity-80" 
                 style={{ borderColor: selectedCategory.color }} 
                 initial={{ width: 0, height: 0 }}
                 animate={{ width: 64, height: 64 }}
                 transition={{ duration: 0.5, delay: 0.5 }}
               />
               <motion.div 
                 className="absolute bottom-0 right-0 border-b-2 border-r-2 m-2 opacity-80" 
                 style={{ borderColor: selectedCategory.color }} 
                 initial={{ width: 0, height: 0 }}
                 animate={{ width: 64, height: 64 }}
                 transition={{ duration: 0.5, delay: 0.6 }}
               />

               {/* Left Column: Image & Meta */}
               <motion.div 
                 className="w-full md:w-[45%] bg-[#080808]/80 relative flex flex-col border-r z-10" 
                 style={{ borderColor: `${selectedCategory.color}30` }}
                 initial={{ x: -50, opacity: 0 }}
                 animate={{ x: 0, opacity: 1 }}
                 transition={{ duration: 0.8, delay: 0.5 }}
               >
                  <div className="relative h-[300px] md:h-1/2 w-full shrink-0 overflow-hidden group/image">
                     <motion.div 
                       className="absolute inset-0 z-20"
                       style={{ backgroundColor: selectedCategory.color }}
                       initial={{ y: "0%" }}
                       animate={{ y: "100%" }}
                       transition={{ duration: 1, delay: 0.8, ease: "easeInOut" }}
                     />
                     <motion.img 
                       src={selectedCategory.image} 
                       alt="" 
                       className="w-full h-full object-cover filter grayscale contrast-125 md:mix-blend-screen opacity-50 transition-transform duration-1000" 
                       whileHover={{ scale: 1.05 }}
                     />
                     <div className="absolute inset-0 md:mix-blend-color opacity-50 hidden md:block" style={{ backgroundColor: selectedCategory.color }} />
                     <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent/20" />
                     
                     <div className="absolute top-4 left-4 z-30">
                        <button 
                           onClick={() => setSelectedId(null)}
                           className="flex items-center gap-2 text-[10px] font-bold tracking-widest hover:text-white transition-colors bg-black/60 px-4 py-2 border md:backdrop-blur-md overflow-hidden relative group"
                           style={{ color: selectedCategory.color, borderColor: `${selectedCategory.color}50` }}
                        >
                           <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity" style={{ backgroundColor: selectedCategory.color }}/>
                           <X size={14} /> ABORT SYNC
                        </button>
                     </div>
                  </div>

                  <div className="p-8 md:p-12 flex-1 flex flex-col justify-center">
                     <motion.div 
                       className="flex items-center gap-4 mb-6"
                       initial={{ x: -20, opacity: 0 }}
                       animate={{ x: 0, opacity: 1 }}
                       transition={{ delay: 1 }}
                     >
                        <div className="relative p-4 border bg-black/50 overflow-hidden" style={{ borderColor: selectedCategory.color, color: selectedCategory.color }}>
                           <motion.div 
                             className="absolute inset-0 opacity-20" 
                             style={{ backgroundColor: selectedCategory.color }}
                             animate={{ y: ["100%", "-100%"] }}
                             transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                           />
                           {selectedCategory.icon}
                        </div>
                        <div>
                           <div className="text-[10px] tracking-widest font-bold opacity-80" style={{ color: selectedCategory.color }}>FREQUENCY // {selectedCategory.frequency}</div>
                           <div className="text-sm tracking-widest uppercase text-zinc-300">{selectedCategory.phonetic}</div>
                        </div>
                     </motion.div>
                     <motion.h1 
                        className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase leading-[0.9] mb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                     >
                        {selectedCategory.shortName.split('').map((char, i) => (
                          <motion.span 
                            key={i} 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 + i * 0.05 }}
                            style={{ display: "inline-block" }}
                          >
                            {char}
                          </motion.span>
                        ))}
                     </motion.h1>
                     <motion.div 
                       className="h-1" 
                       style={{ backgroundColor: selectedCategory.color }}
                       initial={{ width: 0 }}
                       animate={{ width: 48 }}
                       transition={{ delay: 1.5, duration: 0.5 }}
                     />
                  </div>
                  
               </motion.div>

               {/* Right Column: Content Scroll */}
               <motion.div 
                 className="w-full md:w-[55%] p-8 md:p-16 overflow-y-auto bg-transparent relative scroller z-10"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ duration: 1, delay: 0.8 }}
               >
                  <div className="absolute top-0 right-8 text-[12rem] font-black select-none pointer-events-none leading-none -mt-8 opacity-[0.03]" style={{ color: selectedCategory.color }}>
                     {selectedCategory.chapter}
                  </div>

                  <div className="relative z-10">
                     <motion.h2 
                       className="text-2xl md:text-3xl text-zinc-100 mb-6 font-semibold tracking-tight"
                       initial={{ opacity: 0, x: 20 }}
                       animate={{ opacity: 1, x: 0 }}
                       transition={{ delay: 1.2 }}
                     >
                        {selectedCategory.title}
                     </motion.h2>

                     <motion.div 
                       className="text-zinc-400 leading-relaxed mb-12 text-sm md:text-base max-w-xl p-6 border-l-2 bg-white/[0.02] relative overflow-hidden"
                       style={{ borderColor: selectedCategory.color, transformOrigin: "top" }}
                       initial={{ opacity: 0, scaleY: 0 }}
                       animate={{ opacity: 1, scaleY: 1 }}
                       transition={{ delay: 1.3, duration: 0.5 }}
                     >
                        {/* Scanning line across the description */}
                        <motion.div 
                          className="absolute left-0 right-0 h-px opacity-50"
                          style={{ backgroundColor: selectedCategory.color }}
                          animate={{ top: ["0%", "100%", "0%"] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        />
                        {selectedCategory.content.description}
                     </motion.div>

                     <div className="flex flex-col gap-10">
                        {selectedCategory.content.sections.map((section, idx) => (
                           <motion.div 
                              key={idx}
                              initial={{ opacity: 0, x: 30 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 1.5 + (idx * 0.15), type: "spring" }}
                              className="group border-t border-white/5 pt-6 relative"
                           >
                              <div className="absolute top-0 left-0 w-0 h-px bg-current opacity-20 transition-all duration-700 group-hover:w-full" style={{ color: selectedCategory.color }} />
                              <div className="flex items-start gap-4 mb-3">
                                 <motion.div 
                                   className="text-[10px] font-bold px-2 py-1 border" 
                                   style={{ color: selectedCategory.color, borderColor: `${selectedCategory.color}30`, backgroundColor: `${selectedCategory.color}10` }}
                                   whileHover={{ scale: 1.1, backgroundColor: `${selectedCategory.color}30` }}
                                 >
                                    0{idx + 1}
                                 </motion.div>
                                 <h3 className="text-xl font-bold text-zinc-100 group-hover:text-white transition-colors duration-300">
                                    {section.title}
                                 </h3>
                              </div>
                              <p className="text-sm text-zinc-500 leading-relaxed md:pl-12">
                                 {section.text}
                              </p>
                           </motion.div>
                        ))}
                     </div>
                  </div>
               </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main HUD overlay */}
      <div className="absolute z-40 inset-0 pointer-events-none flex flex-col justify-between p-6 md:p-8 md:mix-blend-screen">
         <div className="flex justify-between items-start">
            <div className="flex flex-col border-l-2 pl-3 transition-colors duration-1000" style={{ borderColor: activeColor }}>
               <h2 className="text-xl font-bold tracking-[0.3em] text-white leading-none">ARCHIVE.SYS</h2>
               <p className="text-[10px] mt-2 tracking-widest text-zinc-500">LAMENT // SYNC 99.9%</p>
            </div>
            
            <div className="flex flex-col items-end w-32 border-r-2 pr-3" style={{ borderColor: `${activeColor}50` }}>
               <DataStream />
            </div>
         </div>

         <div className="flex justify-between items-end w-full">
            <div className="flex gap-12">
               <div className="flex flex-col p-3 md:backdrop-blur-md border transition-colors duration-1000 relative overflow-hidden" style={{ borderColor: `${activeColor}30`, backgroundColor: `${activeColor}10` }}>
                  <motion.div 
                    className="absolute inset-0 opacity-10"
                    style={{ background: `repeating-linear-gradient(45deg, transparent, transparent 10px, ${activeColor} 10px, ${activeColor} 20px)` }}
                    animate={{ backgroundPosition: ["0px 0px", "100px 100px"] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  />
                  <span className="text-[8px] tracking-widest mb-1 leading-none text-zinc-400 relative z-10">ACTIVE RESONANCE</span>
                  <span className="text-sm font-bold leading-none relative z-10" style={{ color: activeColor }}><HzValue /> Hz</span>
               </div>
            </div>
            
            <motion.div 
              className="hidden md:flex items-center gap-3"
              animate={{ opacity: isDropped ? 0 : 0.6 }}
            >
               <span className="text-[10px] tracking-widest text-zinc-400 border border-zinc-800 px-3 py-1 bg-black/50 md:backdrop-blur">PAN & ZOOM ENABLED [3D MODE]</span>
            </motion.div>
         </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .scroller::-webkit-scrollbar {
          width: 4px;
        }
        .scroller::-webkit-scrollbar-track {
          background: transparent;
        }
        .scroller::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
        }
        .scroller:hover::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.3);
        }
      `}} />
    </div>
  );
};
