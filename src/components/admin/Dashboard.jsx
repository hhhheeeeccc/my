import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  RotateCcw, X, Edit3, Globe, Menu, Lock, User, KeyRound,
  Layout, Settings, Mail, Briefcase, Info,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SidebarItem = ({ section, activeSection, onClick }) => (
  <button
    onClick={() => onClick(section.id)}
    className={`w-full flex items-center gap-5 px-8 py-6 rounded-[2rem] font-black transition-all group relative overflow-hidden ${
      activeSection === section.id
        ? 'bg-blue-600 text-white shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] scale-[1.05]'
        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200/50 dark:hover:border-slate-700/50'
    }`}
  >
    <span className={`transition-all duration-500 ${
      activeSection === section.id ? 'text-white scale-110' : 'text-blue-600 dark:text-blue-400 group-hover:scale-125'
    }`}>
      {section.icon}
    </span>
    <span className="text-lg tracking-tight">{section.label}</span>
    {activeSection === section.id && (
      <motion.div layoutId="sidebar-indicator" className="absolute end-0 top-0 bottom-0 w-2 bg-white/20" />
    )}
  </button>
);

const LanguageSwitcher = ({ activeLang, onLangChange }) => (
  <div className="flex bg-slate-100/50 dark:bg-slate-950 p-2 rounded-[2rem] mb-10 border border-slate-200/50 dark:border-slate-800/50 shadow-inner">
    {['en', 'ar'].map((lang) => (
      <button
        key={lang}
        onClick={() => onLangChange(lang)}
        className={`flex-1 py-4 rounded-[1.5rem] text-sm font-black transition-all uppercase tracking-[0.3em] ${
          activeLang === lang ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-2xl' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
        }`}
      >
        {lang}
      </button>
    ))}
  </div>
);

const DashboardField = ({ label, value, onChange, type = 'text' }) => (
  <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 relative z-[110]">
    <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-3 ms-1">
      {label}
    </label>
    {type === 'textarea' ? (
      <textarea
        className="editor-input w-full px-6 py-5 rounded-[1.5rem] bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-lg min-h-[140px] shadow-sm resize-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    ) : (
      <input
        className="editor-input w-full px-6 py-5 rounded-[1.5rem] bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-lg shadow-sm"
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    )}
  </motion.div>
);

