import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
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
import Experience3D from './components/common/Experience3D';
import StoryBlobs from './components/common/StoryBlobs';

function App() {
  const { i18n } = useTranslation();
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const isAr = i18n.language?.startsWith('ar');

  const { scrollYProgress } = useScroll();

  // High-end smooth progress for global interactions
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Global 3D scene distortion and scale
  const sceneRotateX = useTransform(smoothProgress, [0, 0.5, 1], ["2deg", "0deg", "-2deg"]);
  const sceneRotateY = useTransform(smoothProgress, [0, 1], [isAr ? "2deg" : "-2deg", isAr ? "-2deg" : "2deg"]);
  const sceneScale = useTransform(smoothProgress, [0, 0.5, 1], [1, 0.98, 1]);

  // Progress bar logic
  const scaleX = smoothProgress;

  useEffect(() => {
    const currentIsAr = i18n.language?.startsWith('ar');
    document.documentElement.dir = currentIsAr ? 'rtl' : 'ltr';
    document.documentElement.lang = currentIsAr ? 'ar' : 'en';
  }, [i18n.language]);

  return (
    <ReactLenis root>
      <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500 overflow-x-hidden relative">
        <div className="noise-overlay" aria-hidden="true" />
        <CustomCursor />
        <StoryBlobs />
        <Experience3D />

        <motion.div
          className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 z-[150] shadow-[0_0_15px_rgba(59,130,246,0.5)]"
          style={{
            scaleX,
            transformOrigin: isAr ? "right" : "left"
          }}
        />

        <Navbar />

        <motion.main
          style={{
            perspective: "2000px",
            transformStyle: "preserve-3d"
          }}
          className="relative z-10"
        >
          <motion.div
            style={{
              rotateX: sceneRotateX,
              rotateY: sceneRotateY,
              scale: sceneScale,
              transformStyle: "preserve-3d"
            }}
            className="w-full origin-center transition-transform duration-1000 ease-out"
          >
            <Hero />
            <SectionReveal><About /></SectionReveal>
            <SectionReveal><Skills /></SectionReveal>
            <SectionReveal><Projects /></SectionReveal>
            <SectionReveal><Contact /></SectionReveal>
          </motion.div>
        </motion.main>

        <Footer />

        <AdminToggle onClick={() => setIsAdminOpen(true)} />
        {isAdminOpen && <Dashboard onClose={() => setIsAdminOpen(false)} />}
      </div>
    </ReactLenis>
  );
}

export default App;
