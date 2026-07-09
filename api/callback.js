export default async function handler(req, res) {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  const clientSecret = process.env.OAUTH_GITHUB_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    res.status(500).send('OAUTH_GITHUB_CLIENT_ID / OAUTH_GITHUB_CLIENT_SECRET not set on this deployment.');
    return;
  }
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const origin = `${proto}://${host}`;
  const code = req.query?.code;

  let status = 'error';
  let content = { error: 'missing_code' };
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

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(html);
}
