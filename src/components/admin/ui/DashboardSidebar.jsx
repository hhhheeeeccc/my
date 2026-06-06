import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Globe, X } from 'lucide-react';
import SidebarItem from './SidebarItem';
import LanguageSwitcher from './LanguageSwitcher';

const DashboardSidebar = ({ activeLang, setActiveLang, sections, activeSection, setActiveSection, onExport, t, isMobile, setIsSidebarOpen, isRTL }) => {
  const sbc = (
    <div className="flex flex-col h-full">
      {isMobile && (
        <div className="flex items-center justify-between mb-10">
          <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">M.Y.H.G</span>
          <button onClick={() => setIsSidebarOpen(false)} className="p-3 bg-slate-100 dark:bg-slate-900 rounded-2xl text-slate-500"><X size={24} /></button>
        </div>
      )}
      <LanguageSwitcher activeLang={activeLang} onLangChange={(l) => { setActiveLang(l); if(isMobile) setIsSidebarOpen(false); }} />
      <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {sections.map(s => <SidebarItem key={s.id} {...s} activeSection={activeSection} onClick={(id) => { setActiveSection(id); if(isMobile) setIsSidebarOpen(false); }} />)}
      </div>
      {!isMobile && (
        <div className="mt-8 pt-8 border-t border-slate-200/50 dark:border-slate-800/50">
          <button onClick={onExport} className="w-full py-5 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-[2rem] hover:border-blue-500 transition-all text-xs font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 group">
            <Globe size={20} className="group-hover:rotate-[360deg] transition-transform duration-1000" /> {t('admin.exportJson')}
          </button>
        </div>
      )}
    </div>
  );

  if (!isMobile) return <div className="hidden lg:flex w-96 flex-col p-10 bg-white dark:bg-slate-900 border-e border-slate-200/50 dark:border-slate-800/50 gap-4 relative z-[105]">{sbc}</div>;

  return (
    <div className="lg:hidden">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[120]" />
      <motion.div initial={{ x: isRTL ? '100%' : '-100%' }} animate={{ x: 0 }} exit={{ x: isRTL ? '100%' : '-100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }} className="fixed inset-y-0 start-0 w-80 bg-white dark:bg-slate-950 z-[130] p-8 flex flex-col gap-3 shadow-2xl">{sbc}</motion.div>
    </div>
  );
};

DashboardSidebar.propTypes = {
  activeLang: PropTypes.string.isRequired,
  setActiveLang: PropTypes.func.isRequired,
  sections: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  })).isRequired,
  activeSection: PropTypes.string.isRequired,
  setActiveSection: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
  setIsSidebarOpen: PropTypes.func.isRequired,
  isRTL: PropTypes.bool.isRequired
};

export default DashboardSidebar;
