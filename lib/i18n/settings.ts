export function getOptions(lng = 'en', ns = ['common', 'bills']) {
  return {
    debug: true,
    supportedLngs: ['en', 'fr', 'ar'],
    fallbackLng: 'en',
    lng,
    fallbackNS: 'common',
    defaultNS: 'common',
    ns,
    backend: {
      loadPath: './public/locales/{{lng}}/{{ns}}.json',
    },
  }
}