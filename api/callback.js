import { createHmac, timingSafeEqual } from 'node:crypto';

function parseCookies(header) {
  const out = {};
  if (!header) return out;
  for (const pair of header.split(';')) {
    const idx = pair.indexOf('=');
    if (idx < 0) continue;
    const k = pair.slice(0, idx).trim();
    const v = pair.slice(idx + 1).trim();
    if (k) out[k] = v;
  }
  return out;
}

function verifyState(state, cookieState, secret) {
  if (!state || !cookieState || state !== cookieState) return false;
  const dot = state.indexOf('.');
  if (dot < 0) return false;
  const nonce = state.slice(0, dot);
  const sig = state.slice(dot + 1);
  const expected = createHmac('sha256', secret).update(nonce).digest('hex');
  const a = Buffer.from(sig, 'hex');
  const b = Buffer.from(expected, 'hex');
  if (a.length !== b.length || a.length === 0) return false;
  return timingSafeEqual(a, b);
}

export default async function handler(req, res) {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  const clientSecret = process.env.OAUTH_GITHUB_CLIENT_SECRET;
  const stateSecret = process.env.OAUTH_STATE_SECRET;
  if (!clientId || !clientSecret || !stateSecret) {
    res.status(500).send('OAUTH_GITHUB_CLIENT_ID / OAUTH_GITHUB_CLIENT_SECRET / OAUTH_STATE_SECRET not all set.');
    return;
  }

  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const origin = `${proto}://${host}`;

  const clearCookie = 'oauth_state=; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=0';

  const cookies = parseCookies(req.headers.cookie);
  const stateFromQuery = req.query?.state;
  const stateFromCookie = cookies.oauth_state;

  let status = 'error';
  let content = { error: 'missing_code' };

  if (!verifyState(stateFromQuery, stateFromCookie, stateSecret)) {
    content = { error: 'invalid_state' };
  } else {
    const code = req.query?.code;
    if (code) {
      try {
        const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
          method: 'POST',
          headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
        });
        const data = await tokenRes.json();
        if (data.access_token) {
          status = 'success';
          content = { token: data.access_token, provider: 'github' };
        } else {
          content = { error: 'no_access_token', details: data };
        }
      } catch (err) {
        content = { error: 'exchange_failed', message: String(err) };
      }
    }
  }

  const html = `<!DOCTYPE html>
<html><body><script>
(function() {
  var payload = ${JSON.stringify({ status, content })};
  var allowedOrigin = ${JSON.stringify(origin)};
  function receive(e) {
    if (e.origin !== allowedOrigin) return;
    var msg = 'authorization:github:' + payload.status + ':' + JSON.stringify(payload.content);
    window.opener.postMessage(msg, allowedOrigin);
    window.removeEventListener('message', receive);
    window.close();
  }
  window.addEventListener('message', receive, false);
  if (window.opener) window.opener.postMessage('authorizing:github', '*');
})();
</script></body></html>`;

  res.setHeader('Set-Cookie', clearCookie);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(html);
}
