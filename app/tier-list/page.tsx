"use client";
import { Star } from 'lucide-react';

export default function TierListPage() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-[#0a0a0f]">
        <div className="flex flex-col items-center justify-center p-12 bg-[#151520] rounded-3xl border border-white/10 max-w-lg text-center shadow-[0_0_30px_rgba(255,255,255,0.05)]">
            <Star size={64} className="text-[#06b6d4] mb-6 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
            <h2 className="text-3xl font-akira font-bold text-white mb-4 tracking-wider">Tier List</h2>
            <p className="text-[#8F8FA3] font-mono text-sm tracking-widest uppercase">System In Development. Please wait for the next iteration cycle.</p>
        </div>
    </div>
  );
}
