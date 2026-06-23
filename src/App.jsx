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

// Common Components
import CustomCursor from './components/common/CustomCursor';
import Preloader from './components/common/Preloader';
import GlobalCanvas from './components/common/GlobalCanvas';

function App() {
  const { i18n } = useTranslation();
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
    <ReactLenis root options={{ lerp: 0.06, smoothWheel: true, duration: 1.2 }}>
      <div className="min-h-screen bg-black overflow-x-hidden relative">
        {/* Cinematic Noise & Vignette in Global Styles */}

        {/* Preloader */}
        {!isLoaded && <Preloader onComplete={handlePreloaderComplete} />}

        {/* CustomCursor with optimized performance */}
        <CustomCursor />

        <GlobalCanvas />

        {/* Cinematic scroll progress */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-[2px] z-[150]"
          style={{
            scaleX: smoothProgress,
            transformOrigin: isAr ? "right" : "left",
            background: 'linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.4), transparent)',
          }}
        />

        <Navbar isAdminOpen={false} />

        <main className="relative z-10" style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 1s' }}>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Contact />
        </main>

        <Footer />
      </div>
    </ReactLenis>
  );
}

export default App;
