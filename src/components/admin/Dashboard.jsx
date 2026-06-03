import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePortfolio } from '../../context/PortfolioContext';
import { RotateCcw, X, Edit3, Globe, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = ({ onClose }) => {
  const { t, i18n } = useTranslation();
  const { content, updateContent, resetContent } = usePortfolio();
  const [activeLang, setActiveLang] = useState(i18n.language.startsWith('ar') ? 'ar' : 'en');
  const [activeSection, setActiveSection] = useState('hero');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isRTL = i18n.dir() === 'rtl';

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

  const renderField = (label, path, type = 'text') => {
    const keys = path.split('.');
    let value = content[activeLang];
    for (const key of keys) {
      value = value?.[key];
    }
    value = value || '';

    return (
      <div className="mb-6 relative z-[110]">
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
          {label}
        </label>
        {type === 'textarea' ? (
          <textarea
            className="editor-input w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            rows="4"
            value={value}
            onChange={(e) => updateContent(activeLang, path, e.target.value)}
          />
        ) : (
          <input
            type="text"
            className="editor-input w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={value}
            onChange={(e) => updateContent(activeLang, path, e.target.value)}
          />
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-0 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-slate-50 dark:bg-slate-950 w-full max-w-6xl h-full sm:h-[90vh] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 relative z-[101]"
      >
        {/* Header */}
        <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 lg:hidden text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              <Menu size={20} />
            </button>
            <div className="p-2 sm:p-3 bg-blue-600 rounded-xl sm:rounded-2xl text-white shadow-lg shadow-blue-500/20">
              <Edit3 size={20} className="sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight">{t('admin.title')}</h2>
              <p className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-sm">{t('admin.subtitle')}</p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-3">
            <button
              onClick={handleReset}
              className="p-2 sm:p-3 text-slate-400 hover:text-red-500 transition-colors rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10"
              title={t('admin.resetTitle')}
            >
              <RotateCcw size={18} sm:size={20} />
            </button>
            <button
              onClick={onClose}
              className="p-2 sm:p-3 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-700 transition-all"
            >
              <X size={18} sm:size={20} />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden relative">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:flex w-64 border-e border-slate-200 dark:border-slate-800 flex-col p-6 gap-2 bg-slate-50/50 dark:bg-slate-950/50">
            <div className="flex bg-slate-200 dark:bg-slate-900 p-1 rounded-xl mb-6 shadow-inner">
              <button
                onClick={() => setActiveLang('en')}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeLang === 'en' ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                English
              </button>
              <button
                onClick={() => setActiveLang('ar')}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeLang === 'ar' ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                العربية
              </button>
            </div>

            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-start px-4 py-3 rounded-xl font-bold transition-all ${activeSection === section.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 scale-[1.02]' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-900'}`}
              >
                {section.label}
              </button>
            ))}

            <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800">
                <button
                    onClick={() => {
                        const data = JSON.stringify(content, null, 2);
                        const blob = new Blob([data], {type: 'application/json'});
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'portfolio-config.json';
                        a.click();
                    }}
                    className="w-full py-3 border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all text-sm font-bold flex items-center justify-center gap-2 group"
                >
                    <Globe size={16} className="group-hover:rotate-12 transition-transform" />
                    {t('admin.exportJson')}
                </button>
            </div>
          </div>

          {/* Sidebar - Mobile Overlay */}
          <AnimatePresence>
            {isSidebarOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsSidebarOpen(false)}
                  className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110] lg:hidden"
                />
                <motion.div
                  initial={{ x: isRTL ? '100%' : '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: isRTL ? '100%' : '-100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed inset-y-0 start-0 w-72 bg-white dark:bg-slate-950 z-[120] lg:hidden p-6 flex flex-col gap-2 shadow-2xl"
                >
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="font-bold text-slate-900 dark:text-white">{t('admin.sections.hero')}</h3>
                    <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-slate-500"><X size={20} /></button>
                  </div>

                  <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl mb-6">
                    <button
                      onClick={() => { setActiveLang('en'); setIsSidebarOpen(false); }}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeLang === 'en' ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-slate-500'}`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => { setActiveLang('ar'); setIsSidebarOpen(false); }}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeLang === 'ar' ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-slate-500'}`}
                    >
                      العربية
                    </button>
                  </div>

                  {sections.map(section => (
                    <button
                      key={section.id}
                      onClick={() => { setActiveSection(section.id); setIsSidebarOpen(false); }}
                      className={`w-full text-start px-4 py-3 rounded-xl font-bold transition-all ${activeSection === section.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'}`}
                    >
                      {section.label}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-white dark:bg-slate-900/30 relative z-[105] scroll-smooth">
            <div className="max-w-2xl mx-auto lg:mx-0">
              {activeSection === 'hero' && (
                <div className="space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  {renderField(t('admin.fields.fullName'), 'hero.name')}
                  {renderField(t('admin.fields.profTitle'), 'hero.title')}
                  {renderField(t('admin.fields.shortBio'), 'hero.subtitle', 'textarea')}
                  {renderField(t('admin.fields.exploreBtn'), 'hero.ctaWork')}
                  {renderField(t('admin.fields.contactBtn'), 'hero.ctaContact')}
                </div>
              )}

              {activeSection === 'about' && (
                <div className="space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  {renderField(t('admin.fields.secTitle'), 'about.title')}
                  {renderField(t('admin.fields.detailedBio'), 'about.bio', 'textarea')}
                  {renderField(t('admin.fields.personalTouchTitle'), 'about.personalTouchTitle')}
                  {renderField(t('admin.fields.personalTouchBio'), 'about.personalTouchBio', 'textarea')}
                </div>
              )}

              {activeSection === 'skills' && (
                <div className="space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  {renderField(t('admin.fields.secTitle'), 'skills.title')}
                  <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-6 mt-10 flex items-center gap-2">
                    <span className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></span>
                    {t('admin.fields.categories')}
                    <span className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></span>
                  </h4>
                  {renderField(t('admin.fields.frontend'), 'skills.categories.frontend')}
                  {renderField(t('admin.fields.backend'), 'skills.categories.backend')}
                  {renderField(t('admin.fields.architecture'), 'skills.categories.architecture')}
                  {renderField(t('admin.fields.cicd'), 'skills.categories.cicd')}
                </div>
              )}

              {activeSection === 'projects' && (
                <div className="space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  {renderField(t('admin.fields.secTitle'), 'projects.title')}
                  <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-6 mt-10 flex items-center gap-2">
                    <span className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></span>
                    {t('admin.fields.project1')}
                    <span className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></span>
                  </h4>
                  {renderField(t('admin.fields.pTitle'), 'projects.project1.title')}
                  {renderField(t('admin.fields.pDesc'), 'projects.project1.description', 'textarea')}
                  <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-6 mt-10 flex items-center gap-2">
                    <span className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></span>
                    {t('admin.fields.project2')}
                    <span className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></span>
                  </h4>
                  {renderField(t('admin.fields.pTitle'), 'projects.project2.title')}
                  {renderField(t('admin.fields.pDesc'), 'projects.project2.description', 'textarea')}
                </div>
              )}

              {activeSection === 'contact' && (
                <div className="space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  {renderField(t('admin.fields.secTitle'), 'contact.title')}
                  {renderField(t('admin.fields.subtitle'), 'contact.subtitle', 'textarea')}
                  {renderField(t('admin.fields.emailLabel'), 'contact.emailMe')}
                  {renderField(t('admin.fields.displayEmail'), 'contact.emailAddress')}
                  {renderField(t('admin.fields.namePlaceholder'), 'contact.namePlaceholder')}
                  {renderField(t('admin.fields.emailPlaceholder'), 'contact.emailPlaceholder')}
                  {renderField(t('admin.fields.messagePlaceholder'), 'contact.messagePlaceholder')}
                  {renderField(t('admin.fields.submitBtn'), 'contact.sendButton')}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
