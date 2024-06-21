import httpStatus from 'http-status';
import mongoose from 'mongoose';
import ApiError from '../../services/errors/ApiError';
import { catchAsync, pick } from '../../utils';
import * as inventoryService from './inventory.service';
// #region Inventory-Item
export const createInventoryItem = catchAsync(async (req, res) => {
    const inventoryItem = await inventoryService.createInventoryItem(req.body);
    res.status(httpStatus.CREATED).send(inventoryItem);
});
export const getInventoryItems = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['code', 'name']);
    const options = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
    const result = await inventoryService.queryInventoryItems(filter, options);
    res.send(result);
});
export const getInventoryItem = catchAsync(async (req, res) => {
    if (typeof req.params['inventoryItemId'] === 'string') {
        const inventoryItem = await inventoryService.getInventoryItemById(new mongoose.Types.ObjectId(req.params['inventoryItemId']));
        if (!inventoryItem) {
            throw new ApiError(httpStatus.NOT_FOUND, req.t('inventory:inventoryItemNotFound'));
        }
        res.send(inventoryItem);
    }
});
export const updateInventoryItem = catchAsync(async (req, res) => {
    if (typeof req.params['inventoryItemId'] === 'string') {
        const inventoryItem = await inventoryService.updateInventoryItemById(new mongoose.Types.ObjectId(req.params['inventoryItemId']), req.body, req.t);
        res.send(inventoryItem);
    }
});
export const deleteInventoryItem = catchAsync(async (req, res) => {
    if (typeof req.params['inventoryItemId'] === 'string') {
        await inventoryService.deleteInventoryItemById(new mongoose.Types.ObjectId(req.params['inventoryItemId']), req.t);
        res.status(httpStatus.NO_CONTENT).send();
    }
});
// #endregion
// #region Inventory-Group
export const createInventoryGroup = catchAsync(async (req, res) => {
    const inventoryGroup = await inventoryService.createInventoryGroup(req.body);
    res.status(httpStatus.CREATED).send(inventoryGroup);
});
export const getInventoryGroups = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['code', 'name']);
    const options = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
    const result = await inventoryService.queryInventoryGroups(filter, options);
    res.send(result);
});
export const getInventoryGroup = catchAsync(async (req, res) => {
    if (typeof req.params['inventoryGroupId'] === 'string') {
        const inventoryGroup = await inventoryService.getInventoryGroupById(new mongoose.Types.ObjectId(req.params['inventoryGroupId']));
        if (!inventoryGroup) {
            throw new ApiError(httpStatus.NOT_FOUND, req.t('inventory:inventoryGroupNotFound'));
        }
        res.send(inventoryGroup);
    }
});
export const updateInventoryGroup = catchAsync(async (req, res) => {
    if (typeof req.params['inventoryGroupId'] === 'string') {
        const inventoryGroup = await inventoryService.updateInventoryGroupById(new mongoose.Types.ObjectId(req.params['inventoryGroupId']), req.body, req.t);
        res.send(inventoryGroup);
    }
});
export const deleteInventoryGroup = catchAsync(async (req, res) => {
    if (typeof req.params['inventoryGroupId'] === 'string') {
        await inventoryService.deleteInventoryGroupById(new mongoose.Types.ObjectId(req.params['inventoryGroupId']), req.t);
        res.status(httpStatus.NO_CONTENT).send();
    }
});
export const addInventoryGroupItems = catchAsync(async (req, res) => {
    if (typeof req.params['inventoryGroupId'] === 'string') {
        const inventoryGroup = await inventoryService.addInventoryGroupItemsById(new mongoose.Types.ObjectId(req.params['inventoryGroupId']), req.body, req.t);
        res.send(inventoryGroup);
    }
});
export const deleteInventoryGroupItems = catchAsync(async (req, res) => {
    if (typeof req.params['inventoryGroupId'] === 'string') {
        const inventoryGroup = await inventoryService.deleteInventoryGroupItemsById(new mongoose.Types.ObjectId(req.params['inventoryGroupId']), req.body, req.t);
        res.send(inventoryGroup);
    }
});
// #endregion
// #region Inventory-Template
export const createInventoryTemplate = catchAsync(async (req, res) => {
    const inventoryTemplate = await inventoryService.createInventoryTemplate(req.body);
    res.status(httpStatus.CREATED).send(inventoryTemplate);
});
export const getInventoryTemplates = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['code', 'name']);
    const options = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
    const result = await inventoryService.queryInventoryTemplates(filter, options);
    res.send(result);
});
export const getInventoryTemplate = catchAsync(async (req, res) => {
    if (typeof req.params['inventoryTemplateId'] === 'string') {
        const inventoryTemplate = await inventoryService.getInventoryTemplateById(new mongoose.Types.ObjectId(req.params['inventoryTemplateId']));
        if (!inventoryTemplate) {
            throw new ApiError(httpStatus.NOT_FOUND, req.t('inventory:inventoryTemplateNotFound'));
        }
        res.send(inventoryTemplate);
    }
});
export const updateInventoryTemplate = catchAsync(async (req, res) => {
    if (typeof req.params['inventoryTemplateId'] === 'string') {
        const inventoryTemplate = await inventoryService.updateInventoryTemplateById(new mongoose.Types.ObjectId(req.params['inventoryTemplateId']), req.body, req.t);
        res.send(inventoryTemplate);
    }
});
export const deleteInventoryTemplate = catchAsync(async (req, res) => {
    if (typeof req.params['inventoryTemplateId'] === 'string') {
        await inventoryService.deleteInventoryTemplateById(new mongoose.Types.ObjectId(req.params['inventoryTemplateId']), req.t);
        res.status(httpStatus.NO_CONTENT).send();
    }
});
// -------
export const addInventoryTemplateGroups = catchAsync(async (req, res) => {
    if (typeof req.params['inventoryTemplateId'] === 'string') {
        const inventoryGroup = await inventoryService.addInventoryTemplateGroupsById(new mongoose.Types.ObjectId(req.params['inventoryTemplateId']), req.body, req.t);
        res.send(inventoryGroup);
    }
});
export const deleteInventoryTemplateGroups = catchAsync(async (req, res) => {
    if (typeof req.params['inventoryTemplateId'] === 'string') {
        const inventoryGroup = await inventoryService.deleteInventoryTemplateGroupsById(new mongoose.Types.ObjectId(req.params['inventoryTemplateId']), req.body, req.t);
        res.send(inventoryGroup);
    }
});
export const addInventoryTemplateGroupItems = catchAsync(async (req, res) => {
    if (typeof req.params['inventoryTemplateId'] === 'string' && typeof req.params['inventoryGroupId'] === 'string') {
        const inventoryGroup = await inventoryService.addInventoryTemplateGroupItemsById(new mongoose.Types.ObjectId(req.params['inventoryTemplateId']), new mongoose.Types.ObjectId(req.params['inventoryGroupId']), req.body, req.t);
        res.send(inventoryGroup);
    }
});
export const deleteInventoryTemplateGroupItems = catchAsync(async (req, res) => {
    if (typeof req.params['inventoryTemplateId'] === 'string' && typeof req.params['inventoryGroupId'] === 'string') {
        const inventoryGroup = await inventoryService.deleteInventoryTemplateGroupItemsById(new mongoose.Types.ObjectId(req.params['inventoryTemplateId']), new mongoose.Types.ObjectId(req.params['inventoryGroupId']), req.body, req.t);
        res.send(inventoryGroup);
    }
});
// #endregion
// #region Inventory-Invoice
export const createInvoice = catchAsync(async (req, res) => {
    const invoice = await inventoryService.createInvoice(req.body);
    res.status(httpStatus.CREATED).send(invoice);
});
export const getInvoices = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['code', 'name']);
    const options = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
    const result = await inventoryService.queryInvoices(filter, options);
    res.send(result);
});
export const getInvoice = catchAsync(async (req, res) => {
    if (typeof req.params['invoiceId'] === 'string') {
        const invoice = await inventoryService.getInvoiceById(new mongoose.Types.ObjectId(req.params['invoiceId']));
        if (!invoice) {
            throw new ApiError(httpStatus.NOT_FOUND, req.t('inventory:invoiceNotFound'));
        }
        res.send(invoice);
    }
});
export const updateInvoice = catchAsync(async (req, res) => {
    if (typeof req.params['invoiceId'] === 'string') {
        const invoice = await inventoryService.updateInvoiceById(new mongoose.Types.ObjectId(req.params['invoiceId']), req.body, req.t);
        res.send(invoice);
    }
});
export const deleteInvoice = catchAsync(async (req, res) => {
    if (typeof req.params['invoiceId'] === 'string') {
        await inventoryService.deleteInvoiceById(new mongoose.Types.ObjectId(req.params['invoiceId']), req.t);
        res.status(httpStatus.NO_CONTENT).send();
    }
});
// #endregion
//# sourceMappingURL=inventory.controller.js.map