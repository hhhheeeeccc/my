import React from 'react';
import { ReactLenis } from 'lenis/react';

// Section Components
import HeroSection from './components/sections/HeroSection';
import MarqueeSection from './components/sections/MarqueeSection';
import AboutSection from './components/sections/AboutSection';
import ServicesSection from './components/sections/ServicesSection';
import ProjectsSection from './components/sections/ProjectsSection';

function App() {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
      <div className="main-wrapper relative min-h-screen">
        <div className="noise-overlay" aria-hidden="true" />

        <main>
          <HeroSection />
          <MarqueeSection />
          <AboutSection />
          <ServicesSection />
          <ProjectsSection />
        </main>

        <footer className="bg-[#0C0C0C] py-20 px-10 text-center border-t border-[#D7E2EA]/10">
          <p className="text-[#D7E2EA]/40 uppercase tracking-widest text-sm">
            © {new Date().getFullYear()} Jack -- 3D Creator. All rights reserved.
          </p>
        </footer>
      </div>
    </ReactLenis>
  );
}

export default App;
