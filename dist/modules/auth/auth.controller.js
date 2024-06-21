import httpStatus from 'http-status';
import lodash from 'lodash';
import { emailService } from '../../services/email';
import catchAsync from '../../utils/catchAsync';
import { tokenService } from '../token';
import { userService } from '../user';
import * as authService from './auth.service';
import * as languageService from '../language/language.service';
export const register = catchAsync(async (req, res) => {
    const user = await userService.registerUser(req.body, req.t);
    const tokens = await tokenService.generateAuthTokens(user);
    res.status(httpStatus.CREATED).send({ user, tokens });
});
export const login = catchAsync(async (req, res) => {
    const { username, password } = req.body;
    const user = await authService.loginUserWithUsernameAndPassword(username, password, req.t);
    const tokens = await tokenService.generateAuthTokens(user);
    const userRole = await userService.getPermissionsByRole(user?.role);
    const language = await languageService.getLanguageById(user?.languageId);
    const permissions = lodash.map(lodash.filter(userRole?.permissions, { type: 'FrontEnd' }), (permission) => { return permission['permission']; });
    res.cookie('refresh-token', tokens.refresh.token); // May used in continue with the current tokens
    res.send({ user, tokens, permissions, language });
});
export const logout = catchAsync(async (req, res) => {
    await authService.logout(req.body.refreshToken, req.t);
    res.status(httpStatus.NO_CONTENT).send();
});
export const refreshTokens = catchAsync(async (req, res) => {
    const userWithTokens = await authService.refreshAuth(req.body.refreshToken, req.t);
    res.send({ ...userWithTokens });
});
/**
 * Check the username is available. If exist, send an email to the user with password reset link.
 * @param {string} body.username the username of the password to be reset
 * @returns 204 on if the password reset email is sent, or failed
 */
export const forgotPassword = catchAsync(async (req, res) => {
    const { email, resetPasswordToken } = await tokenService.generateResetPasswordToken(req.body.username);
    await emailService.sendResetPasswordEmail(email, resetPasswordToken);
    res.status(httpStatus.NO_CONTENT).send();
});
/**
 * Create the password using the token received to the email
 * @param {string} query.token the token received to the email
 * @param {string} body.password the password
 * @returns 204 on if the password reset is success
 * @returns 422 on if the password reset is failed
 */
export const createPassword = catchAsync(async (req, res) => {
    await authService.createPassword(req.query['token'], req.body.password, req.t);
    res.status(httpStatus.NO_CONTENT).send();
});
/**
 * Update the password using the token received to the email
 * @param {string} query.token the token received to the email
 * @param {string} body.password the new password
 * @returns 204 on if the password reset is success
 * @returns 422 on if the password reset is failed
 */
export const resetPassword = catchAsync(async (req, res) => {
    await authService.resetPassword(req.query['token'], req.body.password, req.t);
    res.status(httpStatus.NO_CONTENT).send();
});
export const sendVerificationEmail = catchAsync(async (req, res) => {
    const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
    const result = await emailService.sendVerificationEmail(req.user.email, verifyEmailToken, `${req.user.firstName} ${req.user.lastName}`);
    res.status(httpStatus.NO_CONTENT).send();
});
/**
 * Verify the user email
 * @param {string} query.token the token received to the email
 * @returns 204 on if the email verification is success
 * @returns 400 on if the email verification failed
 */
export const verifyEmail = catchAsync(async (req, res) => {
    await authService.verifyEmail(req.query['token'], req.t);
    res.status(httpStatus.NO_CONTENT).send();
});
/**
 * Update the password using the username and old password
 * @param {string} body.username the username
 * @param {string} body.oldPassword the old/current password
 * @param {string} body.password the new password
 * @returns 204 on if the password reset is success
 * @returns 422 on if the password reset is failed
 */
export const updatePassword = catchAsync(async (req, res) => {
    await authService.updatePassword(req.body.username, req.body.oldPassword, req.body.password, req.t);
    res.status(httpStatus.NO_CONTENT).send();
});
//# sourceMappingURL=auth.controller.js.map