import express from 'express';
import config from '../../config/config';
import authRoute from '../../modules/auth/auth.route';
import countryRoute from '../../modules/country/country.route';
import languageRoute from '../../modules/language/language.route';
import organizationRoute from '../../modules/organization/organization.route';
import userRoute from '../../modules/user/user.route';
import docsRoute from './swagger.route';
import inventoryRoute from '../../modules/inventory/inventory.route';
import baseRoute from '../../modules/base/base.route';
import institutionalizationRoute from '../../modules/institutionalization/institutionalization.route';
import reportRoute from '../../modules/report/index.route';
const router = express.Router();
const defaultIRoute = [
    {
        path: '/auth',
        route: authRoute,
    },
    {
        path: '/users',
        route: userRoute,
    },
    {
        path: '/organizations',
        route: organizationRoute,
    },
    {
        path: '/languages',
        route: languageRoute,
    },
    {
        path: '/countries',
        route: countryRoute,
    },
    {
        path: '/inventory',
        route: inventoryRoute,
    },
    {
        path: '/base',
        route: baseRoute,
    },
    {
        path: '/institutionalization',
        route: institutionalizationRoute,
    },
    {
        path: '/report',
        route: reportRoute,
    }
];
const devIRoute = [
    // IRoute available only in development mode
    {
        path: '/docs',
        route: docsRoute,
    },
];
defaultIRoute.forEach((route) => {
    router.use(route.path, route.route);
});
/* istanbul ignore next */
if (config.env === 'development') {
    devIRoute.forEach((route) => {
        router.use(route.path, route.route);
    });
}
export default router;
//# sourceMappingURL=index.js.map