import Joi from 'joi';
import { AssessmentStatusEnum, FormStatusEnum } from '../../shared/interfaces/institutionalization';
import { objectId } from '../validate';
//#region Assessment-Form
export const institutionalizationForm = {
    title: Joi.string().optional().allow(null, ''),
    date: Joi.date(),
    status: Joi.string().required().valid(...Object.values(FormStatusEnum)),
    modules: Joi.array().items(Joi.object({
        _id: Joi.string().optional(),
        instruction: Joi.string().optional().allow(null, ''),
        moduleNo: Joi.string().required(),
        condition: Joi.string().required(),
        indicators: Joi.array().items(Joi.object({
            _id: Joi.string().optional(),
            instruction: Joi.string().optional().allow(null, ''),
            indicatorNo: Joi.string().required(),
            question: Joi.string().required(),
            description: Joi.string().optional(),
            weight: Joi.number(),
            scale: Joi.number(),
            indicatorScore: Joi.number(),
            subQuestions: Joi.array().items(Joi.object({
                _id: Joi.string().optional(),
                subQuestion: Joi.string().optional(),
                subAnswer: Joi.string().optional().allow(null, ''),
            })),
            comments: Joi.array().items(Joi.object({
                _id: Joi.string().optional(),
                userId: Joi.string().custom(objectId),
                userFullName: Joi.string(),
                date: Joi.date(),
                comment: Joi.string(),
            }))
        })),
        moduleScore: Joi.number(),
        moduleClassification: Joi.string().optional().allow(null, ''),
        comments: Joi.array().items(Joi.object({
            _id: Joi.string().optional(),
            userId: Joi.string().custom(objectId),
            userFullName: Joi.string(),
            date: Joi.date(),
            comment: Joi.string(),
        }))
    })),
    score: Joi.number(),
    classification: Joi.string().optional().allow(null, ''),
    comments: Joi.array().items(Joi.object({
        _id: Joi.string().optional(),
        userId: Joi.string().custom(objectId),
        userFullName: Joi.string(),
        date: Joi.date(),
        comment: Joi.string(),
    }))
};
export const createInstitutionalizationForm = {
    body: Joi.object().keys({
        version: Joi.string().required(),
        ...institutionalizationForm
    }),
};
export const getInstitutionalizationForms = {
    body: Joi.object().keys({
        code: Joi.string(),
        name: Joi.string(),
        sortBy: Joi.string(),
        projectBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};
export const getInstitutionalizationForm = {
    params: Joi.object().keys({
        formId: Joi.string().custom(objectId),
    }),
};
export const updateInstitutionalizationForm = {
    params: Joi.object().keys({
        formId: Joi.required().custom(objectId),
    }),
    body: Joi.object().keys(institutionalizationForm).min(1),
};
export const deleteInstitutionalizationForm = {
    params: Joi.object().keys({
        formId: Joi.string().custom(objectId),
    }),
};
//#endregion
//#region Country-Assessment
export const institutionalizationCountryReview = {
    year: Joi.number(),
    start: Joi.date(),
    end: Joi.date(),
    timeZone: Joi.string().required(),
    status: Joi.string().valid(...Object.values(AssessmentStatusEnum)),
    score: Joi.number(),
    trainingComponents: Joi.array().items(Joi.object({
        code: Joi.string(),
        name: Joi.string(),
    })),
    classification: Joi.string()
};
export const createInstitutionalizationCountryReview = {
    body: Joi.object().keys({
        title: Joi.string().required(),
        countryId: Joi.string().required(),
        ...institutionalizationCountryReview
    }),
};
export const getInstitutionalizationCountries = {
    body: Joi.object().keys({
        code: Joi.string(),
        name: Joi.string(),
        sortBy: Joi.string(),
        projectBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};
export const getInstitutionalizationCountryReview = {
    params: Joi.object().keys({
        reviewId: Joi.string().custom(objectId),
    }),
};
export const updateInstitutionalizationCountryReview = {
    params: Joi.object().keys({
        reviewId: Joi.required().custom(objectId),
    }),
    body: Joi.object().keys(institutionalizationCountryReview).min(1),
};
export const deleteInstitutionalizationCountryReview = {
    params: Joi.object().keys({
        reviewId: Joi.string().custom(objectId),
    }),
};
export const getInstitutionalizationCountryActiveReview = {
    params: Joi.object().keys({
        countryId: Joi.string().custom(objectId),
        status: Joi.string().valid(...Object.values(AssessmentStatusEnum)),
    }),
};
//#endregion
//#region Organization-Assessment
export const institutionalizationOrganization = {
    status: Joi.string().valid(...Object.values(AssessmentStatusEnum)),
    start: Joi.date(),
    complete: Joi.date(),
    timeZone: Joi.string().required(),
    score: Joi.number(),
    institutionalization: Joi.object().keys({
        formId: Joi.string().custom(objectId),
        version: Joi.string(),
        ...institutionalizationForm
    }).min(1),
    comments: Joi.array().items(Joi.object({
        _id: Joi.string().optional(),
        userId: Joi.string().custom(objectId),
        date: Joi.date(),
        comment: Joi.string()
    })),
    endorse: {
        organizationId: Joi.string().custom(objectId),
        organization: Joi.string(),
        userId: Joi.string().custom(objectId),
        userFullName: Joi.string(),
        date: Joi.date(),
        comment: Joi.string(),
    }
};
export const createInstitutionalizationOrganization = {
    body: Joi.object().keys({
        countryId: Joi.string().required(),
        languageId: Joi.string().required(),
        organizationId: Joi.string().required(),
        countryReviewId: Joi.string().required(),
        trainingComponent: Joi.string().required(),
        ...institutionalizationOrganization
    }),
};
export const getInstitutionalizationOrganizations = {
    body: Joi.object().keys({
        code: Joi.string(),
        name: Joi.string(),
        sortBy: Joi.string(),
        projectBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};
export const getInstitutionalizationOrganization = {
    params: Joi.object().keys({
        assessmentId: Joi.string().custom(objectId),
    }),
};
export const updateInstitutionalizationOrganization = {
    params: Joi.object().keys({
        assessmentId: Joi.required().custom(objectId),
    }),
    body: Joi.object().keys(institutionalizationOrganization).min(1),
};
export const deleteInstitutionalizationOrganization = {
    params: Joi.object().keys({
        assessmentId: Joi.string().custom(objectId),
    }),
};
//#endregion
//# sourceMappingURL=institutionalization.validation.js.map