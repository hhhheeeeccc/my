import React from 'react';
import { motion } from 'framer-motion';
import { Globe, X, Layout, Info, Zap, Briefcase, Mail } from 'lucide-react';

const SidebarItem = ({ id, label, activeSection, onClick }) => {
  const isActive = activeSection === id;
  const icons = { hero: <Layout size={18} />, about: <Info size={18} />, skills: <Zap size={18} />, projects: <Briefcase size={18} />, contact: <Mail size={18} /> };
  return (
    <button onClick={() => onClick(id)} className={`w-full flex items-center gap-5 px-8 py-6 rounded-[2rem] font-black transition-all group relative overflow-hidden ${isActive ? 'bg-blue-600 text-white shadow-2xl scale-[1.05]' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
      <span className={`transition-all duration-500 ${isActive ? 'text-white scale-110' : 'text-blue-600 dark:text-blue-400 group-hover:scale-125'}`}>{icons[id]}</span>
      <span className="text-lg tracking-tight">{label}</span>
      {isActive && <motion.div layoutId="sidebar-indicator" className="absolute end-0 top-0 bottom-0 w-2 bg-white/20" />}
    </button>
  );
};

const DashboardSidebar = ({ activeLang, setActiveLang, sections, activeSection, setActiveSection, onExport, t, isMobile, setIsSidebarOpen, isRTL }) => {
  const content = (
    <div className="flex flex-col h-full">
      {isMobile && (
        <div className="flex items-center justify-between mb-10">
          <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">M.Y.H.G</span>
          <button onClick={() => setIsSidebarOpen(false)} className="p-3 bg-slate-100 dark:bg-slate-900 rounded-2xl text-slate-500"><X size={24} /></button>
        </div>
      )}
      <div className="flex bg-slate-100/50 dark:bg-slate-950 p-2 rounded-[2rem] mb-10 border border-slate-200/50 dark:border-slate-800/50 shadow-inner">
        {['en', 'ar'].map(l => (
          <button key={l} onClick={() => { setActiveLang(l); if(isMobile) setIsSidebarOpen(false); }} className={`flex-1 py-4 rounded-[1.5rem] text-sm font-black transition-all uppercase tracking-[0.3em] ${activeLang === l ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-2xl' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>{l}</button>
        ))}
      </div>
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

  if (!isMobile) return <div className="hidden lg:flex w-96 flex-col p-10 bg-white dark:bg-slate-900 border-e border-slate-200/50 dark:border-slate-800/50 gap-4 relative z-[105]">{content}</div>;

  return (
    <div className="lg:hidden">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[120]" />
      <motion.div initial={{ x: isRTL ? '100%' : '-100%' }} animate={{ x: 0 }} exit={{ x: isRTL ? '100%' : '-100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }} className="fixed inset-y-0 start-0 w-80 bg-white dark:bg-slate-950 z-[130] p-8 flex flex-col gap-3 shadow-2xl">{content}</motion.div>
    </div>
  );
};

export default DashboardSidebar;
