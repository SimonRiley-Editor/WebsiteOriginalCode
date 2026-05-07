"use client";

import React, { useEffect, useRef, useState } from 'react';
import '@esotericsoftware/spine-player/dist/spine-player.css';

export interface SpineTexture {
  name: string;
  url: string;
}

export interface SpineViewport {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  padLeft?: string | number;
  padRight?: string | number;
  padTop?: string | number;
  padBottom?: string | number;
}

export interface HiyukiSpinePlayerProps {
  className?: string;
  style?: React.CSSProperties;
  skelUrl?: string;
  atlasUrl?: string;
  textures?: SpineTexture[];
  animation?: string;
  skin?: string;
  viewport?: SpineViewport;
}

export default function HiyukiSpinePlayer({ className, style, skelUrl, atlasUrl, textures, animation, skin, viewport }: HiyukiSpinePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const [errorInfo, setErrorInfo] = useState<string | null>(null);
  const [loadingMsg, setLoadingMsg] = useState<string | null>("Initializing Spine...");

  const texturesString = JSON.stringify(textures);

  useEffect(() => {
    if (!containerRef.current || playerRef.current) return;
    
    // Default fallback values if not provided
    const skeletonPath = skelUrl || "https://res.cloudinary.com/ds6dwbk37/raw/upload/v1777173287/Portraits_Feixue_kekcf3.skel";
    const atlasPath = atlasUrl || "https://res.cloudinary.com/ds6dwbk37/raw/upload/v1777173287/Portraits_Feixue_iltaii.atlas";
    
    // Only use default textures if no custom URLs are provided and no custom textures are passed
    let activeTextures: SpineTexture[] = [];
    if (textures && textures.length > 0) {
       activeTextures = textures;
    } else if (!skelUrl && !atlasUrl) {
       activeTextures = [
          { name: "Portraits_Feixue.webp", url: "https://res.cloudinary.com/ds6dwbk37/image/upload/v1777173288/Portraits_Feixue_ihwgwn.webp" },
          { name: "Portraits_Feixue_2.webp", url: "https://res.cloudinary.com/ds6dwbk37/image/upload/v1777190831/Portraits_Feixue_2_q8dke1.png" }
       ];
    }

    let isActive = true;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    
    const handleMouseMove = (e: MouseEvent) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const initSpine = async () => {
      // Import the SpinePlayer dynamically
      const { SpinePlayer } = await import('@esotericsoftware/spine-player');
      
      if (!isActive) return;

      const rawDataURIs: Record<string, string> = {};

      try {
        // First try to fetch atlas to see what textures it expects
        let requiredTextures: string[] = [];
        try {
            const atlasRes = await fetch(atlasPath);
            if (atlasRes.ok) {
                const atlasText = await atlasRes.text();
                // Find all lines ending in .png, .jpg, .webp
                const matches = atlasText.match(/^(.+\.(?:png|jpg|jpeg|webp))\s*$/gm);
                if (matches) {
                    requiredTextures = matches.map(s => s.trim());
                }
            }
        } catch(e) {}

        const basePathMatch = atlasPath.match(/(.*\/)/);
        const basePath = basePathMatch ? basePathMatch[1] : '';

        const getTextureUrl = (textureName: string, activeTextures: SpineTexture[]) => {
            const exactMatch = activeTextures.find(t => t.name === textureName);
            if (exactMatch && exactMatch.url) return exactMatch.url;

            const cleanTarget = textureName.replace(/\.[^/.]+$/, "").toLowerCase();
            
            const matches = activeTextures.map(t => {
                if (!t.url) return null;
                
                let sourceName = t.name;
                if (!sourceName) {
                    const uMatch = t.url.match(/([^\/]+)$/);
                    sourceName = uMatch ? uMatch[1].split('?')[0] : '';
                }
                
                const cleanSource = sourceName.replace(/\.[^/.]+$/, "").toLowerCase();
                const cleanSourceWithoutHash = cleanSource.replace(/_[a-z0-9]{5,8}$/, ""); // Handles Cloudinary hash
                
                if (cleanSource === cleanTarget || cleanSourceWithoutHash === cleanTarget) {
                    return { t, score: 3 }; // Exact match on name base
                }
                if (cleanSource.includes(cleanTarget)) return { t, score: 2 };
                if (cleanTarget.includes(cleanSource)) return { t, score: 1 };
                
                return null;
            }).filter(Boolean) as { t: SpineTexture, score: number }[];

            if (matches.length > 0) {
                // sort by score descending
                matches.sort((a, b) => b.score - a.score);
                return matches[0].t.url;
            }
            return null;
        };

        // 1. Fetch all required textures found in atlas
        for (const reqTex of requiredTextures) {
            const mappedUrl = getTextureUrl(reqTex, activeTextures);
            if (mappedUrl) {
                try {
                    const res = await fetch(mappedUrl);
                    if (!res.ok) throw new Error(`Fetch failed for ${mappedUrl}`);
                    const blob = await res.blob();
                    const base64 = await new Promise<string>((resolve) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result as string);
                        reader.readAsDataURL(blob);
                    });
                    
                    rawDataURIs[basePath + reqTex] = base64;
                    rawDataURIs[reqTex] = base64;
                    console.log(`Mapped required texture ${reqTex} to URL ${mappedUrl}`);
                } catch (err) {
                    console.warn(`Spine texture fetch failed for reqTex ${reqTex} (URL: ${mappedUrl}):`, err);
                }
            } else {
                console.warn(`Could not find a mapped URL for required texture: ${reqTex}`);
            }
        }

        // 2. Fetch any missing textures from activeTextures (in case atlas parsing failed)
        for (const tex of activeTextures) {
           if (!tex.url) continue;
           let sourceName = tex.name;
           if (!sourceName) {
               const uMatch = tex.url.match(/([^\/]+)$/);
               sourceName = uMatch ? uMatch[1].split('?')[0] : '';
           }
           if (rawDataURIs[sourceName] || rawDataURIs[basePath + sourceName]) {
               continue; // already loaded
           }

           try {
               const res = await fetch(tex.url);
               if (!res.ok) throw new Error(`Fetch failed for ${tex.url}`);
               const blob = await res.blob();
               const base64 = await new Promise<string>((resolve) => {
                 const reader = new FileReader();
                 reader.onload = () => resolve(reader.result as string);
                 reader.readAsDataURL(blob);
               });
               
               rawDataURIs[basePath + sourceName] = base64;
               rawDataURIs[sourceName] = base64;
               rawDataURIs[tex.url] = base64;
           } catch(err) {
               console.warn("Fallback spine texture fetch failed for:", tex.url, err);
           }
        }
        console.log("RAW DATA URIs mapped keys:", Object.keys(rawDataURIs));
      } catch (err) {
        console.error("Failed to process Spine texture mapping:", err);
      }

      if (!isActive) return;

      try {
        playerRef.current = new SpinePlayer(containerRef.current as HTMLElement, {
          binaryUrl: skeletonPath,
          atlasUrl: atlasPath,
          rawDataURIs: rawDataURIs,
          alpha: true,
          backgroundColor: "#00000000",
          showControls: false,
          premultipliedAlpha: false, // Turn off so we don't get white outlines
          preserveDrawingBuffer: false,
          ...(animation ? { animation } : { animation: "idle" }),
          ...(skin ? { skin } : {}),
          viewport: viewport || {
             padLeft: "15%",
             padRight: "15%",
             padTop: "15%",
             padBottom: "15%"
          },
          debug: {
              bones: false,
              regions: false,
              meshes: false,
              bounds: false,
              paths: false,
              clipping: false,
              points: false,
              hulls: false
          },
          success: (player: any) => {
             setLoadingMsg(null);
          },
          error: (player: any, reason: string) => {
             setLoadingMsg(null);
             console.error("Spine Error: " + reason);
             setErrorInfo(`Spine Error: ${reason}. Mapped Keys: ${Object.keys(rawDataURIs).join(', ')}`);
          },
          update: (player: any, delta: number) => {
              if (!player.skeleton) return;
              
              // Attempt to find common neck/head bones
              const headBone = player.skeleton.findBone("head") || player.skeleton.findBone("Head") || player.skeleton.findBone("Neck") || player.skeleton.findBone("neck");
              
              if (headBone) {
                  const screenW = window.innerWidth;
                  const screenH = window.innerHeight;
                  const mx = (mouseX / screenW) * 2 - 1;
                  const my = (mouseY / screenH) * 2 - 1;
                  headBone.rotation += (mx * 15);
              }
          }
        });
      } catch (err) {
        setErrorInfo("Spine init exception: " + String(err));
      }
    };

    initSpine();

    return () => {
      isActive = false;
      window.removeEventListener('mousemove', handleMouseMove);
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [skelUrl, atlasUrl, texturesString, animation, skin, viewport]);

  return (
    <div 
       className={`relative w-full h-[800px] border border-transparent ${className || ''}`}
       style={{ ...style }} 
    >
       {loadingMsg && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/50 text-white p-2 text-xs z-50 rounded">
             {loadingMsg}
          </div>
       )}
       {errorInfo && (
          <div className="absolute top-0 left-0 bg-red-500/80 text-white p-2 text-[10px] z-50 rounded max-w-full overflow-hidden break-words">
             {errorInfo}
          </div>
       )}
       <div ref={containerRef} className="w-full h-full" style={{ minHeight: '600px' }} />
    </div>
  );
}
