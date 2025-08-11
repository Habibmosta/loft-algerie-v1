export function getOptions(lng = 'ar', ns = ['common', 'bills', 'lofts']) {
  return {
    debug: true,
    supportedLngs: ['en', 'fr', 'ar'],
    fallbackLng: 'ar',
    lng,
    fallbackNS: 'common',
    defaultNS: 'common',
    ns,
    backend: {
      loadPath: './public/locales/{{lng}}/{{ns}}.json',
    },
  }
}