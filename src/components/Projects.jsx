import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';

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
      image: "bg-blue-600"
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
      image: "bg-cyan-500"
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
      image: "bg-purple-600"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <section id="projects" className="py-32 bg-slate-50 dark:bg-slate-900/50 transition-colors duration-300 relative overflow-hidden">
       {/* Background accent */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <div className="w-12 h-1 bg-blue-600 rounded-full" />
            <span className="text-blue-600 font-bold uppercase tracking-widest text-sm">{t('projects.subtitle', 'Portfolio')}</span>
            <div className="w-12 h-1 bg-blue-600 rounded-full" />
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6">
            {t('projects.title')}
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
            {t('projects.intro', 'A selection of my most challenging and impactful engineering projects.')}
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid lg:grid-cols-3 gap-12"
        >
          {projects.map((project, idx) => (
            <motion.div
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 60 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
              }}
              className="group bg-white dark:bg-slate-950 rounded-[3rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-xl hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] transition-all duration-500 flex flex-col h-full relative"
            >
              {/* Image Placeholder with Gradient */}
              <div className={`h-64 w-full relative overflow-hidden bg-gradient-to-br ${project.iconColor} opacity-90`}>
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="text-white/20 font-black text-9xl select-none">0{idx + 1}</div>
                </div>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
              </div>

              <div className="p-10 flex flex-col flex-grow">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed flex-grow font-medium">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-10">
                  {project.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-4 py-1.5 text-xs font-black uppercase tracking-widest rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-6 pt-8 border-t border-slate-100 dark:border-slate-800">
                  <button className="flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all transform hover:translate-x-1">
                    <Github size={20} />
                    <span>{t('projects.sourceCode')}</span>
                  </button>
                  <button className="flex items-center gap-2 text-sm font-black text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all transform hover:translate-x-1">
                    <ExternalLink size={20} />
                    <span>{t('projects.liveDemo')}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
           <a href="#" className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black hover:bg-blue-600 dark:hover:bg-blue-500 dark:hover:text-white transition-all transform hover:scale-105 active:scale-95 group shadow-xl">
             <span>{t('projects.viewMore', 'View All Engineering Work')}</span>
             <ArrowRight className="group-hover:translate-x-2 transition-transform" />
           </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
