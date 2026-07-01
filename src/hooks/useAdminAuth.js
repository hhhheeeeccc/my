import { useState, useEffect, useCallback, useRef } from 'react';
import { checkAdminAuth, setAuthSession, getAuthSession } from '../utils/auth';

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 5 * 60 * 1000; // 5 minutes

export const useAdminAuth = (t) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const attemptsRef = useRef(0);
  const lockUntilRef = useRef(0);

  useEffect(() => { if (getAuthSession()) setIsAuthenticated(true); }, []);

  const handleLogin = useCallback((e) => {
    e.preventDefault();
    const now = Date.now();

    if (now < lockUntilRef.current) {
      const remaining = Math.ceil((lockUntilRef.current - now) / 1000);
      setLoginError(t('admin.tooManyAttempts') || `Too many attempts. Try again in ${remaining}s.`);
      return;
    }

    if (attemptsRef.current >= MAX_ATTEMPTS) {
      lockUntilRef.current = now + LOCKOUT_MS;
      attemptsRef.current = 0;
      setLoginError(t('admin.tooManyAttempts') || `Too many attempts. Try again in 5 minutes.`);
      return;
    }

    if (checkAdminAuth(loginData.username, loginData.password)) {
      setIsAuthenticated(true);
      setAuthSession(true);
      setLoginError('');
      attemptsRef.current = 0;
    } else {
      attemptsRef.current += 1;
      setLoginError(t('admin.error'));
    }
  }, [loginData, t]);

  return { isAuthenticated, loginData, setLoginData, loginError, handleLogin };
};