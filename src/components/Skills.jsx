import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Code2, Terminal, Layers, ShieldCheck } from 'lucide-react';

const Skills = () => {
  const { t } = useTranslation();

  const skillGroups = [
    {
      title: t('skills.categories.frontend'),
      icon: <Code2 className="text-blue-500" />,
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
      icon: <Terminal className="text-emerald-500" />,
      skills: [
        t('skills.items.electron'),
        t('skills.items.go'),
        t('skills.items.node')
      ]
    },
    {
      title: t('skills.categories.architecture'),
      icon: <Layers className="text-amber-500" />,
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
      icon: <ShieldCheck className="text-red-500" />,
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
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section id="skills" className="py-24 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {t('skills.title')}
          </h2>
          <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full" />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {skillGroups.map((group, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all shadow-sm hover:shadow-md"
            >
              <div className="mb-6 p-3 bg-white dark:bg-slate-800 rounded-2xl w-fit shadow-inner">
                {group.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                {group.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="px-3 py-1 text-sm font-medium rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
