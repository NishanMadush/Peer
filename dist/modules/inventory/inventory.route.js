import { Router } from "express";
import { validate } from "../validate";
import * as inventoryController from "./inventory.controller";
import * as inventoryValidation from "./inventory.validation";
const router = Router();
// #region Inventory-Item
router
    .route('/items')
    /**
     *
     */
    .post(validate(inventoryValidation.createInventoryItem), inventoryController.createInventoryItem)
    /**
     *
     */
    .get(validate(inventoryValidation.getInventoryItems), inventoryController.getInventoryItems);
router
    .route('/items/:inventoryItemId')
    /**
     *
     */
    .get(validate(inventoryValidation.getInventoryItem), inventoryController.getInventoryItem)
    /**
     *
     */
    .patch(validate(inventoryValidation.updateInventoryItem), inventoryController.updateInventoryItem)
    /**
     *
     */
    .delete(validate(inventoryValidation.deleteInventoryItem), inventoryController.deleteInventoryItem);
// #endregion
// #region Inventory-Group
router
    .route('/groups')
    /**
     *
     */
    .post(validate(inventoryValidation.createInventoryGroup), inventoryController.createInventoryGroup)
    /**
     *
     */
    .get(validate(inventoryValidation.getInventoryGroups), inventoryController.getInventoryGroups);
router
    .route('/groups/:inventoryGroupId')
    /**
     *
     */
    .get(validate(inventoryValidation.getInventoryGroup), inventoryController.getInventoryGroup)
    /**
     *
     */
    .patch(validate(inventoryValidation.updateInventoryGroup), inventoryController.updateInventoryGroup)
    /**
     *
     */
    .delete(validate(inventoryValidation.deleteInventoryGroup), inventoryController.deleteInventoryGroup);
/**
 *
 */
router
    .route('/groups/:inventoryGroupId/items')
    .post(validate(inventoryValidation.addInventoryGroupItems), inventoryController.addInventoryGroupItems);
router
    .route('/groups/:inventoryGroupId/items')
    .delete(validate(inventoryValidation.deleteInventoryGroupItems), inventoryController.deleteInventoryGroupItems);
// #endregion
// #region Inventory-Template
router
    .route('/templates')
    /**
     *
     */
    .post(validate(inventoryValidation.createInventoryTemplate), inventoryController.createInventoryTemplate)
    /**
     *
     */
    .get(validate(inventoryValidation.getInventoryTemplates), inventoryController.getInventoryTemplates);
router
    .route('/templates/:inventoryTemplateId')
    /**
     *
     */
    .get(validate(inventoryValidation.getInventoryTemplate), inventoryController.getInventoryTemplate)
    /**
     *
     */
    .patch(validate(inventoryValidation.updateInventoryTemplate), inventoryController.updateInventoryTemplate)
    /**
     *
     */
    .delete(validate(inventoryValidation.deleteInventoryTemplate), inventoryController.deleteInventoryTemplate);
/**
 *
 */
router
    .route('/templates/:inventoryTemplateId/groups')
    .post(validate(inventoryValidation.addInventoryTemplateGroups), inventoryController.addInventoryTemplateGroups);
router
    .route('/templates/:inventoryTemplateId/groups')
    .delete(validate(inventoryValidation.deleteInventoryTemplateGroups), inventoryController.deleteInventoryTemplateGroups);
router
    .route('/templates/:inventoryTemplateId/groups/:inventoryGroupId/items')
    .post(validate(inventoryValidation.addInventoryTemplateGroupItems), inventoryController.addInventoryTemplateGroupItems);
router
    .route('/templates/:inventoryTemplateId/groups/:inventoryGroupId/items')
    .delete(validate(inventoryValidation.deleteInventoryTemplateGroupItems), inventoryController.deleteInventoryTemplateGroupItems);
// #endregion
// #region Inventory-Invoice
router
    .route('/invoices')
    /**
     *
     */
    .post(validate(inventoryValidation.createInvoice), inventoryController.createInvoice)
    /**
     *
     */
    .get(validate(inventoryValidation.getInvoices), inventoryController.getInvoices);
router
    .route('/invoices/:invoiceId')
    /**
     *
     */
    .get(validate(inventoryValidation.getInvoice), inventoryController.getInvoice)
    /**
     *
     */
    .patch(validate(inventoryValidation.updateInvoice), inventoryController.updateInvoice)
    /**
     *
     */
    .delete(validate(inventoryValidation.deleteInvoice), inventoryController.deleteInvoice);
// #endregion
export default router;
//# sourceMappingURL=inventory.route.js.map