import { env } from "cloudflare:workers";

const ADMIN_EMAIL = "shusol0016@gmail.com";
type ProductInput = { name?: unknown; category?: unknown; fabric?: unknown; price?: unknown; imageUrl?: unknown; description?: unknown };

function config() {
  const url = env.SUPABASE_URL?.replace(/\/$/, "");
  const key = env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Supabase settings are missing.");
  return { url, key };
}

function accessToken(request: Request) {
  const header = request.headers.get("authorization") || "";
  return header.match(/^Bearer\s+(.+)$/i)?.[1] || "";
}

async function isAdmin(url: string, key: string, token: string) {
  if (!token) return false;
  try {
    const response = await fetch(`${url}/auth/v1/user`, { headers: { apikey: key, Authorization: `Bearer ${token}` }, cache: "no-store" });
    if (!response.ok) return false;
    const user = await response.json() as { email?: string; email_confirmed_at?: string | null };
    return user.email?.toLowerCase() === ADMIN_EMAIL && !!user.email_confirmed_at;
  } catch { return false; }
}

function databaseHeaders(key: string, token?: string, extra: Record<string, string> = {}) {
  return { apikey: key, ...(token ? { Authorization: `Bearer ${token}` } : {}), ...extra };
}

function formatProduct(p: { id: number | string; name: string; category: string; fabric?: string|null; description?: string|null; price?: number|string|null; image_url?: string|null }) {
  return { id: String(p.id), name: p.name, category: p.category, fabric: p.fabric || "", price: Number(p.price || 0), imageUrl: p.image_url || "", description: p.description || "" };
}

export async function GET(request: Request) {
  try {
    const { url, key } = config();
    const token = accessToken(request);
    const authorized = token && await isAdmin(url, key, token);
    const params = new URLSearchParams({ select: "id,name,category,fabric,description,price,image_url,is_active", order: "sort_order.asc,created_at.desc" });
    if (!authorized) params.set("is_active", "eq.true");
    const response = await fetch(`${url}/rest/v1/ranisa_products?${params}`, {
      headers: databaseHeaders(key, authorized ? token : undefined, { Accept: "application/json" }), cache: "no-store",
    });
    if (!response.ok) return Response.json({ products: [], error: "Could not load the boutique catalogue." }, { status: 503 });
    const rows = await response.json() as Parameters<typeof formatProduct>[0][];
    return Response.json({ products: rows.map(formatProduct) }, { headers: { "cache-control": "no-store" } });
  } catch {
    return Response.json({ products: [], error: "Supabase catalogue settings are not available." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  try {
    const { url, key } = config();
    const token = accessToken(request);
    if (!await isAdmin(url, key, token)) return Response.json({ error: "Admin sign-in required." }, { status: 401 });
    const data = await request.json() as ProductInput;
    const name = String(data.name || "").trim();
    const category = String(data.category || "").trim();
    const fabric = String(data.fabric || "").trim();
    const description = String(data.description || "").trim();
    const image_url = String(data.imageUrl || "").trim();
    const price = Number(data.price);
    if (name.length < 2 || name.length > 140 || !["suit", "lehenga", "material"].includes(category) || !Number.isFinite(price) || price < 1 || fabric.length > 100 || description.length > 3000 || image_url.length > 2000) {
      return Response.json({ error: "Enter a valid name, type, fabric and price." }, { status: 400 });
    }
    const response = await fetch(`${url}/rest/v1/ranisa_products`, {
      method: "POST", headers: databaseHeaders(key, token, { "content-type": "application/json", Prefer: "return=representation" }),
      body: JSON.stringify({ name, category, fabric, description, price, image_url }),
    });
    if (!response.ok) return Response.json({ error: "Supabase could not save this product. Check the Ranisa admin policy." }, { status: response.status === 401 || response.status === 403 ? 403 : 503 });
    const [product] = await response.json() as Parameters<typeof formatProduct>[0][];
    return Response.json({ id: String(product.id) }, { status: 201 });
  } catch { return Response.json({ error: "Could not save product." }, { status: 503 }); }
}

export async function PATCH(request: Request) {
  try {
    const { url, key } = config();
    const token = accessToken(request);
    if (!await isAdmin(url, key, token)) return Response.json({ error: "Admin sign-in required." }, { status: 401 });
    const id = new URL(request.url).searchParams.get("id");
    if (!id) return Response.json({ error: "Missing product id." }, { status: 400 });
    const data = await request.json() as { price?: unknown; imageUrl?: unknown };
    const price = Number(data.price);
    const image_url = String(data.imageUrl || "").trim();
    if (!Number.isFinite(price) || price < 1 || image_url.length > 2000) return Response.json({ error: "Enter a valid price and image URL." }, { status: 400 });
    const response = await fetch(`${url}/rest/v1/ranisa_products?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH", headers: databaseHeaders(key, token, { "content-type": "application/json", Prefer: "return=minimal" }),
      body: JSON.stringify({ price, image_url }),
    });
    if (!response.ok) return Response.json({ error: "Supabase could not update this product." }, { status: response.status === 401 || response.status === 403 ? 403 : 503 });
    return Response.json({ ok: true });
  } catch { return Response.json({ error: "Could not update product." }, { status: 503 }); }
}

export async function DELETE(request: Request) {
  try {
    const { url, key } = config();
    const token = accessToken(request);
    if (!await isAdmin(url, key, token)) return Response.json({ error: "Admin sign-in required." }, { status: 401 });
    const id = new URL(request.url).searchParams.get("id");
    if (!id) return Response.json({ error: "Missing product id." }, { status: 400 });
    const response = await fetch(`${url}/rest/v1/ranisa_products?id=eq.${encodeURIComponent(id)}`, {
      method: "DELETE", headers: databaseHeaders(key, token, { Prefer: "return=minimal" }),
    });
    if (!response.ok) return Response.json({ error: "Supabase could not remove this product." }, { status: response.status === 401 || response.status === 403 ? 403 : 503 });
    return Response.json({ ok: true });
  } catch { return Response.json({ error: "Could not delete product." }, { status: 503 }); }
}
