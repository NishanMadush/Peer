import { InventoryItem as InventoryItemModel, InventoryGroup as InventoryGroupModel, InventoryTemplate as InventoryTemplateModel, Invoice as InvoiceModel } from "./inventory.model";
import mongoose from "mongoose";
import { ApiError } from "../../services/errors";
import httpStatus from "http-status";
import logger from "../../services/logger/logger";
import lodash from "lodash";
// #region Inventory-Item
/**
 * Create a inventory item
 * @param {IInventoryItem} inventoryItemBody
 * @returns {Promise<IInventoryItemDoc>}
 */
export const createInventoryItem = async (inventoryItemBody) => {
    return InventoryItemModel.create(inventoryItemBody);
};
/**
 * Query for inventory items
 * @param {Object} filter the mongo filter
 * @param {Object} options the query options
 * @returns {Promise<QueryResult>}
 */
export const queryInventoryItems = async (filter, options) => {
    const inventoryItems = await InventoryItemModel.paginate(filter, options);
    return inventoryItems;
};
/**
 * Get the inventory item by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IInventoryItemDoc|null>}
 */
export const getInventoryItemById = async (id) => InventoryItemModel.findById(id);
/**
 * Update the inventory item by id
 * @param {ObjectId} inventoryItemId inventory item id
 * @param {UpdateInventoryItemBody} updateInventoryItemBody update body
 * @returns {Promise<IInventoryItemDoc|null>}
 */
export const updateInventoryItemById = async (inventoryItemId, updateInventoryItemBody, _t) => {
    const inventoryItem = await InventoryItemModel.findByIdAndUpdate(inventoryItemId, updateInventoryItemBody, { new: true });
    if (!inventoryItem) {
        throw new ApiError(httpStatus.NOT_FOUND, _t('inventory:inventoryItemNotFound'));
    }
    return inventoryItem;
};
/**
 * Delete the inventory item by id
 * @param {ObjectId} inventoryItemId inventory item id
 * @returns {Promise<ILanguageDoc|null>}
 */
export const deleteInventoryItemById = async (inventoryItemId, _t) => {
    const inventoryItem = await getInventoryItemById(inventoryItemId);
    if (!inventoryItem) {
        throw new ApiError(httpStatus.NOT_FOUND, _t('inventory:inventoryItemNotFound'));
    }
    await inventoryItem.remove();
    return inventoryItem;
};
// #endregion
// #region Inventory-Group
/**
 * Create a inventory group
 * @param {IInventoryGroup} inventoryGroupBody
 * @returns {Promise<IInventoryGroupDoc>}
 */
export const createInventoryGroup = async (inventoryGroupBody) => {
    return InventoryGroupModel.create(inventoryGroupBody);
};
/**
* Query for inventory groups
* @param {Object} filter the mongo filter
* @param {Object} options the query options
* @returns {Promise<QueryResult>}
*/
export const queryInventoryGroups = async (filter, options) => {
    const inventoryGroups = await InventoryGroupModel.paginate(filter, options);
    return inventoryGroups;
};
/**
* Get the inventory group by id
* @param {mongoose.Types.ObjectId} inventoryGroupId inventory group id
* @returns {Promise<IInventoryGroupDoc|null>}
*/
export const getInventoryGroupById = async (inventoryGroupId) => InventoryGroupModel.findById(inventoryGroupId);
/**
* Update the inventory group by id
* @param {ObjectId} inventoryGroupId inventory group id
* @param {UpdateInventoryGroupBody} updateInventoryGroupBody update body
* @returns {Promise<IInventoryGroupDoc|null>}
*/
export const updateInventoryGroupById = async (inventoryGroupId, updateInventoryGroupBody, _t) => {
    const inventoryGroup = await InventoryGroupModel.findByIdAndUpdate(inventoryGroupId, updateInventoryGroupBody, { new: true });
    if (!inventoryGroup) {
        throw new ApiError(httpStatus.NOT_FOUND, _t('inventory:inventoryGroupNotFound'));
    }
    return inventoryGroup;
};
/**
* Delete the inventory group by id
* @param {ObjectId} inventoryGroupId inventory group id
* @returns {Promise<IInventoryGroupDoc|null>}
*/
export const deleteInventoryGroupById = async (inventoryGroupId, _t) => {
    const inventoryGroup = await getInventoryGroupById(inventoryGroupId);
    if (!inventoryGroup) {
        throw new ApiError(httpStatus.NOT_FOUND, _t('inventory:inventoryGroupNotFound'));
    }
    await inventoryGroup.remove();
    return inventoryGroup;
};
/**
 * Add item/s to an existing group
 * @param {ObjectId} query.inventoryGroupId inventory group id
 * @param {IInventoryGroupItem[]} body.inventoryItemBody inventory item body
 * @returns {Promise<IInventoryGroupDoc>}
 */
