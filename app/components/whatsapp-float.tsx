"use client";
import { motion, useReducedMotion } from "motion/react";

export default function WhatsAppFloat() {
  const reduceMotion = useReducedMotion();
  return <motion.a className="whatsapp-float" href="https://wa.me/919004517938" target="_blank" rel="noreferrer" aria-label="Chat with Ranisa Boutique on WhatsApp" whileHover={reduceMotion ? undefined : { y: -4, scale: 1.04 }} whileTap={reduceMotion ? undefined : { scale: 0.96 }}>
    <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3.2A12.5 12.5 0 0 0 5.3 22.2L3.8 28l6-1.5A12.5 12.5 0 1 0 16 3.2Zm0 22.7a10 10 0 0 1-5.1-1.4l-.4-.2-3.5.9.9-3.4-.2-.4a10 10 0 1 1 8.3 4.5Zm5.5-7.5c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.2 8.2 0 0 1-2.4-1.5 9 9 0 0 1-1.7-2.1c-.2-.4 0-.5.1-.7l.5-.5.3-.5c.1-.2 0-.4 0-.5l-1-2.2c-.2-.6-.5-.5-.7-.5H11c-.2 0-.5.1-.8.4s-1 1-1 2.3 1 2.7 1.1 2.9a12 12 0 0 0 4.7 5c.7.3 1.3.6 1.7.7.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4s-.2-.2-.5-.4Z"/></svg>
    <span>WhatsApp</span>
  </motion.a>;
}
