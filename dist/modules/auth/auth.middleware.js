import httpStatus from 'http-status';
import lodash from 'lodash';
import passport from 'passport';
// import { roleRights } from '../../config/roles'
import ApiError from '../../services/errors/ApiError';
import { userService } from '../user';
import { PermissionTypeEnum } from '../../shared/interfaces/user';
import { error } from 'console';
const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (err || info || !user) {
        console.error(`${new Date()} request is unauthorized`);
        return reject(new ApiError(httpStatus.UNAUTHORIZED, req.t('auth:pleaseAuthenticate')));
    }
    // return reject(new ApiError(httpStatus.FORBIDDEN, req.t('auth:forbidden')))
    const userRole = await userService.getPermissionsByRole(user.role);
    req.user = user;
    req.role = userRole;
    if (requiredRights.length >= 0) {
        if (!userRole) {
            console.error(`${new Date()} request role is unavailable for ${user?.id}`);
            return reject(new ApiError(httpStatus.FORBIDDEN, req.t('auth:forbidden')));
        }
        // Filter the backend rights
        const userRights = lodash.filter(userRole?.permissions, { type: PermissionTypeEnum.BE });
        if (userRights.length == 0) {
            console.error(`${new Date()} role permissions unavailable for user ${user?.id}`);
            return reject(new ApiError(httpStatus.FORBIDDEN, req.t('auth:forbidden')));
        }
        const hasRequiredRights = requiredRights.every((requiredRight) => (lodash.find(userRights, { permission: requiredRight }) !== undefined));
        if (!hasRequiredRights && req.params['userId'] !== user.id) {
            console.error(`${new Date()} required permissions unavailable for user ${user?.id} which are ${requiredRights}`);
            return reject(new ApiError(httpStatus.FORBIDDEN, req.t('auth:forbidden')));
        }
    }
    resolve();
};
const authMiddleware = (...requiredRights) => async (req, res, next) => {
    return new Promise((resolve, reject) => {
        passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
    })
        .then(() => next())
        .catch((err) => {
        console.error(error);
        next(err);
    });
};
export default authMiddleware;
//# sourceMappingURL=auth.middleware.js.map