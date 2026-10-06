"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useEffect,useState} from "react";
import {AnimatePresence,motion} from "motion/react";
import dynamic from "next/dynamic";
import {useCart} from "./cart-store";
import CustomerAccount from "./customer-account";
const CartDrawer=dynamic(()=>import("./cart-drawer"),{ssr:false});
const links=[["Home","/"],["Collections","/shop"],["Our story","/about"],["Custom design","/custom"],["Visit us","/contact"]];
export default function SiteHeader(){
 const path=usePathname(),[scrolled,setScrolled]=useState(false),[menu,setMenu]=useState(false),[bag,setBag]=useState(false),cart=useCart();
 useEffect(()=>{const fn=()=>setScrolled(window.scrollY>30);fn();window.addEventListener("scroll",fn,{passive:true});return()=>window.removeEventListener("scroll",fn)},[]);
 useEffect(()=>{if(!menu)return;const fn=(e:KeyboardEvent)=>{if(e.key==="Escape")setMenu(false)};window.addEventListener("keydown",fn);return()=>window.removeEventListener("keydown",fn)},[menu]);
 return <><header className={`site-header ${path==="/"&&!scrolled&&!menu?"over-hero":""} ${scrolled?"is-scrolled":""}`}><Link className="brand" href="/" aria-label="Ranisa Boutique home" onClick={()=>setMenu(false)}><img src="/media/monogram.webp" alt="" width="42" height="48"/></Link><nav className="desktop-nav" aria-label="Main navigation">{links.map(([label,href])=><Link key={href} href={href} data-customize-link={href==="/custom"?"true":undefined} aria-current={path===href?"page":undefined}>{label}</Link>)}</nav><div className="nav-actions"><CustomerAccount/><button className="bag-toggle" onClick={()=>setBag(true)} aria-label={`Open bag, ${cart.reduce((n,x)=>n+x.qty,0)} items`}><span>Bag</span><span className="bag-count">{cart.reduce((n,x)=>n+x.qty,0)}</span></button><button className={`menu-toggle ${menu?"active":""}`} aria-label={menu?"Close menu":"Open menu"} aria-expanded={menu} aria-controls="mobile-menu" onClick={()=>setMenu(!menu)}><span/><span/></button></div></header><AnimatePresence>{menu&&<motion.nav id="mobile-menu" className="mobile-menu" aria-label="Mobile navigation" initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}} transition={{duration:.25}}>{links.map(([label,href],i)=><Link key={href} href={href} data-customize-link={href==="/custom"?"true":undefined} onClick={()=>setMenu(false)}><span>0{i+1}</span>{label}</Link>)}<p>Traditional elegance.<br/><i>Entirely your own.</i></p></motion.nav>}</AnimatePresence>{bag&&<CartDrawer open={bag} onClose={()=>setBag(false)}/>}</>;
}
