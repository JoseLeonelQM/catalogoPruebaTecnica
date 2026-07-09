import { useState } from 'react';
import { AxiosError } from 'axios';
import API from '../services/api';
import type { LoginResponse, User } from '../types/auth';
import logoVertex from '../assets/VertexLogo.png'; 

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
      <div className="bg-(--color-surface) animate-fade p-8 w-full max-w-md border border-(--color-border) rounded-2xl shadow-xl flex flex-col items-center">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-(--color-primary) text-center leading-none">
          Prueba Técnica
        </h1>
        <p className="text-center text-(--color-text-secondary) text-sm font-medium tracking-tight mt-2.5 mb-8 opacity-90">
          Inicia sesión para continuar al catálogo
        </p>
        <div className="p-3 sm:p-4 rounded-xl transition-all duration-300 dark:bg-[#F8F9FA] dark:shadow-md dark:shadow-[#03070E]/30 flex items-center justify-center mb-10 select-none">
          <img 
            src={logoVertex} 
            alt="Logo Vertex" 
            className="h-12 w-auto sm:h-14 object-contain transition-transform hover:scale-105 duration-200"
          />
        </div>
        <form onSubmit={handleSubmit} className="space-y-5 w-full">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-(--color-text) opacity-80">
              Correo electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-(--color-bg) border border-(--color-border) text-(--color-text) rounded-xl p-3 text-sm placeholder-(--color-text-secondary)/40 focus:outline-none transition-all font-medium"
              placeholder="admin@gmail.com"
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-(--color-text) opacity-80">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-(--color-bg) border border-(--color-border) text-(--color-text) rounded-xl p-3 text-sm placeholder-(--color-text-secondary)/40 focus:outline-none transition-all font-medium"
              placeholder="********"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn w-full bg-(--color-primary) hover:bg-(--color-primary-hover) text-white font-black tracking-wide text-sm rounded-xl py-3.5 shadow-md disabled:opacity-50 disabled:pointer-events-none cursor-pointer mt-2 transition-all uppercase"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>
        {error && (
          <div className="w-full mt-5 rounded-xl border border-(--color-danger)/20 bg-(--color-danger)/10 p-3.5 text-sm font-semibold text-(--color-danger) animate-scale text-center">
            {error}
          </div>
        )}
        <div className="w-full mt-8 border-t border-(--color-border) pt-5 text-xs text-(--color-text-secondary)">
          <p className="font-black mb-3 text-(--color-text) uppercase tracking-widest text-[10px] text-center sm:text-left opacity-80">
            🔒 Usuarios de prueba
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-(--color-bg) p-3.5 rounded-xl border border-(--color-border)/60">
            <div className="text-center sm:text-left">
              <p className="font-black text-(--color-text) tracking-tight text-sm">Administrador</p>
              <p className="opacity-70 mt-0.5 font-medium">admin@gmail.com</p>
              <p className="font-mono text-(--color-primary) font-black mt-0.5 text-xs">admin123*</p>
            </div>
            <div className="border-t sm:border-t-0 sm:border-l border-(--color-border)/60 pt-2.5 sm:pt-0 sm:pl-3 text-center sm:text-left">
              <p className="font-black text-(--color-text) tracking-tight text-sm">Usuario</p>
              <p className="opacity-70 mt-0.5 font-medium">user@gmail.com</p>
              <p className="font-mono text-(--color-primary) font-black mt-0.5 text-xs">user123*</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}