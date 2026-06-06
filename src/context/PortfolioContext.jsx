import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from '../i18n';
import { en as initialEn, ar as initialAr } from '../translations';

const PortfolioContext = createContext();

export const usePortfolio = () => useContext(PortfolioContext);

export const PortfolioProvider = ({ children }) => {
  const [content, setContent] = useState(() => {
    const saved = globalThis.localStorage?.getItem('portfolio_content');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.en && parsed.ar) return parsed;
      } catch (e) {
        console.error('Failed to parse saved content', e);
      }
    }
    return { en: initialEn.translation, ar: initialAr.translation };
  });

  useEffect(() => {
    i18n.addResourceBundle('en', 'translation', content.en, true, true);
    i18n.addResourceBundle('ar', 'translation', content.ar, true, true);
    globalThis.localStorage?.setItem('portfolio_content', JSON.stringify(content));
    i18n.changeLanguage(i18n.language);
  }, [content]);

  const updateContent = (lang, path, value) => {
    setContent(prev => {
      const newContent = JSON.parse(JSON.stringify(prev));
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
    const defaultContent = { en: initialEn.translation, ar: initialAr.translation };
    setContent(defaultContent);
  };

  return (
    <PortfolioContext.Provider value={{ content, updateContent, resetContent }}>
      {children}
    </PortfolioContext.Provider>
  );
};
