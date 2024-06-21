import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-xhr-backend'
import { initReactI18next } from 'react-i18next'

import { PUBLIC_BASE_ROUTE_URL } from '../constants/routes'

void i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    backend: {
      loadPath: `${PUBLIC_BASE_ROUTE_URL}/locales/{{lng}}/{{ns}}.translation.json`,
    },
    fallbackLng: 'en',
    ns: [
      'common',
      'users',
      'countries',
      'languages',
      'organizations',
      'inventories',
      'institutionalization',
      'institutionalizationform',
      'report',
      'faq',
    ],
    fallbackNS: 'common',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    supportedLngs: ['en', 'fr'],
  })
