import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import FadeIn from '../common/FadeIn';
import LiveProjectButton from '../common/LiveProjectButton';

const PROJECTS = [
  {
    num: "01",
    client: "Nextlevel Studio",
    category: "Client",
    images: {
      col1_1: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85",
      col1_2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85",
      col2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85"
    }
  },
  {
    num: "02",
    client: "Aura Brand Identity",
    category: "Personal",
    images: {
      col1_1: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85",
      col1_2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85",
      col2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85"
    }
  },
  {
    num: "03",
    client: "Solaris Digital",
    category: "Client",
    images: {
      col1_1: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85",
      col1_2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85",
      col2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85"
    }
  }
];

interface ProjectCardProps {
  project: typeof PROJECTS[0];
  index: number;
  total: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, total }) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start']
  });

  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  return (
    <div ref={container} className="h-[85vh] flex items-center justify-center sticky top-24 md:top-32">
      <motion.div
        style={{ scale }}
        className="w-full h-full rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 border-[#D7E2EA] background-[#0C0C0C] bg-[#0C0C0C] p-4 sm:p-6 md:p-8 flex flex-col gap-6"
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4 sm:gap-8">
            <span className="text-[#D7E2EA] font-black leading-none text-[clamp(2rem,6vw,80px)]">
              {project.num}
            </span>
            <div className="flex flex-col">
              <span className="text-[#D7E2EA] opacity-60 uppercase text-xs sm:text-sm tracking-widest">
                {project.category}
              </span>
              <h3 className="text-[#D7E2EA] font-medium uppercase text-base sm:text-lg md:text-2xl">
                {project.client}
              </h3>
            </div>
          </div>
          <LiveProjectButton />
        </div>

        <div className="flex-1 grid grid-cols-10 gap-4 sm:gap-6 md:gap-8 overflow-hidden">
          <div className="col-span-4 flex flex-col gap-4 sm:gap-6 md:gap-8">
            <img
              src={project.images.col1_1}
              alt="Project detail"
              className="w-full h-[clamp(130px,16vw,230px)] object-cover rounded-[40px] sm:rounded-[50px] md:rounded-[60px]"
            />
            <img
              src={project.images.col1_2}
              alt="Project detail"
              className="w-full h-[clamp(160px,22vw,340px)] object-cover rounded-[40px] sm:rounded-[50px] md:rounded-[60px]"
            />
          </div>
          <div className="col-span-6 h-full">
            <img
              src={project.images.col2}
              alt="Project main"
              className="w-full h-full object-cover rounded-[40px] sm:rounded-[50px] md:rounded-[60px]"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const ProjectsSection: React.FC = () => {
  return (
    <section id="projects" className="bg-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 z-10 px-5 sm:px-8 md:px-10 py-20 relative">
      <div className="max-w-7xl mx-auto">
        <FadeIn delay={0} y={40} className="text-center mb-16 sm:mb-20 md:mb-28">
          <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-[clamp(3rem,12vw,160px)]">
            Project
          </h2>
        </FadeIn>

        <div className="flex flex-col gap-[10vh]">
          {PROJECTS.map((project, i) => (
            <ProjectCard
              key={project.num}
              project={project}
              index={i}
              total={PROJECTS.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
