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
  PythonIcon
} from '../../icons/TechIcons';
import TextReveal3D from '../common/TextReveal3D';

const SkillCard = ({ group, idx }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 50, rotateX: 15 },
        visible: {
          opacity: 1,
          y: 0,
          rotateX: 0,
          transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        }
      }}
      whileHover={{ y: -10 }}
      className="group p-10 rounded-[3rem] bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 relative overflow-hidden perspective-[1000px]"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-600 to-cyan-500 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />

      <motion.div
        style={{ translateZ: "40px" }}
        className="mb-8 p-5 bg-white dark:bg-slate-800 rounded-2xl w-fit shadow-xl group-hover:shadow-blue-500/20 transition-all"
      >
        {group.icon}
      </motion.div>

      <h3
        style={{ translateZ: "30px" }}
        className="text-2xl font-black text-slate-900 dark:text-white mb-8 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
      >
        {group.title}
      </h3>

      <motion.div
        style={{ translateZ: "20px" }}
        className="flex flex-wrap gap-4"
        variants={containerVariants}
      >
        {group.skills.map((skill, sIdx) => (
          <motion.div
            key={sIdx}
            variants={itemVariants}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 group-hover:border-blue-200 dark:group-hover:border-blue-900/50 transition-all"
          >
            {skill.icon && <skill.icon size={18} />}
            <span className="text-sm font-bold">{skill.name}</span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

const Skills = () => {
  const { t } = useTranslation();

  const skillGroups = [
    {
      title: t('skills.categories.frontend', 'Frontend'),
      icon: <Code2 className="text-blue-500" size={32} />,
      skills: [
        { name: 'React', icon: ReactIcon },
        { name: 'JavaScript', icon: JavascriptIcon },
        { name: 'TypeScript', icon: TypescriptIcon },
        { name: 'Tailwind', icon: TailwindIcon },
      ]
    },
    {
      title: t('skills.categories.backend', 'Backend'),
      icon: <Terminal className="text-emerald-500" size={32} />,
      skills: [
        { name: 'Node.js', icon: NodeIcon },
        { name: 'Go', icon: GoIcon },
        { name: 'Python', icon: PythonIcon },
      ]
    },
    {
      title: t('skills.categories.architecture', 'Systems'),
      icon: <Layers className="text-amber-500" size={32} />,
      skills: [
        { name: 'Microservices', icon: null },
        { name: 'Architecture', icon: null },
        { name: 'Performance', icon: null },
      ]
    },
    {
      title: t('skills.categories.cicd', 'DevOps'),
      icon: <ShieldCheck className="text-red-500" size={32} />,
      skills: [
        { name: 'CI/CD', icon: null },
        { name: 'Git', icon: null },
        { name: 'Docker', icon: null },
      ]
    }
  ];

  return (
    <section id="skills" className="py-40 bg-white dark:bg-slate-950 transition-colors duration-500 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-32 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-6 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-black text-xs uppercase tracking-[0.3em] mb-6"
          >
            {t('skills.label', 'Expertise')}
          </motion.div>
          <TextReveal3D
            text={t('skills.title', 'Capabilities')}
            className="text-5xl md:text-8xl font-black text-slate-900 dark:text-white mb-10 tracking-tight text-center justify-center"
          />
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 150 }}
            transition={{ duration: 1, ease: "circOut" }}
            className="h-2 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 rounded-full mt-2"
          />
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {skillGroups.map((group, idx) => (
            <SkillCard key={idx} group={group} idx={idx} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
