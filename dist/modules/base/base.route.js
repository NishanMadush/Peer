import express from 'express';
import * as baseController from './base.controller';
import { auth } from '../auth';
const router = express.Router();
router
    .route('/activity-logs')
    .get(baseController._getUserActivityLog);
router
    .route('/notifications')
    .get(baseController._notifications);
router
    .route('/settings/user')
    .get(auth('GET_BASE_SETTINGS'), baseController.userSettings);
export default router;
//# sourceMappingURL=base.route.js.map