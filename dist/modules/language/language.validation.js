import Joi from 'joi';
import { LanguageDirectionEnum, LanguageStatusEnum } from '../../shared/interfaces/language';
import { objectId } from '../validate';
export const language = {
    code: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string(),
    direction: Joi.string()
        .required()
        .valid(...Object.keys(LanguageDirectionEnum)),
    order: Joi.number(),
    recaptchaLanguageCode: Joi.string(),
    status: Joi.string().valid(...Object.values(LanguageStatusEnum)),
};
export const createLanguage = {
    body: Joi.object().keys(language),
};
export const getLanguages = {
    body: Joi.object().keys({
        name: Joi.string(),
        sortBy: Joi.string(),
        projectBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};
export const getLanguage = {
    params: Joi.object().keys({
        languageId: Joi.string().custom(objectId),
    }),
};
export const updateLanguage = {
    params: Joi.object().keys({
        languageId: Joi.required().custom(objectId),
    }),
    body: Joi.object().keys(language).min(1),
};
export const deleteLanguage = {
    params: Joi.object().keys({
        languageId: Joi.string().custom(objectId),
    }),
};
//# sourceMappingURL=language.validation.js.map