import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ReactLenis, useLenis } from 'lenis/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

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
    stiffness: 80,
    damping: 25,
    restDelta: 0.001
  });

  // Sync Lenis with GSAP ScrollTrigger
  useLenis(ScrollTrigger.update);

  useEffect(() => {
    const currentIsAr = i18n.language?.startsWith('ar');
    document.documentElement.dir = currentIsAr ? 'rtl' : 'ltr';
    document.documentElement.lang = currentIsAr ? 'ar' : 'en';
  }, [i18n.language]);

  // Cleanup ScrollTriggers on unmount
  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  // Refresh ScrollTriggers after load
  useEffect(() => {
    if (isLoaded) {
      setTimeout(() => ScrollTrigger.refresh(), 200);
    }
  }, [isLoaded]);

  const handlePreloaderComplete = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return (
    <ReactLenis root options={{ lerp: 0.08, smoothWheel: true }}>
      <div className="min-h-screen bg-slate-950 overflow-x-hidden relative">
        <div className="noise-overlay" aria-hidden="true" />

        {/* Preloader */}
        {!isLoaded && <Preloader onComplete={handlePreloaderComplete} />}

        <CustomCursor />
        <GlobalCanvas />

        {/* Scroll progress bar - minimal */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-[1px] z-[150]"
          style={{
            scaleX: smoothProgress,
            transformOrigin: isAr ? "right" : "left",
            background: 'linear-gradient(90deg, transparent, #06b6d4, #8b5cf6, transparent)',
          }}
        />

        <Navbar isAdminOpen={isAdminOpen} />

        <main className={`relative z-10 transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Contact />
        </main>

        <Footer />

        {/* Admin: only via ?admin=1 */}
        {typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('admin') === '1' && (
          <>
            <AdminToggle onClick={() => setIsAdminOpen(true)} />
            {isAdminOpen && <Dashboard onClose={() => setIsAdminOpen(false)} />}
          </>
        )}
      </div>
    </ReactLenis>
  );
}

export default App;