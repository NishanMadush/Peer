import httpStatus from 'http-status';
import { ApiError } from '../../services/errors';
import LanguageModel from './language.model';
/**
 * Create a language
 * @param {ILanguage} languageBody
 * @returns {Promise<ILanguageDoc>}
 */
export const createLanguage = async (languageBody) => {
    return LanguageModel.create(languageBody);
};
/**
 * Query for languages
 * @param {Object} filter the mongo filter
 * @param {Object} options the query options
 * @returns {Promise<QueryResult>}
 */
export const queryLanguages = async (filter, options) => {
    const languages = await LanguageModel.paginate(filter, options);
    return languages;
};
/**
 * Get the language by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<ILanguageDoc|null>}
 */
export const getLanguageById = async (id) => LanguageModel.findById(id);
/**
 * Update the language by id
 * @param {ObjectId} languageId language id
 * @param {UpdateLanguageBody} updateBody update body
 * @returns {Promise<ILanguageDoc|null>}
 */
export const updateLanguageById = async (languageId, updateBody, _t) => {
    const language = await LanguageModel.findByIdAndUpdate(languageId, updateBody, { new: true });
    if (!language) {
        throw new ApiError(httpStatus.NOT_FOUND, _t('language:languageNotFound'));
    }
    return language;
};
/**
 * Delete the language by id
 * @param {ObjectId} languageId language id
 * @returns {Promise<ILanguageDoc|null>}
 */
export const deleteLanguageById = async (languageId, _t) => {
    const language = await getLanguageById(languageId);
    if (!language) {
        throw new ApiError(httpStatus.NOT_FOUND, _t('language:languageNotFound'));
    }
    await language.remove();
    return language;
};
//# sourceMappingURL=language.service.js.map