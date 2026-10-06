import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const source = readFileSync(new URL('../app/api/customer-auth/route.ts', import.meta.url), 'utf8').replace('import { env } from "cloudflare:workers";', 'const env = { SUPABASE_URL: "https://test.supabase.co", SUPABASE_PUBLISHABLE_KEY: "test-publishable-key" };');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
const { GET, POST } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
const originalFetch = globalThis.fetch;
after(() => { globalThis.fetch = originalFetch; });
const origin = 'https://ranisa.example';
const user = { id: 'customer-1', email: 'customer@example.com' };
const session = { access_token: 'access-secret', refresh_token: 'refresh-secret', expires_in: 3600, user };
function request(body, extra = {}) { return new Request(`${origin}/api/customer-auth`, { method: 'POST', headers: { origin, 'content-type': 'application/json', ...extra }, body: JSON.stringify(body) }); }
function mock(responses) {
 const calls = [];
 globalThis.fetch = async (url, init) => { calls.push({ url, ...init }); const next = responses.shift(); assert.ok(next, 'unexpected upstream request'); return Response.json(next.body, { status: next.status || 200 }); };
 return calls;
}
test('rejects cross-origin requests and invalid emails without contacting Supabase', async () => {
 const calls = mock([]);
 assert.equal((await POST(request({ action: 'send', email: 'customer@example.com', mode: 'signup' }, { origin: 'https://other.example' }))).status, 403);
 assert.equal((await POST(request({ action: 'send', email: 'invalid', mode: 'signup' }))).status, 400);
 assert.equal(calls.length, 0);
});
test('signup permits new accounts, signin does not create accounts', async () => {
 const calls = mock([{ body: {} }, { body: {} }]);
 for (const mode of ['signup', 'signin']) assert.equal((await POST(request({ action: 'send', email: ' CUSTOMER@example.com ', mode }))).status, 200);
 assert.deepEqual(JSON.parse(calls[0].body), { email: 'customer@example.com', create_user: true });
 assert.equal(JSON.parse(calls[1].body).create_user, false);
});
test('invalid codes never create a session, rate limits are retained', async () => {
 mock([{ status: 403, body: {} }, { status: 429, body: {} }]);
 const invalid = await POST(request({ action: 'verify', email: user.email, token: '123456' }));
 assert.equal(invalid.status, 400); assert.equal(invalid.headers.get('set-cookie'), null);
 assert.equal((await POST(request({ action: 'send', email: user.email, mode: 'signin' }))).status, 429);
});
test('verified sessions use secure HttpOnly cookies and do not expose tokens', async () => {
 const calls = mock([{ body: session }]);
 const result = await POST(request({ action: 'verify', email: user.email, token: '123456' }));
 assert.deepEqual(await result.json(), { user });
 assert.deepEqual(JSON.parse(calls[0].body), { email: user.email, token: '123456', type: 'email' });
 const cookies = result.headers.getSetCookie(); assert.equal(cookies.length, 2);
 for (const cookie of cookies) { assert.match(cookie, /HttpOnly/); assert.match(cookie, /SameSite=Lax/); assert.match(cookie, /Secure/); }
 assert.match(result.headers.get('cache-control'), /no-store/);
});
test('session restoration validates the user upstream and refreshes expired access', async () => {
 const calls = mock([{ status: 401, body: {} }, { body: session }]);
 const result = await GET(new Request(`${origin}/api/customer-auth`, { headers: { cookie: 'ranisa_customer_access=expired; ranisa_customer_refresh=refresh-secret' } }));
 assert.deepEqual(await result.json(), { user });
 assert.match(calls[0].url, /\/user$/); assert.match(calls[1].url, /grant_type=refresh_token/);
 assert.equal(result.headers.getSetCookie().length, 2);
});
test('signout revokes the local Supabase session and clears both customer cookies', async () => {
 const calls = mock([{ body: session }, { body: {} }]);
 const result = await POST(request({ action: 'signout' }, { cookie: 'ranisa_customer_refresh=refresh-secret' }));
 assert.match(calls[1].url, /logout\?scope=local/);
 assert.equal(calls[1].headers.Authorization, 'Bearer access-secret');
 assert.deepEqual(await result.json(), { user: null });
 for (const cookie of result.headers.getSetCookie()) assert.match(cookie, /Max-Age=0/);
});
test('anonymous sessions require no upstream call; outages preserve refresh cookies', async () => {
 const calls = mock([]);
 assert.deepEqual(await (await GET(new Request(`${origin}/api/customer-auth`))).json(), { user: null });
 assert.equal(calls.length, 0);
 mock([{ status: 503, body: {} }]);
 const result = await GET(new Request(`${origin}/api/customer-auth`, { headers: { cookie: 'ranisa_customer_refresh=refresh-secret' } }));
 assert.equal(result.status, 503); assert.equal(result.headers.get('set-cookie'), null);
});
