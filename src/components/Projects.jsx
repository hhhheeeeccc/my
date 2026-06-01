import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { GithubIcon } from '../icons/CustomIcons';

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
      iconColor: "from-blue-600 to-indigo-600"
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
      iconColor: "from-cyan-500 to-blue-500"
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
      iconColor: "from-purple-600 to-blue-600"
    }
  ];

  return (
    <section id="projects" className="py-24 bg-slate-50 dark:bg-slate-900/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {t('projects.title')}
          </h2>
          <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full" />
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {projects.map((project, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group bg-white dark:bg-slate-950 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col"
            >
              <div className={`h-4 w-full bg-gradient-to-r ${project.iconColor}`} />
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed flex-grow">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center space-x-4 rtl:space-x-reverse pt-6 border-t border-slate-100 dark:border-slate-800">
                  <button className="flex items-center space-x-2 rtl:space-x-reverse text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <GithubIcon size={18} />
                    <span>{t('projects.sourceCode')}</span>
                  </button>
                  <button className="flex items-center space-x-2 rtl:space-x-reverse text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <ExternalLink size={18} />
                    <span>{t('projects.liveDemo')}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
