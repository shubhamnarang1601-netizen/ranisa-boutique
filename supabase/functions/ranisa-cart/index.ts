import { createRemoteJWKSet, jwtVerify } from 'npm:jose@5.9.6';

const origin = 'https://ranisa-boutique-dehradun.shubhamnarang1601.chatgpt.site';
const appId = 'CTST8DZ1XN4CDP5DKR4O';
const jwks = createRemoteJWKSet(new URL('https://otpless.com/.well-known/jwks'));
const headers = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
  'Access-Control-Allow-Origin': origin,
  'Access-Control-Allow-Headers': 'content-type, apikey',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  Vary: 'Origin',
};
const result = (data: unknown, status = 200) => new Response(status === 204 ? null : JSON.stringify(data), { status, headers });

async function database(path: string, method = 'GET', body?: object, prefer?: string) {
  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) throw new Error('The cart service is unavailable.');
  const response = await fetch(`${url}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(prefer ? { Prefer: prefer } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!response.ok) throw new Error('The cart could not be updated. Please try again.');
  return method === 'GET' ? response.json() : null;
}

Deno.serve(async request => {
  if (request.headers.get('origin') !== origin) return result({ error: 'Origin is not allowed.' }, 403);
  if (request.method === 'OPTIONS') return result({}, 204);
  if (request.method !== 'POST') return result({ error: 'Method is not allowed.' }, 405);
  let input: Record<string, unknown>;
  try { input = await request.json(); }
  catch { return result({ error: 'Invalid request.' }, 400); }
  if (typeof input.idToken !== 'string' || input.idToken.length > 10000) return result({ error: 'Please sign in with Google.' }, 401);
  let userKey: string;
  try {
    const { payload } = await jwtVerify(input.idToken, jwks, {
      issuer: 'https://otpless.com',
      audience: appId,
      algorithms: ['RS256'],
      clockTolerance: 30,
    });
    if (typeof payload.sub !== 'string' || !payload.sub || payload.sub.length > 200 ||
      typeof payload.email !== 'string' || !payload.email ||
      payload.email_verified === false || payload.email_verified === 'false') throw new Error('No verified email');
    userKey = payload.sub;
  } catch { return result({ error: 'Your sign-in expired. Please sign in again.' }, 401); }
  const encodedUser = encodeURIComponent(userKey);
  try {
    if (input.action === 'list') {
      const items = await database(`ranisa_cart_items?select=product_id,quantity&user_key=eq.${encodedUser}&order=updated_at.desc`);
      return result({ items });
    }
    if (input.action !== 'set' && input.action !== 'remove') return result({ error: 'Unknown cart action.' }, 400);
    if (!Number.isSafeInteger(input.productId) || Number(input.productId) < 0) return result({ error: 'Choose a valid style.' }, 400);
    const productId = Number(input.productId);
    const filter = `ranisa_cart_items?user_key=eq.${encodedUser}&product_id=eq.${productId}`;
    if (input.action === 'remove') {
      await database(filter, 'DELETE');
    } else {
      if (!Number.isInteger(input.quantity) || Number(input.quantity) < 1 || Number(input.quantity) > 20)
        return result({ error: 'Choose a quantity between 1 and 20.' }, 400);
      const available = await database(`ranisa_products?select=id&id=eq.${productId}&is_active=eq.true&limit=1`);
      if (!available?.length) return result({ error: 'This style is unavailable.' }, 404);
      await database('ranisa_cart_items?on_conflict=user_key,product_id', 'POST', {
        user_key: userKey, product_id: productId, quantity: Number(input.quantity), updated_at: new Date().toISOString(),
      }, 'resolution=merge-duplicates,return=minimal');
    }
    const items = await database(`ranisa_cart_items?select=product_id,quantity&user_key=eq.${encodedUser}&order=updated_at.desc`);
    return result({ items });
  } catch (error) {
    return result({ error: error instanceof Error ? error.message : 'The cart is unavailable.' }, 503);
  }
});