const Dashboard = ({ onClose }) => {
  const { t, i18n } = useTranslation();
  const { content, updateContent, resetContent } = usePortfolio();
  const [activeLang, setActiveLang] = useState(i18n.language.startsWith('ar') ? 'ar' : 'en');
  const [activeSection, setActiveSection] = useState('hero');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const isRTL = i18n.dir() === 'rtl';

  useEffect(() => {
    if (sessionStorage.getItem('admin_auth') === 'true') setIsAuthenticated(true);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.username === 'marwan' && loginData.password === '736187483') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
    } else {
      setLoginError(t('admin.error'));
    }
  };

  const sections = useMemo(() => [
    { id: 'hero', label: t('admin.sections.hero'), icon: <Layout size={18} /> },
    { id: 'about', label: t('admin.sections.about'), icon: <Info size={18} /> },
    { id: 'skills', label: t('admin.sections.skills'), icon: <Zap size={18} /> },
    { id: 'projects', label: t('admin.sections.projects'), icon: <Briefcase size={18} /> },
    { id: 'contact', label: t('admin.sections.contact'), icon: <Mail size={18} /> },
  ], [t]);

  const renderField = (label, path, type = 'text') => {
    const keys = path.split('.');
    let value = content[activeLang];
    for (const key of keys) value = value?.[key];
    return <DashboardField key={path} label={label} value={value || ''} type={type} onChange={(val) => updateContent(activeLang, path, val)} />;
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-950/90 backdrop-blur-3xl" onClick={onClose} />
        <motion.div initial={{ scale: 0.9, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="relative w-full max-w-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-[3.5rem] shadow-2xl border border-white/20 dark:border-slate-800 p-10 sm:p-16 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600" />
          <button onClick={onClose} className="absolute top-10 end-10 p-3 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-2xl transition-all"><X size={24} /></button>
          <div className="text-center mb-12">
            <motion.div animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="inline-flex p-6 rounded-[2.5rem] bg-blue-600 text-white shadow-2xl shadow-blue-500/40 mb-10"><Lock size={48} /></motion.div>
            <h2 className="text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">{t('admin.loginTitle')}</h2>
            <p className="text-xl text-slate-500 dark:text-slate-400 font-medium opacity-80">{t('admin.subtitle')}</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-8">
            {[['username', <User size={24} />, 'text'], ['password', <KeyRound size={24} />, 'password']].map(([id, icon, type]) => (
              <div key={id} className="space-y-3">
                <label className="block text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-2 ms-4">{t(`admin.${id}`)}</label>
                <div className="relative group">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">{icon}</span>
                  <input type={type} required className="w-full pl-16 pr-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-500 rounded-[2rem] text-slate-900 dark:text-white outline-none transition-all font-bold text-xl" value={loginData[id]} onChange={(e) => setLoginData({ ...loginData, [id]: e.target.value })} />
                </div>
              </div>
            ))}
            {loginError && <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-red-500/10 p-5 rounded-3xl border border-red-500/20 text-red-500 text-lg font-black text-center">{loginError}</motion.div>}
            <button type="submit" className="w-full py-7 bg-blue-600 text-white font-black rounded-[2rem] shadow-2xl shadow-blue-600/40 hover:bg-blue-700 transition-all text-xl uppercase tracking-widest">{t('admin.loginBtn')}</button>
          </form>
        </motion.div>
      </div>
    );
  }

  const SidebarContent = ({ isMobile = false }) => (
    <>
      {isMobile && (
        <div className="flex items-center justify-between mb-10">
          <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">M.Y.H.G</span>
          <button onClick={() => setIsSidebarOpen(false)} className="p-3 bg-slate-100 dark:bg-slate-900 rounded-2xl text-slate-500"><X size={24} /></button>
        </div>
      )}
      <LanguageSwitcher activeLang={activeLang} onLangChange={(lang) => { setActiveLang(lang); if(isMobile) setIsSidebarOpen(false); }} />
      <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {sections.map(s => <SidebarItem key={s.id} section={s} activeSection={activeSection} onClick={(id) => { setActiveSection(id); if(isMobile) setIsSidebarOpen(false); }} />)}
      </div>
      {!isMobile && (
        <div className="mt-8 pt-8 border-t border-slate-200/50 dark:border-slate-800/50">
          <button onClick={() => { const data = JSON.stringify(content, null, 2); const blob = new Blob([data], {type: 'application/json'}); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'portfolio-config.json'; a.click(); }} className="w-full py-5 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-[2rem] hover:border-blue-500 hover:text-blue-600 transition-all text-xs font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 group">
            <Globe size={20} className="group-hover:rotate-[360deg] transition-transform duration-1000" /> {t('admin.exportJson')}
          </button>
        </div>
      )}
    </>
  );

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-0 sm:p-6 md:p-12 lg:p-16">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-950/60 backdrop-blur-2xl" />
      <motion.div initial={{ y: 100, opacity: 0, scale: 0.9 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 100, opacity: 0, scale: 0.9 }} transition={{ type: 'spring', damping: 35, stiffness: 200 }} className="relative w-full h-full bg-white dark:bg-slate-950 sm:rounded-[4rem] shadow-2xl border border-white/20 dark:border-slate-800 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-10 sm:px-16 py-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 relative z-[110]">
          <div className="flex items-center gap-8">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-4 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-[1.5rem] transition-colors"><Menu size={32} /></button>
            <div className="flex items-center gap-6">
              <div className="p-5 bg-blue-600 rounded-[2rem] text-white shadow-2xl shadow-blue-500/40"><Edit3 size={32} /></div>
              <div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">{t('admin.title')}</h2>
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                  <p className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">{activeSection} Editor</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <motion.button whileHover={{ rotate: -180, scale: 1.15 }} onClick={() => window.confirm(t('admin.resetConfirm')) && resetContent()} className="p-5 text-slate-400 hover:text-red-500 rounded-3xl transition-all" title={t('admin.resetTitle')}><RotateCcw size={28} /></motion.button>
            <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} onClick={onClose} className="p-5 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 rounded-3xl transition-all shadow-sm"><X size={28} /></motion.button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="hidden lg:flex w-96 flex-col p-10 bg-white dark:bg-slate-900 border-e border-slate-200/50 dark:border-slate-800/50 gap-4 relative z-[105]"><SidebarContent /></div>
          <AnimatePresence>
            {isSidebarOpen && (
              <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[120] lg:hidden" />
                <motion.div initial={{ x: isRTL ? '100%' : '-100%' }} animate={{ x: 0 }} exit={{ x: isRTL ? '100%' : '-100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }} className="fixed inset-y-0 start-0 w-80 bg-white dark:bg-slate-950 z-[130] lg:hidden p-8 flex flex-col gap-3 shadow-2xl"><SidebarContent isMobile /></motion.div>
              </>
            )}
          </AnimatePresence>

          <div className="flex-1 overflow-y-auto p-12 sm:p-20 lg:p-24 relative z-[105] scroll-smooth bg-slate-50/30 dark:bg-slate-900/10">
            <div className="max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div key={activeSection + activeLang} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
                  <div className="mb-20">
                     <div className="flex items-center gap-4 mb-6"><span className="h-1.5 w-20 bg-blue-600 rounded-full" /><span className="text-xs font-black text-blue-600 uppercase tracking-[0.5em]">{activeLang} version</span></div>
                     <h1 className="text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-[0.9]">{sections.find(s => s.id === activeSection)?.label}</h1>
                     <p className="text-2xl font-semibold text-slate-500 dark:text-slate-400 opacity-70 leading-relaxed max-w-2xl">Refine every detail of your {activeSection} section to build a world-class engineering portfolio.</p>
                  </div>

                  <div className="space-y-4">
                    {activeSection === 'hero' && (
                      <div className="space-y-6">
                        {[ ['Welcome Tagline', 'hero.welcome'], [t('admin.fields.fullName'), 'hero.name'], [t('admin.fields.profTitle'), 'hero.title'] ].map(([l, p]) => renderField(l, p))}
                        {renderField(t('admin.fields.shortBio'), 'hero.subtitle', 'textarea')}
                        <div className="grid sm:grid-cols-2 gap-8">{ [[t('admin.fields.exploreBtn'), 'hero.ctaWork'], [t('admin.fields.contactBtn'), 'hero.ctaContact']].map(([l, p]) => renderField(l, p)) }</div>
                      </div>
                    )}
                    {activeSection === 'about' && (
                      <div className="space-y-6">
                        {[['Section Label', 'about.subtitle'], [t('admin.fields.secTitle'), 'about.title']].map(([l, p]) => renderField(l, p))}
                        {[['Introduction', 'about.intro'], [t('admin.fields.detailedBio'), 'about.bio']].map(([l, p]) => renderField(l, p, 'textarea'))}
                        <div className="py-12 flex items-center gap-8"><span className="text-xs font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.5em]">Experience Highlights</span><div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" /></div>
                        <div className="grid sm:grid-cols-2 gap-8">
                           {['code', 'rocket'].map((f, i) => (
                              <div key={f} className="p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                 <h4 className="text-xs font-black text-blue-600 mb-6 uppercase tracking-widest">Feature {i+1}</h4>
                                 {renderField("Title", `about.features.${f}.title`)}
                                 {renderField("Description", `about.features.${f}.desc`, 'textarea')}
                              </div>
                           ))}
                        </div>
                        <div className="h-px bg-slate-200 dark:bg-slate-800 my-16" />
                        {renderField(t('admin.fields.personalTouchTitle'), 'about.personalTouchTitle')}
                        {renderField(t('admin.fields.personalTouchBio'), 'about.personalTouchBio', 'textarea')}
                      </div>
                    )}
                    {activeSection === 'skills' && (
                      <div className="space-y-6">
                        {renderField("Section Label", 'skills.subtitle')}
                        {renderField(t('admin.fields.secTitle'), 'skills.title')}
                        {renderField("Intro Description", 'skills.intro', 'textarea')}
                        <div className="py-12 flex items-center gap-8"><span className="text-xs font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.5em]">Categories</span><div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" /></div>
                        <div className="grid sm:grid-cols-2 gap-8">{['frontend', 'backend', 'architecture', 'cicd'].map(c => renderField(t(`admin.fields.${c}`), `skills.categories.${c}`))}</div>
                      </div>
                    )}
                    {activeSection === 'projects' && (
                      <div className="space-y-6">
                        {[['Section Label', 'projects.subtitle'], [t('admin.fields.secTitle'), 'projects.title']].map(([l, p]) => renderField(l, p))}
                        {renderField("Intro Description", 'projects.intro', 'textarea')}
                        {renderField("CTA Button", 'projects.viewMore')}
                        <div className="mt-16 space-y-16">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="p-12 rounded-[3.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl group transition-all">
                               <h4 className="text-sm font-black text-blue-600 uppercase tracking-[0.4em] mb-12 flex items-center gap-4"><span className="w-12 h-12 rounded-[1.2rem] bg-blue-600 text-white flex items-center justify-center text-lg shadow-lg shadow-blue-500/20">0{i}</span>{t(`admin.fields.project${i}`, `Project ${i}`)}</h4>
                               {renderField(t('admin.fields.pTitle'), `projects.project${i}.title`)}
                               {renderField(t('admin.fields.pDesc'), `projects.project${i}.description`, 'textarea')}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {activeSection === 'contact' && (
                      <div className="space-y-6">
                        {renderField(t('admin.fields.secTitle'), 'contact.title')}
                        {renderField(t('admin.fields.subtitle'), 'contact.subtitle', 'textarea')}
                        <div className="h-px bg-slate-200 dark:bg-slate-800 my-16" />
                        <div className="grid sm:grid-cols-2 gap-8">{[[t('admin.fields.emailLabel'), 'contact.emailMe'], [t('admin.fields.displayEmail'), 'contact.emailAddress']].map(([l, p]) => renderField(l, p))}</div>
                        <div className="grid sm:grid-cols-2 gap-8">{[[t('admin.fields.namePlaceholder'), 'contact.namePlaceholder'], [t('admin.fields.emailPlaceholder'), 'contact.emailPlaceholder']].map(([l, p]) => renderField(l, p))}</div>
                        {renderField(t('admin.fields.messagePlaceholder'), 'contact.messagePlaceholder')}
                        {renderField(t('admin.fields.submitBtn'), 'contact.sendButton')}
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
