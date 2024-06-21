import { Router } from 'express';
import institutionalizationRouter from './institutionalization/institutionalization.route';
import dashboardRouter from './dashboard/dashboard.route';
const router = Router();
//#region Statistics
router
    .use('/institutionalization', institutionalizationRouter)
    .use('/dashboard', dashboardRouter);
//#endregion
export default router;
//# sourceMappingURL=index.route.js.map