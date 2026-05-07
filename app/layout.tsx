import type { Metadata } from 'next';
import { Inter, Space_Grotesk, Syncopate, Orbitron, Rajdhani, Playfair_Display, Anton, Cinzel } from 'next/font/google';
import CustomCursor from '@/components/CustomCursor';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
});

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

const syncopate = Syncopate({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-syncopate',
});

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
});

const rajdhani = Rajdhani({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-rajdhani',
});

export const metadata: Metadata = {
  title: 'GrimVeil | Tactical Guide',
  description: 'Wuthering Waves Character Guide',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${anton.variable} ${spaceGrotesk.variable} ${syncopate.variable} ${orbitron.variable} ${rajdhani.variable} ${playfair.variable} ${cinzel.variable}`}>
      <body className="antialiased bg-[var(--bg-primary)] text-[var(--text-primary)] cursor-default overflow-x-hidden" suppressHydrationWarning>
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
