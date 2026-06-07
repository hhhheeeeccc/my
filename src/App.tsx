import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import HeroSection from './components/sections/HeroSection';
import MarqueeSection from './components/sections/MarqueeSection';
import AboutSection from './components/sections/AboutSection';
import ServicesSection from './components/sections/ServicesSection';
import ProjectsSection from './components/sections/ProjectsSection';
import ContactSection from './components/sections/ContactSection';
import AdminToggle from './components/admin/AdminToggle';
import Dashboard from './components/admin/Dashboard';

function App() {
  const { i18n } = useTranslation();
  const [isAdminOpen, setIsAdminOpen] = React.useState(false);
  const isAr = i18n.language?.startsWith('ar');

  useEffect(() => {
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language, isAr]);

  return (
    <div className="bg-[#0C0C0C] min-h-screen text-[#D7E2EA] font-['Kanit'] selection:bg-[#BBCCD7] selection:text-[#0C0C0C] overflow-x-clip relative">
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <ContactSection />

      <AdminToggle onClick={() => setIsAdminOpen(true)} />
      {isAdminOpen && <Dashboard onClose={() => setIsAdminOpen(false)} />}
    </div>
  );
}

export default App;
