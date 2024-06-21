import httpStatus from 'http-status';
import mongoose from 'mongoose';
import ApiError from '../../services/errors/ApiError';
import catchAsync from '../../utils/catchAsync';
import pick from '../../utils/pick';
import * as userService from './user.service';
import { tokenService } from '../token';
import { emailService } from '../../services/email';
import { UserStatusEnum } from '../../shared/interfaces/user';
import lodash from 'lodash';
//#region User
export const createUser = catchAsync(async (req, res) => {
    if (req.body?.password == undefined) {
        req.body['password'] = `A${Math.random() * 10000}@a`;
    }
    const user = await userService.createUser(req.body, req.t);
    const { email, createPasswordToken } = await tokenService.generateCreatePasswordToken(req.body.username);
    await emailService.sendCreatePasswordEmail(email, createPasswordToken);
    res.status(httpStatus.CREATED).send(user);
});
export const getUsers = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['_id', 'username', 'role', 'email', 'status', 'employment.organization.organizationId']);
    const options = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
    const result = await userService.queryUsers(filter, options);
    res.send(result);
});
export const getUsersWithCountry = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['_id', 'username', 'role', 'email', 'status']);
    const result = await userService.queryUsersWithCountry(filter ?? {});
    // country and organization ids are filtered using lodash
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (lodash.isArray(result) && (req?.query['organizationId'] || req?.query['countryId'])) {
        const ldhResult = lodash.filter(result, function (item) {
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            if (req.query['organizationId']) {
                return item?.employment?.organization?.organizationId?.id?.toString() === req.query['organizationId'].toString();
            }
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            else if (req.query['countryId']) {
                return item?.employment?.organization?.organizationId?.countryId?.toString() === req.query['countryId'].toString();
            }
            else {
                return false;
            }
        });
        return res.send(ldhResult);
    }
    else {
        return res.send(result);
    }
});
export const getUser = catchAsync(async (req, res) => {
    console.log('@@@@ session reg.user: ', req?.user);
    if (typeof req.params['userId'] === 'string') {
        const user = await userService.getUserById(new mongoose.Types.ObjectId(req.params['userId']));
        if (!user) {
            throw new ApiError(httpStatus.NOT_FOUND, req.t('user:userNotFound'));
        }
        res.send(user);
    }
});
export const updateUser = catchAsync(async (req, res) => {
    if (typeof req.params['userId'] === 'string') {
        const user = await userService.updateUserById(new mongoose.Types.ObjectId(req.params['userId']), req.body, req.t);
        res.send(user);
    }
});
export const deleteUser = catchAsync(async (req, res) => {
    if (typeof req.params['userId'] === 'string') {
        await userService.deleteUserById(new mongoose.Types.ObjectId(req.params['userId']), req.t);
        res.status(httpStatus.NO_CONTENT).send();
    }
});
//#endregion
//#region User-Profile
export const getProfile = catchAsync(async (req, res) => {
    if (typeof req.params['userId'] === 'string' && req.params['userId'] === req.user._id.toString()) {
        const user = await userService.getUserById(new mongoose.Types.ObjectId(req.params['userId']));
        if (user) {
            return res.send(user);
        }
    }
    throw new ApiError(httpStatus.NOT_FOUND, req.t('user:userNotFound'));
});
export const updateProfile = catchAsync(async (req, res) => {
    console.log('~!@# update profile: ', req.user);
    console.log('~!@# update profile: ', req.body);
    if (typeof req.params['userId'] === 'string' && req.params['userId'] === req.user._id.toString()) {
        const user = await userService.updateUserById(new mongoose.Types.ObjectId(req.params['userId']), req.body, req.t);
        return res.send(user);
    }
    throw new ApiError(httpStatus.NOT_FOUND, req.t('user:userNotFound'));
});
//#endregion
export const notifyUser = catchAsync(async (req, res) => {
    console.log('~!@# notiy user: ', req.params);
    if (typeof req.params['userId'] !== 'string') {
        throw new ApiError(httpStatus.NOT_FOUND, req.t('user:userNotFound'));
    }
    const user = await userService.getUserById(new mongoose.Types.ObjectId(req.params['userId']));
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, req.t('user:userNotFound'));
    }
    const { email, resetPasswordToken } = await tokenService.generateResetPasswordToken(user?.username);
    if (user.status === UserStatusEnum.Pending) {
        await emailService.sendCreatePasswordEmail(email, resetPasswordToken);
    }
    else if (user.status === UserStatusEnum.Incomplete || user.status === UserStatusEnum.Active) {
        await emailService.sendResetPasswordEmail(email, resetPasswordToken);
    }
    else {
        throw new ApiError(httpStatus.BAD_REQUEST, req.t('user:userNotFound'));
    }
    // Email sent to the user
    res.status(httpStatus.NO_CONTENT).send();
});
export const sendOptions = catchAsync(async (req, res) => {
    res.status(httpStatus.NO_CONTENT).send();
});
export const _getUserActivityLog = catchAsync(async (req, res) => {
    const activities = [
        {
            "id": "1",
            "actor": "You",
            "code": "eventAdded",
            "createdAt": 1617868226000,
            "params": {
                "resource": "React Summit"
            }
        },
        {
            "id": "2",
            "actor": "John Smith",
            "code": "eventUpdated",
            "createdAt": 1617868226000,
            "params": {
                "resource": "React Summit"
            }
        },
        {
            "id": "3",
            "actor": "John Smith",
            "code": "userDeleted",
            "createdAt": 1617868226000,
            "params": {
                "resource": "John Smith"
            }
        },
        {
            "id": "4",
            "actor": "John Smith",
            "code": "userUpdated",
            "createdAt": 1617868226000,
            "params": {
                "resource": "John Smith"
            }
        },
        {
            "id": "5",
            "actor": "John Smith",
            "code": "userAdded",
            "createdAt": 1617868226000,
            "params": {
                "resource": "John Smith"
            }
        }
    ];
    res.status(httpStatus.OK).send(activities);
    // res.send(activities)
});
//#region User-Role
export const createRole = catchAsync(async (req, res) => {
    const userRole = await userService.createRole(req.body, req.t);
    res.status(httpStatus.CREATED).send(userRole);
});
export const getRoles = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['role']);
    const options = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
    console.log('~!@# options: ', options);
    console.log('~!@# filter: ', filter);
    const result = await userService.queryRoles(filter, options);
    res.send(result);
});
export const getPermissionsByRole = catchAsync(async (req, res) => {
    if (typeof req.params['role'] === 'string') {
        const userRole = await userService.getPermissionsByRole(req.params['role']);
        if (!userRole) {
            throw new ApiError(httpStatus.NOT_FOUND, req.t('user:roleNotFound'));
        }
        res.send(userRole);
    }
});
export const updateRole = catchAsync(async (req, res) => {
    if (typeof req.params['role'] === 'string') {
        const userRole = await userService.updatePermissionsByRole(req.params['role'], req.body, req.t);
        res.send(userRole);
    }
});
export const deleteRole = catchAsync(async (req, res) => {
    if (typeof req.params['roleId'] === 'string') {
        await userService.deleteRoleById(new mongoose.Types.ObjectId(req.params['roleId']), req.t);
        res.status(httpStatus.NO_CONTENT).send();
    }
});
//#endregion
//# sourceMappingURL=user.controller.js.map