export function apiUrl(path) {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:5001';
  const cleanBase = base.replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}