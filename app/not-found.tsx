import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col items-center justify-center p-8">
      <h2 className="text-3xl font-bold text-red-500 mb-4">404 - Not Found</h2>
      <p className="text-slate-400 mb-8">Could not find requested resource</p>
      <Link href="/" className="px-6 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition">Return Home</Link>
    </div>
  )
}
