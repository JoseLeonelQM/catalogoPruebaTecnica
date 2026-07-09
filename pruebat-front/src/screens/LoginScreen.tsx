import { useState } from 'react';
import { AxiosError } from 'axios';
import API from '../services/api';
import type { LoginResponse, User } from '../types/auth';

interface LoginScreenProps {
  onLogin: (token: string, user: User) => void;
}

export default function LoginScreen({
  onLogin,
}: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      const response =
        await API.post<LoginResponse>(
          '/auth/login',
          {
            email,
            password,
          }
        );

      onLogin(
        response.data.token,
        response.data.user
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        const axiosError =
          err as AxiosError<{
            message?: string;
          }>;

        setError(
          axiosError.response?.data?.message ??
            'No se pudo iniciar sesión.'
        );
      } else {
        setError(
          'Ocurrió un error inesperado.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-2">
          Catálogo XYZ
        </h1>

        <p className="text-center text-gray-500 text-sm mb-8">
          Inicia sesión para continuar
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div>
            <label className="block text-sm font-medium mb-1">
              Correo electrónico
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="admin@gmail.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Contraseña
            </label>

            <input
              type="password"
              required
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="********"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2 font-medium transition disabled:bg-indigo-300"
          >
            {loading
              ? 'Iniciando sesión...'
              : 'Iniciar sesión'}
          </button>

        </form>

        {error && (
          <div className="mt-5 rounded-lg bg-red-100 p-3 text-sm text-red-700">
            ❌ {error}
          </div>
        )}

        <div className="mt-8 border-t pt-4 text-xs text-gray-500">

          <p className="font-semibold mb-2">
            Usuarios de prueba
          </p>

          <p>
            <strong>Administrador</strong>
          </p>

          <p>admin@gmail.com</p>

          <p className="mb-3">
            admin123*
          </p>

          <p>
            <strong>Usuario</strong>
          </p>

          <p>user@gmail.com</p>

          <p>user123*</p>

        </div>

      </div>
    </div>
  );
}