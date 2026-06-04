import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';

const ProjectCard = ({ project, idx }) => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.1) 0%, transparent 70%)`;

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
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
      className="group bg-white dark:bg-slate-950 rounded-[3rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col h-full relative"
    >
      <motion.div
        style={{
          background: glareBackground,
          translateZ: "2px"
        }}
        className="absolute inset-0 z-20 pointer-events-none"
      />

      <div className={`h-72 w-full relative overflow-hidden bg-gradient-to-br ${project.iconColor} opacity-90`}>
        <motion.div
          style={{ transformStyle: "preserve-3d", translateZ: "50px" }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
           <div className="text-white/10 font-black text-[10rem] select-none group-hover:scale-105 transition-transform duration-1000">0{idx + 1}</div>
        </motion.div>
      </div>

      <div className="p-10 flex flex-col flex-grow" style={{ transformStyle: "preserve-3d", translateZ: "30px" }}>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 group-hover:text-blue-600 transition-colors">
          {project.title}
        </h3>
        <p className="text-base text-slate-600 dark:text-slate-400 mb-8 leading-relaxed flex-grow font-medium opacity-90">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-10">
          {project.tags.map((tag, tIdx) => (
            <span
              key={tIdx}
              className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100/50"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-6 pt-8 border-t border-slate-100 dark:border-slate-800">
          <motion.button
            whileHover={{ x: 3 }}
            className="flex items-center gap-2 text-xs font-black text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors"
          >
            <Github size={18} />
            <span>{t('projects.sourceCode')}</span>
          </motion.button>
          <motion.button
            whileHover={{ x: 3 }}
            className="flex items-center gap-2 text-xs font-black text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ExternalLink size={18} />
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
      tags: [t('projects.tags.react'), t('projects.tags.ts'), t('projects.tags.go'), t('projects.tags.tailwind')],
      iconColor: "from-blue-600 to-indigo-600",
    },
    {
      title: t('projects.project2.title'),
      description: t('projects.project2.description'),
      tags: [t('projects.tags.electron'), t('projects.tags.node'), t('projects.tags.networking')],
      iconColor: "from-cyan-500 to-blue-500",
    },
    {
      title: t('projects.project3.title'),
      description: t('projects.project3.description'),
      tags: [t('projects.tags.perf'), t('projects.tags.uiohook')],
      iconColor: "from-purple-600 to-blue-600",
    }
  ];

  return (
    <section id="projects" className="py-40 bg-slate-50 dark:bg-slate-900/30 transition-colors duration-500 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-32">
          <h2 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white mb-10 tracking-tight">
            {t('projects.title')}
          </h2>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium opacity-80 leading-relaxed">
            {t('projects.intro')}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {projects.map((project, idx) => (
            <ProjectCard key={idx} project={project} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
