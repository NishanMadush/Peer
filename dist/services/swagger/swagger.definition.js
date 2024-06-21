import config from '../../config/config';
import { API_ENDPOINT } from '../../constants/apiEndpoints';
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'node-express-typescript-boilerplate API documentation',
        version: '0.0.1',
        description: 'This is a node express mongoose boilerplate in typescript',
        license: {
            name: 'MIT',
            url: 'https://github.com/saisilinus/node-express-mongoose-typescript-boilerplate.git',
        },
    },
    servers: [
        {
            url: `http://localhost:${config.port}${API_ENDPOINT}`,
            description: 'Development Server',
        },
    ],
};
export default swaggerDefinition;
//# sourceMappingURL=swagger.definition.js.map