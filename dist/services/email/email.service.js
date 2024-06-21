import nodemailer from 'nodemailer';
import config from '../../config/config';
import logger from '../logger/logger';
import { EMAIL_SENDER_SIGNATURE, PUBLIC_PASSWORD_RESET_ROUTE } from '../../constants/helper';
import tokenTypes from '../../modules/token/token.types';
export const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== 'test') {
    transport
        .verify()
        .then(() => logger.info('Connected to email server'))
        .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}
/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @param {string} html
 * @returns {Promise<void>}
 */
export const sendEmail = async (to, subject, text, html) => {
    const msg = {
        from: config.email.from,
        to,
        subject,
        text,
        html,
    };
    await transport.sendMail(msg);
};
/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise<void>}
 */
export const sendResetPasswordEmail = async (to, token) => {
    const subject = 'Reset password';
    // replace this url with the link to the reset password page of your front-end app
    const resetPasswordUrl = `${config.frontUrl}${PUBLIC_PASSWORD_RESET_ROUTE}?action=${tokenTypes.RESET_PASSWORD}&token=${token}`;
    const text = `Hi,
  To reset your password, click on this link: ${resetPasswordUrl}
  If you did not request any password resets, then ignore this email.
  Thanks,
  ${EMAIL_SENDER_SIGNATURE}`;
    const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Dear user,</strong></h4>
  <p>To reset your password, click on this link: <a href='${resetPasswordUrl}'>${resetPasswordUrl}</a></p>
  <p>If you did not request any password resets, please ignore this email.</p>
  <p>Thanks,</p>
  <p><strong>${EMAIL_SENDER_SIGNATURE}</strong></p></div>`;
    await sendEmail(to, subject, text, html);
};
/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise<void>}
 */
export const sendCreatePasswordEmail = async (to, token) => {
    const subject = 'Create password';
    // replace this url with the link to the reset password page of your front-end app
    const resetPasswordUrl = `${config.frontUrl}${PUBLIC_PASSWORD_RESET_ROUTE}?action=${tokenTypes.CREATE_PASSWORD}&token=${token}`;
    const text = `Hi,
  Welcome!
  To create your password, click on this link: ${resetPasswordUrl}
  If this is not for you, please ignore this email.
  Thanks,
  ${EMAIL_SENDER_SIGNATURE}`;
    const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Dear user,</strong></h4>
  <p>To create your password, click on this link: <a href='${resetPasswordUrl}'>${resetPasswordUrl}</a></p>
  <p>If this is not for you, please ignore this email.</p>
  <p>Thanks,</p>
  <p><strong>${EMAIL_SENDER_SIGNATURE}</strong></p></div>`;
    await sendEmail(to, subject, text, html);
};
/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @param {string} name
 * @returns {Promise<void>}
 */
export const sendVerificationEmail = async (to, token, name) => {
    const subject = 'Email Verification';
    // replace this url with the link to the email verification page of your front-end app
    const verificationEmailUrl = `${config.frontUrl}`.includes('http') ? `${config.frontUrl}/verify-email?token=${token}` : `http://${config.frontUrl}/verify-email?token=${token}`;
    const text = `Hi ${name},
  To verify your email, click on this link: ${verificationEmailUrl}
  If you did not create an account, then ignore this email.
  Thanks,
  ${EMAIL_SENDER_SIGNATURE}`;
    const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
  <p>To verify your email, click on this link: ${verificationEmailUrl}</p>
  <p>If you did not create an account, then ignore this email.</p>
  <p>Thanks,</p>
  <p><strong>${EMAIL_SENDER_SIGNATURE}</strong></p></div></div>`;
    await sendEmail(to, subject, text, html);
};
/**
 * Send email verification after registration
 * @param {string} to
 * @param {string} token
 * @param {string} name
 * @returns {Promise<void>}
 */
export const sendSuccessfulRegistration = async (to, token, name) => {
    const subject = 'Email Verification';
    // replace this url with the link to the email verification page of your front-end app
    const verificationEmailUrl = `${config.frontUrl}`.includes('http') ? `${config.frontUrl}/verify-email?token=${token}` : `http://${config.frontUrl}/verify-email?token=${token}`;
    const text = `Hi ${name},
  Congratulations! Your account has been created. 
  You are almost there. Complete the final step by verifying your email at: ${verificationEmailUrl}
  Don't hesitate to contact us if you face any problems
  Regards,
  ${EMAIL_SENDER_SIGNATURE}`;
    const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
  <p>Congratulations! Your account has been created.</p>
  <p>You are almost there. Complete the final step by verifying your email at: ${verificationEmailUrl}</p>
  <p>Don't hesitate to contact us if you face any problems</p>
  <p>Regards,</p>
  <p><strong>${EMAIL_SENDER_SIGNATURE}</strong></p></div></div>`;
    await sendEmail(to, subject, text, html);
};
/**
 * Send email verification after registration
 * @param {string} to
 * @param {string} name
 * @returns {Promise<void>}
 */
export const sendAccountCreated = async (to, name) => {
    const subject = 'Account Created Successfully';
    // replace this url with the link to the email verification page of your front-end app
    const loginUrl = `http://${config.frontUrl}/auth/login`;
    const text = `Hi ${name},
  Congratulations! Your account has been created successfully. 
  You can now login at: ${loginUrl}
  Don't hesitate to contact us if you face any problems
  Regards,
  ${EMAIL_SENDER_SIGNATURE}`;
    const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
  <p>Congratulations! Your account has been created successfully.</p>
  <p>You can now login at: ${loginUrl}</p>
  <p>Don't hesitate to contact us if you face any problems</p>
  <p>Regards,</p>
  <p><strong>${EMAIL_SENDER_SIGNATURE}</strong></p></div></div>`;
    await sendEmail(to, subject, text, html);
};
//# sourceMappingURL=email.service.js.map