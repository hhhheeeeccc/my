import React from 'react';
import HeroSection from './components/sections/HeroSection';
import MarqueeSection from './components/sections/MarqueeSection';
import AboutSection from './components/sections/AboutSection';
import ServicesSection from './components/sections/ServicesSection';
import ProjectsSection from './components/sections/ProjectsSection';

function App() {
  return (
    <div className="bg-[#0C0C0C] min-h-screen text-[#D7E2EA] font-['Kanit'] selection:bg-[#BBCCD7] selection:text-[#0C0C0C] overflow-x-clip">
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
    </div>
  );
}

export default App;
