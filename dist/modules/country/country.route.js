import express from 'express';
import { validate } from '../validate';
import * as countryController from './country.controller';
import * as countryValidation from './country.validation';
import { auth } from '../auth';
const router = express.Router();
router
    .route('/')
    /**
     *
     */
    .post(auth('MANAGE_COUNTRY'), validate(countryValidation.createCountry), countryController.createCountry)
    /**
     *
     */
    .get(auth('GET_COUNTRY'), validate(countryValidation.getCountries), countryController.getCountries);
router
    .route('/:countryId')
    /**
     *
     */
    .get(auth('GET_COUNTRY'), validate(countryValidation.getCountry), countryController.getCountry)
    /**
     *
     */
    .patch(auth('MANAGE_COUNTRY'), validate(countryValidation.updateCountry), countryController.updateCountry)
    /**
     *
     */
    .delete(auth('MANAGE_COUNTRY'), validate(countryValidation.deleteCountry), countryController.deleteCountry);
export default router;
//# sourceMappingURL=country.route.js.map