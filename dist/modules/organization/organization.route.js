import express from 'express';
import { validate } from '../validate';
import * as organizationController from './organization.controller';
import * as organizationValidation from './organization.validation';
import { auth } from '../auth';
const router = express.Router();
router
    .route('/')
    /**
     *
     */
    .post(auth('MANAGE_ORGANIZATIONS'), validate(organizationValidation.createOrganization), organizationController.createOrganization)
    /**
     *
     */
    .get(auth('GET_ORGANIZATIONS'), validate(organizationValidation.getOrganizations), organizationController.getOrganizations);
router
    .route('/:organizationId')
    /**
     *
     */
    .get(auth('GET_ORGANIZATIONS'), validate(organizationValidation.getOrganization), organizationController.getOrganization)
    /**
     *
     */
    .patch(auth('MANAGE_ORGANIZATIONS'), validate(organizationValidation.updateOrganization), organizationController.updateOrganization)
    /**
     *
     */
    .delete(auth('MANAGE_ORGANIZATIONS'), validate(organizationValidation.deleteOrganization), organizationController.deleteOrganization);
export default router;
//# sourceMappingURL=organization.route.js.map