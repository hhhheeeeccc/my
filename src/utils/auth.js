export const checkAdminAuth = (username, password) => {
  return username === (import.meta.env.VITE_ADMIN_USER || '') && password === (import.meta.env.VITE_ADMIN_PASS || '');
};

export const setAuthSession = (isAuthenticated) => {
  const expires = Date.now() + 2 * 60 * 60 * 1000; // 2 hours
  globalThis.sessionStorage?.setItem('admin_auth', isAuthenticated ? JSON.stringify({ auth: true, exp: expires }) : 'false');
};

export const getAuthSession = () => {
  try {
    const raw = globalThis.sessionStorage?.getItem('admin_auth');
    if (raw === 'false' || !raw) return false;
    const data = JSON.parse(raw);
    if (!data.auth || !data.exp) return false;
    if (Date.now() > data.exp) {
      globalThis.sessionStorage?.removeItem('admin_auth');
      return false;
    }
    return true;
  } catch {
    return false;
  }
};