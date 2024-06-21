import httpStatus from 'http-status';
import mongoose from 'mongoose';
import ApiError from '../../services/errors/ApiError';
import { catchAsync, pick } from '../../utils';
import * as organizationService from './organization.service';
export const createOrganization = catchAsync(async (req, res) => {
    const organization = await organizationService.createOrganization(req.body);
    res.status(httpStatus.CREATED).send(organization);
});
export const getOrganizations = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['_id', 'countryId']);
    const options = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
    const result = await organizationService.queryOrganizations(filter, options);
    res.send(result);
});
export const getOrganization = catchAsync(async (req, res) => {
    if (typeof req.params['organizationId'] === 'string') {
        const organization = await organizationService.getOrganizationById(new mongoose.Types.ObjectId(req.params['organizationId']));
        if (!organization) {
            throw new ApiError(httpStatus.NOT_FOUND, req.t('organization:organizationNotFound'));
        }
        res.send(organization);
    }
});
export const updateOrganization = catchAsync(async (req, res) => {
    if (typeof req.params['organizationId'] === 'string') {
        const organization = await organizationService.updateOrganizationById(new mongoose.Types.ObjectId(req.params['organizationId']), req.body, req.t);
        res.send(organization);
    }
});
export const deleteOrganization = catchAsync(async (req, res) => {
    if (typeof req.params['organizationId'] === 'string') {
        await organizationService.deleteOrganizationById(new mongoose.Types.ObjectId(req.params['organizationId']), req.t);
        res.status(httpStatus.NO_CONTENT).send();
    }
});
//# sourceMappingURL=organization.controller.js.map