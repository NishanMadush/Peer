import httpStatus from 'http-status';
import mongoose from 'mongoose';
import ApiError from '../../services/errors/ApiError';
import { catchAsync, pick } from '../../utils';
import * as countryService from './country.service';
export const createCountry = catchAsync(async (req, res) => {
    const country = await countryService.createCountry(req.body);
    res.status(httpStatus.CREATED).send(country);
});
export const getCountries = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['name', 'role']);
    const options = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
    const result = await countryService.queryCountries(filter, options);
    res.send(result);
});
export const getCountry = catchAsync(async (req, res) => {
    if (typeof req.params['countryId'] === 'string') {
        const country = await countryService.getCountryById(new mongoose.Types.ObjectId(req.params['countryId']));
        if (!country) {
            throw new ApiError(httpStatus.NOT_FOUND, req.t('country:countryNotFound'));
        }
        res.send(country);
    }
});
export const updateCountry = catchAsync(async (req, res) => {
    if (typeof req.params['countryId'] === 'string') {
        const country = await countryService.updateCountryById(new mongoose.Types.ObjectId(req.params['countryId']), req.body, req.t);
        res.send(country);
    }
});
export const deleteCountry = catchAsync(async (req, res) => {
    if (typeof req.params['countryId'] === 'string') {
        await countryService.deleteCountryById(new mongoose.Types.ObjectId(req.params['countryId']), req.t);
        res.status(httpStatus.NO_CONTENT).send();
    }
});
//# sourceMappingURL=country.controller.js.map