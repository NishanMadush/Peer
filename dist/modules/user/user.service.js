import httpStatus from 'http-status';
import ApiError from '../../services/errors/ApiError';
import { User, RolePermission } from './user.model';
/**
 * Create an user
 * @param {NewCreatedUser} userBody
 * @returns {Promise<IUserDoc>}
 */
export const createUser = async (userBody, _t) => {
    if (await User.isUsernameTaken(userBody.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, _t('user:usernameAlreadyTaken'));
    }
    return User.create(userBody);
};
/**
 * Register an user
 * @param {NewRegisteredUser} userBody
 * @returns {Promise<IUserDoc>}
 */
export const registerUser = async (userBody, _t) => {
    if (await User.isUsernameTaken(userBody.username)) {
        throw new ApiError(httpStatus.BAD_REQUEST, _t('user:usernameAlreadyTaken'));
    }
    return User.create(userBody);
};
/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryUsers = async (filter, options) => {
    const users = await User.paginate(filter, options);
    return users;
};
/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryUsersWithCountry = async (filter) => {
    const users = await User.find(filter).populate('employment.organization.organizationId', 'name countryId');
    return users;
};
/**
 * Get user by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IUserDoc | null>}
 */
export const getUserById = async (id) => User.findById(id);
/**
 * Get user by email
 * @param {string} username
 * @returns {Promise<IUserDoc | null>}
 */
export const getUserByUsername = async (username) => User.findOne({ username });
export const getUserByUsernameWithCountry = async (username) => {
    return User.findOne({ username }).populate('employment.organization.organizationId', 'name countryId');
};
/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<IUserDoc | null>}
 */
export const getUserByEmail = async (email) => User.findOne({ email });
/**
 * Update user by id
 * @param {mongoose.Types.ObjectId} userId
 * @param {UpdateUserBody} updateBody
 * @returns {Promise<IUserDoc | null>}
 */
export const updateUserById = async (userId, updateBody, _t) => {
    const user = await getUserById(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, _t('user:userNotFound'));
    }
    if ((updateBody.username != null) && (await User.isUsernameTaken(updateBody.username, userId))) {
        throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, _t('user:usernameAlreadyTaken'));
    }
    Object.assign(user, updateBody);
    await user.save();
    return user;
};
/**
 * Delete user by id
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<IUserDoc | null>}
 */
export const deleteUserById = async (userId, _t) => {
    const user = await getUserById(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, _t('user:userNotFound'));
    }
    await user.remove();
    return user;
};
/**
 * Create a role
 * @param {CreateRoleBody} roleBody
 * @returns {Promise<IRole>}
 */
export const createRole = async (roleBody, _t) => {
    if (await RolePermission.isRoleTaken(roleBody.role)) {
        throw new ApiError(httpStatus.BAD_REQUEST, _t('user:roleAlreadyTaken'));
    }
    return RolePermission.create(roleBody);
};
/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryRoles = async (filter, options) => {
    const userRoles = await RolePermission.paginate(filter, options);
    return userRoles;
};
/**
 * Get permissions by role
 * @param {string} role
 * @returns {Promise<IRoleDoc | null>}
 */
export const getPermissionsByRole = async (role) => RolePermission.findOne({ role });
/**
 * Update user by id
 * @param {string} role
 * @param {UpdateRoleBody} updateBody
 * @returns {Promise<IRoleDoc | null>}
 */
export const updatePermissionsByRole = async (role, updateBody, _t) => {
    const userRole = await getPermissionsByRole(role);
    if (!userRole) {
        throw new ApiError(httpStatus.NOT_FOUND, _t('user:roleNotFound'));
    }
    if ((updateBody.role != null) && (await RolePermission.isRoleTaken(updateBody.role))) {
        throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, _t('user:roleAlreadyTaken'));
    }
    Object.assign(userRole, updateBody);
    await userRole.save();
    return userRole;
};
/**
 * Delete role by id
 * @param {mongoose.Types.ObjectId} roleId
 * @returns {Promise<IRoleDoc | null>}
 */
export const deleteRoleById = async (roleId, _t) => {
    const userRole = await RolePermission.findById(roleId);
    if (!userRole) {
        throw new ApiError(httpStatus.NOT_FOUND, _t('user:roleNotFound'));
    }
    await userRole.remove();
    return userRole;
};
//# sourceMappingURL=user.service.js.map