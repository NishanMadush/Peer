import Joi from 'joi';
import { CountryStatusEnum } from '../../shared/interfaces/country';
import { objectId } from '../validate';
export const country = {
    code: Joi.string().required(),
    name: Joi.string().required(),
    order: Joi.number(),
    isAppCountry: Joi.boolean(),
    status: Joi.string().valid(...Object.values(CountryStatusEnum)),
};
export const createCountry = {
    body: Joi.object().keys(country),
};
export const getCountries = {
    body: Joi.object().keys({
        name: Joi.string(),
        sortBy: Joi.string(),
        projectBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};
export const getCountry = {
    params: Joi.object().keys({
        countryId: Joi.string().custom(objectId),
    }),
};
export const updateCountry = {
    params: Joi.object().keys({
        countryId: Joi.required().custom(objectId),
    }),
    body: Joi.object().keys(country).min(1),
};
export const deleteCountry = {
    params: Joi.object().keys({
        countryId: Joi.string().custom(objectId),
    }),
};
//# sourceMappingURL=country.validation.js.map