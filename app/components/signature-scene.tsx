"use client";
import {useRef} from "react";
import {motion,useScroll,useTransform,useReducedMotion} from "motion/react";
import Link from "next/link";
export default function SignatureScene(){
 const ref=useRef<HTMLElement>(null),reduce=useReducedMotion();
 const {scrollYProgress}=useScroll({target:ref,offset:["start end","end start"]});
 const rotate=useTransform(scrollYProgress,[0,1],[-10,10]),rotateZ=useTransform(scrollYProgress,[0,1],[-2,2]),y=useTransform(scrollYProgress,[0,1],[100,-100]),textX=useTransform(scrollYProgress,[0,1],[140,-140]),silkX=useTransform(scrollYProgress,[0,1],[-80,80]);
 return <section className="signature" ref={ref} aria-labelledby="signature-title"><div className="signature-sticky"><div className="signature-heading"><p className="eyebrow">THE SIGNATURE EDIT · A LAYERED STUDY</p><h2 id="signature-title">Designed to be<br/><i>remembered.</i></h2></div><motion.span aria-hidden="true" className="signature-backword signature-word-back" style={{x:reduce?0:textX}}>RANISA</motion.span><motion.img aria-hidden="true" className="signature-silk-back" src="/media/silk.webp" width="933" height="1400" alt="" style={{x:reduce?0:silkX,y:reduce?0:y}}/><motion.div className="signature-subject-wrap" style={{y:reduce?0:y,rotateY:reduce?0:rotate,rotateZ:reduce?0:rotateZ}}><img className="signature-model" src="/media/signature.webp" alt="An intricately embroidered burgundy lehenga" width="933" height="1400" loading="lazy" decoding="async"/></motion.div><span aria-hidden="true" className="signature-word-front">RANISA</span><div className="signature-foreground"><span>Crafted for every<br/><i>version of you.</i></span><Link className="light-link" href="/custom">Make it your own <span aria-hidden="true">↗</span></Link></div><p className="signature-note">A STUDY IN TRADITION, TEXTURE & INDIVIDUALITY</p></div></section>
}
