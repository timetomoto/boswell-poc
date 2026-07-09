import { randomBytes, createHmac } from 'node:crypto';

export default function handler(req, res) {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  const stateSecret = process.env.OAUTH_STATE_SECRET;
  if (!clientId) {
    res.status(500).send('OAUTH_GITHUB_CLIENT_ID is not set on this deployment.');
    return;
  }
  if (!stateSecret) {
    res.status(500).send('OAUTH_STATE_SECRET is not set on this deployment.');
    return;
  }

  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const redirectUri = `${proto}://${host}/api/callback`;

  const nonce = randomBytes(24).toString('hex');
  const sig = createHmac('sha256', stateSecret).update(nonce).digest('hex');
  const state = `${nonce}.${sig}`;

  const cookie = [
    `oauth_state=${state}`,
    'Path=/api',
    'HttpOnly',
    'Secure',
    'SameSite=Lax',
    'Max-Age=600',
  ].join('; ');

  const url = new URL('https://github.com/login/oauth/authorize');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('scope', 'repo,user');
  url.searchParams.set('state', state);

  res.setHeader('Set-Cookie', cookie);
  res.setHeader('Location', url.toString());
  res.status(302).end();
}
