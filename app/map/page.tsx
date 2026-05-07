'use client';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

export default function MapPage() {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className="w-full h-svh bg-[#FAFAFC] relative overflow-hidden font-sans text-gray-800 flex flex-col">
            
            {/* Header */}
            <div className="h-[80px] w-full bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center px-8 shrink-0 z-10 shadow-sm relative">
                <Link href="/" className="group flex items-center gap-3 text-gray-500 hover:text-gray-900 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center transition-colors">
                        <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                    </div>
                    <span className="font-bold tracking-widest text-sm">BACK TO APP</span>
                </Link>
                
                <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <h1 className="font-display font-black text-xl tracking-wider text-gray-900">INTERACTIVE MAP</h1>
                    <h2 className="text-[10px] uppercase font-bold tracking-[0.3em] text-gray-400">Solaris-3 Explorer</h2>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 w-full bg-slate-50 relative">
                <AnimatePresence>
                    {isLoading && (
                        <motion.div 
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-20 flex items-center justify-center bg-slate-50/80 backdrop-blur-sm"
                        >
                            <div className="flex items-center gap-4 text-gray-500">
                                <div className="w-6 h-6 border-2 border-gray-300 border-t-amber-500 rounded-full animate-spin"></div>
                                <span className="font-semibold tracking-wide">Loading Map Data...</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                
                <iframe 
                    src="https://wuthering-waves-map.appsample.com/?map=lahai-roi"
                    className="w-full h-full border-0 absolute inset-0 z-10"
                    onLoad={() => setIsLoading(false)}
                    allow="fullscreen"
                    loading="lazy"
                ></iframe>
            </div>

        </div>
    );
}
