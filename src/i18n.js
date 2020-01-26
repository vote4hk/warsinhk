import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import translationEN from '@/locales/en/translation.json'
import translationZH from '@/locales/zh/translation.json'

i18n.use(initReactI18next).init({
  lng: 'zh',
  fallbackLng: 'zh',
  debug: false,
  interpolation: {
    escapeValue: false,
  },

  resources: {
    en: {
      translation: translationEN,
    },
    zh: {
      translation: translationZH,
    },
  },
  react: {
    wait: true,
  },
  keySeparator: '-',
})

export default i18n
