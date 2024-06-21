import httpStatus from 'http-status';
import { ApiError } from '../../services/errors';
import OrganizationModel from './organization.model';
/**
 * Create an organization
 * @param {IOrganizationDoc} organizationBody
 * @returns {Promise<IOrganizationDoc>}
 */
export const createOrganization = async (organizationBody) => {
    return OrganizationModel.create(organizationBody);
};
/**
 * Query for organizations
 * @param {Object} filter the mongo filter
 * @param {Object} options the query options
 * @returns {Promise<QueryResult}
 */
export const queryOrganizations = async (filter, options) => {
    const organizations = await OrganizationModel.paginate(filter, options);
    return organizations;
};
/**
 * Get organization by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IOrganizationDoc|null>}
 */
export const getOrganizationById = async (id) => OrganizationModel.findById(id);
/**
 * Update an organization by id
 * @param {ObjectId} organizationId organization id
 * @param {UpdateOrganizationBody} updateBody update body
 * @returns {Promise<IOrganizationDoc|null>}
 */
export const updateOrganizationById = async (organizationId, updateBody, _t) => {
    const organization = await OrganizationModel.findByIdAndUpdate(organizationId, updateBody, { new: true });
    if (!organization) {
        throw new ApiError(httpStatus.NOT_FOUND, _t('organization:organizationNotFound'));
    }
    return organization;
};
/**
 * Delete organization by id
 * @param {ObjectId} organizationId organization id
 * @returns {Promise<IOrganizationDoc|null>}
 */
export const deleteOrganizationById = async (organizationId, _t) => {
    const organization = await getOrganizationById(organizationId);
    if (!organization) {
        throw new ApiError(httpStatus.NOT_FOUND, _t('organization:organizationNotFound'));
    }
    // Do necessary. Such as check branches or users
    await organization.remove();
    return organization;
};
//# sourceMappingURL=organization.service.js.map