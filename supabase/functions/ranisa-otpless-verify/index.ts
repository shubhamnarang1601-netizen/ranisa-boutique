import { createRemoteJWKSet, jwtVerify } from 'npm:jose@5.9.6';

const allowedOrigin = 'https://ranisa-boutique-dehradun.shubhamnarang1601.chatgpt.site';
// App IDs are public: OTPLESS uses this value as the signed token's audience.
const appId = 'CTST8DZ1XN4CDP5DKR4O';
const jwks = createRemoteJWKSet(new URL('https://otpless.com/.well-known/jwks'));

function response(body: object, status = 200, origin = allowedOrigin) {
  return new Response(status === 204 ? null : JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Headers': 'content-type, apikey',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      Vary: 'Origin',
    },
  });
}

Deno.serve(async (request) => {
  const origin = request.headers.get('origin');
  if (origin !== allowedOrigin) return response({ error: 'Origin is not allowed.' }, 403);
  if (request.method === 'OPTIONS') return response({}, 204);
  if (request.method !== 'POST') return response({ error: 'Method is not allowed.' }, 405);
  try {
    const { idToken } = await request.json();
    if (typeof idToken !== 'string' || idToken.length > 10000) throw new Error('Invalid token');
    const { payload } = await jwtVerify(idToken, jwks, {
      issuer: 'https://otpless.com',
      audience: appId,
      algorithms: ['RS256'],
      clockTolerance: 30,
    });
    const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : '';
    if (!email || payload.email_verified === false || payload.email_verified === 'false' || !payload.sub || !payload.exp) {
      throw new Error('A verified email is required');
    }
    return response({ email, subject: payload.sub, expiresAt: payload.exp });
  } catch {
    return response({ error: 'Your sign-in expired or could not be verified. Please sign in again.' }, 401);
  }
});
