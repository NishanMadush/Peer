import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { API_ENDPOINT } from '../../constants/apiEndpoints';
import swaggerDefinition from '../../services/swagger/swagger.definition';
const router = express.Router();
const specs = swaggerJsdoc({
    swaggerDefinition,
    apis: ['packages/components.yaml', `dist/routes${API_ENDPOINT}/*.js`],
});
router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(specs, {
    explorer: true,
}));
export default router;
//# sourceMappingURL=swagger.route.js.map