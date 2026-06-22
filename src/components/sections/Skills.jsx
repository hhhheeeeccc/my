import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import TechIcons from '../../icons/TechIcons';
import SectionHeader from '../layout/SectionHeader';

const SkillCard = ({ skill, idx }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 60, scale: 0.95 },
      visible: {
        opacity: 1, y: 0, scale: 1,
        transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: idx * 0.08 }
      }
    }}
    whileHover={{ y: -8, scale: 1.02 }}
    className="group relative p-8 md:p-10 rounded-2xl bg-slate-900/40 border border-slate-800/40 backdrop-blur-sm hover:border-cyan-500/30 transition-all duration-500 overflow-hidden"
  >
    {/* Hover gradient glow */}
    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/5 group-hover:to-blue-500/5 transition-all duration-700" />

    <div className="relative z-10">
      {/* Icon */}
      <div className="mb-8 p-4 bg-slate-800/80 rounded-2xl w-fit group-hover:bg-cyan-500/10 group-hover:scale-110 transition-all duration-500">
        <TechIcons name={skill.techIcon} className="w-8 h-8 text-cyan-400" />
      </div>

      {/* Title */}
      <h3 className="text-xl md:text-2xl font-black text-white mb-3 group-hover:text-cyan-400 transition-colors duration-500">
        {skill.name}
      </h3>

      {/* Description */}
      <p className="text-slate-500 font-medium leading-relaxed text-sm">
        {skill.description}
      </p>
    </div>

    {/* Bottom accent line */}
    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
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
      {/* Section number */}
      <div className="absolute top-20 right-8 md:right-12 text-[8rem] font-black text-white/[0.02] leading-none select-none pointer-events-none">
        02
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader subtitle={t('skills.subtitle')} title={t('skills.title')} intro={t('skills.intro')} />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {skillList.map((s, i) => <SkillCard key={i} skill={s} idx={i} />)}
        </motion.div>
      </div>
    </section>
  );
};
export default Skills;