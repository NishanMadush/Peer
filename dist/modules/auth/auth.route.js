import express from 'express';
import { validate } from '../validate';
import { auth, authController, authValidation } from '.';
const router = express.Router();
/**
 * Register a new user
 * @route POST /api/auth/register
 * @headers Accept-Language for translations
 * @param {string} body.username the username of the user
 * @param {string} body.email the email of the user
 * @param {string} body.password the password of the user
 * @param {string} body.firstName the first name of the user
 * @param {string} body.lastName the last name of the user
 * @returns 201 on a successful user creation with IUser details and tokens
 * @returns 400 on if the username is taken or missing parameters
 * @returns 500 on internal error or database error
 */
router.post('/register', validate(authValidation.register), authController.register);
/**
 * Login with username and password.
 * @route POST /api/auth/login
 * @headers Accept-Language for translations
 * @param {string} body.username the username of the user
 * @param {string} body.password the password of the user
 * @returns 200 on a successful login with IUser details and tokens
 * @returns 400 on missing parameters
 * @returns 401 on if the username or password is incorrect
 * @returns 500 on internal error or database error
 */
router.post('/login', validate(authValidation.login), authController.login);
/**
 * Logout from a successful login session
 * @route POST /api/auth/logout
 * @headers Accept-Language for translations
 * @param {string} body.refreshToken the refresh token of the current session
 * @returns 204 on a successful logout
 * @returns 400 on missing parameters
 * @returns 404 on token not found
 * @returns 500 on internal error or database error
 */
router.post('/logout', /*validate(authValidation.logout),*/ authController.logout);
/**
 * Request a new token using current refresh-token
 * @route POST /api/auth/refresh-tokens
 * @headers Accept-Language for translations
 * @param {string} body.refreshToken the refresh token of the current session
 * @returns 200 on a successful token with IUser details
 * @returns 400 on missing parameters
 * @returns 401 on token not valid
 * @returns 500 on internal error or database error
 */
router.post('/refresh-tokens', auth(), validate(authValidation.refreshTokens), authController.refreshTokens);
/**
 * Check whether the username is available. If exist, send an email to the user with password reset link.
 * @route POST /api/auth/forgot-password
 * @headers Accept-Language for translations
 * @param {string} body.username the username of the password to be reset
 * @returns 204 on if the password reset email is sent, or failed
 * @returns 400 on missing parameters
 * @returns 500 on internal error, database error or smtp error
 */
router.post('/forgot-password', validate(authValidation.forgotPassword), authController.forgotPassword);
/**
 * Create the password using the token received to the email
 * @route POST /api/auth/create-password
 * @headers Accept-Language for translations
 * @param {string} query.token the token received to the email
 * @param {string} body.password the new password
 * @returns 204 on if the password create is success
 * @returns 400 on missing parameters
 * @returns 401 on if the password create is failed
 * @returns 500 on internal error or database error
 */
router.post('/create-password', validate(authValidation.resetPassword), authController.createPassword);
/**
 * Update the password using the token received to the email
 * @route POST /api/auth/reset-password
 * @headers Accept-Language for translations
 * @param {string} query.token the token received to the email
 * @param {string} body.password the new password
 * @returns 204 on if the password reset is success
 * @returns 400 on missing parameters
 * @returns 401 on if the password reset is failed
 * @returns 500 on internal error or database error
 */
router.post('/reset-password', validate(authValidation.resetPassword), authController.resetPassword);
/**
 * Update the password using the username
 * @route POST /api/auth/reset-password
 * @headers Accept-Language for translations
 * @param {string} body.username the username
 * @param {string} body.oldPassword the old/current password
 * @param {string} body.password the new password
 * @returns 204 on if the password reset is success
 * @returns 400 on missing parameters
 * @returns 422 on if the password update is failed
 * @returns 500 on internal error or database error
 */
router.post('/update-password', auth(), validate(authValidation.updatePassword), authController.updatePassword);
/**
 * Verify the user email
 * @route POST /api/auth/send-verification-email
 * @security Bearer Token
 * @headers Accept-Language for translations
 * @returns 401 on if the Bearer token is incorrect
 * @returns 500 on internal error, database error or smtp error
 */
router.post('/send-verification-email', auth('MANAGE_USERS'), authController.sendVerificationEmail);
/**
 * Verify the user email
 * @route POST /api/auth/verify-email
 * @headers Accept-Language for translations
 * @param {string} query.token the token received to the email
 * @returns 204 on if the email verification is success
 * @returns 400 on if the email verification failed
 * @returns 500 on internal error or database error
 */
router.post('/verify-email', validate(authValidation.verifyEmail), authController.verifyEmail);
export default router;
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register as user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *             example:
 *               name: fake name
 *               email: fake@example.com
 *               password: password1
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 */
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *             example:
 *               email: fake@example.com
 *               password: password1
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "401":
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 401
 *               message: Invalid email or password
 */
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *             example:
 *               refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZWJhYzUzNDk1NGI1NDEzOTgwNmMxMTIiLCJpYXQiOjE1ODkyOTg0ODQsImV4cCI6MTU4OTMwMDI4NH0.m1U63blB0MLej_WfB7yC2FTMnCziif9X8yzwDEfJXAg
 *     responses:
 *       "204":
 *         description: No content
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
/**
 * @swagger
 * /auth/refresh-tokens:
 *   post:
 *     summary: Refresh auth tokens
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *             example:
 *               refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZWJhYzUzNDk1NGI1NDEzOTgwNmMxMTIiLCJpYXQiOjE1ODkyOTg0ODQsImV4cCI6MTU4OTMwMDI4NH0.m1U63blB0MLej_WfB7yC2FTMnCziif9X8yzwDEfJXAg
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserWithTokens'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Forgot password
 *     description: An email will be sent to reset password.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *             example:
 *               email: fake@example.com
 *     responses:
 *       "204":
 *         description: No content
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The reset password token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *             example:
 *               password: password1
 *     responses:
 *       "204":
 *         description: No content
 *       "401":
 *         description: Password reset failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 401
 *               message: Password reset failed
 */
/**
 * @swagger
 * /auth/send-verification-email:
 *   post:
 *     summary: Send verification email
 *     description: An email will be sent to verify email.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "204":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
/**
 * @swagger
 * /auth/verify-email:
 *   post:
 *     summary: verify email
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The verify email token
 *     responses:
 *       "204":
 *         description: No content
 *       "401":
 *         description: verify email failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 401
 *               message: verify email failed
 */
//# sourceMappingURL=auth.route.js.map