import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Code2, Terminal, Layers, ShieldCheck } from 'lucide-react';

const Skills = () => {
  const { t } = useTranslation();

  const skillGroups = [
    {
      title: t('skills.categories.frontend'),
      icon: <Code2 className="text-blue-500" size={32} />,
      skills: [
        t('skills.items.react'),
        t('skills.items.js'),
        t('skills.items.ts'),
        t('skills.items.tailwind'),
        t('skills.items.bootstrap'),
        t('skills.items.html'),
        t('skills.items.css')
      ]
    },
    {
      title: t('skills.categories.backend'),
      icon: <Terminal className="text-emerald-500" size={32} />,
      skills: [
        t('skills.items.electron'),
        t('skills.items.go'),
        t('skills.items.node')
      ]
    },
    {
      title: t('skills.categories.architecture'),
      icon: <Layers className="text-amber-500" size={32} />,
      skills: [
        t('skills.items.microservices'),
        t('skills.items.unitTesting'),
        t('skills.items.e2e'),
        t('skills.items.uiAuto'),
        t('skills.items.eventCoalescing')
      ]
    },
    {
      title: t('skills.categories.cicd'),
      icon: <ShieldCheck className="text-red-500" size={32} />,
      skills: [
        t('skills.items.ghActions'),
        t('skills.items.gitlab'),
        t('skills.items.gitLfs'),
        t('skills.items.codacy'),
        t('skills.items.sonar'),
        t('skills.items.deepSource')
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const tagVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 }
    }
  };

  return (
    <section id="skills" className="py-32 bg-white dark:bg-slate-950 transition-colors duration-500 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-5 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-black text-xs uppercase tracking-[0.2em] mb-4"
          >
            {t('skills.label', 'Expertise')}
          </motion.div>
          <h2 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">
            {t('skills.title')}
          </h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 120 }}
            transition={{ duration: 1 }}
            className="h-2 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 mx-auto rounded-full"
          />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {skillGroups.map((group, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{
                y: -12,
                boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.25)"
              }}
              className="group p-10 rounded-[3rem] bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-600 to-cyan-500 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />

              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0] }}
                className="mb-8 p-5 bg-white dark:bg-slate-800 rounded-2xl w-fit shadow-xl group-hover:shadow-blue-500/20 transition-all"
              >
                {group.icon}
              </motion.div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {group.title}
              </h3>
              <motion.div
                className="flex flex-wrap gap-2.5"
                variants={containerVariants}
              >
                {group.skills.map((skill, sIdx) => (
                  <motion.span
                    key={sIdx}
                    variants={tagVariants}
                    className="px-4 py-2 text-sm font-bold rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 group-hover:border-blue-200 dark:group-hover:border-blue-900/50 transition-colors cursor-default"
                  >
                    {skill}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
