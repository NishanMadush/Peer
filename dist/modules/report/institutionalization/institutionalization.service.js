import { LevelStatEnum } from '../../../shared/interfaces/report';
import { StatisticInstitutionalization as StatisticInstitutionalizationModel, } from './institutionalization.model';
import lodash from 'lodash';
import { decimalDivideBy } from './institutionalization.constants';
import * as countryService from '../../country/country.service';
import * as organizationService from '../../organization/organization.service';
import * as institutionalizationService from '../../institutionalization/institutionalization.service';
// #region Statistics
/**
 * Get the statistics by props
 * @param {Partial<IStatisticInstitutionalization>} props // selection criteria
 * @returns {Promise<IStatisticInstitutionalizationDoc|null>}
 */
export const getStatisticInstitutionalizationsByProps = async (props) => StatisticInstitutionalizationModel.find(props);
/**
 * Delete the statistics by props
 * @param {Partial<IStatisticInstitutionalization>} props // delete criteria
 * @returns {Promise<any>}
 */
// This can be improve by removing selected data
export const deleteStatisticInstitutionalizationsByProps = async (props) => StatisticInstitutionalizationModel.deleteMany(props);
/**
 * Create an organization assessment
 * @param {IInstitutionalizationOrganization} institutionalizationOrganizationAssessmentBody
 * @returns {Promise<IInstitutionalizationOrganizationDoc|null>}
 */
export const createStatisticInstitutionalizations = async (statisticsInstitutionalizationBody) => {
    StatisticInstitutionalizationModel.insertMany(statisticsInstitutionalizationBody)
        .then(function () {
        return true;
    }).catch(function (error) {
        console.error(error);
        return false;
    });
};
/**
 * Update statistics
 * @param {String} level
 * @param {ObjectId} itemId
 * @returns {Promise<true|false>}
 */