export const addInventoryGroupItemsById = async (inventoryGroupId, inventoryItemBody, _t) => {
    const inventoryGroup = await InventoryGroupModel.findOneAndUpdate({ _id: inventoryGroupId }, {
        $addToSet: { items: inventoryItemBody },
    }, { upsert: false, new: true, setDefaultsOnInsert: true, runValidators: true });
    if (inventoryGroup)
        return inventoryGroup;
    else
        throw new ApiError(httpStatus.NOT_FOUND, _t('inventory:inventoryGroupNotFound'));
};
/**
 * Delete item/s from an existing group
 * @param {ObjectId} query.inventoryGroupId inventory group id
 * @param {IInventoryGroupItem[]} body.inventoryItemBody inventory item body
 * @returns {Promise<IInventoryGroupDoc>}
 */
export const deleteInventoryGroupItemsById = async (inventoryGroupId, inventoryItemBody, _t) => {
    const inventoryGroup = await getInventoryGroupById(inventoryGroupId);
    if (!inventoryGroup) {
        throw new ApiError(httpStatus.NOT_FOUND, _t('inventory:inventoryGroupNotFound'));
    }
    logger.info(inventoryGroup.items);
    if (lodash.isArray(inventoryItemBody)) {
        inventoryItemBody.forEach(item => {
            try {
                const removedItem = lodash.remove(inventoryGroup.items, { "itemId": new mongoose.Types.ObjectId(item.itemId) });
                logger.info(removedItem);
            }
            catch (error) {
                // Ignore error
                logger.error(error);
            }
        });
        logger.info(inventoryGroup.items);
        await inventoryGroup.save();
    }
    return inventoryGroup;
};
// #endregion
// #region Inventory-Template
/**
 * Create an inventory template
 * @param {IInventoryTemplate} inventoryTemplateBody inventory template body
 * @returns {Promise<IInventoryTemplateDoc>}
 */
export const createInventoryTemplate = async (inventoryTemplateBody) => {
    return InventoryTemplateModel.create(inventoryTemplateBody);
};
/**
* Query for inventory templates
* @param {Object} filter the mongo filter
* @param {Object} options the query options
* @returns {Promise<QueryResult>}
*/
export const queryInventoryTemplates = async (filter, options) => {
    const inventoryTemplates = await InventoryTemplateModel.paginate(filter, options);
    return inventoryTemplates;
};
/**
* Get the inventory template by id
* @param {mongoose.Types.ObjectId} inventoryTemplateId inventory template id
* @returns {Promise<IInventoryTemplateDoc|null>}
*/
export const getInventoryTemplateById = async (inventoryTemplateId) => InventoryTemplateModel.findById(inventoryTemplateId);
/**
* Update the inventory template by id
* @param {ObjectId} inventoryTemplateId inventory template id
* @param {UpdateInventoryTemplateBody} updateInventoryTemplateBody update body
* @returns {Promise<IInventoryTemplateDoc|null>}
*/
export const updateInventoryTemplateById = async (inventoryTemplateId, updateInventoryTemplateBody, _t) => {
    const inventoryTemplate = await InventoryTemplateModel.findByIdAndUpdate(inventoryTemplateId, updateInventoryTemplateBody, { new: true });
    if (!inventoryTemplate) {
        throw new ApiError(httpStatus.NOT_FOUND, _t('inventory:inventoryTemplateNotFound'));
    }
    return inventoryTemplate;
};
/**
* Delete the inventory template by id
* @param {ObjectId} inventoryTemplateId inventory template id
* @returns {Promise<IInventoryTemplateDoc|null>}
*/
export const deleteInventoryTemplateById = async (inventoryTemplateId, _t) => {
    const inventoryTemplate = await getInventoryTemplateById(inventoryTemplateId);
    if (!inventoryTemplate) {
        throw new ApiError(httpStatus.NOT_FOUND, _t('inventory:inventoryTemplateNotFound'));
    }
    await inventoryTemplate.remove();
    return inventoryTemplate;
};
/**
 * Add groups to an existing template
 * @param {ObjectId} query.inventoryTemplateId inventory template id
 * @param {IInventoryTemplateGroup[]} body.inventoryTemplateGroupBody inventory group body
 * @returns {Promise<IInventoryTemplateDoc>}
 */
