import React from 'react';
import { Settings } from 'lucide-react';

const AdminToggle = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 left-8 z-[90] p-4 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all group"
      title="Open Content Editor"
    >
      <Settings className="group-hover:rotate-90 transition-transform duration-500" />
    </button>
  );
};

export default AdminToggle;
