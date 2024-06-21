import Joi from 'joi';
import { AddressTypeEnum } from '../../shared/interfaces/address';
import { GenderEnum, UserStatusEnum } from '../../shared/interfaces/user';
import { objectId, password, username } from '../validate/custom.validation';
const createUserBody = {
    username: Joi.string().required().custom(username),
    email: Joi.string().required().email(),
    password: Joi.string().optional().custom(password),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    role: Joi.string().required(),
    status: Joi.string()
        .required()
        .valid(...Object.values(UserStatusEnum)),
    languageId: Joi.string().required(),
    phoneNumber: Joi.string().optional().allow(null, ''),
    employment: {
        organization: {
            organizationId: Joi.string(),
            organizationName: Joi.string().optional(),
        },
        department: Joi.string().optional(),
        designation: Joi.string().optional(),
        email: Joi.string().email().optional(),
        phoneNumber: Joi.string().optional(),
        branch: {
            branchId: Joi.string(),
            branchName: Joi.string().optional(),
        },
    },
    countryProfileSettings: {
        countryName: Joi.string().optional(),
        nodalAgency: {
            agency: Joi.string().optional(),
            agencyFocalPoint: Joi.string().optional(),
        },
        leadInstitutions: {
            cadre: Joi.string().optional(),
            cadreFocalPoint: Joi.string().optional(),
            mfr: Joi.string().optional(),
            mfrFocalPoint: Joi.string().optional(),
            cssr: Joi.string().optional(),
            cssrFocalPoint: Joi.string().optional(),
            hope: Joi.string().optional(),
            hopeFocalPoint: Joi.string().optional(),
        },
        programYears: Joi.string().optional(),
        geographicCoverage: Joi.string().optional(),
        trainedResponders: {
            cadre: Joi.number().optional(),
            mfr: Joi.number().optional(),
            cssr: Joi.number().optional(),
            hope: Joi.number().optional(),
        },
        trainedInstructors: {
            cadreQualified: Joi.number().optional(),
            mfrQualified: Joi.number().optional(),
            cssrQualified: Joi.number().optional(),
            hopeQualified: Joi.number().optional(),
        },
    },
};
export const createUser = {
    body: Joi.object().keys(createUserBody).options({ allowUnknown: true }),
};
export const getUsers = {
// query: Joi.object().keys({
//   name: Joi.string(),
//   role: Joi.string(),
//   sortBy: Joi.string(),
//   projectBy: Joi.string(),
//   limit: Joi.number().integer(),
//   page: Joi.number().integer(),
// }),
};
export const getUser = {
    params: Joi.object().keys({
        userId: Joi.string().custom(objectId),
    }),
};
export const addressBody = {
    category: Joi.string().valid(...Object.values(AddressTypeEnum)),
    line1: Joi.string().allow(null, ''),
    street: Joi.string().allow(null, ''),
    city: Joi.string(),
    postalCode: Joi.string(),
    countryId: Joi.string(),
    location: {
        lat: Joi.number(),
        lng: Joi.number(),
    },
};
export const updateUser = {
    params: Joi.object().keys({
        userId: Joi.required().custom(objectId),
    }),
    body: Joi.object()
        .keys({
        // username: string
        email: Joi.string().email(),
        password: Joi.string().custom(password),
        firstName: Joi.string(),
        lastName: Joi.string(),
        role: Joi.string(),
        isEmailVerified: Joi.boolean(),
        phoneNumber: Joi.string().optional().allow(null, ''),
        status: Joi.string().valid(...Object.values(UserStatusEnum)),
        languageId: Joi.string(),
        profile: {
            gender: Joi.string().valid(...Object.values(GenderEnum)),
            address: Joi.object().keys(addressBody),
            profilePicture: Joi.string().optional().allow(null, ''),
            salutation: Joi.string(),
        },
        employment: {
            organization: {
                organizationId: Joi.string(),
                organizationName: Joi.string(),
            },
            department: Joi.string(),
            designation: Joi.string(),
            email: Joi.string().email(),
            phoneNumber: Joi.string(),
            branch: {
                branchId: Joi.string(),
                branchName: Joi.string(),
                // branchAddress: Joi.object().keys(addressBody),
            },
        },
        countryProfileSettings: {
            countryName: Joi.string().optional(),
            nodalAgency: {
                agency: Joi.string().optional(),
                agencyFocalPoint: Joi.string().optional(),
            },
            leadInstitutions: {
                cadre: Joi.string().optional(),
                cadreFocalPoint: Joi.string().optional(),
                mfr: Joi.string().optional(),
                mfrFocalPoint: Joi.string().optional(),
                cssr: Joi.string().optional(),
                cssrFocalPoint: Joi.string().optional(),
                hope: Joi.string().optional(),
                hopeFocalPoint: Joi.string().optional(),
            },
            programYears: Joi.string().optional(),
            geographicCoverage: Joi.string().optional(),
            trainedResponders: {
                cadre: Joi.number().optional(),
                mfr: Joi.number().optional(),
                cssr: Joi.number().optional(),
                hope: Joi.number().optional(),
            },
            trainedInstructors: {
                cadreQualified: Joi.number().optional(),
                mfrQualified: Joi.number().optional(),
                cssrQualified: Joi.number().optional(),
                hopeQualified: Joi.number().optional(),
            },
        },
    })
        .min(1),
};
export const deleteUser = {
    params: Joi.object().keys({
        userId: Joi.string().custom(objectId),
    }),
};
//# sourceMappingURL=user.validation.js.map