export const addInventoryTemplateGroupsById = async (inventoryTemplateId, inventoryTemplateGroupBody, _t) => {
    const inventoryTemplate = await getInventoryTemplateById(inventoryTemplateId);
    if (!inventoryTemplate) {
        throw new ApiError(httpStatus.NOT_FOUND, _t('inventory:inventoryTemplateNotFound'));
    }
    if (lodash.isArray(inventoryTemplateGroupBody)) {
        inventoryTemplateGroupBody.forEach(group => {
            logger.info(group);
            try {
                const existingGroup = lodash.find(inventoryTemplate.groups, { "groupId": new mongoose.Types.ObjectId(group.groupId) });
                if (!existingGroup) {
                    inventoryTemplate.groups.push(group);
                }
            }
            catch (error) {
                // Ignore error
                logger.error(error);
            }
        });
        await inventoryTemplate.save();
    }
    return inventoryTemplate;
};
/**
 * Delete groups from an existing template
 * @param {ObjectId} query.inventoryTemplateId inventory template id
 * @param {IInventoryTemplateGroup[]} body.inventoryTemplateGroupBody inventory group body
 * @returns {Promise<IInventoryTemplateDoc>}
 */
export const deleteInventoryTemplateGroupsById = async (inventoryTemplateId, inventoryTemplateGroupBody, _t) => {
    const inventoryTemplate = await getInventoryTemplateById(inventoryTemplateId);
    if (!inventoryTemplate) {
        throw new ApiError(httpStatus.NOT_FOUND, _t('inventory:inventoryTemplateNotFound'));
    }
    if (lodash.isArray(inventoryTemplateGroupBody)) {
        inventoryTemplateGroupBody.forEach(group => {
            try {
                const removedItem = lodash.remove(inventoryTemplate.groups, { "groupId": new mongoose.Types.ObjectId(group.groupId) });
                logger.info(removedItem);
            }
            catch (error) {
                // Ignore error
                logger.error(error);
            }
        });
        await inventoryTemplate.save();
    }
    return inventoryTemplate;
};
/**
 * Add groups to an existing template
 * @param {ObjectId} query.inventoryTemplateId inventory template id
 * @param {ObjectId} query.inventoryTemplateGroupId inventory template group id
 * @param {IInventoryTemplateGroupItem[]} body.inventoryTemplateGroupItemBody inventory group item body
 * @returns {Promise<IInventoryTemplateDoc>}
 */
export const addInventoryTemplateGroupItemsById = async (inventoryTemplateId, inventoryTemplateGroupId, inventoryTemplateGroupItemBody, _t) => {
    const inventoryTemplate = await getInventoryTemplateById(inventoryTemplateId);
    if (!inventoryTemplate) {
        throw new ApiError(httpStatus.NOT_FOUND, _t('inventory:inventoryTemplateNotFound'));
    }
    if (lodash.isArray(inventoryTemplate.groups)) {
        const templateUpdateGroup = lodash.find(inventoryTemplate.groups, { "groupId": new mongoose.Types.ObjectId(inventoryTemplateGroupId) });
        if (!lodash.isEmpty(templateUpdateGroup) && !lodash.isEmpty(inventoryTemplateGroupItemBody)) {
            inventoryTemplateGroupItemBody.forEach(item => {
                try {
                    const existingItem = lodash.find(templateUpdateGroup.items, { "itemId": new mongoose.Types.ObjectId(item.itemId) });
                    if (!existingItem) {
                        templateUpdateGroup.items.push(item);
                    }
                }
                catch (error) {
                    // Ignore error
                    logger.error(error);
                }
            });
            await inventoryTemplate.save();
        }
    }
    return inventoryTemplate;
};
/**
 * remove groups to an existing template
 * @param {ObjectId} query.inventoryTemplateId inventory template id
 * @param {ObjectId} query.inventoryTemplateGroupId inventory template group id
 * @param {IInventoryTemplateGroupItem[]} body.inventoryTemplateGroupItemBody inventory group item body
 * @returns {Promise<IInventoryTemplateDoc>}
 */
