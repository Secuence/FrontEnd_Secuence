// Token JWT en sessionStorage (no localStorage): sobrevive la navegación
// completa entre auth-flow.html e index.html (son páginas separadas, no una
// sola SPA, así que una variable en memoria se perdía en ese salto), pero
// se borra solo al cerrar la pestaña/ventana — nunca persiste entre
// sesiones nuevas del navegador como sí haría localStorage.
const STORAGE_KEY = 'sc.token';

export function getToken(): string | null {
  return sessionStorage.getItem(STORAGE_KEY);
}

export function setToken(newToken: string): void {
  sessionStorage.setItem(STORAGE_KEY, newToken);
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}

export function logout(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}

// Un JWT solo va firmado, no cifrado: decodificar el payload es una simple
// lectura (no requiere la clave secreta del backend, y no verifica la
// firma — solo se usa para mostrar datos en pantalla, nunca para decisiones
// de seguridad, esas las sigue validando el backend en cada request).
export function getTokenPayload(): Record<string, unknown> | null {
  const token = getToken();
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length < 2) return null;
  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join(''),
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// Confirmado por el usuario (2026-07-05): el nombre del usuario autenticado
// viene en el claim "name" del token.
export function getUserName(): string | null {
  const name = getTokenPayload()?.name;
  return typeof name === 'string' ? name : null;
}
