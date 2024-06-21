import httpStatus from 'http-status';
import mongoose from 'mongoose';
// import Polyglot from 'node-polyglot'
import ApiError from '../../services/errors/ApiError';
import { loggerWithLabel } from '../../services/logger/logger';
import { UserStatusEnum } from '../../shared/interfaces/user';
import Token from '../token/token.model';
import { generateAuthTokens, verifyToken } from '../token/token.service';
import tokenTypes from '../token/token.types';
import { getUserById, getUserByUsername, getUserByUsernameWithCountry, updateUserById } from '../user/user.service';
// import { messages } from './auth.translation'
const logger = loggerWithLabel('token.service');
/**
 * Login with username and password
 * @param {string} username
 * @param {string} password
 * @returns {Promise<IUserDoc>}
 */
export const loginUserWithUsernameAndPassword = async (username, password, _t) => {
    const user = await getUserByUsernameWithCountry(username);
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!user || !(await user.isPasswordMatch(password))) {
        throw new ApiError(httpStatus.UNAUTHORIZED, _t('auth:loginWrongUserPass'));
        // Below is a sample ICU message
        // throw new ApiError(httpStatus.UNAUTHORIZED, _t('auth:loginAttempts', { attempts: 2 }))
    }
    else if (user.status !== UserStatusEnum.Active) {
        throw new ApiError(httpStatus.UNAUTHORIZED, _t('auth:loginInactiveUser'));
    }
    return user;
};
/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise<void>}
 */
export const logout = async (refreshToken, _t) => {
    console.log('~!@# user token: ', refreshToken);
    const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
    if (!refreshTokenDoc) {
        throw new ApiError(httpStatus.NOT_FOUND, _t('auth:loginNotFound'));
    }
    await refreshTokenDoc.remove();
};
/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<IUserWithTokens>}
 */
export const refreshAuth = async (refreshToken, _t) => {
    try {
        const refreshTokenDoc = await verifyToken(refreshToken, tokenTypes.REFRESH);
        const user = await getUserById(new mongoose.Types.ObjectId(refreshTokenDoc.user));
        if (!user) {
            throw new Error(); //---------------
        }
        await refreshTokenDoc.remove();
        const tokens = await generateAuthTokens(user);
        return { user, tokens };
    }
    catch (error) {
        throw new ApiError(httpStatus.UNAUTHORIZED, _t('auth:pleaseAuthenticate'));
    }
};
/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise<void>}
 */
export const resetPassword = async (resetPasswordToken, newPassword, _t) => {
    try {
        const resetPasswordTokenDoc = await verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
        const user = await getUserById(new mongoose.Types.ObjectId(resetPasswordTokenDoc.user));
        if (!user) {
            logger.error({
                message: 'User not available',
                meta: {
                    action: 'resetPassword',
                },
            });
            throw new Error(); //---------------
        }
        await updateUserById(user.id, { password: newPassword }, _t);
        await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : _t('auth:passwordResetFailed');
        logger.error({
            message: errorMessage,
            meta: {
                action: 'resetPassword',
            },
            error,
        });
        throw new ApiError(httpStatus.BAD_REQUEST, errorMessage);
    }
};
/**
 * Create password
 * @param {string} createPasswordToken
 * @param {string} password
 * @returns {Promise<void>}
 */
export const createPassword = async (createPasswordToken, password, _t) => {
    try {
        const createPasswordTokenDoc = await verifyToken(createPasswordToken, tokenTypes.CREATE_PASSWORD);
        const user = await getUserById(new mongoose.Types.ObjectId(createPasswordTokenDoc.user));
        if (!user) {
            logger.error({
                message: 'User not available',
                meta: {
                    action: 'createPassword',
                },
            });
            throw new Error(); //---------------
        }
        await updateUserById(user.id, { password, isEmailVerified: true, status: UserStatusEnum.Active }, _t);
        await Token.deleteMany({ user: user.id, type: tokenTypes.CREATE_PASSWORD });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : _t('auth:passwordCreateFailed');
        logger.error({
            message: errorMessage,
            meta: {
                action: 'createPassword',
            },
            error,
        });
        throw new ApiError(httpStatus.BAD_REQUEST, errorMessage);
    }
};
/**
 * Update password
 * @param {string} username
 * @param {string} oldPassword
 * @param {string} password
 * @returns {Promise<void>}
 */
export const updatePassword = async (username, oldPassword, password, _t) => {
    try {
        const user = await getUserByUsername(username);
        if (!user || !(await user.isPasswordMatch(oldPassword))) {
            throw new ApiError(httpStatus.UNAUTHORIZED, _t('auth:loginWrongOldPass'));
        }
        else if (user.status !== UserStatusEnum.Active) {
            throw new ApiError(httpStatus.UNAUTHORIZED, _t('auth:loginInactiveUser'));
        }
        await updateUserById(user.id, { password: password }, _t);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : _t('auth:passwordUpdateFailed');
        logger.error({
            message: errorMessage,
            meta: {
                action: 'updatePassword',
            },
            error,
        });
        throw new ApiError(httpStatus.BAD_REQUEST, errorMessage);
    }
};
/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise<IUserDoc | null>}
 */
export const verifyEmail = async (verifyEmailToken, _t) => {
    try {
        const verifyEmailTokenDoc = await verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
        const user = await getUserById(new mongoose.Types.ObjectId(verifyEmailTokenDoc.user));
        if (!user) {
            logger.error({
                message: 'User not available',
                meta: {
                    action: 'verifyEmail',
                },
            });
            throw new Error();
        }
        await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
        const updatedUser = await updateUserById(user.id, { isEmailVerified: true }, _t);
        return updatedUser;
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : _t('auth:emailVerificationFailed');
        logger.error({
            message: errorMessage,
            meta: {
                action: 'verifyEmail',
            },
            error,
        });
        throw new ApiError(httpStatus.BAD_REQUEST, errorMessage);
    }
};
//# sourceMappingURL=auth.service.js.map