export default {
  async fetch(request, env, ctx) {
    const ua = request.headers.get("user-agent") || "";

    // User-Agent resmi Facebook
    const facebookBots = [
      "facebookexternalhit",
      "Facebot",
      "AdsBot-Facebook"
    ];

    // Jika request dari crawler Facebook → return 204
    if (facebookBots.some(agent => ua.includes(agent))) {
      return new Response("", { status: 204 });
    }

    // Fetch script Histats asli untuk user normal
    const histatsURL = 'https://s10.histats.com/js15_as.js';
    const response = await fetch(histatsURL, { headers: request.headers });
    let body = await response.text();

    // Ganti ID Histats dengan milik kamu: 5005916
    body = body.replace(/1,\d+,\d+,\d+,\d+,\d+,\d+/,
                        '1,5005916,4,0,0,0,00000000');

    return new Response(body, {
      status: 200,
      headers: { 'Content-Type': 'application/javascript' }
    });
  }
}
