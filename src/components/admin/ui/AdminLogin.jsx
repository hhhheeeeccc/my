import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Lock, User, KeyRound, X } from 'lucide-react';

const AdminLogin = ({ loginData, setLoginData, handleLogin, loginError, t, onClose }) => (
  <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-950/90 backdrop-blur-3xl" onClick={onClose} />
    <motion.div initial={{ scale: 0.9, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="relative w-full max-w-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-[3.5rem] shadow-2xl border border-white/20 dark:border-slate-800 p-10 sm:p-16 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600" />
      <button onClick={onClose} className="absolute top-10 end-10 p-3 text-slate-400 rounded-2xl"><X size={24} /></button>
      <div className="text-center mb-12">
        <motion.div animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }} transition={{ duration: 5, repeat: Infinity }} className="inline-flex p-6 rounded-[2.5rem] bg-blue-600 text-white mb-10"><Lock size={48} /></motion.div>
        <h2 className="text-5xl font-black text-slate-900 dark:text-white mb-4">{t('admin.loginTitle')}</h2>
        <p className="text-xl text-slate-500 dark:text-slate-400 font-medium">{t('admin.subtitle')}</p>
      </div>
      <form onSubmit={handleLogin} className="space-y-8">
        {[ ['username', <User key="u" size={24} />], ['password', <KeyRound key="p" size={24} />, 'password'] ].map(([id, icon, type]) => (
          <div key={id} className="space-y-3">
            <label className="block text-xs font-black uppercase tracking-[0.3em] text-slate-400 ms-4">{t(`admin.${id}`)}</label>
            <div className="relative group">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500">{icon}</span>
              <input type={type || 'text'} required className="w-full pl-16 pr-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-500 rounded-[2rem] text-slate-900 dark:text-white font-bold text-xl shadow-inner" value={loginData[id]} onChange={(e) => setLoginData({ ...loginData, [id]: e.target.value })} />
            </div>
          </div>
        ))}
        {loginError && <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-red-500/10 p-5 rounded-3xl text-red-500 text-lg font-black text-center">{loginError}</motion.div>}
        <button type="submit" className="w-full py-7 bg-blue-600 text-white font-black rounded-[2rem] shadow-2xl hover:bg-blue-700 transition-all text-xl uppercase tracking-widest">{t('admin.loginBtn')}</button>
      </form>
    </motion.div>
  </div>
);

AdminLogin.propTypes = {
  loginData: PropTypes.object.isRequired,
  setLoginData: PropTypes.func.isRequired,
  handleLogin: PropTypes.func.isRequired,
  loginError: PropTypes.string,
  t: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default AdminLogin;
