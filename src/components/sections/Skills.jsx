import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import TechIcons from '../../icons/TechIcons';
import TextReveal3D from '../layout/TextReveal3D';

const SkillCard = ({ skill, idx }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: idx * 0.05 } }
      }}
      className="group relative p-10 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 overflow-hidden"
    >
      <div className="relative z-10">
        <div
          className="mb-8 p-4 bg-white dark:bg-slate-950 rounded-2xl w-fit shadow-lg"
        >
          <TechIcons name={skill.techIcon} className="w-10 h-10" />
        </div>

        <h3
          className="text-2xl font-black text-slate-900 dark:text-white mb-4"
        >
          {skill.name}
        </h3>

        <p
          className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed"
        >
          {skill.description}
        </p>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </motion.div>
  );
};

const Skills = () => {
  const { t } = useTranslation();

  const skillList = [
    { name: t('skills.items.frontend.name'), description: t('skills.items.frontend.desc'), icon: 'Monitor', techIcon: 'react' },
    { name: t('skills.items.backend.name'), description: t('skills.items.backend.desc'), icon: 'Server', techIcon: 'go' },
    { name: t('skills.items.desktop.name'), description: t('skills.items.desktop.desc'), icon: 'Laptop', techIcon: 'electron' },
    { name: t('skills.items.arch.name'), description: t('skills.items.arch.desc'), icon: 'Layers', techIcon: 'cleanArch' },
    { name: t('skills.items.optimization.name'), description: t('skills.items.optimization.desc'), icon: 'Zap', techIcon: 'performance' },
    { name: t('skills.items.localization.name'), description: t('skills.items.localization.desc'), icon: 'Globe', techIcon: 'i18next' },
  ];

  return (
    <section id="skills" className="py-40 bg-white dark:bg-slate-950 transition-colors duration-500 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-32 flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-12 h-1 bg-blue-600 rounded-full" />
              <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-xs md:text-sm">{t('skills.subtitle', 'Expertise')}</span>
              <div className="w-12 h-1 bg-blue-600 rounded-full" />
            </motion.div>

            <div className="text-5xl md:text-8xl font-black text-slate-900 dark:text-white mb-10 tracking-tight leading-[0.9]">
              <TextReveal3D text={t('skills.title')} />
            </div>

            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl font-semibold opacity-80 leading-relaxed">
              {t('skills.intro', 'Crafting high-performance digital experiences with cutting-edge technologies.')}
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {skillList.map((skill, idx) => (
              <SkillCard key={idx} skill={skill} idx={idx} />
            ))}
          </motion.div>
      </div>
    </section>
  );
};

export default Skills;