export const generateStatisticsForAssert = async () => {
    const countries = await countryService.queryCountries({}, {});
    const organizations = await organizationService.queryOrganizations({}, {});
    const forms = await institutionalizationService.queryInstitutionalizationForms({}, {});
    const reviews = await institutionalizationService.queryInstitutionalizationCountryReviewAssessments({}, {});
    console.log('~!@# reviews ------------------------------------------------: ', reviews);
    // Get country level statistics
    const countryStat = [];
    for (const country of countries.results) {
        const countryResult = await generateStatisticsForCountry(country, forms.results, reviews.results);
        if (lodash.isArray(countryResult) && countryResult.length > 0)
            lodash.map(countryResult, (o) => { countryStat.push(o); });
    }
    // Get organization level statistics
    const organizationStat = [];
    for (const organization of organizations.results) {
        const organizationResult = await generateStatisticsForOrganization(organization, countries.results, forms.results);
        console.log('######## organizationResult: ', organizationResult);
        if (lodash.isArray(organizationResult) && organizationResult.length > 0)
            lodash.map(organizationResult, (o) => { organizationStat.push(o); });
    }
    // Get assessment level statistics
    const assessmentResult = await generateStatisticsForAssessment(organizations.results, countries.results, forms.results, reviews.results);
    try {
        // Clean all previous data
        const resultDelete = await deleteStatisticInstitutionalizationsByProps({});
        console.log('!@# delete many: ', resultDelete);
        // Insert country statistics
        const resultInsertCountry = await createStatisticInstitutionalizations(countryStat);
        // Insert organization statistics
        const resultInsertOrganization = await createStatisticInstitutionalizations(organizationStat);
        // Insert assessment statistics
        const resultInsertAssessment = await createStatisticInstitutionalizations(assessmentResult);
    }
    catch (error) {
        console.error('!@# error delete and recreate: ', error);
    }
    return {
        countryStat,
        organizationStat,
        assessmentResult,
    };
};
const generateStatisticsForCountry = async (country, forms, reviews) => {
    const countryAssessments = await institutionalizationService.queryInstitutionalizationOrganizationAssessments({ countryId: country.id }, {});
    const assessments = countryAssessments.results;
    // Pre process data
    // Rearrange data in detail
    const processedData = [];
    lodash.map(assessments, function mapAssessment(assessment) {
        processedData.push({
            formId: assessment.institutionalization.formId,
            countryId: assessment.countryId,
            countryReviewId: assessment.countryReviewId,
            organizationId: assessment.organizationId,
            trainingComponent: assessment.trainingComponent,
            assessmentStatus: assessment.status,
            assessmentScore: Number.isNaN(assessment?.institutionalization?.score) ? 0 : assessment?.institutionalization?.score,
            completedDate: assessment.complete,
        });
    });
    // Post process data
    // Summarize data
    const countryStat = [];
    lodash.map(lodash.groupBy(processedData, 'formId'), (form) => {
        const formDetails = lodash.find(forms, function (o) { return o._id.toString() === form[0].formId; });
        lodash.map(lodash.groupBy(form, 'countryReviewId'), (review) => {
            const reviewDetails = lodash.find(reviews, function (o) { return o._id.toString() === review[0].countryReviewId.toString(); });
            lodash.map(lodash.groupBy(review, 'trainingComponent'), (component) => {
                lodash.map(lodash.groupBy(component, 'assessmentStatus'), (status) => {
                    const sumScore = lodash.sumBy(status, function (o) { return o.assessmentScore; });
                    const avgScore = Math.round((sumScore / status.length) * decimalDivideBy) / decimalDivideBy;
                    const timeScore = [];
                    lodash.map(status, (o) => {
                        timeScore.push({ completedDate: o.completedDate, assessmentScore: o.assessmentScore });
                    });
                    countryStat.push({
                        level: LevelStatEnum.Country,
                        formId: status[0].formId,
                        formTitle: formDetails?.title,
                        countryId: status[0].countryId,
                        country: country.id.toString() === status[0].countryId.toString() ? country.name : '',
                        countryReviewId: status[0].countryReviewId,
                        countryReviewTitle: reviewDetails?.title,
                        trainingComponent: status[0].trainingComponent,
                        assessmentStatus: status[0].assessmentStatus,
                        assessmentScore: Number.isNaN(avgScore) ? 0 : avgScore,
                        assessmentCount: status.length,
                        assessmentData: timeScore
                    });
                });
            });
        });
    });
    return countryStat;
};
const generateStatisticsForOrganization = async (organization, countries, forms) => {
    // const organizationAssessments = await institutionalizationService.queryInstitutionalizationOrganizationAssessments({ organizationId: organization['id'], status: AssessmentStatusEnum.Complete}, {})
    const organizationAssessments = await institutionalizationService.queryInstitutionalizationOrganizationAssessments({ organizationId: organization['id'] }, {});
    const assessments = organizationAssessments.results;
    // Pre process data
    // Rearrange data in detail
    const processedData = [];
    lodash.map(assessments, function mapAssessment(assessment) {
        processedData.push({
            formId: assessment.institutionalization.formId,
            countryId: assessment.countryId,
            countryReviewId: assessment.countryReviewId,
            organizationId: assessment.organizationId,
            trainingComponent: assessment.trainingComponent,
            assessmentStatus: assessment.status,
            assessmentScore: Number.isNaN(assessment?.institutionalization?.score) ? 0 : assessment?.institutionalization?.score,
            completedDate: assessment.complete,
        });
    });
    // Post process data
    // Summarize data
    const organizationStat = [];
    lodash.map(lodash.groupBy(processedData, 'formId'), (form) => {
        const formDetails = lodash.find(forms, function (o) { return o._id.toString() === form[0].formId; });
        lodash.map(lodash.groupBy(form, 'trainingComponent'), (component) => {
            lodash.map(lodash.groupBy(component, 'assessmentStatus'), (status) => {
                // const sumScore = lodash.sumBy(status, function (o) { return o.assessmentScore })
                // const avgScore = Math.round((sumScore / status.length) * decimalDivideBy) / decimalDivideBy
                const avgScore = lodash.meanBy(status, 'assessmentScore');
                const timeScore = [];
                lodash.map(status, (o) => { timeScore.push({ completedDate: o.completedDate, assessmentScore: o.assessmentScore }); });
                organizationStat.push({
                    level: LevelStatEnum.Organization,
                    formId: status[0].formId,
                    formTitle: formDetails?.title,
                    countryId: status[0].countryId,
                    organizationId: status[0].organizationId,
                    organizationName: organization['id'].toString() === status[0].organizationId.toString() ? organization.name : '',
                    trainingComponent: status[0].trainingComponent,
                    assessmentStatus: status[0].assessmentStatus,
                    assessmentScore: Number.isNaN(avgScore) ? 0 : avgScore,
                    assessmentCount: status.length,
                    assessmentData: timeScore
                });
            });
        });
    });
    return organizationStat;
};
const generateStatisticsForAssessment = async (organizations, countries, forms, reviews) => {
    const courseAssessments = await institutionalizationService.queryInstitutionalizationOrganizationAssessments({}, {});
    const assessments = courseAssessments.results;
    const processedData = [];
    // Get module wise data
    lodash.map(assessments, function mapAssessment(assessment) {
        lodash.map(assessment?.institutionalization?.modules, function mapModules(module) {
            const formDetails = lodash.find(forms, function (o) { return o._id.toString() === assessment?.institutionalization?.formId?.toString(); });
            const countryDetails = lodash.find(countries, function (o) { return o._id.toString() === assessment.countryId.toString(); });
            const reviewDetails = lodash.find(reviews, function (o) { return o._id.toString() === assessment.countryReviewId.toString(); });
            const organizationDetails = lodash.find(organizations, function (o) { return o._id.toString() === assessment.organizationId.toString(); });
            processedData.push({
                level: LevelStatEnum.Assessment,
                countryId: assessment.countryId,
                country: `${countryDetails?.name}`,
                countryReviewId: reviewDetails ? reviewDetails['_id'].toString() : '',
                countryReviewTitle: `${reviewDetails?.title}`,
                organizationId: assessment.organizationId,
                organizationName: `${organizationDetails?.name}`,
                formId: assessment.institutionalization.formId,
                formTitle: `${formDetails?.title}`,
                trainingComponent: assessment.trainingComponent,
                completedDate: assessment.complete,
                assessmentStatus: assessment.status,
                assessmentScore: assessment.score,
                moduleNo: module.moduleNo,
                moduleScore: module.moduleScore,
            });
        });
    });
    return processedData;
};
// #endregion
//# sourceMappingURL=institutionalization.service.js.map