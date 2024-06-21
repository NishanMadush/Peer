import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import validator from 'validator';
// import { roles } from '../../config/roles'
import paginate from '../../services/paginate/paginate';
import toJSON from '../../services/toJSON/toJSON';
import { AddressTypeEnum } from '../../shared/interfaces/address';
import { GenderEnum, PermissionTypeEnum, UserStatusEnum } from '../../shared/interfaces/user';
import { ORGANIZATION_SCHEMA } from '../organization/organization.model';
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: false,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email');
            }
        },
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        validate(value) {
            if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
                throw new Error('Password must contain at least one letter and one number');
            }
        },
        private: true, // used by the toJSON plugin
    },
    role: {
        type: String,
        // enum: roles,
        default: 'user',
        trim: true,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    languageId: {
        type: mongoose.Types.ObjectId,
        required: true,
        default: '63c01a2d9c15dabf9f9c1dc4',
    },
    phoneNumber: {
        type: String,
        trim: true,
        default: null,
        required: false,
    },
    status: {
        type: String,
        required: true,
        enum: UserStatusEnum,
        default: UserStatusEnum.Pending,
        trim: true,
    },
    profile: {
        type: {
            gender: {
                type: String,
                enum: GenderEnum,
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
                    countryId: { type: mongoose.Types.ObjectId },
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
            profilePicture: {
                type: String,
                trim: true,
            },
            salutation: {
                type: String,
                trim: true,
            },
        },
        _id: false,
        required: false,
    },
    employment: {
        type: {
            organization: {
                organizationId: {
                    type: mongoose.Types.ObjectId,
                    ref: ORGANIZATION_SCHEMA
                },
                organizationName: {
                    type: String,
                    trim: true,
                },
            },
            // organization: {
            //   type: mongoose.Types.ObjectId,
            //   ref: ORGANIZATION_SCHEMA
            // },
            department: {
                type: String,
                trim: true,
            },
            designation: {
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
            branch: {
                branchId: { type: mongoose.Types.ObjectId },
                branchName: {
                    type: String,
                    trim: true,
                }
            },
        },
        _id: false,
        required: false,
    },
    countryProfileSettings: {
        countryName: {
            type: String,
            trim: true,
        },
        nodalAgency: {
            agency: {
                type: String,
                trim: true,
            },
            agencyFocalPoint: {
                type: String,
                trim: true,
            },
        },
        leadInstitutions: {
            cadre: {
                type: String,
                trim: true,
            },
            cadreFocalPoint: {
                type: String,
                trim: true,
            },
            mfr: {
                type: String,
                trim: true,
            },
            mfrFocalPoint: {
                type: String,
                trim: true,
            },
            cssr: {
                type: String,
                trim: true,
            },
            cssrFocalPoint: {
                type: String,
                trim: true,
            },
            hope: {
                type: String,
                trim: true,
            },
            hopeFocalPoint: {
                type: String,
                trim: true,
            },
        },
        programYears: {
            type: String,
            trim: true,
        },
        geographicCoverage: {
            type: String,
            trim: true,
        },
        trainedResponders: {
            cadre: { type: Number },
            mfr: { type: Number },
            cssr: { type: Number },
            hope: { type: Number },
        },
        trainedInstructors: {
            cadreQualified: { type: Number },
            mfrQualified: { type: Number },
            cssrQualified: { type: Number },
            hopeQualified: { type: Number },
        }
    },
    previousAccessed: { type: Date },
    lastAccessed: { type: Date },
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
}, {
    timestamps: true,
});
// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);
/**
 * Check if username is taken
 * @param {string} username - The user's username
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.static('isUsernameTaken', async function (username, excludeUserId) {
    const user = await this.findOne({ username, _id: { $ne: excludeUserId } });
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    return !!user;
});
/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.static('isEmailTaken', async function (email, excludeUserId) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    return !!(user);
});
/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.method('isPasswordMatch', async function (password) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const user = this;
    return bcrypt.compare(password, user.password);
});
userSchema.pre('save', async function (next) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});
const User = mongoose.model('User', userSchema);
// #region roles-permissions
const rolePermissionSchema = new mongoose.Schema({
    role: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    // permissions: [
    //   {
    //     type: String,
    //     _id: false,
    //   },
    // ],
    // roleCode: {
    //   type: String,
    //   trim: true,
    //   required: true,
    //   unique: true
    // },
    // roleName: {
    //   type: String,
    //   trim: true,
    //   required: true
    // },
    // roleDescription: {
    //   type: String,
    //   trim: true
    // },
    permissions: {
        type: [
            {
                permission: {
                    type: String,
                    trim: true,
                    required: true,
                },
                type: {
                    type: String,
                    enum: PermissionTypeEnum,
                    trim: true,
                    required: true
                },
                // permissionCode: {
                //   type: String,
                //   trim: true,
                //   required: true,
                //   unique: true
                // },
                // permissionName: {
                //   type: String,
                //   trim: true,
                //   required: true
                // },
                // permissionDescription: {
                //   type: String,
                //   trim: true
                // },
            }
        ],
        _id: false,
    },
}, { timestamps: true });
// add plugin that converts mongoose to json
rolePermissionSchema.plugin(toJSON);
rolePermissionSchema.plugin(paginate);
/**
 * Check if role is taken
 * @param {string} role - The user's role
 * @param {ObjectId} [excludeRoleId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
rolePermissionSchema.static('isRoleTaken', async function (role, excludeRoleId) {
    const userRole = await this.findOne({ role, _id: { $ne: excludeRoleId } });
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    return !!userRole;
});
const RolePermission = mongoose.model('RolePermission', rolePermissionSchema);
// #endregion
export { User, RolePermission };
//# sourceMappingURL=user.model.js.map