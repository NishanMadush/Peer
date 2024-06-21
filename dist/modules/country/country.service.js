import httpStatus from 'http-status';
import { ApiError } from '../../services/errors';
import CountryModel from './country.model';
/**
 * Create a country
 * @param {ICountryDoc} countryBody
 * @returns {Promise<ICountryDoc>}
 */
export const createCountry = async (countryBody) => {
    return CountryModel.create(countryBody);
};
/**
 * Query for countries
 * @param {Object} filter the mongo filter
 * @param {Object} options the query options
 * @returns {Promise<QueryResult}
 */
export const queryCountries = async (filter, options) => {
    const countries = await CountryModel.paginate(filter, options);
    return countries;
};
/**
 * Get the country by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<ICountryDoc|null>}
 */
export const getCountryById = async (id) => CountryModel.findById(id);
/**
 * Update the country by id
 * @param {ObjectId} countryId country id
 * @param {UpdateCountryBody} updateBody update body
 * @returns {Promise<ICountryDoc|null>}
 */
export const updateCountryById = async (countryId, updateBody, _t) => {
    const country = await CountryModel.findByIdAndUpdate(countryId, updateBody, { new: true });
    if (!country) {
        throw new ApiError(httpStatus.NOT_FOUND, _t('country:countryNotFound'));
    }
    return country;
};
/**
 * Delete the country by id
 * @param {ObjectId} countryId country id
 * @returns {Promise<ICountryDoc|null>}
 */
export const deleteCountryById = async (countryId, _t) => {
    const country = await getCountryById(countryId);
    if (!country) {
        throw new ApiError(httpStatus.NOT_FOUND, _t('country:countryNotFound'));
    }
    await country.remove();
    return country;
};
//# sourceMappingURL=country.service.js.map