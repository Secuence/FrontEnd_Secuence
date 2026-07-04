import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserService } from '@/services/UserService';
import { useAuth } from '@/hooks/useAuth';

// Ejemplo de integración: cuando llegue el diseño real de Login desde Claude
// Design, el formulario visual va en src/ui/pages/LoginPage.tsx y este archivo
// solo cambia el <form> de abajo por ese componente, manteniendo la lógica.
export function LoginPage() {
  const navigate = useNavigate();
  const setToken = useAuth((state) => state.setToken);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { token } = await UserService.login({ email, password });
      setToken(token);
      navigate('/dashboard');
    } catch {
      setError('Credenciales inválidas. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-lg bg-white p-8 shadow">
        <h1 className="mb-6 text-xl font-semibold text-gray-900">Iniciar sesión</h1>
        <label className="mb-1 block text-sm text-gray-700" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mb-4 w-full rounded border border-gray-300 px-3 py-2"
        />
        <label className="mb-1 block text-sm text-gray-700" htmlFor="password">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mb-4 w-full rounded border border-gray-300 px-3 py-2"
        />
        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-indigo-600 py-2 font-medium text-white disabled:opacity-50"
        >
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
}
