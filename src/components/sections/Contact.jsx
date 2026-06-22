import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle2 } from 'lucide-react';
import Magnetic from '../common/Magnetic';
import SectionHeader from '../layout/SectionHeader';
import { SOCIALS, SECTION_ANIMATION_VARIANTS } from '../../utils/constants.jsx';

const Contact = () => {
  const { t } = useTranslation();
  const [s, setS] = useState({ sub: false, sent: false });
  const handleSubmit = (e) => {
    e.preventDefault(); setS({ sub: true, sent: false });
    setTimeout(() => { setS({ sub: false, sent: true }); setTimeout(() => setS(p => ({ ...p, sent: false })), 3000); }, 1500);
  };
  const { container, item: iv } = SECTION_ANIMATION_VARIANTS;

  return (
    <section id="contact" className="py-40 bg-white dark:bg-transparent transition-colors duration-500 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader subtitle={t('contact.subtitle')} title={t('contact.title')} intro={t('contact.intro', "I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.")} />
        <div className="grid md:grid-cols-5 gap-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} transition={container.transition} className="md:col-span-2 space-y-12">
            <motion.div variants={iv} className="p-10 rounded-[3rem] bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-4"><div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl text-blue-600"><Mail size={24} /></div><span>{t('contact.emailMe')}</span></h3>
              <a href={`mailto:${t('contact.emailAddress')}`} className="text-xl text-blue-600 font-bold break-all hover:underline decoration-2 underline-offset-4">{t('contact.emailAddress')}</a>
            </motion.div>
            <motion.div variants={iv} className="flex justify-center md:justify-start gap-5">
              {SOCIALS.map((soc, i) => <Magnetic key={i}><motion.a href={soc.link} whileHover={{ scale: 1.15, y: -5 }} className={`p-5 rounded-2xl bg-white dark:bg-slate-800 text-slate-500 border border-slate-100 dark:border-slate-700 shadow-sm transition-colors ${soc.color}`}>{soc.icon}</motion.a></Magnetic>)}
            </motion.div>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} transition={container.transition} className="md:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid sm:grid-cols-2 gap-8">
                {['name', 'email'].map(f => (
                  <motion.div key={f} variants={iv}>
                    <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-widest">{t(`contact.${f}Label`)}</label>
                    <input required type={f === 'email' ? 'email' : 'text'} className="w-full px-8 py-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium" placeholder={t(`contact.${f}Placeholder`)} />
                  </motion.div>
                ))}
              </div>
              <motion.div variants={iv}>
                <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-widest">{t('contact.messageLabel')}</label>
                <textarea required rows="6" className="w-full px-8 py-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium resize-none" placeholder={t('contact.messagePlaceholder')}></textarea>
              </motion.div>
              <Magnetic><motion.button variants={iv} whileHover={{ scale: 1.02 }} disabled={s.sub || s.sent} type="submit" className={`w-full py-6 ${s.sent ? 'bg-emerald-500' : 'bg-blue-600'} text-white font-black rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 relative overflow-hidden`}>
                {s.sub ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full" /> : s.sent ? <><CheckCircle2 size={24} /><span>{t('contact.messageSent')}</span></> : <><Send size={20} className="group-hover:translate-x-1 transition-transform" /><span>{t('contact.sendButton')}</span></>}
              </motion.button></Magnetic>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
export default Contact;
