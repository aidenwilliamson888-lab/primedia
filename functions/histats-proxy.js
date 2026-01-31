export async function onRequestGet(context) {
    const { request } = context;
    const ua = request.headers.get("user-agent") || "";

    // User-Agent resmi Facebook
    const facebookBots = [
        "facebookexternalhit",
        "Facebot",
        "AdsBot-Facebook"
    ];

    // Jika request dari Menlo Park → blok
    if (facebookBots.some(agent => ua.includes(agent))) {
        return new Response("", { status: 204 });
    }

    // Visitor normal → fetch Histats JS
    const histatsURL = 'https://s10.histats.com/js15_as.js';
    const response = await fetch(histatsURL, { headers: request.headers });
    let body = await response.text();

    // Ganti ID Histats dengan 5005916
    body = body.replace(/1,\d+,\d+,\d+,\d+,\d+,\d+/,
                        '1,5005916,4,0,0,0,00000000');

    return new Response(body, {
        status: 200,
        headers: { 'Content-Type': 'application/javascript' }
    });
}
