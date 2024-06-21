import lodash from 'lodash';
import winston from 'winston';
import config from '../../config/config';
const enumerateErrorFormat = winston.format((info) => {
    if (info instanceof Error) {
        Object.assign(info, { message: info.stack });
    }
    return info;
});
const logger = winston.createLogger({
    level: config.env === 'development' ? 'debug' : 'info',
    format: winston.format.combine(enumerateErrorFormat(), config.env === 'development' ? winston.format.colorize() : winston.format.uncolorize(), winston.format.splat(), winston.format.printf((info) => `${info.level}: ${info.message}`)),
    transports: [
        new winston.transports.Console({
            stderrLevels: ['error'],
        }),
    ],
});
/**
 * Creates logger options for use by winston.
 * @param callingModule The label of the logger
 * @returns the created options
 */
export const loggerWithLabel = (callingModule) => {
    return winston.createLogger({
        level: config.env === 'development' ? 'debug' : 'info',
        format: winston.format.combine(enumerateErrorFormat(), winston.format.label({ label: callingModule }), winston.format.timestamp(), config.env === 'development' ? winston.format.colorize() : winston.format.uncolorize(), winston.format.splat(), winston.format.printf((info) => `${info.level} ${info.timestamp} [${info.label}]: ${JSON.stringify(lodash.omit(info, ['level', 'timestamp', 'label']))}`)),
        transports: [
            new winston.transports.Console({
                stderrLevels: ['error'],
            }),
        ],
    });
};
export default logger;
//# sourceMappingURL=logger.js.map