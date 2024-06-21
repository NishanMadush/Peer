import httpStatus from 'http-status';
import { ApiError } from '../../services/errors';
import { InstitutionalizationForm as InstitutionalizationFormModel, InstitutionalizationCountryReview as InstitutionalizationCountryReviewModel, InstitutionalizationOrganization as InstitutionalizationOrganizationModel, } from './institutionalization.model';
// #region Assessment-Form
/**
 * Create an assessment form
 * @param {IInstitutionalizationForm} institutionalizationFormBody
 * @returns {Promise<IInstitutionalizationFormDoc|null>}
 */
export const createInstitutionalizationForm = async (institutionalizationFormBody) => {
    return InstitutionalizationFormModel.create(institutionalizationFormBody);
};
/**
 * Query for assessment forms
 * @param {Object} filter the mongo filter
 * @param {Object} options the query options
 * @returns {Promise<QueryResult>}
 */
export const queryInstitutionalizationForms = async (filter, options) => {
    const institutionalizationForms = await InstitutionalizationFormModel.paginate(filter, options);
    return institutionalizationForms;
};
/**
 * Get the assessment form by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IInstitutionalizationFormDoc|null>}
 */
export const getInstitutionalizationFormById = async (id) => InstitutionalizationFormModel.findById(id);
/**
 * Update the assessment form by id
 * @param {ObjectId} InstitutionalizationCountryReviewAssessmentId assessment form id
 * @param {UpdateInstitutionalizationFormBody} updateInstitutionalizationFormBody update body
 * @returns {Promise<IInstitutionalizationFormDoc|null>}
 */
export const updateInstitutionalizationFormById = async (InstitutionalizationCountryReviewAssessmentId, updateInstitutionalizationFormBody, _t) => {
    const institutionalizationForm = await InstitutionalizationFormModel.findByIdAndUpdate(InstitutionalizationCountryReviewAssessmentId, updateInstitutionalizationFormBody, { new: true });
    if (!institutionalizationForm) {
        throw new ApiError(httpStatus.NOT_FOUND, _t('institutionalization:institutionalizationFormNotFound'));
    }
    return institutionalizationForm;
};
/**
 * Delete the assessment form by id
 * @param {ObjectId} InstitutionalizationCountryReviewAssessmentId assessment form id
 * @returns {Promise<IInstitutionalizationFormDoc|null>}
 */
export const deleteInstitutionalizationFormById = async (InstitutionalizationCountryReviewAssessmentId, _t) => {
    const institutionalizationForm = await getInstitutionalizationFormById(InstitutionalizationCountryReviewAssessmentId);
    if (!institutionalizationForm) {
        throw new ApiError(httpStatus.NOT_FOUND, _t('institutionalization:institutionalizationFormNotFound'));
    }
    await institutionalizationForm.remove();
    return institutionalizationForm;
};
// #endregion
// #region Country-Review
/**
 * Create an country assessment
 * @param {IInstitutionalizationCountryReview} institutionalizationCountryReviewAssessmentBody
 * @returns {Promise<IInstitutionalizationCountryReviewDoc|null>}
 */
export const createInstitutionalizationCountryReviewAssessment = async (institutionalizationCountryReviewAssessmentBody) => {
    return InstitutionalizationCountryReviewModel.create(institutionalizationCountryReviewAssessmentBody);
};
/**
 * Query for country assessment
 * @param {Object} filter the mongo filter
 * @param {Object} options the query options
 * @returns {Promise<QueryResult>}
 */
export const queryInstitutionalizationCountryReviewAssessments = async (filter, options) => {
    const institutionalizationForms = await InstitutionalizationCountryReviewModel.paginate(filter, options);
    return institutionalizationForms;
};
/**
 * Get the country assessment by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IInstitutionalizationCountryReviewDoc|null>}
 */
export const getInstitutionalizationCountryReviewAssessmentById = async (id) => InstitutionalizationCountryReviewModel.findById(id);
/**
 * Update the country assessment by id
 * @param {ObjectId} InstitutionalizationCountryReviewAssessmentId assessment id
 * @param {UpdateInstitutionalizationCountryReviewAssessmentBody} updateInstitutionalizationCountryReviewAssessmentBody update body
 * @returns {Promise<IInstitutionalizationCountryReviewDoc|null>}
 */
