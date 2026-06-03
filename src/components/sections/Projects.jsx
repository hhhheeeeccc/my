import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';
import ParallaxContainer from '../common/ParallaxContainer';

const ProjectCard = ({ project, idx }) => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  // Glare effect
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: "1200px"
      }}
      variants={{
        hidden: { opacity: 0, y: 60, rotateX: 10 },
        visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
      }}
      className="group bg-white dark:bg-slate-950 rounded-[3.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-xl hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.35)] transition-shadow duration-500 flex flex-col h-full relative"
    >
      {/* Glare Layer */}
      <motion.div
        style={{
          background: useTransform(() => `radial-gradient(circle at ${glareX.get()} ${glareY.get()}, rgba(255,255,255,0.15) 0%, transparent 80%)`),
          translateZ: "1px"
        }}
        className="absolute inset-0 z-20 pointer-events-none"
      />

      <div className={`h-80 w-full relative overflow-hidden bg-gradient-to-br ${project.iconColor} opacity-90`}>
        <motion.div
          style={{ transformStyle: "preserve-3d", translateZ: "80px" }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
           <div className="text-white/20 font-black text-[12rem] select-none group-hover:scale-110 transition-transform duration-1000">0{idx + 1}</div>
        </motion.div>
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
      </div>

      <div className="p-12 flex flex-col flex-grow" style={{ transformStyle: "preserve-3d", translateZ: "50px" }}>
        <motion.h3
          style={{ translateZ: "60px" }}
          className="text-3xl font-black text-slate-900 dark:text-white mb-5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
        >
          {project.title}
        </motion.h3>
        <motion.p
          style={{ translateZ: "40px" }}
          className="text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed flex-grow font-medium opacity-90"
        >
          {project.description}
        </motion.p>
        <motion.div
          style={{ translateZ: "70px" }}
          className="flex flex-wrap gap-2.5 mb-12"
        >
          {project.tags.map((tag, tIdx) => (
            <span
              key={tIdx}
              className="px-5 py-2 text-xs font-black uppercase tracking-[0.15em] rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/30"
            >
              {tag}
            </span>
          ))}
        </motion.div>
        <div className="flex items-center gap-8 pt-10 border-t border-slate-100 dark:border-slate-800" style={{ translateZ: "30px" }}>
          <motion.button
            whileHover={{ x: 5, scale: 1.05, translateZ: 10 }}
            className="flex items-center gap-2.5 text-sm font-black text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
          >
            <Github size={22} />
            <span>{t('projects.sourceCode')}</span>
          </motion.button>
          <motion.button
            whileHover={{ x: 5, scale: 1.05, translateZ: 10 }}
            className="flex items-center gap-2.5 text-sm font-black text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all"
          >
            <ExternalLink size={22} />
            <span>{t('projects.liveDemo')}</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const Projects = () => {
  const { t } = useTranslation();

  const projects = [
    {
      title: t('projects.project1.title'),
      description: t('projects.project1.description'),
      tags: [
        t('projects.tags.react'),
        t('projects.tags.ts'),
        t('projects.tags.go'),
        t('projects.tags.tailwind'),
        t('projects.tags.arch')
      ],
      iconColor: "from-blue-600 to-indigo-600",
    },
    {
      title: t('projects.project2.title'),
      description: t('projects.project2.description'),
      tags: [
        t('projects.tags.electron'),
        t('projects.tags.js'),
        t('projects.tags.node'),
        t('projects.tags.networking'),
        t('projects.tags.proxy')
      ],
      iconColor: "from-cyan-500 to-blue-500",
    },
    {
      title: t('projects.project3.title'),
      description: t('projects.project3.description'),
      tags: [
        t('projects.tags.react'),
        t('projects.tags.electron'),
        t('projects.tags.node'),
        t('projects.tags.uiohook'),
        t('projects.tags.perf')
      ],
      iconColor: "from-purple-600 to-blue-600",
    }
  ];

  return (
    <section id="projects" className="py-40 bg-slate-50 dark:bg-slate-900/30 transition-colors duration-500 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ParallaxContainer className="flex flex-col items-center">
          <div className="text-center mb-32" style={{ translateZ: "50px" }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-center gap-3 mb-6"
            >
              <div className="w-16 h-1.5 bg-blue-600 rounded-full" />
              <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-xs md:text-sm">{t('projects.subtitle', 'Portfolio')}</span>
              <div className="w-16 h-1.5 bg-blue-600 rounded-full" />
            </motion.div>
            <h2 className="text-5xl md:text-8xl font-black text-slate-900 dark:text-white mb-10 tracking-tight">
              {t('projects.title')}
            </h2>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-semibold opacity-80 leading-relaxed">
              {t('projects.intro', 'A selection of my most challenging and impactful engineering projects.')}
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid lg:grid-cols-3 gap-16 w-full"
            style={{ translateZ: "20px" }}
          >
            {projects.map((project, idx) => (
              <ProjectCard key={idx} project={project} idx={idx} />
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-32 text-center"
            style={{ translateZ: "40px" }}
          >
             <motion.a
               href="#"
               whileHover={{ scale: 1.05, y: -5 }}
               whileTap={{ scale: 0.95 }}
               className="inline-flex items-center gap-4 px-14 py-6 rounded-[2rem] bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black hover:bg-blue-600 dark:hover:bg-blue-500 dark:hover:text-white transition-all group shadow-2xl"
             >
               <span className="text-lg">{t('projects.viewMore', 'View All Work')}</span>
               <ArrowRight className="group-hover:translate-x-3 transition-transform duration-500" size={24} />
             </motion.a>
          </motion.div>
        </ParallaxContainer>
      </div>
    </section>
  );
};

export default Projects;
