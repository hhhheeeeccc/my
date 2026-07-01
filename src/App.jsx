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

// 3D Background
import GlobalCanvas from './components/common/GlobalCanvas';

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
        <div style={{ padding: '4rem', textAlign: 'center', color: '#fff', background: '#000', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Something went wrong</h2>
          <button onClick={() => window.location.reload()} style={{ padding: '0.75rem 2rem', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '0.5rem', color: '#fff', background: 'transparent', cursor: 'pointer', fontSize: '0.875rem' }}>
            Reload Page
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
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  useEffect(() => {
    if (isLoaded) {
      setTimeout(() => ScrollTrigger.refresh(), 200);
    }
  }, [isLoaded]);

  const handlePreloaderComplete = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return (
    <ErrorBoundary>
      <ReactLenis root options={{ lerp: 0.07, smoothWheel: true }}>
        <div className="min-h-screen bg-black overflow-x-hidden relative">

          <GlobalCanvas />

          {!isLoaded && <Preloader onComplete={handlePreloaderComplete} />}

          <Navbar isAdminOpen={isAdminOpen} />

          <main className={`relative z-[5] transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Contact />
          </main>

          <div className="relative z-[5]">
            <Footer />
          </div>

          <AdminToggle onClick={() => setIsAdminOpen(true)} />
          {isAdminOpen && <Dashboard onClose={() => setIsAdminOpen(false)} />}
        </div>
      </ReactLenis>
    </ErrorBoundary>
  );
}

export default App;