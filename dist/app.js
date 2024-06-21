import compression from 'compression';
import cors from 'cors';
import express from 'express';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import httpStatus from 'http-status';
import i18nextMiddleware from 'i18next-http-middleware';
import passport from 'passport';
import xss from 'xss-clean';
import config from './config/config';
import { API_ENDPOINT } from './constants/apiEndpoints';
import { jwtStrategy } from './modules/auth';
import routes from './routes/api';
import { ApiError, errorConverter, errorHandler } from './services/errors';
import { morgan } from './services/logger';
import i18next from './services/translation/i18n';
import { authLimiter } from './utils';
const app = express();
if (config.env !== 'test') {
    app.use(morgan.successHandler);
    app.use(morgan.errorHandler);
}
// set security HTTP headers
app.use(helmet());
// enable cors
const corsConfig = {
    credentials: true,
    origin: true,
};
app.use(cors(corsConfig));
app.options('*', cors());
// manage translations
app.use(i18nextMiddleware.handle(i18next));
// parse json request body
app.use(express.json());
// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));
// sanitize request data
app.use(xss());
app.use(ExpressMongoSanitize());
// gzip compression
app.use(compression());
// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);
// limit repeated failed requests to auth endpoints
// if (config.env === 'production') {
app.use(`${API_ENDPOINT}/auth`, authLimiter);
// }
// api routes
app.use(API_ENDPOINT, routes);
// send back a 404 error for any unknown api request
app.use((_req, _res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, _req.t('common:routeNotFound')));
});
// convert error to ApiError, if needed
app.use(errorConverter);
// handle error
app.use(errorHandler);
export default app;
//# sourceMappingURL=app.js.map