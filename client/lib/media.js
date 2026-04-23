const FALLBACK_API_URL = 'http://localhost:5000/api';

export function getApiOrigin(apiUrl = process.env.NEXT_PUBLIC_API_URL || FALLBACK_API_URL) {
  try {
    return new URL(apiUrl).origin;
  } catch (_) {
    return '';
  }
}

export function resolveMediaUrl(url) {
  if (!url) return url;
  if (/^(?:[a-z]+:)?\/\//i.test(url) || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  if (!url.startsWith('/')) return url;

  const origin = getApiOrigin();
  return origin ? `${origin}${url}` : url;
}
