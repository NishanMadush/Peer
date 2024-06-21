import httpStatus from 'http-status';
import lodash from 'lodash';
import mongoose from 'mongoose';
import { FormStatusEnum, AssessmentStatusEnum } from '../../shared/interfaces/institutionalization';
import { ApiError } from '../../services/errors';
import { catchAsync, pick } from '../../utils';
import * as institutionalizationService from './institutionalization.service';
import * as reportDashboardService from '../report/dashboard/dashboard.service';
import * as reportInstitutionalizationService from '../report/institutionalization/institutionalization.service';
// #region Assessment-Form
export const createInstitutionalizationForm = catchAsync(async (req, res) => {
    if (req?.body?.status === FormStatusEnum.Active) {
        const isDuplicate = await isActiveFormAvailable(``);
        if (isDuplicate) {
            return res.status(425).send({ message: 'Active form already exists' });
        }
    }
    const institutionalizationForm = await institutionalizationService.createInstitutionalizationForm(req.body);
    return res.status(httpStatus.CREATED).send(institutionalizationForm);
});
export const getInstitutionalizationForms = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['code', 'name']);
    const options = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
    const result = await institutionalizationService.queryInstitutionalizationForms(filter, options);
    res.send(result);
});
export const getInstitutionalizationForm = catchAsync(async (req, res) => {
    if (typeof req.params['formId'] === 'string') {
        const institutionalizationForm = await institutionalizationService.getInstitutionalizationFormById(new mongoose.Types.ObjectId(req.params['formId']));
        if (!institutionalizationForm) {
            throw new ApiError(httpStatus.NOT_FOUND, req.t('inventory:institutionalizationFormNotFound'));
        }
        res.send(institutionalizationForm);
    }
});
export const updateInstitutionalizationForm = catchAsync(async (req, res) => {
    console.log(`form ${req.params} body ${req.body}`);
    if (typeof req.params['formId'] !== 'string') {
        return res.status(httpStatus.BAD_REQUEST).send({ message: 'Malformed form details' });
    }
    if (req?.body?.status === FormStatusEnum.Active) {
        const isDuplicate = await isActiveFormAvailable(`${req.params['formId']}`);
        if (isDuplicate) {
            return res.status(425).send({ message: 'Active form already exists' });
        }
    }
    // TODO: Validate uniqueness
    const institutionalizationForm = await institutionalizationService.updateInstitutionalizationFormById(new mongoose.Types.ObjectId(req.params['formId']), req.body, req.t);
    return res.send(institutionalizationForm);
});
export const deleteInstitutionalizationForm = catchAsync(async (req, res) => {
    if (typeof req.params['formId'] === 'string') {
        await institutionalizationService.deleteInstitutionalizationFormById(new mongoose.Types.ObjectId(req.params['formId']), req.t);
        res.status(httpStatus.NO_CONTENT).send();
    }
});
const isActiveFormAvailable = async (formId) => {
    let isDuplicate = false;
    const options = {};
    const filterSimilar = {
        status: FormStatusEnum.Active
    };
    const existingFormActive = await institutionalizationService.queryInstitutionalizationForms(filterSimilar, options);
    existingFormActive?.results.forEach((form) => {
        if (formId !== form.id.toString())
            return isDuplicate = true;
        else
            return false;
    });
    return isDuplicate;
};
export const createInstitutionalizationFormTranslation = catchAsync(async (req, res) => {
    if (typeof req.params['formId'] === 'string') {
        const institutionalizationForm = await institutionalizationService.getInstitutionalizationFormById(new mongoose.Types.ObjectId(req.params['formId']));
        if (!institutionalizationForm) {
            throw new ApiError(httpStatus.NOT_FOUND, req.t('inventory:institutionalizationFormNotFound'));
        }
        let institutionalizationTemplate = institutionalizationForm;
        institutionalizationTemplate = lodash.pick(institutionalizationTemplate, ['version', 'title', 'date', 'modules']);
        institutionalizationTemplate['modules'] = lodash.map(institutionalizationTemplate.modules, module => {
            const currentModule = lodash.pick(module, ['instruction', 'moduleNo', 'condition', 'indicators']);
            currentModule['indicators'] = lodash.map(module.indicators, indicator => {
                const currentIndicator = lodash.pick(indicator, ['instruction', 'indicatorNo', 'question', 'description', 'weight', 'subQuestions']);
                currentIndicator['subQuestions'] = lodash.map(currentIndicator['subQuestions'], o => lodash.pick(o, ['subQuestion']));
                return currentIndicator;
            });
            return currentModule;
        });
        console.log('institutionalizationForm: ', institutionalizationForm);
        console.log('institutionalizationTemplate: ', institutionalizationTemplate);
        res.send(institutionalizationTemplate);
    }
});
export const getInstitutionalizationActiveForm = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['code', 'name']);
    const options = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
    const result = await institutionalizationService.queryInstitutionalizationForms(filter, options);
    const activeForm = lodash.find(result.results, { status: FormStatusEnum.Active });
    res.send(activeForm);
});
// #endregion
// #region Country-Review
export const createInstitutionalizationCountryReviewAssessment = catchAsync(async (req, res) => {
    // TODO: Validate uniqueness
    const institutionalizationCountryReviewAssessment = await institutionalizationService.createInstitutionalizationCountryReviewAssessment(req.body);
    res.status(httpStatus.CREATED).send(institutionalizationCountryReviewAssessment);
});
export const getInstitutionalizationCountryReviewAssessments = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['_id', 'countryId', 'year', 'status']);
    const options = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
    const result = await institutionalizationService.queryInstitutionalizationCountryReviewAssessments(filter, options);
    res.send(result);
});
export const getInstitutionalizationCountryReviewAssessment = catchAsync(async (req, res) => {
    if (typeof req.params['reviewId'] === 'string') {
        const institutionalizationCountryReviewAssessment = await institutionalizationService.getInstitutionalizationCountryReviewAssessmentById(new mongoose.Types.ObjectId(req.params['reviewId']));
        if (!institutionalizationCountryReviewAssessment) {
            throw new ApiError(httpStatus.NOT_FOUND, req.t('inventory:institutionalizationCountryReviewAssessmentNotFound'));
        }
        res.send(institutionalizationCountryReviewAssessment);
    }
});
export const updateInstitutionalizationCountryReviewAssessment = catchAsync(async (req, res) => {
    if (typeof req.params['reviewId'] !== 'string') {
        return res.status(httpStatus.BAD_REQUEST).send({ message: 'Malformed review details' });
    }
    let isDuplicate = false;
    if (req?.body?.status === AssessmentStatusEnum.Progress) {
        const options = {};
        const filter = { _id: req.params['reviewId'] };
        const currentReviewResult = await institutionalizationService.queryInstitutionalizationCountryReviewAssessments(filter, options);
        const currentReview = currentReviewResult?.results[0];
        const filterSimilar = {
            countryId: currentReview?.countryId,
            status: AssessmentStatusEnum.Progress
        };
        const existingReviewsProgress = await institutionalizationService.queryInstitutionalizationCountryReviewAssessments(filterSimilar, options);
        existingReviewsProgress?.results.forEach((review) => {
            if (req.params['reviewId'] !== review.id.toString())
                return isDuplicate = true;
            else
                return false;
        });
    }
    if (isDuplicate) {
        return res.status(425).send({ message: 'Progressing review exist for the country' });
    }
    else {
        const institutionalizationCountryReviewAssessment = await institutionalizationService.updateInstitutionalizationCountryReviewAssessmentById(new mongoose.Types.ObjectId(req.params['reviewId']), req.body, req.t);
        return res.send(institutionalizationCountryReviewAssessment);
    }
});
export const deleteInstitutionalizationCountryReviewAssessment = catchAsync(async (req, res) => {
    if (typeof req.params['reviewId'] === 'string') {
        await institutionalizationService.deleteInstitutionalizationCountryReviewAssessmentById(new mongoose.Types.ObjectId(req.params['reviewId']), req.t);
        res.status(httpStatus.NO_CONTENT).send();
    }
});
export const getInstitutionalizationCountryActiveReview = catchAsync(async (req, res) => {
    if (typeof req.params['countryId'] === 'string' && typeof req.params['status'] === 'string') {
        const filter = { countryId: req.params['countryId'] };
        const options = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
        const result = await institutionalizationService.queryInstitutionalizationCountryReviewAssessments(filter, options);
        const activeCountryReview = lodash.filter(result.results, { status: req.params['status'] });
        res.send(activeCountryReview);
    }
    else {
        res.send([]);
    }
});
// #endregion
// #region Organization-Assessment
export const createInstitutionalizationOrganizationAssessment = catchAsync(async (req, res) => {
    // TODO: Validate uniqueness
    const institutionalizationOrganizationAssessment = await institutionalizationService.createInstitutionalizationOrganizationAssessment(req.body);
    res.status(httpStatus.CREATED).send(institutionalizationOrganizationAssessment);
});
export const getInstitutionalizationOrganizationAssessments = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['_id', 'countryId', 'organizationId', 'countryReviewId', 'status']);
    const options = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
    const result = await institutionalizationService.queryInstitutionalizationOrganizationAssessments(filter, options);
    res.send(result);
});
export const getInstitutionalizationOrganizationAssessment = catchAsync(async (req, res) => {
    if (typeof req.params['assessmentId'] === 'string') {
        const institutionalizationOrganizationAssessment = await institutionalizationService.getInstitutionalizationOrganizationAssessmentById(new mongoose.Types.ObjectId(req.params['assessmentId']));
        if (!institutionalizationOrganizationAssessment) {
            throw new ApiError(httpStatus.NOT_FOUND, req.t('inventory:institutionalizationOrganizationAssessmentNotFound'));
        }
        res.send(institutionalizationOrganizationAssessment);
    }
});
export const updateInstitutionalizationOrganizationAssessment = catchAsync(async (req, res) => {
    if (typeof req.params['assessmentId'] === 'string') {
        // TODO: Validate uniqueness
        const institutionalizationOrganizationAssessment = await institutionalizationService.updateInstitutionalizationOrganizationAssessmentById(new mongoose.Types.ObjectId(req.params['assessmentId']), req.body, req.t);
        // If completing, generate statistics
        res.send(institutionalizationOrganizationAssessment);
        if (req?.body?.status === AssessmentStatusEnum.Complete) {
            const statAssert = await await reportInstitutionalizationService.generateStatisticsForAssert();
            console.log('~!@# statAssert: ', statAssert);
            const statDashboard = await reportDashboardService.generateStatisticsForDashboard();
            console.log('~!@# reportDashboardService: ', statDashboard);
        }
    }
});
export const deleteInstitutionalizationOrganizationAssessment = catchAsync(async (req, res) => {
    if (typeof req.params['assessmentId'] === 'string') {
        await institutionalizationService.deleteInstitutionalizationOrganizationAssessmentById(new mongoose.Types.ObjectId(req.params['assessmentId']), req.t);
        res.status(httpStatus.NO_CONTENT).send();
    }
});
// #endregion
//# sourceMappingURL=institutionalization.controller.js.map