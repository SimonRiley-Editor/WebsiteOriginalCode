import * as React from "react";
import { cn } from "@/lib/utils";
import { Zap, Wind, Flame, Snowflake, Sun, Moon, Star } from "lucide-react";
import Link from 'next/link';

export type ElementType = "Electro" | "Aero" | "Fusion" | "Glacio" | "Spectro" | "Havoc";

interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl: string;
  title: string;
  category: string;
  element?: ElementType;
  rarity?: 4 | 5;
  href: string;
  onSave?: () => void;
}

const getElementColor = (element: ElementType) => {
  switch (element) {
    case "Electro": return "var(--color-electro)";
    case "Aero": return "var(--color-aero)";
    case "Fusion": return "var(--color-fusion)";
    case "Glacio": return "var(--color-glacio)";
    case "Spectro": return "var(--color-spectro)";
    case "Havoc": return "var(--color-havoc)";
    default: return "var(--color-teal)";
  }
};

const ElementIcon = ({ element, className }: { element: ElementType; className?: string }) => {
  const getIconUrl = () => {
    switch (element) {
      case "Electro": return "https://res.cloudinary.com/ds6dwbk37/image/upload/v1776681266/electro_logo_png__wuthering_weaves__by_kabasara_dhp6x3i-pre_sxrzdp.png";
      case "Aero": return "https://res.cloudinary.com/ds6dwbk37/image/upload/v1776681266/aero_logo_png__wuthering_weaves__by_kabasara_dhp6xbu-pre_xnsfza.png";
      case "Fusion": return "https://res.cloudinary.com/ds6dwbk37/image/upload/v1776681267/dhp6xtz-c8d40dd3-92f9-4ca9-b57f-29195fd2f237_pza0yj.png";
      case "Glacio": return "https://res.cloudinary.com/ds6dwbk37/image/upload/v1776681267/glacio_logo_png__wuthering_weaves__by_kabasara_dhp6y4z-pre_yvyttl.png";
      case "Spectro": return "https://res.cloudinary.com/ds6dwbk37/image/upload/v1776681267/spectro_logo_png__wuthering_weaves__by_kabasara_dhp6vy2-pre_qpslx6.png";
      case "Havoc": return "https://res.cloudinary.com/ds6dwbk37/image/upload/v1776681266/havoc_logo_png__wuthering_weaves__by_kabasara_dhp6wig-pre_jmcguj.png";
      default: return null;
    }
  };

  const url = getIconUrl();
  if (!url) return null;

  const color = getElementColor(element);

  return (
    <div className={cn("relative group-hover:scale-110 transition-transform duration-500", className)}>
      <img 
        src={url || undefined} 
        alt={`${element} Element`} 
        className="w-full h-full object-contain relative z-10 invert brightness-200"
        style={{ 
          filter: `drop-shadow(0 0 4px ${color}) drop-shadow(0 0 8px ${color})`
        }}
      />
      <div 
        className="absolute inset-0 z-0 opacity-50 group-hover:opacity-100 transition-opacity duration-500 blur-md rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  );
};

  const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
    ({ className, imageUrl, title, category, element = "Electro", rarity = 5, href, onSave, ...props }, ref) => {
      const parallaxRef = React.useRef<HTMLDivElement>(null);
      const isHoveredRef = React.useRef(false);
      const [isHovered, setIsHovered] = React.useState(false);

      const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isHoveredRef.current || !parallaxRef.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        requestAnimationFrame(() => {
          if (parallaxRef.current && isHoveredRef.current) {
            parallaxRef.current.style.transform = `translate(${x * -20}px, ${y * -20}px)`;
          }
        });
      };

    const handleSaveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (onSave) {
        onSave();
      }
    };

    const rarityColor = rarity === 5 ? "var(--color-rarity-5)" : "var(--color-rarity-4)";
    const rarityShadow = rarity === 5 ? "rgba(251, 191, 36, 0.5)" : "rgba(168, 85, 247, 0.5)";
    const rarityBorder = rarity === 5 ? "rgba(251, 191, 36, 0.8)" : "rgba(168, 85, 247, 0.8)";
    const elementColor = getElementColor(element);

    return (
      <div
        ref={ref}
        className={cn(
          "group relative block aspect-[4/5] bg-transparent transition-all duration-500 hover:scale-[1.02] hover:z-10 cursor-pointer",
          className
        )}
        onMouseEnter={() => {
          setIsHovered(true);
          isHoveredRef.current = true;
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          isHoveredRef.current = false;
          if (parallaxRef.current) parallaxRef.current.style.transform = 'translate(0px, 0px)';
        }}
        onMouseMove={handleMouseMove}
        {...props}
      >
        {/* Glowing Border Layers (from user snippet) */}
        <div className="absolute inset-[-1.5px] z-0 overflow-hidden rounded-xl blur-[2px]">
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] transition-all duration-1000 group-hover:rotate-[-120deg]" 
            style={{ background: `conic-gradient(#000, ${elementColor} 5%, #000 38%, #000 50%, ${elementColor} 60%, #000 87%)` }}
          />
        </div>
        <div className="absolute inset-[-1.5px] z-0 overflow-hidden rounded-xl blur-[2px]">
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] transition-all duration-1000 group-hover:rotate-[-98deg]" 
            style={{ background: `conic-gradient(transparent, ${elementColor}, transparent 10%, transparent 50%, ${elementColor}, transparent 60%)` }}
          />
        </div>
        <div className="absolute inset-[-1.5px] z-0 overflow-hidden rounded-xl blur-[1px]">
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] brightness-125 transition-all duration-1000 group-hover:rotate-[-97deg]" 
            style={{ background: `conic-gradient(transparent 0%, #fff, transparent 8%, transparent 50%, #fff, transparent 58%)` }}
          />
        </div>
        <div className="absolute inset-[-1.5px] z-0 overflow-hidden rounded-xl blur-[0.5px]">
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] brightness-150 transition-all duration-1000 group-hover:rotate-[-110deg]" 
            style={{ background: `conic-gradient(#1c191c, ${elementColor} 5%, #1c191c 14%, #1c191c 50%, ${elementColor} 60%, #1c191c 64%)` }}
          />
        </div>

        {/* Inner Card Content */}
        <div className="absolute inset-[1.5px] rounded-xl overflow-hidden bg-[#0A0A0A] z-10 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
          <Link href={href} aria-label={title} className="block h-full w-full relative">
            {/* Background Glow based on Rarity */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 mix-blend-screen"
              style={{ background: `radial-gradient(circle at 50% 50%, ${rarityColor} 0%, transparent 70%)` }}
            />

            {/* Parallax Image Wrapper */}
            <div 
              ref={parallaxRef}
              className="absolute inset-[-20px] z-0"
              style={{
                transform: 'translate(0px, 0px)',
                transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.7s ease-out'
              }}
            >
              <img
                src={imageUrl || undefined}
                alt={title}
                className="absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-105 opacity-80 group-hover:opacity-100 saturate-50 group-hover:saturate-110"
              />
            </div>
            
            {/* Inner Vignette for depth */}
            <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] pointer-events-none z-10" />
            
            {/* Element Icon (Top Left) */}
            <div className="absolute top-3 left-3 z-20 w-10 h-10 rounded-full bg-[var(--bg-primary)]/80 backdrop-blur-md border border-[var(--text-primary)]/10 flex items-center justify-center shadow-lg group-hover:border-[var(--text-primary)]/30 transition-colors">
              <ElementIcon element={element} className="w-6 h-6" />
            </div>

            {/* Rarity Stars (Top Right) */}
            <div className="absolute top-3 right-3 z-20 flex justify-end opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110 origin-right">
              <div className="relative">
                {/* Glow effect behind stars */}
                <div className="absolute inset-0 blur-md opacity-0 group-hover:opacity-80 transition-opacity duration-500" style={{ backgroundColor: rarityColor }} />
                {rarity === 5 ? (
                  <img 
                    src="https://res.cloudinary.com/ds6dwbk37/image/upload/v1775453445/Icon_5_Stars_lczozu.webp" 
                    alt="5 Stars" 
                    className="h-3.5 object-contain relative z-10 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" 
                  />
                ) : rarity === 4 ? (
                  <img 
                    src="https://res.cloudinary.com/ds6dwbk37/image/upload/v1777304405/Icon_4_Stars_vpjpiv.webp" 
                    alt="4 Stars" 
                    className="h-3.5 object-contain relative z-10 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" 
                  />
                ) : (
                  <div className="flex gap-0.5 relative z-10 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]">
                    {Array.from({ length: rarity }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" style={{ color: rarityColor }} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Info Area */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/80 to-transparent pt-16 pb-4 px-4 z-10 flex flex-col justify-end transform transition-transform duration-300">
              <div className="flex justify-between items-end mb-1">
                <h3 className="font-display font-bold text-lg text-[var(--text-primary)] leading-none tracking-wide truncate pr-2 drop-shadow-md">{title}</h3>
                <span className="text-[10px] font-mono text-[var(--text-primary)]/80 bg-[var(--bg-primary)]/50 px-1.5 py-0.5 rounded-sm border border-[var(--text-primary)]/10">Lv.90</span>
              </div>
              
              {/* Progress/Accent Bar */}
              <div className="h-[2px] w-full bg-[var(--text-primary)]/10 relative overflow-hidden mb-2 mt-1">
                <div 
                  className="absolute top-0 left-0 h-full w-1/4 transition-all duration-700 ease-out group-hover:w-full" 
                  style={{ backgroundColor: elementColor, boxShadow: `0 0 10px ${elementColor}` }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-mono text-[var(--text-primary)]/50 uppercase tracking-widest truncate">{category}</p>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-2 group-hover:translate-x-0">
                  <span className="text-[9px] font-mono text-[var(--text-primary)]/70 uppercase">View Guide</span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--text-primary)]/70"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </div>
              </div>
            </div>

            {/* WW Corner Accents */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[var(--text-primary)]/20 group-hover:border-[var(--text-primary)]/80 transition-colors z-20" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[var(--text-primary)]/20 group-hover:border-[var(--text-primary)]/80 transition-colors z-20" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[var(--text-primary)]/20 group-hover:border-[var(--text-primary)]/80 transition-colors z-20" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[var(--text-primary)]/20 group-hover:border-[var(--text-primary)]/80 transition-colors z-20" />
          </Link>
        </div>
      </div>
    );
  }
);

ProductCard.displayName = "ProductCard";

export { ProductCard };
