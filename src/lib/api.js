// On localhost the Vite dev-proxy forwards /api → http://localhost:5000.
// On any other host (e.g. a phone on the same Wi-Fi) the proxy is not involved,
// so we build the backend URL explicitly using the current hostname + port 5000.
const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? '/api'
    : `http://${window.location.hostname}:5000/api`;

// ── TOKEN STORAGE ─────────────────────────────────────────────────────────────
// Access token lives in sessionStorage (cleared on tab close, isolated per tab).
// Refresh token lives as an httpOnly cookie managed entirely by the server.

export const tokenStore = {
  get: () => sessionStorage.getItem('sst_token'),
  set: (token) => sessionStorage.setItem('sst_token', token),
  clear: () => sessionStorage.removeItem('sst_token'),
};

// ── AUTH HEADERS ──────────────────────────────────────────────────────────────
const getHeaders = (extra = {}) => {
  const token = tokenStore.get();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
};

// ── SILENT REFRESH STATE ──────────────────────────────────────────────────────
// We track an in-flight refresh promise so multiple concurrent 401/403 responses
// all wait for the same single refresh request rather than firing several.
let _refreshPromise = null;

const silentRefresh = async () => {
  if (_refreshPromise) return _refreshPromise;

  _refreshPromise = fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include', // send the httpOnly refresh cookie
  })
    .then(async (res) => {
      if (!res.ok) throw new Error('Refresh failed');
      const { token } = await res.json();
      tokenStore.set(token);
      return token;
    })
    .finally(() => {
      _refreshPromise = null;
    });

  return _refreshPromise;
};

// ── CENTRAL FETCH WRAPPER ─────────────────────────────────────────────────────
/**
 * apiFetch — drop-in replacement for fetch() that:
 *  1. Attaches Authorization header automatically
 *  2. On 401/403, attempts one silent token refresh then retries
 *  3. On refresh failure, fires 'auth:logout' event and throws
 */
const apiFetch = async (url, options = {}, _isRetry = false) => {
  const res = await fetch(url, {
    ...options,
    credentials: 'include', // always include cookies (refresh token)
    headers: {
      ...getHeaders(),
      ...(options.headers || {}),
    },
  });

  // If unauthorised and this isn't already a retry, attempt silent refresh
  if ((res.status === 401 || res.status === 403) && !_isRetry) {
    try {
      await silentRefresh();
      // Retry the original request once with the new access token
      return apiFetch(url, options, true);
    } catch {
      // Refresh failed — force logout everywhere
      tokenStore.clear();
      window.dispatchEvent(new Event('auth:logout'));
      throw new Error('Session expirée. Veuillez vous reconnecter.');
    }
  }

  return res;
};

// ── API SURFACE ───────────────────────────────────────────────────────────────
export const api = {
  auth: {
    register: async (data) => {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Registration failed');
      tokenStore.set(json.token);
      return json;
    },

    login: async (email, password) => {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Login failed');
      tokenStore.set(json.token);
      return json;
    },

    logout: async () => {
      try {
        // Tell the server to revoke the refresh token in DB
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          credentials: 'include',
        });
      } catch {
        // Network error — still clear the local token
      }
      tokenStore.clear();
    },

    /** Fast session restore — decodes the access token and returns user info.
     *  Falls back to silent refresh if the access token is expired. */
    me: async () => {
      const res = await apiFetch(`${API_BASE_URL}/auth/me`);
      if (!res.ok) return null;
      return res.json();
    },
  },

  profile: {
    get: async () => {
      const res = await apiFetch(`${API_BASE_URL}/profile`);
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || 'Failed to fetch profile');
      }
      return res.json();
    },

    update: async (data) => {
      const res = await apiFetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to update profile');
      return json;
    },
  },

  quiz: {
    getQuestions: async () => {
      const res = await apiFetch(`${API_BASE_URL}/questions`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to fetch questions');
      return json;
    },

    saveResult: async (data) => {
      const res = await apiFetch(`${API_BASE_URL}/quiz-results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to save quiz result');
      return json;
    },

    getResults: async () => {
      const res = await apiFetch(`${API_BASE_URL}/quiz-results`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to fetch quiz results');
      return json;
    },
  },

  chat: {
    sendMessage: async (message, history) => {
      const res = await apiFetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to send message');
      return json;
    },
  },
};
