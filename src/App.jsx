import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useSpring } from 'framer-motion';
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
import StoryBlobs from './components/common/StoryBlobs';
import GlobalCanvas from './components/common/GlobalCanvas';

function App() {
  const { i18n } = useTranslation();
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const isAr = i18n.language?.startsWith('ar');

  const { scrollYProgress } = useScroll();

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const scaleX = smoothProgress;

  useEffect(() => {
    const currentIsAr = i18n.language?.startsWith('ar');
    document.documentElement.dir = currentIsAr ? 'rtl' : 'ltr';
    document.documentElement.lang = currentIsAr ? 'ar' : 'en';
  }, [i18n.language]);

  return (
    <ReactLenis root>
      <div className="min-h-screen bg-slate-950 transition-colors duration-500 overflow-x-hidden relative">
        <div className="noise-overlay" aria-hidden="true" />
        <CustomCursor />
        {/* <StoryBlobs /> */}

        <GlobalCanvas />

        <motion.div
          className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 z-[150] shadow-[0_0_15px_rgba(59,130,246,0.5)]"
          style={{
            scaleX,
            transformOrigin: isAr ? "right" : "left"
          }}
        />

        <Navbar isAdminOpen={isAdminOpen} />

        <main className="relative z-10">
          <Hero />
          <SectionReveal><About /></SectionReveal>
          <SectionReveal><Skills /></SectionReveal>
          <SectionReveal><Projects /></SectionReveal>
          <SectionReveal><Contact /></SectionReveal>
        </main>

        <Footer />

        <AdminToggle onClick={() => setIsAdminOpen(true)} />
        {isAdminOpen && <Dashboard onClose={() => setIsAdminOpen(false)} />}
      </div>
    </ReactLenis>
  );
}

export default App;
