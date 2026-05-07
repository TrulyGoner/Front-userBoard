export interface JWTPayload {
  sub?: string;
  id?: string;
  exp?: number;
  iat?: number;
  nickname?: string;
  email?: string;
  role?: string;
}

export const decodeToken = (token: string): JWTPayload | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const decoded = JSON.parse(atob(parts[1]));
    return decoded as JWTPayload;
  } catch {
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const payload = decodeToken(token);
  if (!payload?.exp) return false;

  const expirationTime = payload.exp * 1000;
  const currentTime = Date.now();

  return currentTime > expirationTime;
};

export const getTokenExpirationTime = (token: string): number | null => {
  const payload = decodeToken(token);
  if (!payload?.exp) return null;

  const expirationTime = payload.exp * 1000;
  const currentTime = Date.now();
  const remaining = expirationTime - currentTime;

  return remaining > 0 ? remaining : 0;
};

export const isTokenValid = (token: string): boolean => {
  if (!token) return false;
  const payload = decodeToken(token);
  if (!payload) return false;
  return !isTokenExpired(token);
};