export const updateInstitutionalizationCountryReviewAssessmentById = async (InstitutionalizationCountryReviewAssessmentId, updateInstitutionalizationCountryReviewAssessmentBody, _t) => {
    const institutionalizationForm = await InstitutionalizationCountryReviewModel.findByIdAndUpdate(InstitutionalizationCountryReviewAssessmentId, updateInstitutionalizationCountryReviewAssessmentBody, { new: true });
    if (!institutionalizationForm) {
        throw new ApiError(httpStatus.NOT_FOUND, _t('institutionalization:institutionalizationFormNotFound'));
    }
    return institutionalizationForm;
};
/**
 * Delete the country assessment by id
 * @param {ObjectId} InstitutionalizationCountryReviewAssessmentId assessment id
 * @returns {Promise<IInstitutionalizationCountryReviewDoc|null>}
 */
export const deleteInstitutionalizationCountryReviewAssessmentById = async (InstitutionalizationCountryReviewAssessmentId, _t) => {
    const institutionalizationForm = await getInstitutionalizationCountryReviewAssessmentById(InstitutionalizationCountryReviewAssessmentId);
    if (!institutionalizationForm) {
        throw new ApiError(httpStatus.NOT_FOUND, _t('institutionalization:institutionalizationFormNotFound'));
    }
    await institutionalizationForm.remove();
    return institutionalizationForm;
};
// #endregion
// #region Organization-Assessment
/**
 * Create an organization assessment
 * @param {IInstitutionalizationOrganization} institutionalizationOrganizationAssessmentBody
 * @returns {Promise<IInstitutionalizationOrganizationDoc|null>}
 */
export const createInstitutionalizationOrganizationAssessment = async (institutionalizationOrganizationAssessmentBody) => {
    return InstitutionalizationOrganizationModel.create(institutionalizationOrganizationAssessmentBody);
};
/**
 * Query for organization assessment
 * @param {Object} filter the mongo filter
 * @param {Object} options the query options
 * @returns {Promise<QueryResult>}
 */
export const queryInstitutionalizationOrganizationAssessments = async (filter, options) => {
    const institutionalizationAssessments = await InstitutionalizationOrganizationModel.paginate(filter, options);
    return institutionalizationAssessments;
};
/**
 * Get the organization assessment by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IInstitutionalizationOrganizationDoc|null>}
 */
export const getInstitutionalizationOrganizationAssessmentById = async (id) => InstitutionalizationOrganizationModel.findById(id);
/**
 * Update the organization assessment by id
 * @param {ObjectId} InstitutionalizationOrganizationAssessmentId assessment id
 * @param {UpdateInstitutionalizationOrganizationAssessmentBody} updateInstitutionalizationOrganizationAssessmentBody update body
 * @returns {Promise<IInstitutionalizationOrganizationDoc|null>}
 */
export const updateInstitutionalizationOrganizationAssessmentById = async (InstitutionalizationOrganizationAssessmentId, updateInstitutionalizationOrganizationAssessmentBody, _t) => {
    const institutionalizationAssessment = await InstitutionalizationOrganizationModel.findByIdAndUpdate(InstitutionalizationOrganizationAssessmentId, updateInstitutionalizationOrganizationAssessmentBody, { new: true });
    if (!institutionalizationAssessment) {
        throw new ApiError(httpStatus.NOT_FOUND, _t('institutionalization:institutionalizationAssessmentNotFound'));
    }
    return institutionalizationAssessment;
};
/**
 * Delete the organization assessment by id
 * @param {ObjectId} InstitutionalizationOrganizationAssessmentId assessment id
 * @returns {Promise<IInstitutionalizationOrganizationDoc|null>}
 */
export const deleteInstitutionalizationOrganizationAssessmentById = async (InstitutionalizationOrganizationAssessmentId, _t) => {
    const institutionalizationAssessment = await getInstitutionalizationOrganizationAssessmentById(InstitutionalizationOrganizationAssessmentId);
    if (!institutionalizationAssessment) {
        throw new ApiError(httpStatus.NOT_FOUND, _t('institutionalization:institutionalizationAssessmentNotFound'));
    }
    await institutionalizationAssessment.remove();
    return institutionalizationAssessment;
};
// #endregion
//# sourceMappingURL=institutionalization.service.js.map