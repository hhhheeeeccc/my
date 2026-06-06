export const checkAdminAuth = (username, password) => {
  return username === 'marwan' && password === '736187483';
};

export const setAuthSession = (isAuthenticated) => {
  globalThis.sessionStorage?.setItem('admin_auth', isAuthenticated ? 'true' : 'false');
};

export const getAuthSession = () => {
  return globalThis.sessionStorage?.getItem('admin_auth') === 'true';
};
