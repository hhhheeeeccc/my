import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import TechIcons from '../../icons/TechIcons';
import SectionHeader from '../layout/SectionHeader';

const SkillCard = ({ skill, idx }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: idx * 0.05 } }
    }}
    className="group relative p-10 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 overflow-hidden"
  >
    <div className="relative z-10">
      <div className="mb-8 p-4 bg-white dark:bg-slate-950 rounded-2xl w-fit shadow-lg"><TechIcons name={skill.techIcon} className="w-10 h-10" /></div>
      <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">{skill.name}</h3>
      <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{skill.description}</p>
    </div>
    <div className="absolute bottom-0 left-0 w-full h-1.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
  </motion.div>
);

SkillCard.propTypes = {
  skill: PropTypes.shape({
    techIcon: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
  }).isRequired,
  idx: PropTypes.number.isRequired
};

const Skills = () => {
  const { t } = useTranslation();
  const skillList = [
    { key: 'frontend', techIcon: 'react' },
    { key: 'backend', techIcon: 'go' },
    { key: 'desktop', techIcon: 'electron' },
    { key: 'arch', techIcon: 'cleanArch' },
    { key: 'optimization', techIcon: 'performance' },
    { key: 'localization', techIcon: 'i18next' },
  ].map(s => ({ ...s, name: t(`skills.items.${s.key}.name`), description: t(`skills.items.${s.key}.desc`) }));

  return (
    <section id="skills" className="py-40 bg-white dark:bg-transparent transition-colors duration-500 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader subtitle={t('skills.subtitle')} title={t('skills.title')} intro={t('skills.intro')} />
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {skillList.map((s, i) => <SkillCard key={i} skill={s} idx={i} />)}
          </motion.div>
      </div>
    </section>
  );
};
export default Skills;
