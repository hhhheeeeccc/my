import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, KeyRound, X, ShieldCheck, AlertCircle } from 'lucide-react';

// NOTE: This is a client-side gate. The app has no backend, so credentials
// are checked in the browser. Only "marwan" / "736187483" can open the editor.
const ADMIN_USERNAME = 'marwan';
const ADMIN_CODE = '736187483';

const AdminLogin = ({ onClose, onSuccess }) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const firstInputRef = useRef(null);

  useEffect(() => {
    firstInputRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim().toLowerCase() === ADMIN_USERNAME && code.trim() === ADMIN_CODE) {
      setError(false);
      onSuccess();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: 'spring', damping: 22, stiffness: 260 }}
        style={shake ? { animation: 'admin-shake 0.5s ease' } : undefined}
        className="relative w-full max-w-md"
      >
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900 shadow-2xl">
          {/* Animated glow header */}
          <div className="relative h-32 overflow-hidden bg-gradient-to-br from-blue-600 to-cyan-500">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/10 blur-2xl"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
              className="absolute -bottom-20 -left-10 w-48 h-48 rounded-full bg-cyan-300/20 blur-2xl"
            />
            <button
              onClick={onClose}
              className="absolute top-4 end-4 z-10 p-2 rounded-xl bg-white/15 text-white hover:bg-white/25 transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
              className="absolute -bottom-8 start-8 p-4 rounded-2xl bg-slate-900 border border-white/10 shadow-xl"
            >
              <Lock className="text-blue-400" size={28} />
            </motion.div>
          </div>

          <div className="px-8 pt-12 pb-8">
            <h2 className="text-2xl font-black text-white mb-1">{t('auth.title')}</h2>
            <p className="text-slate-400 text-sm mb-7">{t('auth.subtitle')}</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                  {t('auth.username')}
                </label>
                <div className="relative">
                  <User size={18} className="absolute top-1/2 -translate-y-1/2 start-4 text-slate-500" />
                  <input
                    ref={firstInputRef}
                    type="text"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setError(false); }}
                    placeholder={t('auth.usernamePlaceholder')}
                    className="w-full ps-12 pe-4 py-3.5 rounded-xl bg-slate-800/70 border border-slate-700 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    autoComplete="off"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                  {t('auth.password')}
                </label>
                <div className="relative">
                  <KeyRound size={18} className="absolute top-1/2 -translate-y-1/2 start-4 text-slate-500" />
                  <input
                    type="password"
                    value={code}
                    onChange={(e) => { setCode(e.target.value); setError(false); }}
                    placeholder={t('auth.passwordPlaceholder')}
                    className="w-full ps-12 pe-4 py-3.5 rounded-xl bg-slate-800/70 border border-slate-700 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    autoComplete="off"
                  />
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 text-red-400 text-sm font-semibold overflow-hidden"
                  >
                    <AlertCircle size={16} />
                    {t('auth.error')}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-4 mt-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-colors"
              >
                <ShieldCheck size={20} />
                {t('auth.login')}
              </motion.button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
