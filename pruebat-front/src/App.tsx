import { useState } from 'react';
import LoginScreen from './screens/LoginScreen';
import CatalogScreen from './screens/CatalogScreen';
import type { User } from './types/auth';

export default function App() {
  const [token, setToken] = useState(
    localStorage.getItem('token') || ''
  );

  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');

    return storedUser ? JSON.parse(storedUser) : null;
  });

  const handleLogin = (token: string, user: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    setToken(token);
    setUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setToken('');
    setUser(null);
  };

  if (!token || !user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <CatalogScreen
      user={user}
      onLogout={handleLogout}
    />
  );
}