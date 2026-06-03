import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle2 } from 'lucide-react';
import { GithubIcon, LinkedinIcon, GitlabIcon } from '../../icons/CustomIcons';

const Contact = () => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      setTimeout(() => setIsSent(false), 3000);
    }, 1500);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section id="contact" className="py-32 bg-white dark:bg-slate-950 transition-colors duration-500 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6">
              {t('contact.title')}
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium opacity-80">
              {t('contact.subtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-5 gap-16">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="md:col-span-2 space-y-10"
            >
              <motion.div
                variants={itemVariants}
                className="p-10 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-500"
              >
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-400">
                    <Mail size={24} />
                  </div>
                  <span>{t('contact.emailMe')}</span>
                </h3>
                <a
                  href={`mailto:${t('contact.emailAddress')}`}
                  className="text-xl text-blue-600 dark:text-blue-400 font-bold break-all hover:underline decoration-2 underline-offset-4"
                >
                  {t('contact.emailAddress')}
                </a>
              </motion.div>

              <motion.div variants={itemVariants} className="flex justify-center md:justify-start gap-5">
                {[
                  { icon: <GithubIcon />, link: "#", color: "hover:text-[#333] dark:hover:text-white" },
                  { icon: <GitlabIcon />, link: "#", color: "hover:text-[#FC6D26]" },
                  { icon: <LinkedinIcon />, link: "#", color: "hover:text-[#0077B5]" }
                ].map((social, idx) => (
                  <motion.a
                    key={idx}
                    href={social.link}
                    whileHover={{ scale: 1.15, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-5 rounded-2xl bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700 shadow-sm transition-colors ${social.color}`}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="md:col-span-3"
            >
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid sm:grid-cols-2 gap-8">
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-widest">
                      {t('contact.nameLabel')}
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full px-8 py-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                      placeholder={t('contact.namePlaceholder')}
                    />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-widest">
                      {t('contact.emailLabel')}
                    </label>
                    <input
                      required
                      type="email"
                      className="w-full px-8 py-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                      placeholder={t('contact.emailPlaceholder')}
                    />
                  </motion.div>
                </div>
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-widest">
                    {t('contact.messageLabel')}
                  </label>
                  <textarea
                    required
                    rows="6"
                    className="w-full px-8 py-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium resize-none"
                    placeholder={t('contact.messagePlaceholder')}
                  ></textarea>
                </motion.div>
                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting || isSent}
                  type="submit"
                  className={`w-full py-6 ${isSent ? 'bg-emerald-500' : 'bg-blue-600 hover:bg-blue-700'} text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 relative overflow-hidden`}
                >
                  {isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : isSent ? (
                    <>
                      <CheckCircle2 size={24} />
                      <span>Message Sent!</span>
                    </>
                  ) : (
                    <>
                      <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      <span>{t('contact.sendButton')}</span>
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
