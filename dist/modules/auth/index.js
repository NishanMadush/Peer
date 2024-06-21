import * as authController from './auth.controller';
import authMiddleware from './auth.middleware';
import * as authService from './auth.service';
import * as authValidation from './auth.validation';
import jwtStrategy from './passport';
export { authMiddleware as auth, authController, authService, authValidation, jwtStrategy };
//# sourceMappingURL=index.js.map