import React from 'react';
import { GithubIcon, GitlabIcon, LinkedinIcon } from '../icons/CustomIcons';

export const NAV_LINKS = [
  { href: "#about", labelKey: "nav.about" },
  { href: "#skills", labelKey: "nav.skills" },
  { href: "#projects", labelKey: "nav.projects" },
  { href: "#contact", labelKey: "nav.contact" },
];

export const ADMIN_SECTIONS = [
  { id: 'hero', labelKey: 'admin.sections.hero' },
  { id: 'about', labelKey: 'admin.sections.about' },
  { id: 'skills', labelKey: 'admin.sections.skills' },
  { id: 'projects', labelKey: 'admin.sections.projects' },
  { id: 'contact', labelKey: 'admin.sections.contact' },
];

export const BLOBS_CONFIG = [
  { pos: [-4, 2, -3], col: ["#3b82f6", "#1d4ed8"], s: 1.5, d: 0.4, r: 1.5 },
  { pos: [4, -3, -4], col: ["#6366f1", "#4338ca"], s: 1, d: 0.5, r: 2 },
  { pos: [2, 4, -5], col: ["#22d3ee", "#0e7490"], s: 1.2, d: 0.3, r: 1.2 },
  { pos: [0, 0, -6], col: ["#1e40af", "#1e3a8a"], s: 0.8, d: 0.5, r: 4 }
];

export const SECTION_ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  }
};

export const SOCIALS = [
  { icon: <GithubIcon />, link: "#", color: "hover:text-[#333] dark:hover:text-white" },
  { icon: <GitlabIcon />, link: "#", color: "hover:text-[#FC6D26]" },
  { icon: <LinkedinIcon />, link: "#", color: "hover:text-[#0077B5]" }
];
