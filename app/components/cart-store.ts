"use client";
import {useSyncExternalStore,useMemo} from "react";
export type CartLine={id:string;qty:number};
const event="ranisa:cart";
function subscribe(cb:()=>void){window.addEventListener(event,cb);window.addEventListener("storage",cb);return()=>{window.removeEventListener(event,cb);window.removeEventListener("storage",cb)}}
function snapshot(){try{return localStorage.getItem("ranisaCart")||"[]"}catch{return "[]"}}
export function readCart():CartLine[]{try{const a=JSON.parse(snapshot());return Array.isArray(a)?a.filter(x=>typeof x.id==="string"&&Number.isInteger(x.qty)&&x.qty>0):[]}catch{return []}}
export function updateCart(id:string,delta:number){const a=readCart(),e=a.find(x=>x.id===id);if(e)e.qty+=delta;else if(delta>0)a.push({id,qty:delta});try{localStorage.setItem("ranisaCart",JSON.stringify(a.filter(x=>x.qty>0)));window.dispatchEvent(new Event(event))}catch{}}
export function useCart(){const value=useSyncExternalStore(subscribe,snapshot,()=>"[]");return useMemo(()=>{try{const a=JSON.parse(value);return (Array.isArray(a)?a.filter(x=>typeof x.id==="string"&&Number.isInteger(x.qty)&&x.qty>0):[]) as CartLine[]}catch{return []}},[value])}
