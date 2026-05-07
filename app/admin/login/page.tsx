"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Eye, EyeOff, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Track mouse for 3D tilt effect on card
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
      setMousePos({ x, y });
    };
    const handleMouseLeave = () => setMousePos({ x: 0, y: 0 });

    const card = cardRef.current;
    card?.addEventListener('mousemove', handleMouseMove);
    card?.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      card?.removeEventListener('mousemove', handleMouseMove);
      card?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify({ password: String(password) }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        router.push('/admin');
      } else {
        setError('Invalid password. Please try again.');
      }
    } catch (err) {
      setError('Connection failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthLabel = ['', 'Weak', 'Good', 'Strong'];
  const strengthColor = ['', '#EF4444', '#F59E0B', '#10B981'];

  return (
    <div
      className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden"
      style={{ fontFamily: 'var(--font-cinzel), serif' }}
    >
      {/* Live Wallpaper Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src="https://res.cloudinary.com/ds6dwbk37/video/upload/v1778157719/Wuthering_Waves_-_Shorekeeper_Live_Wallpaper_jthaws.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.65)_100%)]" />
        <div className="absolute inset-0 mix-blend-overlay bg-black/20"
          style={{ backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)` }}
        />
      </div>

      {/* 3D Tilt Card */}
      <motion.div
        ref={cardRef}
        className="relative z-10 w-full max-w-[440px]"
        style={{
          perspective: 1000,
          transformStyle: 'preserve-3d',
          rotateX: mousePos.y,
          rotateY: mousePos.x,
        }}
        animate={{ rotateX: mousePos.y, rotateY: mousePos.x }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Glow that follows tilt */}
        <div
          className="absolute -inset-1 rounded-[36px] opacity-30 blur-xl transition-all duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${50 + mousePos.x * 3}% ${50 - mousePos.y * 3}%, rgba(255,255,255,0.3), transparent 70%)`
          }}
        />

        <form
          onSubmit={handleLogin}
          className="relative bg-white/5 backdrop-blur-[40px] rounded-[32px] p-10 border-t border-l border-white/20 border-b border-r border-white/5 shadow-[0_8px_48px_0_rgba(0,0,0,0.6)] overflow-hidden"
        >
          {/* Diagonal shine */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10 space-y-8">

            {/* Header */}
            <div className="text-center">
              {/* Lock icon */}
              <motion.div
                className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/5 border border-white/10 mb-5 backdrop-blur-sm"
                whileHover={{ scale: 1.08, borderColor: 'rgba(255,255,255,0.3)' }}
                animate={isLoading ? { rotate: [0, 5, -5, 5, 0] } : {}}
                transition={isLoading ? { repeat: Infinity, duration: 0.4 } : {}}
              >
                <Lock size={22} className="text-white/70" />
              </motion.div>

              <h1 className="text-[28px] font-bold text-white tracking-[0.1em]">
                Admin Panel
              </h1>

              {/* Thin decorative line with dots instead of the purple bar */}
              <div className="flex items-center justify-center gap-2 mt-3">
                <div className="h-[1px] w-8 bg-white/20" />
                <div className="w-1 h-1 rounded-full bg-white/40" />
                <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
                <div className="w-1 h-1 rounded-full bg-white/40" />
                <div className="h-[1px] w-8 bg-white/20" />
              </div>

              <p className="text-white/35 text-[10px] mt-4 tracking-[0.3em] uppercase">
                Create Brand New Guide
              </p>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] text-white/50 tracking-[0.25em] uppercase">
                  Password
                </label>
                <AnimatePresence>
                  {capsLock && (
                    <motion.span
                      initial={{ opacity: 0, x: 6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 6 }}
                      className="text-[10px] text-amber-400/80 tracking-wider"
                    >
                      CAPS LOCK ON
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              <motion.div
                className="relative"
                animate={{ scale: isFocused ? 1.01 : 1 }}
                transition={{ duration: 0.2 }}
              >
                {/* Focus ring glow */}
                <AnimatePresence>
                  {isFocused && (
                    <motion.div
                      className="absolute -inset-[1px] rounded-xl pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.25), 0 0 20px rgba(255,255,255,0.06)' }}
                    />
                  )}
                </AnimatePresence>

                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyUp={(e) => setCapsLock(e.getModifierState('CapsLock'))}
                  placeholder="Enter password"
                  className="w-full bg-black/20 backdrop-blur-md border border-white/8 rounded-xl px-4 py-3.5 pr-12 text-white placeholder:text-white/20 focus:outline-none transition-all text-sm"
                  style={{ fontFamily: 'var(--font-rajdhani), sans-serif', letterSpacing: showPassword ? '0.05em' : '0.2em' }}
                />

                {/* Toggle visibility */}
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors p-1"
                  whileTap={{ scale: 0.85 }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </motion.button>
              </motion.div>

              {/* Password strength bar */}
              <AnimatePresence>
                {password.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="flex items-center gap-2 pt-1"
                  >
                    <div className="flex gap-1 flex-1">
                      {[1, 2, 3].map((i) => (
                        <motion.div
                          key={i}
                          className="h-[2px] flex-1 rounded-full bg-white/10 overflow-hidden"
                        >
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: strengthColor[strength] }}
                            initial={{ width: '0%' }}
                            animate={{ width: strength >= i ? '100%' : '0%' }}
                            transition={{ duration: 0.3, delay: i * 0.05 }}
                          />
                        </motion.div>
                      ))}
                    </div>
                    <span className="text-[10px] tracking-wider" style={{ color: strengthColor[strength], fontFamily: 'var(--font-rajdhani)' }}>
                      {strengthLabel[strength]}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  className="bg-red-500/10 backdrop-blur-md border border-red-500/20 text-red-300 p-3 rounded-xl flex items-start gap-2 text-xs overflow-hidden"
                  style={{ fontFamily: 'var(--font-rajdhani)' }}
                >
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                  <p className="tracking-wide">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading || !password}
              className="relative w-full group overflow-hidden bg-white/6 backdrop-blur-xl text-white py-3.5 rounded-xl border border-white/12 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
              whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.3)' }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              {/* Shimmer */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12 pointer-events-none" />

              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <motion.div
                      className="w-3.5 h-3.5 border border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                    />
                    <span className="text-xs tracking-[0.2em]">Verifying</span>
                  </motion.div>
                ) : (
                  <motion.span
                    key="text"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xs tracking-[0.25em] relative z-10"
                  >
                    Sign In
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

          </div>
        </form>
      </motion.div>
    </div>
  );
}
