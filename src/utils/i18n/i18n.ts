import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './translations/en.json';
import koTranslation from './translations/ko.json';

const resources = {
  en: {
    translation: enTranslation,
  },
  ko: {
    translation: koTranslation,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'ko',
  keySeparator: false,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
