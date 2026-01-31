export default {
  async fetch(request, env, ctx) {
    const ua = request.headers.get("user-agent") || "";
    const url = new URL(request.url);

    // List User-Agent resmi Facebook
    const facebookBots = [
      "facebookexternalhit",
      "Facebot",
      "AdsBot-Facebook"
    ];

    // Filter request ke Histats pixel
    if (url.pathname.includes("s10.histats.com") || url.pathname.includes("histats")) {
        if (facebookBots.some(agent => ua.includes(agent))) {
            // Block crawler untuk Histats
            return new Response("", { status: 204 });
        }
    }

    // Lanjutkan request normal
    return fetch(request);
  }
}
