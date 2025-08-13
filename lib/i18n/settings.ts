export function getOptions(lng = 'fr', ns = ['common', 'bills', 'lofts', 'owners', 'teams', 'reservations', 'transactions']) {
  return {
    debug: true, // Activer le debug pour voir les problèmes
    supportedLngs: ['en', 'fr', 'ar'],
    fallbackLng: 'fr',
    lng,
    fallbackNS: 'common',
    defaultNS: 'common',
    ns,
    backend: {
      loadPath: './public/locales/{{lng}}/{{ns}}.json',
      // Désactiver le cache pour forcer le rechargement
      allowMultiLoading: false,
      crossDomain: false,
      withCredentials: false,
      requestOptions: {
        cache: 'no-cache',
        mode: 'cors',
      },
    },
  }
}