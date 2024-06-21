import lodash from 'lodash';
import { AssessmentStatusEnum, TrainingComponentEnum } from '../../../shared/interfaces/institutionalization';
import * as countryService from '../../country/country.service';
import * as organizationService from '../../organization/organization.service';
import * as institutionalizationService from '../../institutionalization/institutionalization.service';
import { getStatisticInstitutionalizationsByProps } from '../institutionalization/institutionalization.service';
import { LevelStatEnum } from '../../../shared/interfaces/report';
import { statisticDashboard as StatisticDashboardModel } from './dashboard.model';
const getDashboardDate = (date) => {
    if (lodash.isString(date) && !lodash.isEmpty(date)) {
        const formattedDate = date.replace('T', ' ').slice(0, 10);
        return formattedDate;
    }
    else if (lodash.isDate(date)) {
        const formattedDate = date.toISOString();
        return formattedDate.replace('T', ' ').slice(0, 10);
    }
    return '';
};
const getDashboardScore = (score) => {
    const roundScore = lodash.isNumber(score) ? score.toFixed(2) : 0.00;
    return parseFloat(`${roundScore}`);
};
export const getStatisticDashboardByProps = async (props) => StatisticDashboardModel.find(props);
export const deleteStatisticDashboardByProps = async (props) => StatisticDashboardModel.deleteMany(props);
export const createStatisticDashboard = async (statisticsDashboardBody) => {
    StatisticDashboardModel.insertMany(statisticsDashboardBody)
        .then(function () {
        return true;
    }).catch(function (error) {
        console.error(error);
        return false;
    });
};
export const generateStatisticsForDashboard = async () => {
    const countries = await countryService.queryCountries({}, {});
    const organizations = await organizationService.queryOrganizations({}, {});
    const forms = await institutionalizationService.queryInstitutionalizationForms({}, {});
    const reviews = await institutionalizationService.queryInstitutionalizationCountryReviewAssessments({}, { sortBy: 'end' });
    // Get organization level statistics
    const organizationStat = [];
    for (const organization of organizations.results) {
        const organizationResult = await generateStatisticsForOrganization(reviews.results, organization, countries.results, forms.results);
        organizationStat.push(organizationResult);
    }
    // Get country level statistics
    const countryStat = [];
    for (const country of countries.results) {
        const countryResult = await generateStatisticsForCountry(reviews.results, organizations.results, country, forms.results);
        countryStat.push(countryResult);
    }
    // Get global statistics
    const globalResult = await generateStatisticsForGlobal(reviews.results, organizations.results, countries.results, forms.results);
    try {
        // Clean all previous data
        const resultDelete = await deleteStatisticDashboardByProps({});
        console.log('!@# delete many: ', resultDelete);
        // Insert country statistics
        const resultInsertCountry = await createStatisticDashboard(organizationStat);
        // Insert organization statistics
        const resultInsertOrganization = await createStatisticDashboard(countryStat);
        // Insert golbal statistics
        const resultInsertGlobal = await createStatisticDashboard(globalResult);
        console.log('!@# New stat created ');
    }
    catch (error) {
        console.error('!@# error delete and recreate: ', error);
    }
    return {
        organizationStat: organizationStat,
        countryStat: countryStat,
        globalStat: globalResult,
    };
};
const generateStatisticsForOrganization = async (reviews, organization, countries, forms) => {
    console.log(`######################## ${organization.name} ########################`);
    const organizationOutcome = {
        level: LevelStatEnum.Organization,
        countryId: organization.countryId,
        organizationId: organization['id'].toString(),
        trainingComponentTiles: [],
        assessmentHistory: [],
        lastCountryReview: {
            trainingComponentProgress: 0,
            trainingComponentOverview: [],
            trainingComponentModules: [],
            organizationOverview: [],
        },
        countryOverview: [],
    };
    const attemptedAssessments = await institutionalizationService.queryInstitutionalizationOrganizationAssessments({ organizationId: organization['id'] /*, status: AssessmentStatusEnum.Complete*/ }, { sortBy: 'complete' })
        .then((outcome) => {
        return outcome?.results;
    });
    // console.log('@@@@@ : ', attemptedAssessments)
    //#region Top main tiles
    // Not grantee to all in same country review
    const trainingComponentTiles = [];
    const TrainingComponents = Object.values(TrainingComponentEnum);
    TrainingComponents.forEach((value, index) => {
        const latest = lodash.findLast(attemptedAssessments, { status: AssessmentStatusEnum.Complete, trainingComponent: value });
        if (latest) {
            trainingComponentTiles.push({
                date: getDashboardDate(latest.complete),
                code: latest.trainingComponent,
                score: getDashboardScore(latest?.institutionalization?.score ?? 0)
            });
        }
    });
    organizationOutcome['trainingComponentTiles'] = trainingComponentTiles;
    // console.log('@@@@@ 1 trainingComponentTiles: ', trainingComponentTiles)
    //#endregion
    //#region Assessment history
    const assessmentHistory = [];
    const reviewsForCountry = lodash.filter(reviews, function (o) { return o.countryId.toString() === organization.countryId.toString(); });
    lodash.forEach(reviewsForCountry, (review, index) => {
        const assessmentsForReview = lodash.filter(attemptedAssessments, (attemptedAssessment) => {
            return attemptedAssessment.status === AssessmentStatusEnum.Complete
                && attemptedAssessment.countryReviewId.toString() === review['_id'].toString();
        });
        // Uncomment below to skip empty reviews
        // if (!lodash.isEmpty(assessmentsForReview)) {
        const averageScore = lodash.meanBy(assessmentsForReview, 'institutionalization.score');
        assessmentHistory.push({
            date: getDashboardDate(review.end),
            title: review.title,
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            averageScore: getDashboardScore(Number.isNaN(averageScore) || !averageScore ? 0 : averageScore)
        });
        // }
    });
    organizationOutcome['assessmentHistory'] = assessmentHistory;
    // console.log('@@@@@@@@@@@@@@@@@@ assessmentHistory: ', assessmentHistory)
    //#endregion
    let lastCountryReview;
    //#region Last attended review
    let lastAssessmentHistory = [];
    lodash.forEach(reviewsForCountry.reverse(), (review, index) => {
        if (!lodash.isEmpty(lastAssessmentHistory)) {
            return;
        }
        const assessmentsForReview = lodash.filter(attemptedAssessments, (attemptedAssessment) => {
            return attemptedAssessment.countryReviewId.toString() === review['_id'].toString();
        });
        if (!lodash.isEmpty(assessmentsForReview)) {
            lastAssessmentHistory = assessmentsForReview;
            lastCountryReview = review;
        }
    });
    // console.log('@@@@@@@@@@@@@@@@@@ lastAssessmentHistory: ', lastAssessmentHistory)
    // Latest training-component scores with progress
    let trainingComponentProgress = 0;
    const trainingComponentOverview = [];
    if (!lodash.isEmpty(lastCountryReview?.trainingComponents)) {
        lastCountryReview.trainingComponents.forEach((component, index) => {
            const latest = lodash.find(lastAssessmentHistory, { trainingComponent: component.code });
            if (!lodash.isEmpty(latest)) {
                trainingComponentProgress++;
            }
            trainingComponentOverview.push({
                code: latest?.trainingComponent ?? component.code,
                averageScore: getDashboardScore(latest?.status === AssessmentStatusEnum.Complete ? latest?.institutionalization?.score ?? 0 : 0)
            });
        });
        trainingComponentProgress = (trainingComponentProgress / lastCountryReview.trainingComponents.length ?? -1) * 100;
    }
    organizationOutcome['lastCountryReview']['trainingComponentOverview'] = trainingComponentOverview;
    organizationOutcome['lastCountryReview']['trainingComponentProgress'] = trainingComponentProgress;
    //#endregion
    //#region Latest institutionalization
    const trainingComponentModules = [];
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (lastCountryReview && organization) {
        const modulesForReview = await getStatisticInstitutionalizationsByProps({
            level: LevelStatEnum.Assessment,
            countryReviewId: lastCountryReview['_id'].toString(),
            organizationId: organization['_id'].toString(),
            assessmentStatus: AssessmentStatusEnum.Complete,
        });
        // Latest training-component module scores
        // May use forms for details
        const moduleGroups = lodash.groupBy(modulesForReview, 'moduleNo');
        lodash.map(moduleGroups, (group, moduleNo) => {
            const moduleAvgScore = lodash.meanBy(group, 'moduleScore');
            // console.log(`%%% group ${moduleNo} --> ${moduleAvgScore}: `, group)
            trainingComponentModules.push({
                moduleNo: group[0]?.moduleNo ?? moduleNo,
                condition: '',
                // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                score: getDashboardScore(Number.isNaN(moduleAvgScore) || !moduleAvgScore ? 0 : moduleAvgScore)
            });
        });
    }
    organizationOutcome['lastCountryReview']['trainingComponentModules'] = trainingComponentModules;
    //#endregion
    return organizationOutcome;
};
const generateStatisticsForCountry = async (reviews, organizations, country, forms) => {
    // console.log(`######################## ${country.name} ########################`)
    const countryOutcome = {
        level: LevelStatEnum.Country,
        countryId: country['id'].toString(),
        // organizationId: '',
        trainingComponentTiles: [],
        assessmentHistory: [],
        lastCountryReview: {
            trainingComponentProgress: 0,
            trainingComponentOverview: [],
            trainingComponentModules: [],
            organizationOverview: [],
        },
        countryOverview: [],
    };
    const attemptedAssessments = await institutionalizationService.queryInstitutionalizationOrganizationAssessments({ countryId: country['id'] }, { sortBy: 'complete' })
        .then((outcome) => {
        return outcome?.results;
    });
    // console.log('@@@@@ : ', attemptedAssessments)
    //#region Top main tiles
    // Not grantee to all in same country review
    const trainingComponentTiles = [];
    const TrainingComponents = Object.values(TrainingComponentEnum);
    TrainingComponents.forEach((value, index) => {
        const latest = lodash.findLast(attemptedAssessments, { status: AssessmentStatusEnum.Complete, trainingComponent: value });
        if (latest) {
            const organizationDetails = lodash.find(organizations, function (o) { return o._id.toString() === latest.organizationId.toString(); });
            trainingComponentTiles.push({
                date: getDashboardDate(latest.complete),
                code: latest.trainingComponent,
                score: getDashboardScore(latest?.institutionalization?.score ?? 0),
                organization: organizationDetails?.name ?? ''
            });
        }
    });
    countryOutcome['trainingComponentTiles'] = trainingComponentTiles;
    // console.log('@@@@@ 1 trainingComponentTiles: ', trainingComponentTiles)
    //#endregion
    //#region Country review assessment history
    const assessmentHistory = [];
    lodash.forEach(reviews, (review, index) => {
        const assessmentsForReview = lodash.filter(attemptedAssessments, (attemptedAssessment) => {
            return attemptedAssessment.status === AssessmentStatusEnum.Complete
                && attemptedAssessment.countryReviewId.toString() === review['_id'].toString();
        });
        // Uncomment below to skip empty reviews
        // if (!lodash.isEmpty(assessmentsForReview)) {
        const averageScore = lodash.meanBy(assessmentsForReview, 'institutionalization.score');
        assessmentHistory.push({
            date: getDashboardDate(review.end),
            title: review.title,
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            averageScore: getDashboardScore(Number.isNaN(averageScore) || !averageScore ? 0 : averageScore)
        });
        // }
    });
    countryOutcome['assessmentHistory'] = assessmentHistory;
    //#endregion
    let lastCountryReview;
    //#region Last attended review
    let lastAssessmentHistory = [];
    lodash.forEach(reviews.reverse(), (review, index) => {
        if (!lodash.isEmpty(lastAssessmentHistory)) {
            return;
        }
        const assessmentsForReview = lodash.filter(attemptedAssessments, (attemptedAssessment) => {
            return attemptedAssessment.countryReviewId.toString() === review['_id'].toString();
        });
        if (!lodash.isEmpty(assessmentsForReview)) {
            lastAssessmentHistory = assessmentsForReview;
            lastCountryReview = review;
        }
    });
    // Latest training-component scores with progress
    let trainingComponentProgress = 0;
    const trainingComponentOverview = [];
    if (!lodash.isEmpty(lastCountryReview?.trainingComponents)) {
        lastCountryReview.trainingComponents.forEach((component, index) => {
            const latest = lodash.find(lastAssessmentHistory, { trainingComponent: component.code });
            if (!lodash.isEmpty(latest)) {
                trainingComponentProgress++;
            }
            trainingComponentOverview.push({
                code: latest?.trainingComponent ?? component.code,
                // averageScore: getDashboardScore(latest?.institutionalization?.score ?? 0)
                averageScore: getDashboardScore(latest?.status === AssessmentStatusEnum.Complete ? latest?.institutionalization?.score ?? 0 : 0)
            });
        });
        trainingComponentProgress = (trainingComponentProgress / lastCountryReview.trainingComponents.length ?? -1) * 100;
    }
    countryOutcome['lastCountryReview']['trainingComponentOverview'] = trainingComponentOverview;
    countryOutcome['lastCountryReview']['trainingComponentProgress'] = trainingComponentProgress;
    //#endregion
    //#region Latest institutionalization
    const trainingComponentModules = [];
    const organizationOverview = [];
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (lastCountryReview) {
        const modulesForReview = await getStatisticInstitutionalizationsByProps({
            level: LevelStatEnum.Assessment,
            countryReviewId: lastCountryReview['_id'].toString(),
            // countryId: new mongoose.Types.ObjectId(`${country['id'].toString()}`) ,
            assessmentStatus: AssessmentStatusEnum.Complete,
        });
        // Latest training-component module scores
        // May use forms for details
        const moduleGroups = lodash.groupBy(modulesForReview, 'moduleNo');
        lodash.map(moduleGroups, (group, moduleNo) => {
            const moduleAvgScore = lodash.meanBy(group, 'moduleScore');
            // console.log(`%%% group ${moduleNo} --> ${moduleAvgScore}: `, group)
            trainingComponentModules.push({
                moduleNo: group[0]?.moduleNo ?? moduleNo,
                condition: '',
                score: getDashboardScore(Number.isNaN(moduleAvgScore) ? 0 : moduleAvgScore)
            });
        });
        // Latest review organization scores
        const organizationGroups = lodash.groupBy(modulesForReview, 'organizationId');
        lodash.map(organizationGroups, (group, organizationId) => {
            const organizationAvgScore = lodash.meanBy(group, 'moduleScore');
            // console.log(`%%% group ${organizationId} --> ${moduleAvgScore}: `, group)
            organizationOverview.push({
                organization: group[0]?.organizationName ?? `${organizationId}`,
                progress: 0,
                averageScore: getDashboardScore(organizationAvgScore),
            });
        });
    }
    countryOutcome['lastCountryReview']['trainingComponentModules'] = trainingComponentModules;
    countryOutcome['lastCountryReview']['organizationOverview'] = organizationOverview;
    //#endregion 
    return countryOutcome;
};
const generateStatisticsForGlobal = async (reviews, organizations, countries, forms) => {
    console.log(`######################## global ########################`);
    const globalOutcome = {
        level: LevelStatEnum.Global,
        // countryId: '',
        // organizationId: '',
        trainingComponentTiles: [],
        assessmentHistory: [],
        lastCountryReview: {
            trainingComponentProgress: 0,
            trainingComponentOverview: [],
            trainingComponentModules: [],
            organizationOverview: [],
        },
        countryOverview: [],
    };
    const attemptedAssessments = await institutionalizationService.queryInstitutionalizationOrganizationAssessments({}, { sortBy: 'complete' })
        .then((outcome) => {
        return outcome?.results;
    });
    // console.log('@@@@@ : ', attemptedAssessments)
    //#region Top main tiles
    // Not grantee to all in same country review
    const trainingComponentTiles = [];
    const TrainingComponents = Object.values(TrainingComponentEnum);
    TrainingComponents.forEach((value, index) => {
        const latest = lodash.findLast(attemptedAssessments, { status: AssessmentStatusEnum.Complete, trainingComponent: value });
        if (latest) {
            const organizationDetails = lodash.find(organizations, function (o) { return o._id.toString() === latest.organizationId.toString(); });
            const countryDetails = lodash.find(countries, function (o) { return o._id.toString() === latest.countryId.toString(); });
            trainingComponentTiles.push({
                date: getDashboardDate(latest.complete),
                code: latest.trainingComponent,
                score: getDashboardScore(latest?.institutionalization?.score ?? 0),
                country: countryDetails?.name ?? '',
                organization: organizationDetails?.name ?? ''
            });
        }
    });
    globalOutcome['trainingComponentTiles'] = trainingComponentTiles;
    // console.log('@@@@@ 1 trainingComponentTiles: ', trainingComponentTiles)
    //#endregion
    //#region Country review assessment history
    // const assessmentHistory: assessmentHistoryItem[] = []
    const assessmentHistory = [];
    const countryOverview = [];
    lodash.forEach(reviews, (review, index) => {
        const assessmentsForReview = lodash.filter(attemptedAssessments, (attemptedAssessment) => {
            return attemptedAssessment.status === AssessmentStatusEnum.Complete
                && attemptedAssessment.countryReviewId.toString() === review['_id'].toString();
        });
        // Uncomment below to skip empty reviews
        // if (!lodash.isEmpty(assessmentsForReview)) {
        const averageScore = lodash.meanBy(assessmentsForReview, 'institutionalization.score');
        const countryDetails = lodash.find(countries, function (o) { return o._id.toString() === review.countryId.toString(); });
        assessmentHistory.push({
            date: getDashboardDate(review.end),
            title: review.title,
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            averageScore: getDashboardScore(Number.isNaN(averageScore) || !averageScore ? 0 : averageScore),
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            countryId: countryDetails && countryDetails.id ? countryDetails.id.toString() : '',
            country: `${countryDetails?.name}`,
            review: review['_id']
        });
        // }
    });
    // Latest review country scores
    lodash.map(countries, (countryDetails) => {
        const lastReviewDetails = lodash.findLast(assessmentHistory, { countryId: countryDetails.id.toString() });
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (lastReviewDetails) {
            countryOverview.push({
                country: lastReviewDetails.country,
                averageScore: lastReviewDetails.averageScore,
                date: lastReviewDetails.date,
                reviewId: lastReviewDetails.review.toString(),
            });
        }
    });
    globalOutcome['assessmentHistory'] = assessmentHistory;
    globalOutcome['countryOverview'] = countryOverview;
    // console.log('@@@@@@@@@@@@@@@@@@ assessmentHistory: ', assessmentHistory)
    // console.log('@@@@@@@@@@@@@@@@@@ countryOverview: ', countryOverview)
    //#endregion
    return globalOutcome;
};
//# sourceMappingURL=dashboard.service.js.map