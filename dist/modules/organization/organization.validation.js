import Joi from 'joi';
import { GeographicAreaEnum, OrganizationStatusEnum, OrganizationTypeEnum } from '../../shared/interfaces/organization';
import { addressBody } from '../user/user.validation';
import { objectId } from '../validate';
export const organizationBranch = {
    branchName: Joi.string().required(),
    isHeadOffice: Joi.boolean(),
    isVirtual: Joi.boolean(),
    contactPerson: Joi.string(),
    email: Joi.string(),
    phoneNumber: Joi.string(),
    address: Joi.object().keys(addressBody),
    website: Joi.string(),
    employees: Joi.array().items(Joi.custom(objectId)),
};
export const organization = {
    name: Joi.string().required(),
    description: Joi.string(),
    category: Joi.string(),
    countryId: Joi.required().custom(objectId),
    registeredNo: Joi.string(),
    isLegalEntity: Joi.boolean(),
    vision: Joi.string(),
    mission: Joi.string(),
    organizationType: Joi.string().valid(...Object.values(OrganizationTypeEnum)),
    geographicArea: Joi.string().valid(...Object.values(GeographicAreaEnum)),
    status: Joi.string().valid(...Object.values(OrganizationStatusEnum)),
    departments: Joi.array().items(Joi.string()),
    designations: Joi.array().items(Joi.string()),
    headOffice: Joi.object().keys(organizationBranch),
    branches: Joi.array().items(Joi.object().keys(organizationBranch)),
};
export const createOrganization = {
    body: Joi.object().keys(organization),
};
export const getOrganizations = {
    body: Joi.object().keys({
        name: Joi.string(),
        sortBy: Joi.string(),
        projectBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};
export const getOrganization = {
    params: Joi.object().keys({
        organizationId: Joi.string().custom(objectId),
    }),
};
export const updateOrganization = {
    params: Joi.object().keys({
        organizationId: Joi.required().custom(objectId),
    }),
    // body: Joi.object().keys(organization).min(1),
};
export const deleteOrganization = {
    params: Joi.object().keys({
        organizationId: Joi.string().custom(objectId),
    }),
};
//# sourceMappingURL=organization.validation.js.map