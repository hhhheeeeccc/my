import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { usePortfolio } from '../../context/PortfolioContext';
import { AnimatePresence, motion } from 'framer-motion';
import DashboardField from './ui/DashboardField';
import AdminLogin from './ui/AdminLogin';
import DashboardHeader from './ui/DashboardHeader';
import DashboardSidebar from './ui/DashboardSidebar';
import { ADMIN_SECTIONS } from '../../utils/constants';
import { SECTION_FIELDS } from '../../utils/adminConfig';

const Dashboard = ({ onClose }) => {
  const { t, i18n } = useTranslation();
  const { content, updateContent, resetContent } = usePortfolio();
  const [activeLang, setActiveLang] = useState(i18n.language.startsWith('ar') ? 'ar' : 'en');
  const [activeSection, setActiveSection] = useState('hero');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  useEffect(() => { if (sessionStorage.getItem('admin_auth') === 'true') setIsAuthenticated(true); }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.username === 'marwan' && loginData.password === '736187483') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
    } else setLoginError(t('admin.error'));
  };

  const sections = useMemo(() => ADMIN_SECTIONS.map(s => ({ ...s, label: t(s.labelKey) })), [t]);

  const fld = (label, path, type = 'text') => {
    const keys = path.split('.');
    let val = content[activeLang];
    for (const k of keys) val = val?.[k];
    return <DashboardField key={path} label={label} value={val || ''} type={type} onChange={(v) => updateContent(activeLang, path, v)} />;
  };

  const renderSectionContent = () => {
    const fields = SECTION_FIELDS[activeSection];
    const gridFields = [];
    const elements = [];

    fields.forEach((field, i) => {
      if (field.isDivider) {
        elements.push(<div key={`div-${i}`} className="py-12 flex items-center gap-8"><span className="text-xs font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.5em]">{field.labelKey ? t(field.labelKey) : ''}</span><div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" /></div>);
      } else if (field.isFeature) {
        elements.push(<div key={`feat-${field.feature}`} className="p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 mb-6"><h4 className="text-xs font-black text-blue-600 mb-6 uppercase tracking-widest">{t('admin.fields.feature')}</h4>{fld(t('admin.fields.pTitle'), `about.features.${field.feature}.title`)}{fld(t('admin.fields.pDesc'), `about.features.${field.feature}.desc`, 'textarea')}</div>);
      } else if (field.isProject) {
        elements.push(<div key={`proj-${field.index}`} className="p-12 rounded-[3.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl mb-12"><h4 className="text-sm font-black text-blue-600 uppercase tracking-[0.4em] mb-12 flex items-center gap-4"><span className="w-12 h-12 rounded-[1.2rem] bg-blue-600 text-white flex items-center justify-center text-lg">0{field.index}</span>{t(`admin.fields.project${field.index}`)}</h4>{fld(t('admin.fields.pTitle'), `projects.project${field.index}.title`)}{fld(t('admin.fields.pDesc'), `projects.project${field.index}.description`, 'textarea')}</div>);
      } else if (field.half) {
        gridFields.push(field);
        if (gridFields.length === 2 || i === fields.length - 1) {
          elements.push(<div key={`grid-${i}`} className="grid sm:grid-cols-2 gap-8 mb-6">{gridFields.map(gf => fld(t(gf.labelKey), gf.path, gf.type))}</div>);
          gridFields.length = 0;
        }
      } else elements.push(fld(t(field.labelKey), field.path, field.type));
    });
    return elements;
  };

  const onExport = () => {
    const data = JSON.stringify(content, null, 2);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([data], {type: 'application/json'}));
    a.download = 'portfolio-config.json';
    a.click();
  };

  if (!isAuthenticated) return <AdminLogin loginData={loginData} setLoginData={setLoginData} handleLogin={handleLogin} loginError={loginError} t={t} onClose={onClose} />;

  const sidebarProps = { activeLang, setActiveLang, sections, activeSection, setActiveSection, onExport, t, setIsSidebarOpen, isRTL: i18n.dir() === 'rtl' };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-0 sm:p-6 md:p-12 lg:p-16">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-950/60 backdrop-blur-2xl" />
      <motion.div initial={{ y: 100, opacity: 0, scale: 0.9 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 100, opacity: 0, scale: 0.9 }} transition={{ type: 'spring', damping: 35, stiffness: 200 }} className="relative w-full h-full bg-white dark:bg-slate-950 sm:rounded-[4rem] shadow-2xl border border-white/20 dark:border-slate-800 overflow-hidden flex flex-col">
        <DashboardHeader t={t} activeSection={activeSection} setIsSidebarOpen={setIsSidebarOpen} onReset={() => window.confirm(t('admin.resetConfirm')) && resetContent()} onClose={onClose} />
        <div className="flex flex-1 overflow-hidden">
          <DashboardSidebar {...sidebarProps} isMobile={false} />
          <AnimatePresence>{isSidebarOpen && <DashboardSidebar {...sidebarProps} isMobile={true} />}</AnimatePresence>
          <div className="flex-1 overflow-y-auto p-12 sm:p-20 lg:p-24 relative z-[105] scroll-smooth bg-slate-50/30 dark:bg-slate-900/10">
            <div className="max-w-4xl mx-auto"><AnimatePresence mode="wait"><motion.div key={activeSection + activeLang} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}><div className="mb-20"><div className="flex items-center gap-4 mb-6"><span className="h-1.5 w-20 bg-blue-600 rounded-full" /><span className="text-xs font-black text-blue-600 uppercase tracking-[0.5em]">{activeLang} version</span></div><h1 className="text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-[0.9]">{sections.find(s => s.id === activeSection)?.label}</h1><p className="text-2xl font-semibold text-slate-500 dark:text-slate-400 opacity-70 leading-relaxed max-w-2xl">Refine every detail of your {activeSection} section.</p></div>{renderSectionContent()}</motion.div></AnimatePresence></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
