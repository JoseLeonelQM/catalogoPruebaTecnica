import { useState } from 'react';
import { AxiosError } from 'axios';
import API from '../services/api';
import type { LoginResponse, User } from '../types/auth';

interface LoginScreenProps {
  onLogin: (token: string, user: User) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await API.post<LoginResponse>('/auth/login', {
        email,
        password,
      });

      onLogin(response.data.token, response.data.user);
    } catch (err: unknown) {
      if (err instanceof Error) {
        const axiosError = err as AxiosError<{ message?: string }>;
        setError(
          axiosError.response?.data?.message ?? 'No se pudo iniciar sesión.'
        );
      } else {
        setError('Ocurrió un error inesperado.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-(--color-bg) text-(--color-text) transition-colors duration-300 p-4">
      {/* Añadida la clase .card (que maneja el fondo de la superficie y bordes según el tema), 
        y la clase .animate-fade para una bonita animación de entrada.
      */}
      <div className="card animate-fade p-8 w-full max-w-md border border-(--color-border)">
        <h1 className="text-3xl font-bold text-center text-(--color-primary) mb-2">
          Catálogo XYZ
        </h1>

        <p className="text-center text-(--color-text-secondary) text-sm mb-8">
          Inicia sesión para continuar
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1 text-(--color-text)">
              Correo electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              // Limpiadas las clases de foco nativas de Tailwind para usar tu enfoque CSS global
              className="w-full bg-(--color-surface) border border-(--color-border) text-(--color-text) rounded-lg p-2.5 placeholder-(--color-text-secondary)/50"
              placeholder="admin@gmail.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-(--color-text)">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-(--color-surface) border border-(--color-border) text-(--color-text) rounded-lg p-2.5 placeholder-(--color-text-secondary)/50"
              placeholder="********"
            />
          </div>

          {/* Implementada tu clase .btn combinada con tus variables de color.
            Maneja nativamente el efecto hover de elevación y el scale activo.
          */}
          <button
            type="submit"
            disabled={loading}
            className="btn w-full bg-(--color-primary) hover:bg-(--color-primary-hover) text-white font-medium rounded-lg py-2.5 disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>

        {error && (
          // Usando tus colores semánticos de peligro/error dinámicos
          <div className="mt-5 rounded-lg border border-(--color-danger)/20 bg-(--color-danger)/10 p-3 text-sm text-(--color-danger) animate-scale">
            ❌ {error}
          </div>
        )}

        {/* Sección de credenciales adaptada a modo oscuro/claro */}
        <div className="mt-8 border-t border-(--color-border) pt-4 text-xs text-(--color-text-secondary)">
          <p className="font-semibold mb-2 text-(--color-text)">
            Usuarios de prueba
          </p>
          <div className="grid grid-cols-2 gap-2 bg-(--color-bg) p-3 rounded-lg border border-(--color-border)/50">
            <div>
              <p className="font-semibold text-(--color-text)">Administrador</p>
              <p className="opacity-80">admin@gmail.com</p>
              <p className="font-mono opacity-80">admin123*</p>
            </div>
            <div>
              <p className="font-semibold text-(--color-text)">Usuario</p>
              <p className="opacity-80">user@gmail.com</p>
              <p className="font-mono opacity-80">user123*</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}