import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import HttpBackend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { getOptions } from './settings'

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    ...getOptions(),
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    detection: {
      order: ['cookie', 'htmlTag', 'path', 'subdomain'],
      caches: ['cookie'],
    },
  }, (err, t) => {
    if (err) return console.log('something went wrong loading', err);
    console.log('i18next initialized with options:', i18n.options);
    console.log('i18next resources for ar/bills:', JSON.stringify(i18n.getResourceBundle('ar', 'bills'), null, 2));
  })

export default i18n