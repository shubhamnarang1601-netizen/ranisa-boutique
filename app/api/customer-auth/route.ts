import { env } from "cloudflare:workers";

type Session = { access_token?: string; refresh_token?: string; expires_in?: number; user?: { id: string; email?: string } };
const ACCESS = "ranisa_customer_access", REFRESH = "ranisa_customer_refresh";
function config() {
  const url = env.SUPABASE_URL?.replace(/\/$/, ""), key = env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Authentication is temporarily unavailable.");
  return { url, key };
}
function reply(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "cache-control": "no-store, private", "vary": "Cookie" } });
}
function cookie(request: Request, name: string) {
  const value = request.headers.get("cookie")?.split(";").map(x => x.trim()).find(x => x.startsWith(`${name}=`))?.slice(name.length + 1);
  return value ? decodeURIComponent(value) : "";
}
function setCookie(response: Response, request: Request, name: string, value: string, age: number) {
  response.headers.append("set-cookie", `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${age}${new URL(request.url).protocol === "https:" ? "; Secure" : ""}`);
}
function sessionReply(request: Request, session: Session) {
  const response = reply({ user: session.user ? { id: session.user.id, email: session.user.email } : null });
  setCookie(response, request, ACCESS, session.access_token || "", session.expires_in || 3600);
  setCookie(response, request, REFRESH, session.refresh_token || "", 60 * 60 * 24 * 30);
  return response;
}
function clearSession(request: Request) {
  const response = reply({ user: null });
  setCookie(response, request, ACCESS, "", 0);
  setCookie(response, request, REFRESH, "", 0);
  return response;
}
async function auth(path: string, body?: unknown, token?: string) {
  const { url, key } = config();
  return fetch(`${url}/auth/v1/${path}`, {
    method: body !== undefined ? "POST" : "GET",
    headers: { apikey: key, "content-type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}), cache: "no-store",
  });
}
export async function GET(request: Request) {
  try {
    const access = cookie(request, ACCESS), refresh = cookie(request, REFRESH);
    if (!access && !refresh) return reply({ user: null });
    if (access) {
      const result = await auth("user", undefined, access);
      if (result.ok) {
        const user = await result.json() as { id: string; email?: string };
        return reply({ user: { id: user.id, email: user.email } });
      }
      if (result.status !== 401 && result.status !== 403) return reply({ error: "Could not load your account. Please try again." }, 503);
    }
    if (refresh) {
      const result = await auth("token?grant_type=refresh_token", { refresh_token: refresh });
      if (result.ok) return sessionReply(request, await result.json() as Session);
      if (result.status >= 500 || result.status === 429) return reply({ error: "Could not refresh your session. Please try again." }, 503);
    }
    return clearSession(request);
  } catch { return reply({ error: "Could not load your account. Please try again." }, 503); }
}
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if ((origin && origin !== new URL(request.url).origin) || request.headers.get("sec-fetch-site") === "cross-site") return reply({ error: "Please use the sign-in form on this website." }, 403);
  if (!request.headers.get("content-type")?.includes("application/json")) return reply({ error: "Invalid request." }, 415);
  try {
    const body = await request.json() as { action?: string; email?: string; token?: string; mode?: string };
    if (body.action === "signout") {
      let access = cookie(request, ACCESS);
      const refresh = cookie(request, REFRESH);
      // Rotate an expired session before revoking it so sign-out also invalidates
      // the server-side refresh session when the access cookie has expired.
      if (refresh) {
        const result = await auth("token?grant_type=refresh_token", { refresh_token: refresh });
        if (result.ok) access = (await result.json() as Session).access_token || access;
        else if (result.status >= 500 || result.status === 429) return reply({ error: "Could not sign out. Please try again." }, 503);
      }
      if (access) {
        const result = await auth("logout?scope=local", {}, access);
        if (!result.ok && result.status !== 401 && result.status !== 403) return reply({ error: "Could not sign out. Please try again." }, 503);
      }
      return clearSession(request);
    }
    const email = String(body.email || "").trim().toLowerCase();
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return reply({ error: "Enter a valid email address." }, 400);
    if (body.action === "send") {
      if (!["signup", "signin"].includes(body.mode || "")) return reply({ error: "Choose sign up or sign in." }, 400);
      const result = await auth("otp", { email, create_user: body.mode === "signup" });
      if (!result.ok) return reply({ error: result.status === 429 ? "Please wait before requesting another code." : "Unable to send a code. Check your email, or try signing up if you are new." }, result.status === 429 ? 429 : 400);
      return reply({ sent: true });
    }
    if (body.action === "verify") {
      const token = String(body.token || "").trim();
      if (!/^\d{6,10}$/.test(token)) return reply({ error: "Enter the verification code from your email." }, 400);
      const result = await auth("verify", { email, token, type: "email" });
      if (!result.ok) return reply({ error: result.status === 429 ? "Too many attempts. Please wait and try again." : "That code is invalid or expired. Try again or request a new code." }, result.status === 429 ? 429 : 400);
      const session = await result.json() as Session;
      if (!session.access_token || !session.refresh_token || !session.user) return reply({ error: "Could not complete sign-in. Please try again." }, 503);
      return sessionReply(request, session);
    }
    return reply({ error: "Invalid request." }, 400);
  } catch { return reply({ error: "Authentication is temporarily unavailable. Please try again." }, 503); }
}
