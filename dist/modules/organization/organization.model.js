import mongoose from 'mongoose';
import { paginate } from '../../services/paginate';
import { toJSON } from '../../services/toJSON';
import { AddressTypeEnum } from '../../shared/interfaces/address';
import { GeographicAreaEnum, OrganizationStatusEnum, OrganizationTypeEnum, } from '../../shared/interfaces/organization';
export const ORGANIZATION_SCHEMA = 'Organization';
const organizationBranchSchema = new mongoose.Schema({
    branchName: {
        type: String,
        required: true,
        trim: true,
    },
    isHeadOffice: { type: Boolean },
    isVirtual: { type: Boolean },
    contactPerson: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
    },
    phoneNumber: {
        type: String,
        trim: true,
    },
    address: {
        type: {
            category: {
                type: String,
                enum: AddressTypeEnum,
                trim: true,
            },
            line1: {
                type: String,
                trim: true,
            },
            street: {
                type: String,
                trim: true,
            },
            city: {
                type: String,
                trim: true,
            },
            postalCode: {
                type: String,
                trim: true,
            },
            countryId: { type: mongoose.Schema.Types.ObjectId },
            location: {
                lat: {
                    type: Number,
                    default: -1,
                },
                lng: {
                    type: Number,
                    default: -1,
                },
            },
        },
        _id: false,
    },
    website: {
        type: String,
        trim: true,
    },
    employees: [
        {
            type: mongoose.Schema.Types.ObjectId,
            _id: false,
        },
    ],
});
const organizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    category: {
        type: String,
        trim: true,
    },
    countryId: { type: mongoose.Schema.Types.ObjectId },
    registeredNo: {
        type: String,
        trim: true,
    },
    isLegalEntity: { type: Boolean },
    vision: {
        type: String,
        trim: true,
    },
    mission: {
        type: String,
        trim: true,
    },
    organizationType: {
        type: String,
        enum: OrganizationTypeEnum,
        trim: true,
    },
    geographicArea: {
        type: String,
        enum: GeographicAreaEnum,
        trim: true,
    },
    status: {
        type: String,
        enum: OrganizationStatusEnum,
        trim: true,
    },
    departments: [
        {
            type: String,
            trim: true,
        },
    ],
    designations: [
        {
            type: String,
            trim: true,
        },
    ],
    headOffice: organizationBranchSchema,
    branches: [organizationBranchSchema],
    createdBy: {
        userId: { type: mongoose.Schema.Types.ObjectId },
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
        userId: { type: mongoose.Schema.Types.ObjectId },
        userName: {
            type: String,
            trim: true,
        },
        performedAt: {
            type: String,
            trim: true,
        }, // browser date string
    },
}, {
    timestamps: true,
});
// add plugin that converts mongoose to json
organizationSchema.plugin(toJSON);
organizationSchema.plugin(paginate);
const Organization = mongoose.model(ORGANIZATION_SCHEMA, organizationSchema);
export default Organization;
//# sourceMappingURL=organization.model.js.map