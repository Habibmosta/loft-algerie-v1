import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof import('../../public/locales/en/common.json');
      reservations: typeof import('../../public/locales/en/reservations.json');
    };
  }
}