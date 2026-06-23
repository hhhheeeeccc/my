import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Layout, Info, Zap, Briefcase, Mail } from 'lucide-react';

const icons = {
  hero: <Layout size={18} />,
  about: <Info size={18} />,
  skills: <Zap size={18} />,
  projects: <Briefcase size={18} />,
  contact: <Mail size={18} />
};

const SidebarItem = ({ id, label, activeSection, onClick }) => {
  const isActive = activeSection === id;
  return (
    <button onClick={() => onClick(id)} className={`w-full flex items-center gap-5 px-8 py-6 rounded-[2rem] font-black transition-all group relative overflow-hidden ${isActive ? 'bg-blue-600 text-white shadow-2xl scale-[1.05]' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
      <span className={`transition-all duration-500 ${isActive ? 'text-white scale-110' : 'text-blue-600 dark:text-blue-400 group-hover:scale-125'}`}>{icons[id]}</span>
      <span className="text-lg tracking-tight">{label}</span>
      {isActive && <motion.div layoutId="sidebar-indicator" className="absolute end-0 top-0 bottom-0 w-2 bg-white/20" />}
    </button>
  );
};

SidebarItem.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  activeSection: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

export default SidebarItem;
