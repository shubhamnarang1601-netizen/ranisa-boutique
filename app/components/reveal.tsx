"use client";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
export default function Reveal({children,className,delay=0}:{children:ReactNode;className?:string;delay?:number}){
 const reduce=useReducedMotion();
 return <motion.div className={className} initial={false} whileInView={reduce?undefined:{opacity:[.65,1],y:[22,0]}} viewport={{once:true,amount:.08}} transition={{duration:.8,delay,ease:[.22,1,.36,1]}}>{children}</motion.div>;
}
