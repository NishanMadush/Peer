import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import config from '../../config/config';
import ApiError from '../../services/errors/ApiError';
import { loggerWithLabel } from '../../services/logger/logger';
import { userService } from '../user';
import Token from './token.model';
import tokenTypes from './token.types';
const logger = loggerWithLabel('token.service');
/**
 * Generate token
 * @param {mongoose.Types.ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
export const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
    const payload = {
        sub: userId,
        iat: moment().unix(),
        exp: expires.unix(),
        type,
    };
    return jwt.sign(payload, secret);
};
/**
 * Save a token
 * @param {string} token
 * @param {mongoose.Types.ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<ITokenDoc>}
 */
export const saveToken = async (token, userId, expires, type, blacklisted = false) => {
    const tokenDoc = await Token.create({
        token,
        user: userId,
        expires: expires.toDate(),
        type,
        blacklisted,
    });
    return tokenDoc;
};
/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<ITokenDoc>}
 */
export const verifyToken = async (token, type) => {
    const payload = jwt.verify(token, config.jwt.secret);
    if (typeof payload.sub !== 'string') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'bad user');
    }
    const tokenDoc = await Token.findOne({
        token,
        type,
        user: payload.sub,
        blacklisted: false,
    });
    if (!tokenDoc) {
        throw new Error('Token not found');
    }
    return tokenDoc;
};
/**
 * Generate auth tokens
 * @param {IUserDoc} user
 * @returns {Promise<IAccessAndRefreshTokens>}
 */
export const generateAuthTokens = async (user) => {
    const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
    const accessToken = generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS);
    const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
    const refreshToken = generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH);
    await saveToken(refreshToken, user.id, refreshTokenExpires, tokenTypes.REFRESH);
    return {
        access: {
            token: accessToken,
            expires: accessTokenExpires.toDate(),
        },
        refresh: {
            token: refreshToken,
            expires: refreshTokenExpires.toDate(),
        },
    };
};
/**
 * Generate create password token
 * @param {string} email
 * @returns {Promise<string>}
 */
export const generateCreatePasswordToken = async (username) => {
    const user = await userService.getUserByUsername(username);
    if (!user) {
        logger.error({
            message: 'User not available',
            meta: {
                action: 'generateCreatePasswordToken',
            },
        });
        throw new ApiError(httpStatus.NO_CONTENT, '');
    }
    const expires = moment().add(config.jwt.resetPasswordExpirationMinutes * 5, 'minutes');
    const createPasswordToken = generateToken(user.id, expires, tokenTypes.CREATE_PASSWORD);
    await saveToken(createPasswordToken, user.id, expires, tokenTypes.CREATE_PASSWORD);
    return { createPasswordToken, email: user.email };
};
/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
export const generateResetPasswordToken = async (username) => {
    const user = await userService.getUserByUsername(username);
    if (!user) {
        logger.error({
            message: 'User not available',
            meta: {
                action: 'generateResetPasswordToken',
            },
        });
        throw new ApiError(httpStatus.NO_CONTENT, '');
    }
    const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
    const resetPasswordToken = generateToken(user.id, expires, tokenTypes.RESET_PASSWORD);
    await saveToken(resetPasswordToken, user.id, expires, tokenTypes.RESET_PASSWORD);
    return { resetPasswordToken, email: user.email };
};
/**
 * Generate verify email token
 * @param {IUserDoc} user
 * @returns {Promise<string>}
 */
export const generateVerifyEmailToken = async (user) => {
    const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
    const verifyEmailToken = generateToken(user.id, expires, tokenTypes.VERIFY_EMAIL);
    await saveToken(verifyEmailToken, user.id, expires, tokenTypes.VERIFY_EMAIL);
    return verifyEmailToken;
};
//# sourceMappingURL=token.service.js.map