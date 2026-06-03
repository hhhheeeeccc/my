import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useSpring } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Dashboard from './components/Admin/Dashboard';
import AdminToggle from './components/Admin/AdminToggle';
import CustomCursor from './components/CustomCursor';

function App() {
  const { i18n } = useTranslation();
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const isAr = i18n.language?.startsWith('ar');

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    // Set initial direction based on detected language
    const currentIsAr = i18n.language?.startsWith('ar');
    document.documentElement.dir = currentIsAr ? 'rtl' : 'ltr';
    document.documentElement.lang = currentIsAr ? 'ar' : 'en';
  }, [i18n.language]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500">
      <CustomCursor />
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 z-[60] shadow-[0_0_15px_rgba(59,130,246,0.5)]"
        style={{
          scaleX,
          transformOrigin: isAr ? "right" : "left"
        }}
      />
      <Navbar />
      <main className="relative">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />

      <AdminToggle onClick={() => setIsAdminOpen(true)} />
      {isAdminOpen && <Dashboard onClose={() => setIsAdminOpen(false)} />}
    </div>
  );
}

export default App;
