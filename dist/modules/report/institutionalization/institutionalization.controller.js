import { catchAsync } from '../../../utils';
import * as institutionalizationService from './institutionalization.service';
// #region Statistics
export const getStatisticInstitutionalizations = catchAsync(async (req, res) => {
    console.log('query 1: ', req.query);
    console.log('query 1: ', req.query['itemId']);
    console.log('itemId 1: ', req.query['itemId']);
    let props = {};
    // if (typeof req.query['itemId'] === 'string' || typeof req.query['level'] === 'string') {
    //   console.log('level: ', req.query['level'])
    //   console.log('itemId: ', req.query['itemId'])
    //   if (req.query['level'] === LevelStatEnum.Global
    //     || req.query['level'] === LevelStatEnum.Country
    //     || req.query['level'] === LevelStatEnum.Organization
    //     || req.query['level'] === LevelStatEnum.Assessment) {
    //     props['level'] = req.query['level']
    //   }
    //   // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    //   if (req.query['itemId']) props['itemId'] = req.query['itemId']
    // }
    props = req.query;
    console.log('~!@# props: ', props);
    const result = await institutionalizationService.getStatisticInstitutionalizationsByProps(props);
    res.send(result);
});
export const createStatisticInstitutionalizations = catchAsync(async (req, res) => {
    const result = await institutionalizationService.generateStatisticsForAssert();
    res.send(result);
});
// #endregion
//# sourceMappingURL=institutionalization.controller.js.map