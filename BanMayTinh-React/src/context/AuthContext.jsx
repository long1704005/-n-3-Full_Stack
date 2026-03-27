import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

const STORAGE_TOKEN = 'accessToken';
const STORAGE_USER = 'user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_USER);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_TOKEN));
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (userNameOrEmail, password) => {
    setLoading(true);
    try {
      const { data } = await authApi.login(userNameOrEmail, password);
      const t = data.token;
      const u = {
        id: data.id,
        userName: data.userName,
        email: data.email,
        fullName: data.fullName,
        role: data.role,
      };
      localStorage.setItem(STORAGE_TOKEN, t);
      localStorage.setItem(STORAGE_USER, JSON.stringify(u));
      setToken(t);
      setUser(u);
      return { ok: true };
    } catch (e) {
      const msg =
        e.response?.data?.message ||
        e.response?.data ||
        e.message ||
        'Đăng nhập thất bại';
      return { ok: false, error: typeof msg === 'string' ? msg : 'Lỗi đăng nhập' };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_TOKEN);
    localStorage.removeItem(STORAGE_USER);
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const onLogout = () => logout();
    window.addEventListener('auth:logout', onLogout);
    return () => window.removeEventListener('auth:logout', onLogout);
  }, [logout]);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      logout,
      isAuthenticated: !!token && !!user,
      isAdmin: user?.role === 'Admin',
    }),
    [user, token, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
