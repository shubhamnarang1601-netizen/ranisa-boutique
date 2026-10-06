"use client";
import {useRef,useEffect, type ReactNode} from "react";
export default function Dialog({open,onClose,title,children,className=""}:{open:boolean;onClose:()=>void;title:string;children:ReactNode;className?:string}){
 const ref=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const d=ref.current;if(open&&!d?.open)d?.showModal();if(!open&&d?.open)d.close();if(open){const previous=document.body.style.overflow;document.body.style.overflow="hidden";return()=>{document.body.style.overflow=previous}}},[open]);
 return <dialog ref={ref} className={`boutique-dialog ${className}`} aria-label={title} onCancel={onClose} onClick={e=>{if(e.target===e.currentTarget)onClose()}}><div className="dialog-content"><div className="dialog-heading"><h2>{title}</h2><button className="icon-button" aria-label="Close dialog" onClick={onClose}>×</button></div>{children}</div></dialog>
}
