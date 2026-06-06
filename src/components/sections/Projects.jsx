import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';
import SectionHeader from '../layout/SectionHeader';
import ParallaxContainer from '../common/ParallaxContainer';
import { useSectionInteraction } from '../../hooks/useSectionInteraction';

const ProjectCard = ({ project, idx, interaction }) => {
  const { t } = useTranslation();
  return (
    <ParallaxContainer intensity={15} className="h-full">
      <motion.div
        variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } }}
        onMouseEnter={interaction.onEnter}
        onClick={interaction.onClick}
        onMouseLeave={interaction.onLeave}
        className="group bg-white dark:bg-slate-950 rounded-[3.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-xl hover:shadow-[0_40px_80px_-20px_rgba(37,99,235,0.25)] transition-all duration-700 flex flex-col h-full relative"
      >
        <div className={`h-80 w-full relative overflow-hidden bg-gradient-to-br ${project.iconColor} opacity-90`}>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className="text-white/20 font-black text-[12rem] select-none group-hover:scale-125 group-hover:rotate-6 transition-transform duration-1000">0{idx + 1}</div>
          </div>
          <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
        </div>
        <div className="p-12 flex flex-col flex-grow">
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-5 group-hover:text-blue-600 transition-colors">{project.title}</h3>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed flex-grow font-medium opacity-90">{project.description}</p>
          <div className="flex flex-wrap gap-2.5 mb-12">
            {project.tags.map((tag, i) => (
              <span key={i} className="px-5 py-2 text-xs font-black uppercase tracking-[0.15em] rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/30">{tag}</span>
            ))}
          </div>
          <div className="flex items-center gap-8 pt-10 border-t border-slate-100 dark:border-slate-800">
            {[ [Github, 'projects.sourceCode'], [ExternalLink, 'projects.liveDemo'] ].map(([Icon, key], i) => (
              <motion.button key={i} whileHover={{ x: 5, scale: 1.05 }} className={`flex items-center gap-2.5 text-sm font-black transition-all ${i === 1 ? 'text-blue-600' : 'text-slate-700 dark:text-slate-300'}`}>
                <Icon size={22} /> <span>{t(key)}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </ParallaxContainer>
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
    <section id="projects" className="py-40 bg-slate-50 dark:bg-slate-900/30 transition-colors duration-500 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center">
          <SectionHeader subtitle={t('projects.subtitle')} title={t('projects.title')} intro={t('projects.intro')} />
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="grid lg:grid-cols-3 gap-16 w-full">
            {projects.map((p, i) => <ProjectCard key={i} project={p} idx={i} interaction={interaction} />)}
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-32 text-center">
             <motion.a href="#" whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center gap-4 px-14 py-6 rounded-[2rem] bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black hover:bg-blue-600 transition-all shadow-2xl">
               <span className="text-lg">{t('projects.viewMore')}</span><ArrowRight className="group-hover:translate-x-3 transition-transform" size={24} />
             </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
export default Projects;
