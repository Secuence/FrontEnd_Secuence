import { create } from 'zustand';

// Token JWT en memoria de estado (Zustand), NUNCA en localStorage sin protección.
// Se pierde al refrescar la página: es el trade-off de seguridad vs. persistencia
// acordado para Secuence. Si más adelante se necesita persistencia, evaluar
// cookie httpOnly gestionada por el backend, no localStorage plano.
interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  token: null,
  isAuthenticated: false,
  setToken: (token) => set({ token, isAuthenticated: true }),
  logout: () => set({ token: null, isAuthenticated: false }),
}));
