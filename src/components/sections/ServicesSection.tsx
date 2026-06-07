import React from 'react';
import FadeIn from '../common/FadeIn';

const SERVICES = [
  {
    num: "01",
    name: "3D Modeling",
    desc: "Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for games, products, and visualizations."
  },
  {
    num: "02",
    name: "Rendering",
    desc: "High-quality, photorealistic renders that showcase designs with custom lighting, textures, and materials to bring concepts to life."
  },
  {
    num: "03",
    name: "Motion Design",
    desc: "Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences."
  },
  {
    num: "04",
    name: "Branding",
    desc: "Crafting cohesive visual identities -- from logos to full brand systems -- that communicate a clear and memorable presence."
  },
  {
    num: "05",
    name: "Web Design",
    desc: "Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience."
  }
];

const ServicesSection: React.FC = () => {
  return (
    <section id="price" className="bg-[#FFFFFF] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 relative z-10">
      <div className="max-w-7xl mx-auto">
        <FadeIn delay={0} y={40} className="text-center mb-16 sm:mb-20 md:mb-28">
          <h2 className="text-[#0C0C0C] font-black uppercase leading-none text-[clamp(3rem,12vw,160px)]">
            Services
          </h2>
        </FadeIn>

        <div className="max-w-5xl mx-auto flex flex-col">
          {SERVICES.map((service, i) => (
            <FadeIn
              key={service.num}
              delay={i * 0.1}
              y={30}
              className="flex border-t border-[rgba(12,12,12,0.15)] last:border-b py-8 sm:py-10 md:py-12 items-center"
            >
              <span className="text-[#0C0C0C] font-black leading-none text-[clamp(3rem,10vw,140px)] min-w-[30%]">
                {service.num}
              </span>
              <div className="flex flex-col gap-2">
                <h3 className="text-[#0C0C0C] font-medium uppercase text-[clamp(1rem,2.2vw,2.1rem)]">
                  {service.name}
                </h3>
                <p className="text-[#0C0C0C] font-light leading-relaxed max-w-2xl text-[clamp(0.85rem,1.6vw,1.25rem)] opacity-60">
                  {service.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
