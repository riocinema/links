export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response("Missing GitHub code", { status: 400 });
  }

  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "User-Agent": "rio-links-cms"
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code
    })
  });

  const tokenData = await tokenResponse.json();

  if (!tokenData.access_token) {
    return new Response(JSON.stringify(tokenData, null, 2), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  const message = `authorization:github:success:${JSON.stringify({
    token: tokenData.access_token,
    provider: "github"
  })}`;

  return new Response(`
    <!doctype html>
    <html>
      <body>
        <script>
          if (window.opener) {
            window.opener.postMessage(${JSON.stringify(message)}, "*");
            window.close();
          } else {
            document.body.innerText = "Authentication complete. You can close this window.";
          }
        </script>
      </body>
    </html>
  `, {
    headers: { "Content-Type": "text/html" }
  });
}
