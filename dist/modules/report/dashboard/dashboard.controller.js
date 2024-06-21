import { catchAsync } from '../../../utils';
import * as dashboardService from './dashboard.service';
export const getStatisticDashboard = catchAsync(async (req, res) => {
    const props = req.query;
    console.log('~!@# props: ', props);
    const result = await dashboardService.getStatisticDashboardByProps(props);
    res.send(result);
});
export const createStatisticDashboard = catchAsync(async (req, res) => {
    const result = await dashboardService.generateStatisticsForDashboard();
    res.send(result);
});
//# sourceMappingURL=dashboard.controller.js.map