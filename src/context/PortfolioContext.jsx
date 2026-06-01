import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from '../i18n';
import { en as initialEn, ar as initialAr } from '../translations';

const PortfolioContext = createContext();

export const usePortfolio = () => useContext(PortfolioContext);

export const PortfolioProvider = ({ children }) => {
  const [content, setContent] = useState(() => {
    const saved = localStorage.getItem('portfolio_content');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved content', e);
      }
    }
    return { en: initialEn.translation, ar: initialAr.translation };
  });

  useEffect(() => {
    // Update i18next resources whenever content changes
    i18n.addResourceBundle('en', 'translation', content.en, true, true);
    i18n.addResourceBundle('ar', 'translation', content.ar, true, true);

    // Persist to localStorage
    localStorage.setItem('portfolio_content', JSON.stringify(content));

    // Force a re-render for i18next if needed (though addResourceBundle is usually enough)
  }, [content]);

  const updateContent = (lang, path, value) => {
    setContent(prev => {
      const newContent = JSON.parse(JSON.stringify(prev)); // Deep clone
      const keys = path.split('.');
      let current = newContent[lang];

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return newContent;
    });
  };

  const resetContent = () => {
    if (window.confirm('Are you sure you want to reset all data to defaults?')) {
      setContent({ en: initialEn.translation, ar: initialAr.translation });
    }
  };

  return (
    <PortfolioContext.Provider value={{ content, updateContent, resetContent }}>
      {children}
    </PortfolioContext.Provider>
  );
};
