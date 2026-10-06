"use client";
import {useState} from "react";
import Dialog from "./dialog";
export default function AdminLoginModal({open,onClose}:{open:boolean;onClose:()=>void}){
 const [busy,setBusy]=useState(false),[error,setError]=useState("");
 async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setBusy(true);setError("");const form=e.currentTarget;try{const response=await fetch("/api/admin-auth",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(Object.fromEntries(new FormData(form)))});const result=await response.json() as {access_token?:string;error?:string};if(!response.ok||!result.access_token)throw Error(result.error||"Sign-in failed.");sessionStorage.setItem("ranisaAdminToken",result.access_token);window.location.assign("/admin")}catch(e){setError(e instanceof Error?e.message:"Please try again.")}finally{setBusy(false);form.querySelector<HTMLInputElement>('input[type="password"]')!.value=""}}
 return <Dialog open={open} onClose={onClose} title="Welcome back" className="login-dialog"><p>Sign in to manage Ranisa Boutique.</p><form onSubmit={submit} className="login-form"><label>Email<input type="email" name="email" autoComplete="username" required/></label><label>Password<input type="password" name="password" autoComplete="current-password" required/></label>{error&&<p role="alert" className="form-error">{error}</p>}<button className="button" disabled={busy}>{busy?"Signing in…":"Sign in"}</button></form></Dialog>
}
