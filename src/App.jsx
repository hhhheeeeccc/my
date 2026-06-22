import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { ReactLenis } from 'lenis/react';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import SectionReveal from './components/layout/SectionReveal';

// Section Components
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Skills from './components/sections/Skills';
import Projects from './components/sections/Projects';
import Contact from './components/sections/Contact';

// Admin Components
import Dashboard from './components/admin/Dashboard';
import AdminToggle from './components/admin/AdminToggle';

// Common Components
import CustomCursor from './components/common/CustomCursor';
import Preloader from './components/common/Preloader';
import GlobalCanvas from './components/common/GlobalCanvas';

function App() {
  const { i18n } = useTranslation();
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const isAr = i18n.language?.startsWith('ar');

  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const currentIsAr = i18n.language?.startsWith('ar');
    document.documentElement.dir = currentIsAr ? 'rtl' : 'ltr';
    document.documentElement.lang = currentIsAr ? 'ar' : 'en';
  }, [i18n.language]);

  const handlePreloaderComplete = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return (
    <ReactLenis root>
      <div className="min-h-screen bg-slate-950 transition-colors duration-500 overflow-x-hidden relative">
        <div className="noise-overlay" aria-hidden="true" />

        {/* Preloader */}
        {!isLoaded && <Preloader onComplete={handlePreloaderComplete} />}

        <CustomCursor />
        <GlobalCanvas />

        {/* Scroll progress bar */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-[2px] z-[150]"
          style={{
            scaleX: smoothProgress,
            transformOrigin: isAr ? "right" : "left",
            background: 'linear-gradient(90deg, #06b6d4, #8b5cf6, #06b6d4)',
          }}
        />

        <Navbar isAdminOpen={isAdminOpen} />

        <main className={`relative z-10 transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <Hero />
          <SectionReveal variant="wipe"><About /></SectionReveal>
          <SectionReveal variant="scaleReveal"><Skills /></SectionReveal>
          <SectionReveal><Projects /></SectionReveal>
          <SectionReveal variant="slideIn"><Contact /></SectionReveal>
        </main>

        <Footer />

        <AdminToggle onClick={() => setIsAdminOpen(true)} />
        {isAdminOpen && <Dashboard onClose={() => setIsAdminOpen(false)} />}
      </div>
    </ReactLenis>
  );
}

export default App;