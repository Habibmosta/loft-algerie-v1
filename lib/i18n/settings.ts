export function getOptions(lng = 'fr', ns = ['common', 'bills', 'lofts', 'owners', 'teams', 'reservations']) {
  return {
    debug: false, // Désactiver le debug en production
    supportedLngs: ['en', 'fr', 'ar'],
    fallbackLng: 'fr',
    lng,
    fallbackNS: 'common',
    defaultNS: 'common',
    ns,
    backend: {
      loadPath: './public/locales/{{lng}}/{{ns}}.json',
    },
  }
}