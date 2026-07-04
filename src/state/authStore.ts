// Token JWT en memoria (variable de módulo), NUNCA en localStorage sin
// protección. Se pierde al refrescar la página — trade-off de seguridad vs.
// persistencia acordado para Secuence (ver README). Sin React: cualquier
// script del sitio puede importar esto y llamar a las funciones directo.
let token: string | null = null;

export function getToken(): string | null {
  return token;
}

export function setToken(newToken: string): void {
  token = newToken;
}

export function isAuthenticated(): boolean {
  return token !== null;
}

export function logout(): void {
  token = null;
}
