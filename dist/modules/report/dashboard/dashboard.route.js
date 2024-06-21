import { Router } from 'express';
import * as dashboardController from './dashboard.controller';
import { auth } from '../../auth';
const router = Router();
//#region Statistics
router
    .route('/statistics/assessments')
    .get(auth('GET_REPORT_DASHBOARD'), dashboardController.getStatisticDashboard)
    .post(auth('MANAGE_REPORT_DASHBOARD'), dashboardController.createStatisticDashboard);
//#endregion
export default router;
//# sourceMappingURL=dashboard.route.js.map