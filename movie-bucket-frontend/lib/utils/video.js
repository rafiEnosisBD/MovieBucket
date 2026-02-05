function extractYouTubeId(url) {
  try {
    const u = new URL(url);
    if (u.hostname === 'youtu.be') return u.pathname.replace('/', '') || null;
    if (u.hostname.includes('youtube.com')) {
      const v = u.searchParams.get('v');
      if (v) return v;
      const parts = u.pathname.split('/').filter(Boolean);
      const embedIdx = parts.indexOf('embed');
      if (embedIdx >= 0 && parts[embedIdx + 1]) return parts[embedIdx + 1];
    }
    return null;
  } catch {
    return null;
  }
}

export function toEmbeddableVideoUrl(videoLink) {
  if (!videoLink) return null;
  const ytId = extractYouTubeId(videoLink);
  if (ytId) return `https://www.youtube.com/embed/${ytId}`;
  // Fallback: try to embed the provided link directly (may be blocked by the source).
  return videoLink;
}

