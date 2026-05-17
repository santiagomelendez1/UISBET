import { createContext, useMemo, useState } from 'react';

export const AuthContext = createContext();

/**
 * Contexto global del login.
 */
export function AuthProvider({ children }) {
  /* Guarda token y usuario autenticado. */
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  /* Indica si hay sesión iniciada. */
  const isLoggedIn = Boolean(token && user);

  /* Guarda datos del login. */
  const login = (authData) => {
    setToken(authData.token);
    setUser(authData.user);
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', JSON.stringify(authData.user));
  };

  /* Cierra sesión. */
  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = useMemo(
    () => ({ isLoggedIn, user, token, login, logout }),
    [isLoggedIn, user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}