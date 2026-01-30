export async function onRequest({ params, request }) {
  const TMDB_API_KEY = '3ed72f657ce5c5779383b2191d6d0111';
  const SITE_NAME = 'NextflixHD';
  const BASE_URL = new URL(request.url).origin;

  const movieId = params.id;

  // Ignore non-numeric routes (css/js/images)
  if (!/^\d+$/.test(movieId)) {
    return fetch(request);
  }

  let title = `Watch Movie - ${SITE_NAME}`;
  let description = `Watch movies online in HD quality on ${SITE_NAME}`;
  let image = `${BASE_URL}/default-og.jpg`;

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}`
    );

    if (res.ok) {
      const movie = await res.json();
      const year = movie.release_date?.slice(0, 4) || '';

      title = `${movie.title}${year ? ` (${year})` : ''} - ${SITE_NAME}`;
      description =
        movie.overview ||
        `Watch ${movie.title} online in HD quality on ${SITE_NAME}.`;

      if (movie.backdrop_path) {
        image = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
      } else if (movie.poster_path) {
        image = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
      }
    }
  } catch (e) {}

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${title}</title>

<meta property="og:type" content="video.movie">
<meta property="og:site_name" content="${SITE_NAME}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${image}">
<meta property="og:url" content="${request.url}">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="${image}">
</head>
<body>
<script>
location.replace("/index.html#${movieId}");
</script>
</body>
</html>`;

  return new Response(html, {
    headers: { "content-type": "text/html; charset=UTF-8" }
  });
}
