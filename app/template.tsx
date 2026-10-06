"use client";
import {motion,useReducedMotion} from "motion/react";
export default function Template({children}:{children:React.ReactNode}){
 const reduce=useReducedMotion();
 return <motion.div className="page-transition-content" initial={false} animate={reduce?{}:{opacity:[.86,1],y:[6,0]}} transition={{duration:.42,ease:[.22,1,.36,1]}}>{children}</motion.div>;
}