export const deleteInventoryTemplateGroupItemsById = async (inventoryTemplateId, inventoryTemplateGroupId, inventoryTemplateGroupItemBody, _t) => {
    const inventoryTemplate = await getInventoryTemplateById(inventoryTemplateId);
    if (!inventoryTemplate) {
        throw new ApiError(httpStatus.NOT_FOUND, _t('inventory:inventoryTemplateNotFound'));
    }
    if (lodash.isArray(inventoryTemplate.groups)) {
        const templateUpdateGroup = lodash.find(inventoryTemplate.groups, { "groupId": new mongoose.Types.ObjectId(inventoryTemplateGroupId) });
        if (!lodash.isEmpty(templateUpdateGroup) && !lodash.isEmpty(inventoryTemplateGroupItemBody)) {
            const templateUpdateGroupItems = [...templateUpdateGroup.items]; // To avoid reference array update. This will create null entry for the deleted objects in the database
            inventoryTemplateGroupItemBody.forEach(item => {
                try {
                    lodash.remove(templateUpdateGroupItems, { "itemId": new mongoose.Types.ObjectId(item.itemId) });
                }
                catch (error) {
                    // Ignore error
                    logger.error(error);
                }
            });
            templateUpdateGroup.items = templateUpdateGroupItems;
            await inventoryTemplate.save();
        }
    }
    return inventoryTemplate;
};
// #endregion
// #region Inventory-Invoice
/**
 * Create an inventory template
 * @param {IInvoice} invoiceBody inventory template body
 * @returns {Promise<IInvoiceDoc>}
 */
export const createInvoice = async (invoiceBody) => {
    const invoiceCode = `INV${new Date().toISOString().substring(0, 10).replace('-', '')}N${Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)}`;
    // let invoiceCode = `${new mongoose.Types.ObjectId().toString()}`
    // invoiceCode = invoiceCode.toUpperCase()
    // invoiceCode = `${invoiceCode.substring(0,5)}-${invoiceCode.substring(6)}`
    const invoiceDate = new Date();
    invoiceBody['invoiceCode'] = invoiceCode;
    invoiceBody['invoiceDate'] = invoiceDate;
    return InvoiceModel.create(invoiceBody);
};
/**
* Query for inventory templates
* @param {Object} filter the mongo filter
* @param {Object} options the query options
* @returns {Promise<QueryResult>}
*/
export const queryInvoices = async (filter, options) => {
    const invoices = await InvoiceModel.paginate(filter, options);
    return invoices;
};
/**
* Get the inventory template by id
* @param {mongoose.Types.ObjectId} invoiceId inventory template id
* @returns {Promise<IInvoiceDoc|null>}
*/
export const getInvoiceById = async (invoiceId) => InvoiceModel.findById(invoiceId);
/**
* Update the inventory template by id
* @param {ObjectId} invoiceId inventory template id
* @param {UpdateInvoiceBody} updateInvoiceBody update body
* @returns {Promise<IInvoiceDoc|null>}
*/
export const updateInvoiceById = async (invoiceId, updateInvoiceBody, _t) => {
    const invoice = await InvoiceModel.findByIdAndUpdate(invoiceId, updateInvoiceBody, { new: true });
    if (!invoice) {
        throw new ApiError(httpStatus.NOT_FOUND, _t('inventory:invoiceNotFound'));
    }
    return invoice;
};
/**
* Delete the inventory template by id
* @param {ObjectId} invoiceId inventory template id
* @returns {Promise<ILanguageDoc|null>}
*/
export const deleteInvoiceById = async (invoiceId, _t) => {
    const invoice = await getInvoiceById(invoiceId);
    if (!invoice) {
        throw new ApiError(httpStatus.NOT_FOUND, _t('inventory:invoiceNotFound'));
    }
    await invoice.remove();
    return invoice;
};
// #endregion
//# sourceMappingURL=inventory.service.js.map