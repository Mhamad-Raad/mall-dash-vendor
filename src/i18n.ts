import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import ar from './locales/ar.json';
import ku from './locales/ku.json';

import sidebarEn from './locales/Sidebar/en.json';
import navbarEn from './locales/Navbar/en.json';

import themesEn from './locales/Themes/en.json';
import themesAr from './locales/Themes/ar.json';
import themesKu from './locales/Themes/ku.json';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
      sidebar: sidebarEn,
      navbar: navbarEn,
      themes: themesEn,
    },
    ar: {
      translation: ar,
      sidebar: sidebarEn, // Fallback to EN for now
      navbar: navbarEn, // Fallback to EN for now
      themes: themesAr,
    },
    ku: {
      translation: ku,
      sidebar: sidebarEn, // Fallback to EN for now
      navbar: navbarEn, // Fallback to EN for now
      themes: themesKu,
    },
  },
  lng: 'en', // default language
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
