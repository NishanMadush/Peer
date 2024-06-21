import Joi from "joi";
import { objectId } from "../validate";
// #region Item
export const inventoryItem = {
    itemCode: Joi.string().required(),
    itemName: Joi.string().required(),
    description: Joi.string(),
    unit: Joi.string().required(),
    unitPrice: Joi.number(),
    dateOfExpiry: Joi.date(),
    storeContent: Joi.number().integer(),
};
export const createInventoryItem = {
    body: Joi.object().keys(inventoryItem),
};
export const getInventoryItems = {
    body: Joi.object().keys({
        code: Joi.string(),
        name: Joi.string(),
        sortBy: Joi.string(),
        projectBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};
export const getInventoryItem = {
    params: Joi.object().keys({
        inventoryItemId: Joi.string().custom(objectId),
    }),
};
export const updateInventoryItem = {
    params: Joi.object().keys({
        inventoryItemId: Joi.required().custom(objectId),
    }),
    body: Joi.object().keys(inventoryItem).min(1),
};
export const deleteInventoryItem = {
    params: Joi.object().keys({
        inventoryItemId: Joi.string().custom(objectId),
    }),
};
// #endregion
// #region Group
const inventoryGroupItem = {
    itemId: Joi.string().custom(objectId).required(),
    itemCode: Joi.string().optional(),
    itemName: Joi.string().optional(),
};
export const inventoryGroup = {
    groupCode: Joi.string().required(),
    groupName: Joi.string().required(),
    description: Joi.string(),
    parentGroup: Joi.string().custom(objectId),
    items: Joi.array().items(Joi.object().keys(inventoryGroupItem))
};
export const createInventoryGroup = {
    body: Joi.object().keys(inventoryGroup),
};
export const getInventoryGroups = {
    body: Joi.object().keys({
        code: Joi.string(),
        name: Joi.string(),
        sortBy: Joi.string(),
        projectBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};
export const getInventoryGroup = {
    params: Joi.object().keys({
        inventoryGroupId: Joi.string().custom(objectId),
    }),
};
export const updateInventoryGroup = {
    params: Joi.object().keys({
        inventoryGroupId: Joi.required().custom(objectId),
    }),
    body: Joi.object().keys(inventoryGroup).min(1),
};
export const deleteInventoryGroup = {
    params: Joi.object().keys({
        inventoryGroupId: Joi.string().custom(objectId),
    }),
};
// Manipulate group item/s
export const addInventoryGroupItems = {
    params: Joi.object().keys({
        inventoryGroupId: Joi.string().custom(objectId),
    }),
    body: Joi.array().items(Joi.object().keys(inventoryGroupItem)),
};
export const deleteInventoryGroupItems = {
    params: Joi.object().keys({
        inventoryGroupId: Joi.string().custom(objectId),
    }),
    body: Joi.array().items(Joi.object().keys(inventoryGroupItem)),
};
// #endregion
// #region Template
export const inventoryTemplate = {
    templateCode: Joi.string().required(),
    templateName: Joi.string().required(),
    description: Joi.string(),
    groups: Joi.array().items(Joi.object().keys(inventoryGroup)),
};
export const createInventoryTemplate = {
    body: Joi.object().keys(inventoryTemplate),
};
export const getInventoryTemplates = {
    body: Joi.object().keys({
        code: Joi.string(),
        name: Joi.string(),
        sortBy: Joi.string(),
        projectBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};
export const getInventoryTemplate = {
    params: Joi.object().keys({
        inventoryTemplateId: Joi.string().custom(objectId),
    }),
};
export const updateInventoryTemplate = {
    params: Joi.object().keys({
        inventoryTemplateId: Joi.required().custom(objectId),
    }),
    body: Joi.object().keys(inventoryTemplate).min(1),
};
export const deleteInventoryTemplate = {
    params: Joi.object().keys({
        inventoryTemplateId: Joi.string().custom(objectId),
    }),
};
// Manipulate template group/s and item/s
export const addInventoryTemplateGroups = {
    params: Joi.object().keys({
        inventoryTemplateId: Joi.string().custom(objectId),
    }),
    body: Joi.array().items({
        groupId: Joi.string().required(),
        groupCode: Joi.string().required(),
        groupName: Joi.string().required(),
        description: Joi.string(),
        parentGroup: Joi.string().custom(objectId),
        items: Joi.array().items(Joi.object().keys(inventoryGroupItem))
    }),
};
export const deleteInventoryTemplateGroups = {
    params: Joi.object().keys({
        inventoryTemplateId: Joi.string().custom(objectId),
    }),
    body: Joi.array().items({
        groupId: Joi.string().required()
    }),
};
export const addInventoryTemplateGroupItems = {
    params: Joi.object().keys({
        inventoryTemplateId: Joi.string().custom(objectId),
        inventoryGroupId: Joi.string().custom(objectId),
    }),
    body: Joi.array().items(Joi.object().keys(inventoryGroupItem)),
};
export const deleteInventoryTemplateGroupItems = {
    params: Joi.object().keys({
        inventoryTemplateId: Joi.string().custom(objectId),
        inventoryGroupId: Joi.string().custom(objectId),
    }),
    body: Joi.array().items(Joi.object().keys(inventoryGroupItem)),
};
// #endregion
// #region Invoice
export const invoice = {
    grandItemCount: Joi.number().required(),
    grandTotal: Joi.number().required(),
    groups: Joi.array().items(Joi.object().keys({
        groupId: Joi.string().custom(objectId),
        groupCode: Joi.string(),
        groupName: Joi.string(),
        items: Joi.array().items(Joi.object().keys({
            itemId: Joi.string().custom(objectId),
            itemCode: Joi.string().required(),
            itemName: Joi.string().required(),
            unit: Joi.string().required(),
            unitPrice: Joi.number().required(),
            quantity: Joi.number().required(),
            total: Joi.number().required(),
        })),
        itemCount: Joi.number(),
        groupTotal: Joi.number().required(),
    }))
};
export const createInvoice = {
    body: Joi.object().keys(invoice),
};
export const getInvoices = {
    body: Joi.object().keys({
        code: Joi.string(),
        name: Joi.string(),
        sortBy: Joi.string(),
        projectBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};
export const getInvoice = {
    params: Joi.object().keys({
        invoiceId: Joi.string().custom(objectId),
    }),
};
export const updateInvoice = {
    params: Joi.object().keys({
        invoiceId: Joi.required().custom(objectId),
    }),
    body: Joi.object().keys(invoice).min(1),
};
export const deleteInvoice = {
    params: Joi.object().keys({
        invoiceId: Joi.string().custom(objectId),
    }),
};
// #endregion
//# sourceMappingURL=inventory.validation.js.map