import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api, tokenStore } from './api';

// ── Context ───────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

/**
 * AuthProvider — wraps the entire app and provides auth state to all components.
 *
 * State:
 *  - user    : { id, email } or null
 *  - profile : full profile object or null
 *  - isLoading : true while the initial session restore is happening
 *
 * Actions:
 *  - login(email, password)
 *  - register(data)
 *  - logout()
 *  - refreshProfile()
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // true until session restore completes

  // ── Session restore on mount ────────────────────────────────────────────────
  // Use /api/auth/me (fast — validates access token; if expired, apiFetch will
  // silently try the refresh cookie before giving up).
  const restoreSession = useCallback(async () => {
    // Only attempt if there's a local access token or a potential refresh cookie.
    // We always attempt because the refresh cookie is httpOnly (unreadable by JS).
    setIsLoading(true);
    try {
      const data = await api.auth.me();
      if (data) {
        setUser({ id: data.id, email: data.email });
        setProfile(data);
      } else {
        setUser(null);
        setProfile(null);
      }
    } catch {
      setUser(null);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  // ── Listen for forced logout (e.g. refresh token also expired) ──────────────
  useEffect(() => {
    const handleForceLogout = () => {
      setUser(null);
      setProfile(null);
    };
    window.addEventListener('auth:logout', handleForceLogout);
    return () => window.removeEventListener('auth:logout', handleForceLogout);
  }, []);

  // ── Actions ─────────────────────────────────────────────────────────────────

  const login = async (email, password) => {
    const data = await api.auth.login(email, password);
    setUser({ id: data.user.id, email: data.user.email });
    setProfile(data.user);
    return data;
  };

  const register = async (registerData) => {
    const data = await api.auth.register(registerData);
    setUser({ id: data.user.id, email: data.user.email });
    setProfile(data.user);
    return data;
  };

  const logout = async () => {
    await api.auth.logout();
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = useCallback(async () => {
    try {
      const data = await api.profile.get();
      if (data) {
        setProfile(data);
        setUser({ id: data.id, email: data.email });
      }
    } catch (err) {
      console.error('Failed to refresh profile:', err);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, profile, isLoading, login, register, logout, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth — hook to consume the AuthContext.
 * Must be used inside <AuthProvider>.
 */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
