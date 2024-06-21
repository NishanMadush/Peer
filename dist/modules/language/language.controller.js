import httpStatus from 'http-status';
import mongoose from 'mongoose';
import ApiError from '../../services/errors/ApiError';
import { catchAsync, pick } from '../../utils';
import * as languageService from './language.service';
export const createLanguage = catchAsync(async (req, res) => {
    const language = await languageService.createLanguage(req.body);
    res.status(httpStatus.CREATED).send(language);
});
export const getLanguages = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['name', 'role']);
    const options = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
    const result = await languageService.queryLanguages(filter, options);
    res.send(result);
});
export const getLanguage = catchAsync(async (req, res) => {
    if (typeof req.params['languageId'] === 'string') {
        const language = await languageService.getLanguageById(new mongoose.Types.ObjectId(req.params['languageId']));
        if (!language) {
            throw new ApiError(httpStatus.NOT_FOUND, req.t('language:languageNotFound'));
        }
        res.send(language);
    }
});
export const updateLanguage = catchAsync(async (req, res) => {
    if (typeof req.params['languageId'] === 'string') {
        const language = await languageService.updateLanguageById(new mongoose.Types.ObjectId(req.params['languageId']), req.body, req.t);
        res.send(language);
    }
});
export const deleteLanguage = catchAsync(async (req, res) => {
    if (typeof req.params['languageId'] === 'string') {
        await languageService.deleteLanguageById(new mongoose.Types.ObjectId(req.params['languageId']), req.t);
        res.status(httpStatus.NO_CONTENT).send();
    }
});
//# sourceMappingURL=language.controller.js.map