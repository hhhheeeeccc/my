import { useEffect, useState, useCallback, Component } from 'react';
import { useTranslation } from 'react-i18next';
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

// 3D & Technical Overlays
import GlobalCanvas from './components/common/GlobalCanvas';
import TechnicalUI from './components/common/TechnicalUI';

// Admin Components
import Dashboard from './components/admin/Dashboard';
import AdminToggle from './components/admin/AdminToggle';

// Common Components
import Preloader from './components/common/Preloader';

class ErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black text-white p-10 text-center z-[999]">
          <h2 className="text-2xl font-display mb-6">Critical System Error</h2>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 border border-white/20 rounded-full hover:bg-white/10 transition-colors uppercase text-[10px] tracking-widest"
          >
            Re-Initialize System
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const { i18n } = useTranslation();
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useLenis(ScrollTrigger.update);

  useEffect(() => {
    const currentIsAr = i18n.language?.startsWith('ar');
    document.documentElement.dir = currentIsAr ? 'rtl' : 'ltr';
    document.documentElement.lang = currentIsAr ? 'ar' : 'en';
  }, [i18n.language]);

  useEffect(() => {
    if (!isLoaded) return;

    const ctx = gsap.context(() => {
      // Global Section Reveal Transitions
      const sections = gsap.utils.toArray('section:not(#hero)');
      sections.forEach((section) => {
        gsap.fromTo(section,
          { clipPath: 'inset(10% 0% 10% 0%)', opacity: 0 },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            opacity: 1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
              end: 'top 30%',
              scrub: 1,
            }
          }
        );
      });
    });

    return () => ctx.revert();
  }, [isLoaded]);

  const handlePreloaderComplete = useCallback(() => {
    setIsLoaded(true);
    setTimeout(() => ScrollTrigger.refresh(), 100);
  }, []);

  return (
    <ErrorBoundary>
      <ReactLenis root options={{ lerp: 0.08, smoothWheel: true }}>
        <div className="relative min-h-screen bg-black text-white selection:bg-white/10">

          {/* BACKGROUND LAYER (3D) */}
          <GlobalCanvas />

          {/* OVERLAY LAYER (FUI) */}
          <TechnicalUI />

          {/* UI LAYER (Static) */}
          {!isLoaded && <Preloader onComplete={handlePreloaderComplete} />}
          <Navbar isAdminOpen={isAdminOpen} />

          {/* CONTENT LAYER */}
          <main className={`relative z-10 transition-opacity duration-1500 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Contact />
          </main>

          <div className="relative z-10">
            <Footer />
          </div>

          {/* ADMIN LAYER */}
          <AdminToggle onClick={() => setIsAdminOpen(true)} />
          {isAdminOpen && <Dashboard onClose={() => setIsAdminOpen(false)} />}
        </div>
      </ReactLenis>
    </ErrorBoundary>
  );
}

export default App;
