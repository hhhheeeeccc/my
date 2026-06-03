import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Save, RotateCcw, X, Edit3, Globe } from 'lucide-react';

const Dashboard = ({ onClose }) => {
  const { content, updateContent, resetContent } = usePortfolio();
  const [activeLang, setActiveLang] = useState('en');
  const [activeSection, setActiveSection] = useState('hero');

  const sections = [
    { id: 'hero', label: 'Hero' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' },
  ];

  const renderField = (label, path, type = 'text') => {
    const keys = path.split('.');
    let value = content[activeLang];
    for (const key of keys) {
      value = value?.[key];
    }
    value = value || '';

    return (
      <div className="mb-6 relative z-[110]">
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 capitalize">
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-slate-50 dark:bg-slate-950 w-full max-w-6xl h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 relative z-[101]">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-2xl text-white">
              <Edit3 size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Portfolio Editor</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Customize your portfolio content</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={resetContent}
              className="p-3 text-slate-500 hover:text-red-500 transition-colors"
              title="Reset to defaults"
            >
              <RotateCcw size={20} />
            </button>
            <button
              onClick={onClose}
              className="p-3 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-700 transition-all"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r border-slate-200 dark:border-slate-800 flex flex-col p-6 gap-2">
            <div className="flex bg-slate-200 dark:bg-slate-900 p-1 rounded-xl mb-6">
              <button
                onClick={() => setActiveLang('en')}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeLang === 'en' ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-slate-500'}`}
              >
                English
              </button>
              <button
                onClick={() => setActiveLang('ar')}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeLang === 'ar' ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-slate-500'}`}
              >
                العربية
              </button>
            </div>

            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-all ${activeSection === section.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-900'}`}
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
                    className="w-full py-3 border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:border-blue-500 transition-all text-sm font-bold flex items-center justify-center gap-2"
                >
                    <Globe size={16} />
                    Export JSON
                </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-8 bg-white dark:bg-slate-900/30 relative z-[105]">
            {activeSection === 'hero' && (
              <div className="max-w-2xl">
                {renderField('Full Name', 'hero.name')}
                {renderField('Professional Title', 'hero.title')}
                {renderField('Short Bio / Subtitle', 'hero.subtitle', 'textarea')}
                {renderField('Explore Button Text', 'hero.ctaWork')}
                {renderField('Contact Button Text', 'hero.ctaContact')}
              </div>
            )}

            {activeSection === 'about' && (
              <div className="max-w-2xl">
                {renderField('Section Title', 'about.title')}
                {renderField('Detailed Bio', 'about.bio', 'textarea')}
                {renderField('Personal Touch Title', 'about.personalTouchTitle')}
                {renderField('Personal Touch Description', 'about.personalTouchBio', 'textarea')}
              </div>
            )}

            {activeSection === 'skills' && (
              <div className="max-w-2xl">
                {renderField('Section Title', 'skills.title')}
                <h4 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6 mt-10">Categories</h4>
                {renderField('Frontend Category', 'skills.categories.frontend')}
                {renderField('Backend/Desktop Category', 'skills.categories.backend')}
                {renderField('Architecture Category', 'skills.categories.architecture')}
                {renderField('CI/CD Category', 'skills.categories.cicd')}
              </div>
            )}

            {activeSection === 'projects' && (
              <div className="max-w-2xl">
                {renderField('Section Title', 'projects.title')}
                <h4 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6 mt-10">Project 1</h4>
                {renderField('P1 Title', 'projects.project1.title')}
                {renderField('P1 Description', 'projects.project1.description', 'textarea')}
                <h4 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6 mt-10">Project 2</h4>
                {renderField('P2 Title', 'projects.project2.title')}
                {renderField('P2 Description', 'projects.project2.description', 'textarea')}
              </div>
            )}

            {activeSection === 'contact' && (
              <div className="max-w-2xl">
                {renderField('Section Title', 'contact.title')}
                {renderField('Subtitle', 'contact.subtitle', 'textarea')}
                {renderField('Email Label', 'contact.emailMe')}
                {renderField('Display Email', 'contact.emailAddress')}
                {renderField('Name Placeholder', 'contact.namePlaceholder')}
                {renderField('Email Placeholder', 'contact.emailPlaceholder')}
                {renderField('Message Placeholder', 'contact.messagePlaceholder')}
                {renderField('Submit Button Text', 'contact.sendButton')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
