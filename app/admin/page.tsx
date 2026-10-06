"use client";

import { useEffect, useState } from "react";
import Reveal from "../components/reveal";
import AdminPanel from "./panel";

const ADMIN_EMAIL = "shusol0016@gmail.com";
type LoginResult = { access_token?: string; email?: string; error?: string };

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { setToken(sessionStorage.getItem("ranisaAdminToken") || ""); }, []);

  async function signIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin-auth", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json() as LoginResult;
      setPassword("");
      if (!response.ok || !data.access_token) {
        setMessage(data.error || "Sign-in failed. Check your email and password.");
        return;
      }
      sessionStorage.setItem("ranisaAdminToken", data.access_token);
      setToken(data.access_token);
    } catch {
      setMessage("Could not connect to Supabase. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  function signOut() {
    sessionStorage.removeItem("ranisaAdminToken");
    setToken("");
    setMessage("You are signed out.");
  }

  if (token) return <AdminPanel accessToken={token} onSignOut={signOut} />;

  return <main className="page">
    
    <Reveal><p className="kicker">RANISA BOUTIQUE</p>
    <h1>Admin <i>sign in</i></h1>
    <p>Use the boutique administrator account to manage products.</p>
    <form className="adminform" onSubmit={signIn}>
      <label>Email<input type="email" autoComplete="username" value={email} onChange={event => setEmail(event.target.value)} required /></label>
      <label>Password<input type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required /></label>
      {message && <p role="status">{message}</p>}
      <button className="btn" type="submit" disabled={busy}>{busy ? "SIGNING IN…" : "SIGN IN"}</button>
    </form>
    <p><a href="/">Return to the boutique</a></p>
  </Reveal></main>;
}
