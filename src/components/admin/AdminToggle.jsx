import React from 'react';
import { useTranslation } from 'react-i18next';
import { Settings } from 'lucide-react';

const AdminToggle = ({ onClick }) => {
  const { t } = useTranslation();

  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 sm:bottom-8 start-4 sm:start-8 z-[90] p-3 sm:p-4 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all group active:scale-95"
      title={t('admin.title')}
    >
      <Settings size={20} className="sm:w-6 sm:h-6 group-hover:rotate-90 transition-transform duration-500" />
    </button>
  );
};

export default AdminToggle;
