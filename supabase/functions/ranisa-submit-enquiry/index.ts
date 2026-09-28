import { createClient } from "npm:@supabase/supabase-js@2.95.0";

const SITE_ORIGIN = "https://ranisa-boutique-dehradun.shubhamnarang1601.chatgpt.site";
const BUCKET = "ranisa-references";
const MAX_FILE = 10 * 1024 * 1024;
const MAX_TOTAL = 20 * 1024 * 1024;
const TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const headers = {
  "Access-Control-Allow-Origin": SITE_ORIGIN,
  "Access-Control-Allow-Headers": "content-type, apikey",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
  "Vary": "Origin",
};
const respond = (status: number, data: Record<string, unknown>) =>
  new Response(JSON.stringify(data), { status, headers });
const clean = (value: FormDataEntryValue | null) =>
  typeof value === "string" ? value.trim() : "";

async function realImage(file: File): Promise<boolean> {
  // Check common file signatures as well as the browser-supplied MIME type.
  const b = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  if (file.type === "image/jpeg") return b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;
  if (file.type === "image/png") return [137, 80, 78, 71, 13, 10, 26, 10].every((v, i) => b[i] === v);
  if (file.type === "image/webp") {
    return new TextDecoder().decode(b.slice(0, 4)) === "RIFF" &&
      new TextDecoder().decode(b.slice(8, 12)) === "WEBP";
  }
  return false;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (req.method !== "POST") return respond(405, { error: "Method not allowed." });
  if (req.headers.get("origin") !== SITE_ORIGIN) {
    return respond(403, { error: "Please use the Ranisa Boutique contact form." });
  }
  if (Number(req.headers.get("content-length") || 0) > MAX_TOTAL + 100000) {
    return respond(413, { error: "Images must be 20 MB or smaller in total." });
  }

  try {
    const form = await req.formData();
    if (clean(form.get("company_website"))) return respond(400, { error: "Unable to submit this enquiry." });
    const customer_name = clean(form.get("name"));
    const requested_style = clean(form.get("style"));
    const description = clean(form.get("message"));
    const files = form.getAll("images");
    if (!customer_name || customer_name.length > 120 || !requested_style ||
        requested_style.length > 160 || !description || description.length > 3000) {
      return respond(400, { error: "Please complete the form using shorter text." });
    }
    if (files.length > 5 || files.some((file) => !(file instanceof File) ||
        !TYPES[file.type] || file.size === 0 || file.size > MAX_FILE) ||
        files.reduce((total, file) => total + (file instanceof File ? file.size : 0), 0) > MAX_TOTAL) {
      return respond(400, { error: "Choose up to 5 JPG, PNG or WebP images, at most 10 MB each and 20 MB in total." });
    }
    for (const file of files as File[]) {
      if (!(await realImage(file))) return respond(400, { error: "A selected file is not a valid image." });
    }

    const keys = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") || "{}");
    const key = keys.default || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const url = Deno.env.get("SUPABASE_URL");
    if (!url || !key) return respond(503, { error: "Order enquiries are temporarily unavailable." });
    const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

    // The hash limits repeat submissions without storing the visitor's raw address.
    const ip = req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-real-ip") ||
      req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    const digestBytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ip));
    const ip_digest = Array.from(new Uint8Array(digestBytes)).map((b) => b.toString(16).padStart(2, "0")).join("");
    const lastHour = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count, error: countError } = await db.from("ranisa_enquiry_attempts")
      .select("id", { count: "exact", head: true })
      .eq("ip_digest", ip_digest).gte("created_at", lastHour);
    if (countError) throw countError;
    if ((count || 0) >= 4) return respond(429, { error: "Too many enquiries. Please try again later or call the boutique." });
    const { error: limitError } = await db.from("ranisa_enquiry_attempts").insert({ ip_digest });
    if (limitError) throw limitError;

    const id = crypto.randomUUID();
    const paths: string[] = [];
    try {
      for (const file of files as File[]) {
        const path = `${id}/${crypto.randomUUID()}.${TYPES[file.type]}`;
        const { error } = await db.storage.from(BUCKET).upload(path, file, {
          contentType: file.type,
          upsert: false,
        });
        if (error) throw error;
        paths.push(path);
      }
      const { error } = await db.from("ranisa_enquiries").insert({
        id, customer_name, requested_style, description, reference_paths: paths,
      });
      if (error) throw error;
    } catch (error) {
      if (paths.length) await db.storage.from(BUCKET).remove(paths);
      throw error;
    }
    return respond(201, { enquiryId: id, imageCount: paths.length });
  } catch (error) {
    console.error("Ranisa enquiry failed:", error);
    return respond(500, { error: "We could not save your enquiry. Please try again." });
  }
});
