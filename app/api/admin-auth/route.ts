import { env } from "cloudflare:workers";

const ADMIN_EMAIL = "shusol0016@gmail.com";

export async function POST(request: Request) {
  const url = env.SUPABASE_URL?.replace(/\/$/, "");
  const key = env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return Response.json({ error: "Supabase is not configured." }, { status: 503 });

  try {
    const body = await request.json() as { email?: string; password?: string };
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    if (email !== ADMIN_EMAIL || password.length < 1 || password.length > 256) {
      return Response.json({ error: "Invalid admin email or password." }, { status: 401 });
    }

    const response = await fetch(`${url}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: { apikey: key, "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) return Response.json({ error: "Invalid admin email or password." }, { status: 401 });

    const session = await response.json() as { access_token?: string; user?: { email?: string } };
    if (!session.access_token || session.user?.email?.toLowerCase() !== ADMIN_EMAIL) {
      return Response.json({ error: "This account is not authorised to manage Ranisa products." }, { status: 403 });
    }
    return Response.json({ access_token: session.access_token, email: session.user.email }, {
      headers: { "cache-control": "no-store" },
    });
  } catch {
    return Response.json({ error: "Could not sign in. Please try again." }, { status: 503 });
  }
}
