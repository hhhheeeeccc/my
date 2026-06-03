import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import SmoothScroll from './components/common/SmoothScroll';
import './i18n';
import { ThemeProvider } from './context/ThemeContext';
import { PortfolioProvider } from './context/PortfolioContext';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PortfolioProvider>
      <ThemeProvider>
        <SmoothScroll><App /></SmoothScroll>
      </ThemeProvider>
    </PortfolioProvider>
  </React.StrictMode>
);
