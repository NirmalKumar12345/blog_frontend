export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const token = localStorage.getItem("token");
    if (!token) return false;
    const trimmed = token.trim();
    if (!trimmed) return false;

    // Try to decode as JWT and check exp claim. If it's not a JWT, assume present token means authenticated.
    const parts = trimmed.split('.');
    if (parts.length !== 3) return true;
    const payload = parts[1];
    // base64url -> base64
    const b64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(b64)
        .split('')
        .map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    const obj = JSON.parse(json);
    if (!obj.exp) return true;
    const expMs = obj.exp * 1000;
    return Date.now() < expMs;
  } catch (err) {
    return false;
  }
}
