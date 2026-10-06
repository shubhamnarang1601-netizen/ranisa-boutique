"use client";
import { useEffect, useState } from "react";
import { UserRound } from "lucide-react";
import Dialog from "./dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

type User = { id: string; email?: string };
async function accountRequest(body?: object) {
  const response = await fetch("/api/customer-auth", { method: body ? "POST" : "GET", credentials: "same-origin", cache: "no-store", ...(body ? { headers: { "content-type": "application/json" }, body: JSON.stringify(body) } : {}) });
  const result = await response.json() as { user?: User | null; error?: string };
  if (!response.ok) throw new Error(result.error || "Please try again.");
  return result;
}
export default function CustomerAccount() {
  const [open, setOpen] = useState(false), [user, setUser] = useState<User | null>(null);
  const [mode, setMode] = useState<"signin" | "signup">("signin"), [email, setEmail] = useState(""), [code, setCode] = useState("");
  const [sent, setSent] = useState(false), [busy, setBusy] = useState(false), [error, setError] = useState(""), [notice, setNotice] = useState(""), [remaining, setRemaining] = useState(0);
  useEffect(() => { accountRequest().then(x => setUser(x.user || null)).catch(() => {}); }, []);
  useEffect(() => { if (!remaining) return; const timer = window.setTimeout(() => setRemaining(x => Math.max(0, x - 1)), 1000); return () => window.clearTimeout(timer); }, [remaining]);
  async function send() {
    setBusy(true); setError(""); setNotice("");
    try { await accountRequest({ action: "send", email, mode }); setSent(true); setCode(""); setRemaining(60); setNotice("Check your inbox and spam folder for your verification code."); }
    catch (e) { setError(e instanceof Error ? e.message : "Please try again."); }
    finally { setBusy(false); }
  }
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!sent) { await send(); return; }
    setBusy(true); setError("");
    try { const result = await accountRequest({ action: "verify", email, token: code }); setUser(result.user || null); setNotice("You’re signed in. Welcome to Ranisa."); setSent(false); setCode(""); }
    catch (e) { setError(e instanceof Error ? e.message : "Please try again."); }
    finally { setBusy(false); }
  }
  async function signout() {
    setBusy(true); setError("");
    try { await accountRequest({ action: "signout" }); setUser(null); setSent(false); setCode(""); setNotice("You’ve signed out."); }
    catch (e) { setError(e instanceof Error ? e.message : "Please try again."); }
    finally { setBusy(false); }
  }
  return <><button className="account-toggle" aria-label={user ? "Open your account" : "Sign up or sign in"} onClick={() => { setOpen(true); setError(""); }}><UserRound size={20} strokeWidth={1.4}/><span>{user ? "Account" : "Sign in"}</span></button>
    <Dialog open={open} onClose={() => setOpen(false)} title={user ? "Your Ranisa account" : sent ? "Check your email" : mode === "signup" ? "Welcome to Ranisa" : "Welcome back"} className="customer-dialog">
      {user ? <div className="customer-signed-in"><p>Signed in as</p><strong>{user.email}</strong><p>Discover something beautiful, or share your inspiration for a custom design.</p><button className="button" onClick={() => setOpen(false)}>Continue exploring</button><button className="account-text-button" onClick={signout} disabled={busy}>{busy ? "Signing out…" : "Sign out"}</button></div> : <>
        {!sent && <div className="account-mode" aria-label="Account options"><button aria-pressed={mode === "signin"} onClick={() => { setMode("signin"); setError(""); setNotice(""); }}>Sign in</button><button aria-pressed={mode === "signup"} onClick={() => { setMode("signup"); setError(""); setNotice(""); }}>Sign up</button></div>}
        <p>{sent ? <>Enter the code sent to <strong>{email}</strong>.</> : mode === "signup" ? "Create your account with an email verification code. No password needed." : "Sign in with a one-time code sent to your email."}</p>
        <form className="login-form customer-auth-form" onSubmit={submit}>
          {!sent ? <label>Email address<input type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required maxLength={254} disabled={busy}/></label> : <div><label htmlFor="customer-code">Verification code</label><InputOTP id="customer-code" maxLength={8} pattern="^[0-9]*$" value={code} onChange={setCode} autoComplete="one-time-code" autoFocus disabled={busy} required><InputOTPGroup>{Array.from({length:8},(_,index)=><InputOTPSlot key={index} index={index} className="customer-otp-slot"/>)}</InputOTPGroup></InputOTP></div>}
          <button className="button" disabled={busy || (sent && code.length !== 8) || (!sent && remaining > 0)}>{busy ? "Please wait…" : sent ? "Verify & continue" : remaining > 0 ? `Try again in ${remaining}s` : "Send verification code"}</button>
        </form>
        {sent && <div className="account-help"><button className="account-text-button" onClick={send} disabled={busy || remaining > 0}>{remaining > 0 ? `Resend code in ${remaining}s` : "Resend code"}</button><button className="account-text-button" disabled={busy} onClick={() => { setSent(false); setCode(""); setError(""); setNotice(""); }}>Change email</button></div>}
      </>}
      {notice && <p className="account-notice" role="status">{notice}</p>}{error && <p role="alert" className="form-error">{error}</p>}
    </Dialog></>;
}
