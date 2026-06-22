import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react';
import SectionHeader from '../layout/SectionHeader';
import { useSectionInteraction } from '../../hooks/useSectionInteraction';

const ProjectCard = ({ project, idx, interaction }) => {
  const { t } = useTranslation();
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 80 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: idx * 0.15 } }
      }}
      onMouseEnter={interaction.onEnter}
      onClick={interaction.onClick}
      onMouseLeave={interaction.onLeave}
      className="group relative cursor-pointer"
    >
      {/* Card container */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900/60 border border-slate-800/50 backdrop-blur-sm">
        {/* Image / Color header area */}
        <div className="relative h-[320px] md:h-[400px] overflow-hidden">
          {/* Gradient background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${project.iconColor} opacity-80 transition-all duration-700 group-hover:scale-110 group-hover:opacity-100`} />
          {/* Large number overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-[15rem] font-black text-white/[0.04] select-none group-hover:scale-125 group-hover:rotate-3 transition-all duration-1000 ease-out leading-none">
              0{idx + 1}
            </span>
          </div>
          {/* Hover overlay with info */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500 flex items-end">
            <div className="p-8 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
              <div className="flex gap-3">
                <motion.span whileHover={{ scale: 1.1 }} className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white cursor-pointer">
                  <Github size={20} />
                </motion.span>
                <motion.span whileHover={{ scale: 1.1 }} className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white cursor-pointer">
                  <ExternalLink size={20} />
                </motion.span>
              </div>
            </div>
          </div>
          {/* Top-right arrow */}
          <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 translate-x-2 -translate-y-2">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <ArrowUpRight size={18} className="text-white" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 md:p-10">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] rounded-full bg-white/5 text-slate-400 border border-slate-800/50">
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h3 className="text-2xl md:text-3xl font-black text-white mb-3 group-hover:text-cyan-400 transition-colors duration-500">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-slate-500 leading-relaxed font-medium line-clamp-2">
            {project.description}
          </p>

          {/* Bottom link */}
          <div className="mt-8 pt-6 border-t border-slate-800/50 flex items-center justify-between">
            <div className="flex gap-6">
              <motion.a whileHover={{ x: 3 }} className="flex items-center gap-2 text-sm text-slate-500 hover:text-cyan-400 transition-colors font-medium">
                <Github size={16} /> {t('projects.sourceCode')}
              </motion.a>
              <motion.a whileHover={{ x: 3 }} className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-bold">
                <ExternalLink size={16} /> {t('projects.liveDemo')}
              </motion.a>
            </div>
            <motion.div
              className="text-slate-600 group-hover:text-cyan-400 transition-colors"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ArrowUpRight size={20} />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

ProjectCard.propTypes = {
  project: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    iconColor: PropTypes.string.isRequired
  }).isRequired,
  idx: PropTypes.number.isRequired,
  interaction: PropTypes.shape({
    onEnter: PropTypes.func.isRequired,
    onLeave: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired
  }).isRequired
};

const Projects = () => {
  const { t } = useTranslation();
  const interaction = useSectionInteraction();
  const projects = [1, 2, 3].map(i => ({
    title: t(`projects.project${i}.title`),
    description: t(`projects.project${i}.description`),
    tags: i === 1 ? [t('projects.tags.react'), t('projects.tags.ts'), t('projects.tags.go'), t('projects.tags.tailwind'), t('projects.tags.arch')] :
          i === 2 ? [t('projects.tags.electron'), t('projects.tags.js'), t('projects.tags.node'), t('projects.tags.networking'), t('projects.tags.proxy')] :
          [t('projects.tags.react'), t('projects.tags.electron'), t('projects.tags.node'), t('projects.tags.uiohook'), t('projects.tags.perf')],
    iconColor: i === 1 ? "from-blue-600 to-indigo-600" : i === 2 ? "from-cyan-500 to-blue-500" : "from-purple-600 to-blue-600"
  }));

  return (
    <section id="projects" className="py-40 bg-slate-50 dark:bg-transparent transition-colors duration-500 relative overflow-hidden">
      {/* Section number */}
      <div className="absolute top-20 left-8 md:left-12 text-[8rem] font-black text-white/[0.02] leading-none select-none pointer-events-none">
        03
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center">
          <SectionHeader subtitle={t('projects.subtitle')} title={t('projects.title')} intro={t('projects.intro')} />

          {/* Projects grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="w-full"
          >
            {/* First row: 2 projects side by side */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {projects.slice(0, 2).map((p, i) => (
                <ProjectCard key={i} project={p} idx={i} interaction={interaction} />
              ))}
            </div>
            {/* Second row: 1 project centered */}
            <div className="max-w-2xl mx-auto">
              <ProjectCard project={projects[2]} idx={2} interaction={interaction} />
            </div>
          </motion.div>

          {/* View more button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-24 text-center"
          >
            <motion.a
              href="#"
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-4 px-14 py-5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-black tracking-wider uppercase hover:bg-cyan-600 dark:hover:bg-cyan-500 transition-colors duration-500 shadow-2xl"
            >
              <span>{t('projects.viewMore')}</span>
              <ArrowUpRight size={18} />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
export default Projects;