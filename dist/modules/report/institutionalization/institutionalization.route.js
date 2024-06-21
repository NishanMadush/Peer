import { Router } from 'express';
import * as institutionalizationController from './institutionalization.controller';
import { auth } from '../../auth';
const router = Router();
//#region Statistics
router
    .route('/statistics/assessments')
    .post(auth('MANAGE_REPORT_INSTITUTIONALIZATION'), institutionalizationController.createStatisticInstitutionalizations)
    .get(auth('GET_REPORT_INSTITUTIONALIZATION'), institutionalizationController.getStatisticInstitutionalizations);
//#endregion
export default router;
//# sourceMappingURL=institutionalization.route.js.map