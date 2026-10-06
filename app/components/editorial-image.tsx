"use client";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function ResponsiveImage({ asset, alt, eager = false, className = "", sizes = "(max-width: 700px) 100vw, 50vw" }: { asset: string; alt: string; eager?: boolean; className?: string; sizes?: string }) {
  return <picture className={className}>
    <source type="image/avif" srcSet={`/media/${asset}-800.avif 800w, /media/${asset}-1600.avif 1600w`} sizes={sizes}/>
    <img src={`/media/${asset}-800.webp`} srcSet={[480,800,1200,1600].map(w=>`/media/${asset}-${w}.webp ${w}w`).join(", ")} sizes={sizes} alt={alt} loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : "auto"} decoding="async" width="1200" height="1500" />
  </picture>;
}
export default function EditorialImage({ asset, alt, className = "", children }: { asset: string; alt: string; className?: string; children?: ReactNode }) {
 const reduce = useReducedMotion();
 const rx=useMotionValue(0), ry=useMotionValue(0);
 const rotateX=useSpring(rx,{stiffness:110,damping:24}), rotateY=useSpring(ry,{stiffness:110,damping:24});
 return <motion.div className={`editorial-image ${className}`} data-cursor="EXPLORE" style={{rotateX:reduce?0:rotateX,rotateY:reduce?0:rotateY}} onPointerMove={e=>{if(reduce||e.pointerType!=="mouse")return; const r=e.currentTarget.getBoundingClientRect();rx.set(-(e.clientY-r.top-r.height/2)/r.height*3);ry.set((e.clientX-r.left-r.width/2)/r.width*3)}} onPointerLeave={()=>{rx.set(0);ry.set(0)}} initial={false} whileInView={reduce?{}:{clipPath:["inset(5% 0% 5% 0%)","inset(0% 0% 0% 0%)"]}} transition={{duration:1,ease:[.22,1,.36,1]}} viewport={{once:true,amount:.1}}>
  <ResponsiveImage asset={asset} alt={alt}/>{children}
 </motion.div>;
}
