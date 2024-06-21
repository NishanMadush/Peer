import mongoose from 'mongoose';
import { paginate } from '../../services/paginate';
import { toJSON } from '../../services/toJSON';
// #region Inventory-Item
const inventoryItemSchema = new mongoose.Schema({
    itemCode: { type: String, trim: true, required: true, unique: true },
    itemName: { type: String, trim: true, required: true },
    description: { type: String, trim: true },
    unit: { type: String, trim: true, required: true },
    unitPrice: { type: Number, required: true, default: 0 },
    dateOfExpiry: { type: Date },
    storeContent: { type: Number, required: true, default: 0 },
    createdBy: {
        userId: { type: mongoose.Types.ObjectId },
        userName: {
            type: String,
            trim: true,
        },
        performedAt: {
            type: String,
            trim: true,
        }, // browser date string
    },
    lastModifiedBy: {
        userId: { type: mongoose.Types.ObjectId },
        userName: {
            type: String,
            trim: true,
        },
        performedAt: {
            type: String,
            trim: true,
        }, // browser date string
    },
}, { timestamps: true });
// add plugin that converts mongoose to json
inventoryItemSchema.plugin(toJSON);
inventoryItemSchema.plugin(paginate);
const InventoryItem = mongoose.model('InventoryItem', inventoryItemSchema);
// #endregion
// #region Inventory-Group
const inventoryGroupSchema = new mongoose.Schema({
    groupCode: { type: String, trim: true, required: true, unique: true },
    groupName: { type: String, trim: true, required: true },
    description: { type: String, trim: true },
    parentGroup: { type: mongoose.Schema.Types.ObjectId, required: false },
    items: {
        type: [{
                itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
                itemCode: { type: String, trim: true, required: false },
                itemName: { type: String, trim: true, required: false },
            }],
        _id: false,
    },
    createdBy: {
        userId: { type: mongoose.Types.ObjectId },
        userName: {
            type: String,
            trim: true,
        },
        performedAt: {
            type: String,
            trim: true,
        }, // browser date string
    },
    lastModifiedBy: {
        userId: { type: mongoose.Types.ObjectId },
        userName: {
            type: String,
            trim: true,
        },
        performedAt: {
            type: String,
            trim: true,
        }, // browser date string
    },
}, { timestamps: true });
// add plugin that converts mongoose to json
inventoryGroupSchema.plugin(toJSON);
inventoryGroupSchema.plugin(paginate);
const InventoryGroup = mongoose.model('InventoryGroup', inventoryGroupSchema);
// #endregion
// #region Inventory-Template
const inventoryTemplateSchema = new mongoose.Schema({
    templateCode: { type: String, trim: true, required: true, unique: true },
    templateName: { type: String, trim: true, required: true },
    description: { type: String, trim: true },
    groups: {
        type: [
            {
                groupId: { type: mongoose.Schema.Types.ObjectId, required: true },
                groupCode: { type: String, trim: true },
                groupName: { type: String, trim: true },
                description: { type: String, trim: true },
                parentGroup: { type: String, trim: true },
                items: {
                    type: [
                        {
                            itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
                            itemCode: { type: String, trim: true, required: false },
                            itemName: { type: String, trim: true, required: false },
                        }
                    ],
                    _id: false,
                },
            },
        ], _id: false,
    },
    createdBy: {
        userId: { type: mongoose.Types.ObjectId },
        userName: {
            type: String,
            trim: true,
        },
        performedAt: {
            type: String,
            trim: true,
        }, // browser date string
    },
    lastModifiedBy: {
        userId: { type: mongoose.Types.ObjectId },
        userName: {
            type: String,
            trim: true,
        },
        performedAt: {
            type: String,
            trim: true,
        }, // browser date string
    },
}, { timestamps: true });
// add plugin that converts mongoose to json
inventoryTemplateSchema.plugin(toJSON);
inventoryTemplateSchema.plugin(paginate);
const InventoryTemplate = mongoose.model('InventoryTemplate', inventoryTemplateSchema);
// #endregion
// #region Inventory-Invoice
const invoiceSchema = new mongoose.Schema({
    invoiceCode: { type: String, trim: true, unique: true },
    invoiceDate: { type: Date },
    grandItemCount: { type: Number },
    grandTotal: { type: Number },
    groups: {
        type: [
            {
                groupId: { type: mongoose.Schema.Types.ObjectId, required: true },
                groupCode: { type: String, trim: true },
                groupName: { type: String, trim: true },
                items: {
                    type: [
                        {
                            itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
                            itemCode: { type: String, trim: true },
                            itemName: { type: String, trim: true },
                            unit: { type: String, trim: true },
                            unitPrice: { type: Number },
                            quantity: { type: Number },
                            total: { type: Number },
                        },
                    ],
                    _id: false
                },
                itemCount: { type: Number },
                groupTotal: { type: Number },
            }
        ],
        _id: false
    },
    createdBy: {
        userId: { type: mongoose.Types.ObjectId },
        userName: {
            type: String,
            trim: true,
        },
        performedAt: {
            type: String,
            trim: true,
        }, // browser date string
    },
    lastModifiedBy: {
        userId: { type: mongoose.Types.ObjectId },
        userName: {
            type: String,
            trim: true,
        },
        performedAt: {
            type: String,
            trim: true,
        }, // browser date string
    },
}, { timestamps: true });
// add plugin that converts mongoose to json
invoiceSchema.plugin(toJSON);
invoiceSchema.plugin(paginate);
const Invoice = mongoose.model('Invoice', invoiceSchema);
// #endregion
export { InventoryItem, InventoryGroup, InventoryTemplate, Invoice };
//# sourceMappingURL=inventory.model.js.map