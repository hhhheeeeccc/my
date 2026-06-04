import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Code2, Terminal, Layers, ShieldCheck } from 'lucide-react';
import {
  ReactIcon,
  JavascriptIcon,
  TypescriptIcon,
  TailwindIcon,
  NodeIcon,
  GoIcon,
  PythonIcon,
  DockerIcon,
  GitIcon,
  HtmlIcon,
  CssIcon,
  ElectronIcon
} from '../../icons/TechIcons';

const SkillCard = ({ group }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="p-10 rounded-[3rem] bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 h-full flex flex-col"
    >
      <div className="mb-8 p-5 bg-white dark:bg-slate-800 rounded-2xl w-fit shadow-xl">
        {group.icon}
      </div>

      <h3 className="text-xl font-black text-slate-900 dark:text-white mb-8">
        {group.title}
      </h3>

      <div className="flex flex-wrap gap-3 mt-auto">
        {group.skills.map((skill, sIdx) => (
          <div
            key={sIdx}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-300 transition-all"
          >
            {skill.icon && <skill.icon size={16} />}
            <span className="text-[10px] font-black uppercase tracking-widest">{skill.name}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const Skills = () => {
  const { t } = useTranslation();

  const skillGroups = [
    {
      title: t('skills.categories.frontend'),
      icon: <Code2 className="text-blue-500" size={28} />,
      skills: [
        { name: 'React', icon: ReactIcon },
        { name: 'JavaScript', icon: JavascriptIcon },
        { name: 'TypeScript', icon: TypescriptIcon },
        { name: 'Tailwind', icon: TailwindIcon },
        { name: 'HTML5', icon: HtmlIcon },
        { name: 'CSS3', icon: CssIcon },
      ]
    },
    {
      title: t('skills.categories.backend'),
      icon: <Terminal className="text-emerald-500" size={28} />,
      skills: [
        { name: 'Node.js', icon: NodeIcon },
        { name: 'Go', icon: GoIcon },
        { name: 'Python', icon: PythonIcon },
        { name: 'Electron', icon: ElectronIcon },
      ]
    },
    {
      title: t('skills.categories.architecture'),
      icon: <Layers className="text-amber-500" size={28} />,
      skills: [
        { name: 'Architecture', icon: null },
        { name: 'Security', icon: null },
        { name: 'Testing', icon: null },
      ]
    },
    {
      title: t('skills.categories.cicd'),
      icon: <ShieldCheck className="text-red-500" size={28} />,
      skills: [
        { name: 'Docker', icon: DockerIcon },
        { name: 'Git', icon: GitIcon },
        { name: 'CI/CD', icon: null },
      ]
    }
  ];

  return (
    <section id="skills" className="py-40 bg-white dark:bg-slate-950 transition-colors duration-500 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-32 flex flex-col items-center">
          <div className="inline-block px-6 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-black text-[10px] uppercase tracking-[0.3em] mb-8">
            {t('skills.label')}
          </div>
          <h2 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('skills.title')}
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {skillGroups.map((group, idx) => (
            <SkillCard key={idx} group={group} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
