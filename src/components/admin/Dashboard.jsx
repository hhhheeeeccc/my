import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePortfolio } from '../../context/PortfolioContext';
import { RotateCcw, X, Edit3, Download, Menu, LogOut, User, Briefcase, Layers, Mail, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SECTION_ICONS = {
  hero: Sparkles,
  about: User,
  skills: Layers,
  projects: Briefcase,
  contact: Mail,
};

const Dashboard = ({ onClose }) => {
  const { t, i18n } = useTranslation();
  const { content, updateContent, resetContent } = usePortfolio();
  const [activeLang, setActiveLang] = useState(i18n.language.startsWith('ar') ? 'ar' : 'en');
  const [activeSection, setActiveSection] = useState('hero');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isRTL = i18n.dir() === 'rtl';

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const sections = [
    { id: 'hero', label: t('admin.sections.hero') },
    { id: 'about', label: t('admin.sections.about') },
    { id: 'skills', label: t('admin.sections.skills') },
    { id: 'projects', label: t('admin.sections.projects') },
    { id: 'contact', label: t('admin.sections.contact') },
  ];

  const handleReset = () => {
    if (window.confirm(t('admin.resetConfirm'))) {
      resetContent();
    }
  };

  const handleExport = () => {
    const data = JSON.stringify(content, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderField = (label, path, type = 'text') => {
    const keys = path.split('.');
    let value = content[activeLang];
    for (const key of keys) {
      value = value?.[key];
    }
    value = value || '';

    return (
      <div className="mb-5">
        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
          {label}
        </label>
        {type === 'textarea' ? (
          <textarea
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none leading-relaxed"
            rows="4"
            dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
            value={value}
            onChange={(e) => updateContent(activeLang, path, e.target.value)}
          />
        ) : (
          <input
            type="text"
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
            value={value}
            onChange={(e) => updateContent(activeLang, path, e.target.value)}
          />
        )}
      </div>
    );
  };

  const LangToggle = ({ onPick }) => (
    <div className="flex bg-slate-200/70 dark:bg-slate-800 p-1 rounded-xl mb-6 shadow-inner">
      {['en', 'ar'].map((lng) => (
        <button
          key={lng}
          onClick={() => { setActiveLang(lng); onPick?.(); }}
          className={`relative flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${activeLang === lng ? 'text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
        >
          {activeLang === lng && (
            <motion.span
              layoutId="langActive"
              className="absolute inset-0 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/30"
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            />
          )}
          <span className="relative z-10">{lng === 'en' ? 'English' : 'العربية'}</span>
        </button>
      ))}
    </div>
  );

  const SectionNav = ({ onPick }) => (
    <nav className="flex flex-col gap-1.5">
      {sections.map((section) => {
        const Icon = SECTION_ICONS[section.id];
        const active = activeSection === section.id;
        return (
          <button
            key={section.id}
            onClick={() => { setActiveSection(section.id); onPick?.(); }}
            className={`relative w-full flex items-center gap-3 text-start px-4 py-3 rounded-xl font-bold transition-colors ${active ? 'text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'}`}
          >
            {active && (
              <motion.span
                layoutId="sectionActive"
                className="absolute inset-0 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/25"
                transition={{ type: 'spring', damping: 22, stiffness: 300 }}
              />
            )}
            <Icon size={18} className="relative z-10 flex-shrink-0" />
            <span className="relative z-10">{section.label}</span>
          </button>
        );
      })}
    </nav>
  );

  const fieldsAnim = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-0 sm:p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-xl"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 24 }}
        transition={{ type: 'spring', damping: 26, stiffness: 280 }}
        className="relative z-10 bg-white dark:bg-slate-950 w-full max-w-6xl h-full sm:h-[90vh] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800"
      >
        {/* Header */}
        <div className="px-4 sm:px-8 py-4 sm:py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/60 backdrop-blur-sm">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 lg:hidden text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <div className="p-2.5 sm:p-3 bg-blue-600 rounded-xl sm:rounded-2xl text-white shadow-lg shadow-blue-500/25">
              <Edit3 size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-black text-slate-900 dark:text-white leading-tight">{t('admin.title')}</h2>
              <p className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-xs">{t('auth.welcome')}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={handleExport}
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:text-blue-600 transition-colors"
              title={t('admin.exportJson')}
            >
              <Download size={16} />
              <span className="hidden md:inline">{t('admin.exportJson')}</span>
            </button>
            <button
              onClick={handleReset}
              className="p-2.5 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              title={t('admin.resetTitle')}
            >
              <RotateCcw size={18} />
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl hover:bg-blue-600 dark:hover:bg-blue-500 dark:hover:text-white transition-colors font-bold text-sm"
              title={t('admin.logout')}
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">{t('admin.logout')}</span>
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:flex w-64 border-e border-slate-200 dark:border-slate-800 flex-col p-6 bg-slate-50/60 dark:bg-slate-900/30">
            <LangToggle />
            <SectionNav />
          </aside>

          {/* Sidebar - Mobile Overlay */}
          <AnimatePresence>
            {isSidebarOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsSidebarOpen(false)}
                  className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-[260] lg:hidden"
                />
                <motion.aside
                  initial={{ x: isRTL ? '100%' : '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: isRTL ? '100%' : '-100%' }}
                  transition={{ type: 'spring', damping: 28, stiffness: 260 }}
                  className="fixed inset-y-0 start-0 w-72 bg-white dark:bg-slate-950 z-[270] lg:hidden p-6 flex flex-col shadow-2xl"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-black text-slate-900 dark:text-white">{t('admin.title')}</h3>
                    <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                      <X size={20} />
                    </button>
                  </div>
                  <LangToggle onPick={() => setIsSidebarOpen(false)} />
                  <SectionNav onPick={() => setIsSidebarOpen(false)} />
                  <button
                    onClick={() => { handleExport(); setIsSidebarOpen(false); }}
                    className="mt-6 flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm hover:border-blue-500 hover:text-blue-600 transition-colors"
                  >
                    <Download size={16} />
                    {t('admin.exportJson')}
                  </button>
                </motion.aside>
              </>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-10 bg-white dark:bg-slate-950">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection + activeLang}
                variants={fieldsAnim}
                initial="hidden"
                animate="visible"
                className="max-w-2xl mx-auto lg:mx-0"
              >
                {activeSection === 'hero' && (
                  <>
                    {renderField(t('admin.fields.fullName'), 'hero.name')}
                    {renderField(t('admin.fields.profTitle'), 'hero.title')}
                    {renderField(t('admin.fields.shortBio'), 'hero.subtitle', 'textarea')}
                    {renderField(t('admin.fields.exploreBtn'), 'hero.ctaWork')}
                    {renderField(t('admin.fields.contactBtn'), 'hero.ctaContact')}
                  </>
                )}

                {activeSection === 'about' && (
                  <>
                    {renderField(t('admin.fields.secTitle'), 'about.title')}
                    {renderField(t('admin.fields.detailedBio'), 'about.bio', 'textarea')}
                    {renderField(t('admin.fields.personalTouchTitle'), 'about.personalTouchTitle')}
                    {renderField(t('admin.fields.personalTouchBio'), 'about.personalTouchBio', 'textarea')}
                  </>
                )}

                {activeSection === 'skills' && (
                  <>
                    {renderField(t('admin.fields.secTitle'), 'skills.title')}
                    <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-5 mt-8 flex items-center gap-2">
                      <span className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></span>
                      {t('admin.fields.categories')}
                      <span className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></span>
                    </h4>
                    {renderField(t('admin.fields.frontend'), 'skills.categories.frontend')}
                    {renderField(t('admin.fields.backend'), 'skills.categories.backend')}
                    {renderField(t('admin.fields.architecture'), 'skills.categories.architecture')}
                    {renderField(t('admin.fields.cicd'), 'skills.categories.cicd')}
                  </>
                )}

                {activeSection === 'projects' && (
                  <>
                    {renderField(t('admin.fields.secTitle'), 'projects.title')}
                    <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-5 mt-8 flex items-center gap-2">
                      <span className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></span>
                      {t('admin.fields.project1')}
                      <span className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></span>
                    </h4>
                    {renderField(t('admin.fields.pTitle'), 'projects.project1.title')}
                    {renderField(t('admin.fields.pDesc'), 'projects.project1.description', 'textarea')}
                    <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-5 mt-8 flex items-center gap-2">
                      <span className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></span>
                      {t('admin.fields.project2')}
                      <span className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></span>
                    </h4>
                    {renderField(t('admin.fields.pTitle'), 'projects.project2.title')}
                    {renderField(t('admin.fields.pDesc'), 'projects.project2.description', 'textarea')}
                  </>
                )}

                {activeSection === 'contact' && (
                  <>
                    {renderField(t('admin.fields.secTitle'), 'contact.title')}
                    {renderField(t('admin.fields.subtitle'), 'contact.subtitle', 'textarea')}
                    {renderField(t('admin.fields.emailLabel'), 'contact.emailMe')}
                    {renderField(t('admin.fields.displayEmail'), 'contact.emailAddress')}
                    {renderField(t('admin.fields.namePlaceholder'), 'contact.namePlaceholder')}
                    {renderField(t('admin.fields.emailPlaceholder'), 'contact.emailPlaceholder')}
                    {renderField(t('admin.fields.messagePlaceholder'), 'contact.messagePlaceholder')}
                    {renderField(t('admin.fields.submitBtn'), 'contact.sendButton')}
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
