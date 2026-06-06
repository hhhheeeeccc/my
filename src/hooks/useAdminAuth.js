import { useState, useEffect, useCallback } from 'react';
import { checkAdminAuth, setAuthSession, getAuthSession } from '../utils/auth';

export const useAdminAuth = (t) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  useEffect(() => { if (getAuthSession()) setIsAuthenticated(true); }, []);

  const handleLogin = useCallback((e) => {
    e.preventDefault();
    if (checkAdminAuth(loginData.username, loginData.password)) {
      setIsAuthenticated(true);
      setAuthSession(true);
    } else {
      setLoginError(t('admin.error'));
    }
  }, [loginData, t]);

  return { isAuthenticated, loginData, setLoginData, loginError, handleLogin };
};
