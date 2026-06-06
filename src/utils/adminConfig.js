export const SECTION_FIELDS = {
  hero: [
    { labelKey: 'admin.fields.welcomeTag', path: 'hero.welcome' },
    { labelKey: 'admin.fields.fullName', path: 'hero.name' },
    { labelKey: 'admin.fields.profTitle', path: 'hero.title' },
    { labelKey: 'admin.fields.shortBio', path: 'hero.subtitle', type: 'textarea' },
    { labelKey: 'admin.fields.exploreBtn', path: 'hero.ctaWork', half: true },
    { labelKey: 'admin.fields.contactBtn', path: 'hero.ctaContact', half: true }
  ],
  about: [
    { labelKey: 'admin.fields.secLabel', path: 'about.subtitle' },
    { labelKey: 'admin.fields.secTitle', path: 'about.title' },
    { labelKey: 'admin.fields.intro', path: 'about.intro', type: 'textarea' },
    { labelKey: 'admin.fields.detailedBio', path: 'about.bio', type: 'textarea' },
    { isDivider: true, labelKey: 'admin.fields.highlights' },
    { isFeature: true, feature: 'code' },
    { isFeature: true, feature: 'rocket' },
    { isDivider: true },
    { labelKey: 'admin.fields.personalTouchTitle', path: 'about.personalTouchTitle' },
    { labelKey: 'admin.fields.personalTouchBio', path: 'about.personalTouchBio', type: 'textarea' }
  ],
  skills: [
    { labelKey: 'admin.fields.secLabel', path: 'skills.subtitle' },
    { labelKey: 'admin.fields.secTitle', path: 'skills.title' },
    { labelKey: 'admin.fields.intro', path: 'skills.intro', type: 'textarea' },
    { isDivider: true, labelKey: 'admin.fields.categories' },
    { labelKey: 'admin.fields.frontend', path: 'skills.categories.frontend', half: true },
    { labelKey: 'admin.fields.backend', path: 'skills.categories.backend', half: true },
    { labelKey: 'admin.fields.architecture', path: 'skills.categories.architecture', half: true },
    { labelKey: 'admin.fields.cicd', path: 'skills.categories.cicd', half: true }
  ],
  projects: [
    { labelKey: 'admin.fields.secLabel', path: 'projects.subtitle' },
    { labelKey: 'admin.fields.secTitle', path: 'projects.title' },
    { labelKey: 'admin.fields.intro', path: 'projects.intro', type: 'textarea' },
    { labelKey: 'admin.fields.viewMore', path: 'projects.viewMore' },
    { isDivider: true },
    { isProject: true, index: 1 },
    { isProject: true, index: 2 },
    { isProject: true, index: 3 }
  ],
  contact: [
    { labelKey: 'admin.fields.secTitle', path: 'contact.title' },
    { labelKey: 'admin.fields.subtitle', path: 'contact.subtitle', type: 'textarea' },
    { isDivider: true },
    { labelKey: 'admin.fields.emailLabel', path: 'contact.emailMe', half: true },
    { labelKey: 'admin.fields.displayEmail', path: 'contact.emailAddress', half: true },
    { labelKey: 'admin.fields.namePlaceholder', path: 'contact.namePlaceholder', half: true },
    { labelKey: 'admin.fields.emailPlaceholder', path: 'contact.emailPlaceholder', half: true },
    { labelKey: 'admin.fields.messagePlaceholder', path: 'contact.messagePlaceholder', type: 'textarea' },
    { labelKey: 'admin.fields.submitBtn', path: 'contact.sendButton' }
  ]
};
