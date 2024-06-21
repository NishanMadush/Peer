import Joi from 'joi';
import { password, username } from '../validate/custom.validation';
const registerBody = {
    username: Joi.string().required().custom(username),
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    languageId: Joi.string().required(),
    phoneNumber: Joi.string().optional(),
};
export const register = {
    body: Joi.object().keys(registerBody),
};
export const login = {
    body: Joi.object().keys({
        username: Joi.string().required().custom(username),
        password: Joi.string().required(),
    }),
};
export const logout = {
    body: Joi.object().keys({
        refreshToken: Joi.string().required(),
    }),
};
export const refreshTokens = {
    body: Joi.object().keys({
        refreshToken: Joi.string().required(),
    }),
};
export const forgotPassword = {
    body: Joi.object().keys({
        username: Joi.string().required().custom(username),
    }),
};
export const resetPassword = {
    query: Joi.object().keys({
        token: Joi.string().required(),
    }),
    body: Joi.object().keys({
        password: Joi.string().required().custom(password),
        code: Joi.string().optional(),
    }),
};
export const verifyEmail = {
    query: Joi.object().keys({
        token: Joi.string().required(),
    }),
};
export const updatePassword = {
    body: Joi.object().keys({
        username: Joi.string().required().custom(username),
        oldPassword: Joi.string().required().custom(password),
        password: Joi.string().required().custom(password),
    }),
};
//# sourceMappingURL=auth.validation.js.map