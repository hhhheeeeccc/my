import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { usePortfolio } from '../../context/PortfolioContext';
import { AnimatePresence, motion } from 'framer-motion';
import AdminLogin from './ui/AdminLogin';
import DashboardHeader from './ui/DashboardHeader';
import DashboardSidebar from './ui/DashboardSidebar';
import DashboardField from './ui/DashboardField';
import DashboardFeature from './ui/DashboardFeature';
import DashboardProject from './ui/DashboardProject';
import { ADMIN_SECTIONS } from '../../utils/constants.jsx';
import { SECTION_FIELDS } from '../../utils/adminConfig';
import { useAdminAuth } from '../../hooks/useAdminAuth';

const Dashboard = ({ onClose }) => {
  const { t, i18n } = useTranslation();
  const { content, updateContent, resetContent } = usePortfolio();
  const [activeLang, setActiveLang] = useState(i18n.language.startsWith('ar') ? 'ar' : 'en');
  const [activeSection, setActiveSection] = useState('hero');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAuthenticated, loginData, setLoginData, loginError, handleLogin } = useAdminAuth(t);

  const sections = useMemo(() => ADMIN_SECTIONS.map(s => ({ ...s, label: t(s.labelKey) })), [t]);

  const onExport = () => {
    const data = JSON.stringify(content, null, 2);
    const a = globalThis.document.createElement('a');
    a.href = URL.createObjectURL(new Blob([data], {type: 'application/json'}));
    a.download = 'portfolio-config.json';
    a.click();
  };

  if (!isAuthenticated) return <AdminLogin loginData={loginData} setLoginData={setLoginData} handleLogin={handleLogin} loginError={loginError} t={t} onClose={onClose} />;

  const sbProps = { activeLang, setActiveLang, sections, activeSection, setActiveSection, onExport, t, setIsSidebarOpen, isRTL: i18n.dir() === 'rtl' };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-0 sm:p-6 md:p-12 lg:p-16">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-950/60 backdrop-blur-2xl" />
      <motion.div initial={{ y: 100, opacity: 0, scale: 0.9 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 100, opacity: 0, scale: 0.9 }} transition={{ type: 'spring', damping: 35, stiffness: 200 }} className="relative w-full h-full bg-white dark:bg-slate-950 sm:rounded-[4rem] shadow-2xl border border-white/20 dark:border-slate-800 overflow-hidden flex flex-col">
        <DashboardHeader t={t} activeSection={activeSection} setIsSidebarOpen={setIsSidebarOpen} onReset={() => globalThis.confirm(t('admin.resetConfirm')) && resetContent()} onClose={onClose} />
        <div className="flex flex-1 overflow-hidden">
          <DashboardSidebar {...sbProps} isMobile={false} />
          <AnimatePresence>{isSidebarOpen && <DashboardSidebar {...sbProps} isMobile={true} />}</AnimatePresence>
          <div className="flex-1 overflow-y-auto p-12 sm:p-20 lg:p-24 relative z-[105] bg-slate-50/30 dark:bg-slate-900/10">
            <div className="max-w-4xl mx-auto"><AnimatePresence mode="wait">
              <motion.div key={activeSection + activeLang} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.6 }}>
                <div className="mb-20">
                   <div className="flex items-center gap-4 mb-6"><span className="h-1.5 w-20 bg-blue-600 rounded-full" /><span className="text-xs font-black text-blue-600 uppercase tracking-[0.5em]">{activeLang} version</span></div>
                   <h1 className="text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-[0.9]">{sections.find(s => s.id === activeSection)?.label}</h1>
                </div>
                {SECTION_FIELDS[activeSection].map((f, i) => (
                  f.isDivider ? <div key={i} className="py-12 flex items-center gap-8"><span className="text-xs font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.5em]">{f.labelKey ? t(f.labelKey) : ''}</span><div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" /></div> :
                  f.isFeature ? <DashboardFeature key={f.feature} index={i} feature={f.feature} content={content} activeLang={activeLang} updateContent={updateContent} t={t} /> :
                  f.isProject ? <DashboardProject key={f.index} index={f.index} content={content} activeLang={activeLang} updateContent={updateContent} t={t} /> :
                  <DashboardField key={f.path} label={t(f.labelKey)} value={f.path.split('.').reduce((o, i) => o?.[i], content[activeLang]) || ''} type={f.type} onChange={(v) => updateContent(activeLang, f.path, v)} />
                ))}
              </motion.div>
            </AnimatePresence></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

Dashboard.propTypes = { onClose: PropTypes.func.isRequired };

export default Dashboard;
