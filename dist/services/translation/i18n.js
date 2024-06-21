import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import i18nextMiddleware from 'i18next-http-middleware';
import ICU from 'i18next-icu';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { logger } from '../logger';
// eslint-disable-next-line @typescript-eslint/naming-convention
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line @typescript-eslint/naming-convention
const __dirname = dirname(__filename);
i18next
    .use(i18nextMiddleware.LanguageDetector)
    .use(ICU)
    .use(Backend)
    .init({
    backend: {
        loadPath: join(__dirname, `../../../locales/{{lng}}/{{ns}}.translation.json`),
        // addPath: join(__dirname, `../../../locales/{{lng}}/{{lng}}_{{ns}}.missing_translation.json`),
    },
    debug: false,
    detection: {
        order: ['header', 'querystring', 'cookie'],
        // caches: ['cookie'],
        lookupHeader: 'peer-language',
        lookupQuerystring: 'lng',
        lookupCookie: 'i18next',
    },
    preload: ['en', 'si'],
    fallbackLng: 'en',
    ns: ['common', 'auth', 'user', 'organization', 'inventory'],
    fallbackNS: 'common',
    // saveMissing: true,
    i18nFormat: {
        memoize: false,
        memoizeFallback: false,
    },
}, (err, t) => {
    if (err)
        logger.error(err);
    else {
        logger.info('i18next is ready');
        logger.info(t('auth:loginWrongUserPass'));
        logger.info(t('auth:loginWrongUserPass', { lng: 'si' }));
    }
});
export default i18next;
//# sourceMappingURL=i18n.js.map