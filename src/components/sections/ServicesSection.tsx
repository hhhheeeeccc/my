import React from 'react';
import FadeIn from '../common/FadeIn';

const services = [
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

const ServicesSection = () => {
  return (
    <section className="rounded-t-[40px] bg-white px-5 py-20 sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32">
      <div className="mx-auto flex max-w-5xl flex-col items-center">
        <h2 className="mb-16 text-center text-[clamp(3rem,12vw,160px)] font-black uppercase leading-none tracking-tight text-[#0C0C0C] sm:mb-20 md:mb-28">
          Services
        </h2>

        <div className="w-full">
          {services.map((service, i) => (
            <FadeIn key={i} delay={i * 0.1} y={20}>
              <div className="flex w-full flex-col border-b border-[#0C0C0C]/15 py-8 sm:flex-row sm:items-center sm:gap-10 sm:py-10 md:py-12">
                <span className="text-[clamp(3rem,10vw,140px)] font-black leading-none text-[#0C0C0C] sm:min-w-[160px] md:min-w-[200px]">
                  {service.num}
                </span>
                <div className="mt-4 flex flex-col gap-2 sm:mt-0">
                  <h3 className="text-[clamp(1rem,2.2vw,2.1rem)] font-medium uppercase text-[#0C0C0C]">
                    {service.name}
                  </h3>
                  <p className="max-w-2xl text-[clamp(0.85rem,1.6vw,1.25rem)] font-light leading-relaxed text-[#0C0C0C]/60">
                    {service.desc}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
