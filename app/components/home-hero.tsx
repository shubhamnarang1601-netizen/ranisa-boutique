"use client";
import {MagneticLink} from "./cinematic-details";
import Link from "next/link";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useScroll, useTransform, useReducedMotion } from "motion/react";
import { ResponsiveImage } from "./editorial-image";

export default function HomeHero() {
 const ref=useRef<HTMLElement>(null), reduce=useReducedMotion();
 const {scrollYProgress}=useScroll({target:ref,offset:["start start","end start"]});
 const scale=useTransform(scrollYProgress,[0,1],[1.14,1]);
 const drift=useTransform(scrollYProgress,[0,1],[0,90]);
 const modelY=useTransform(scrollYProgress,[0,1],[0,-48]);
 const modelScale=useTransform(scrollYProgress,[0,1],[1.04,.94]);
 const bgY=useTransform(scrollYProgress,[0,1],[0,28]);
 const mx=useMotionValue(0),my=useMotionValue(0),x=useSpring(mx,{stiffness:65,damping:25}),y=useSpring(my,{stiffness:65,damping:25});
 return <section ref={ref} className="campaign-hero" onPointerMove={e=>{if(reduce||e.pointerType!=="mouse")return;let r=e.currentTarget.getBoundingClientRect();mx.set((e.clientX-r.left-r.width/2)/r.width*16);my.set((e.clientY-r.top-r.height/2)/r.height*16)}} onPointerLeave={()=>{mx.set(0);my.set(0)}}>
  <video className="hero-film" src="/ranisa-hero-cinematic-small.mp4" autoPlay muted loop playsInline preload="metadata" poster="/media/campaign-800.webp" aria-label="Cinematic view inside Ranisa Boutique"/>
  <motion.div className="hero-campaign-photo hero-depth-bg" style={{scale:reduce?1:scale,y:reduce?0:bgY}}><ResponsiveImage asset="campaign" alt="Burgundy embroidered lehenga in a warm boutique setting" eager sizes="100vw"/></motion.div>
  <div className="hero-shade"/>
  <motion.div className="hero-depth-model" style={{x:reduce?0:x,y:reduce?0:modelY,scale:reduce?1:modelScale}}><img src="/media/signature.webp" alt="A Ranisa embroidered fashion look" width="933" height="1400" fetchPriority="high"/></motion.div>
  <motion.img className="hero-silk hero-depth-front" src="/media/silk.webp" alt="" aria-hidden="true" width="933" height="1400" style={{x:reduce?0:x,y:reduce?0:y}}/>
  <div className="hero-depth-ring hero-depth-ring-one"/><div className="hero-depth-ring hero-depth-ring-two"/>
  <motion.div className="hero-editorial-copy" style={{y:reduce?0:drift}}>
   <motion.p className="eyebrow" initial={false} animate={{opacity:1}}>THE ART OF PERSONAL STYLE · DEHRADUN</motion.p>
   <h1 aria-label="Elegance, Tailored for You.">{["Elegance,","Tailored","for You."].map((word,i)=><span className="word-mask" key={word}><motion.span className={i===1?"italic":""} initial={false} animate={reduce?{}:{y:["100%","0%"],opacity:[0,1],filter:["blur(6px)","blur(0px)"]}} transition={{duration:.9,delay:.12+i*.14,ease:[.22,1,.36,1]}}>{word}</motion.span></span>)}</h1>
   <p className="hero-deck">Discover timeless silhouettes, thoughtful craftsmanship and contemporary Indian fashion by Ranisa Boutique.</p>
   <div className="hero-cta-row"><MagneticLink className="button button-ivory" href="/shop">Explore the Collection</MagneticLink><Link className="hero-discover" href="/about">Discover Ranisa <span aria-hidden="true">↗</span></Link></div>
  </motion.div>
  <div className="hero-bottom"><span>INDIAN HERITAGE.<br/>YOUR OWN EXPRESSION.</span><a href="#collections" className="scroll-cue">SCROLL TO DISCOVER <span aria-hidden="true">↓</span></a><span>THE RANISA EDIT<br/>VOL. 01 / 2026</span></div>
 </section>;
}
