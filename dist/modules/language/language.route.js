import express from 'express';
import { validate } from '../validate';
import * as languageController from './language.controller';
import * as languageValidation from './language.validation';
import { auth } from '../auth';
const router = express.Router();
router
    .route('/')
    /**
     *
     */
    .post(auth('MANAGE_LANGUAGE'), validate(languageValidation.createLanguage), languageController.createLanguage)
    /**
     *
     */
    .get(auth('GET_LANGUAGE'), validate(languageValidation.getLanguages), languageController.getLanguages);
router
    .route('/:languageId')
    /**
     *
     */
    .get(auth('GET_LANGUAGE'), validate(languageValidation.getLanguage), languageController.getLanguage)
    /**
     *
     */
    .patch(auth('MANAGE_LANGUAGE'), validate(languageValidation.updateLanguage), languageController.updateLanguage)
    /**
     *
     */
    .delete(auth('MANAGE_LANGUAGE'), validate(languageValidation.deleteLanguage), languageController.deleteLanguage);
export default router;
//# sourceMappingURL=language.route.js.map