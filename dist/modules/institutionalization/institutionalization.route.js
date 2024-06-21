import { Router } from 'express';
import { validate } from '../validate';
import * as institutionalizationController from './institutionalization.controller';
import * as institutionalizationValidation from './institutionalization.validation';
import { auth } from '../auth';
const router = Router();
//#region Assessment-Form
router
    .route('/forms/templates')
    .post(auth('MANAGE_INSTITUTIONALIZATION_FORM'), validate(institutionalizationValidation.createInstitutionalizationForm), institutionalizationController.createInstitutionalizationForm)
    .get(auth('GET_INSTITUTIONALIZATION_FORM'), validate(institutionalizationValidation.getInstitutionalizationForms), institutionalizationController.getInstitutionalizationForms);
router
    .route('/forms/templates/:formId')
    .get(auth('GET_INSTITUTIONALIZATION_FORM'), validate(institutionalizationValidation.getInstitutionalizationForm), institutionalizationController.getInstitutionalizationForm)
    .patch(auth('MANAGE_INSTITUTIONALIZATION_FORM'), validate(institutionalizationValidation.updateInstitutionalizationForm), institutionalizationController.updateInstitutionalizationForm)
    .delete(auth('MANAGE_INSTITUTIONALIZATION_FORM'), validate(institutionalizationValidation.deleteInstitutionalizationForm), institutionalizationController.deleteInstitutionalizationForm);
router
    .route('/forms/templates/:formId/translate')
    .get(auth('GET_INSTITUTIONALIZATION_FORM'), validate(institutionalizationValidation.getInstitutionalizationForm), institutionalizationController.createInstitutionalizationFormTranslation);
router
    .route('/forms/active')
    /**
     * Get active form for assessment
     */
    .get(auth('GET_INSTITUTIONALIZATION_FORM'), validate(institutionalizationValidation.getInstitutionalizationForms), institutionalizationController.getInstitutionalizationActiveForm);
//#endregion
//#region Country-Review
router
    .route('/countries/reviews')
    .post(auth('MANAGE_INSTITUTIONALIZATION_COUNTRY_REVIEW'), validate(institutionalizationValidation.createInstitutionalizationCountryReview), institutionalizationController.createInstitutionalizationCountryReviewAssessment)
    .get(auth('GET_INSTITUTIONALIZATION_COUNTRY_REVIEW'), validate(institutionalizationValidation.getInstitutionalizationCountries), institutionalizationController.getInstitutionalizationCountryReviewAssessments);
router
    .route('/countries/reviews/:reviewId')
    .get(auth('GET_INSTITUTIONALIZATION_COUNTRY_REVIEW'), validate(institutionalizationValidation.getInstitutionalizationCountryReview), institutionalizationController.getInstitutionalizationCountryReviewAssessment)
    .patch(auth('MANAGE_INSTITUTIONALIZATION_COUNTRY_REVIEW'), validate(institutionalizationValidation.updateInstitutionalizationCountryReview), institutionalizationController.updateInstitutionalizationCountryReviewAssessment)
    .delete(auth('MANAGE_INSTITUTIONALIZATION_COUNTRY_REVIEW'), validate(institutionalizationValidation.deleteInstitutionalizationCountryReview), institutionalizationController.deleteInstitutionalizationCountryReviewAssessment);
router
    .route('/countries/:countryId/:status')
    /**
   * Get active form for assessment for country
   */
    .get(auth('GET_INSTITUTIONALIZATION_COUNTRY_REVIEW'), validate(institutionalizationValidation.getInstitutionalizationCountryActiveReview), institutionalizationController.getInstitutionalizationCountryActiveReview);
//#endregion
//#region Organization-Assessment
router
    .route('/organizations/assessments')
    .post(auth('MANAGE_INSTITUTIONALIZATION_ORGANIZATION_ASSESSMENT'), validate(institutionalizationValidation.createInstitutionalizationOrganization), institutionalizationController.createInstitutionalizationOrganizationAssessment)
    .get(auth('GET_INSTITUTIONALIZATION_ORGANIZATION_ASSESSMENT'), validate(institutionalizationValidation.getInstitutionalizationCountries), institutionalizationController.getInstitutionalizationOrganizationAssessments);
router
    .route('/organizations/assessments/:assessmentId')
    .get(auth('GET_INSTITUTIONALIZATION_ORGANIZATION_ASSESSMENT'), validate(institutionalizationValidation.getInstitutionalizationOrganization), institutionalizationController.getInstitutionalizationOrganizationAssessment)
    .patch(auth('MANAGE_INSTITUTIONALIZATION_ORGANIZATION_ASSESSMENT'), validate(institutionalizationValidation.updateInstitutionalizationOrganization), institutionalizationController.updateInstitutionalizationOrganizationAssessment)
    .delete(auth('MANAGE_INSTITUTIONALIZATION_ORGANIZATION_ASSESSMENT'), validate(institutionalizationValidation.deleteInstitutionalizationOrganization), institutionalizationController.deleteInstitutionalizationOrganizationAssessment);
//#endregion
export default router;
//# sourceMappingURL=institutionalization.route.js.map