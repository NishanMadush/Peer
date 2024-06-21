import mongoose from 'mongoose';
import { paginate } from '../../services/paginate';
import { toJSON } from '../../services/toJSON';
import { AssessmentStatusEnum, FormStatusEnum } from '../../shared/interfaces/institutionalization';
// // Assessment-Template -------------------------
// const institutionalizationTemplateSchema = new mongoose.Schema({
//   version: { type: String, trim: true, required: true, unique: true },
//   date: { type: Date },
//   modules: [{
//     instruction: { type: String, trim: true },
//     moduleNo: { type: String, trim: true, required: true },
//     condition: { type: String, trim: true, required: true }, // title
//     indicators: [{
//       instruction: { type: String, trim: true },
//       indicatorNo: { type: String, trim: true, required: true },
//       question: { type: String, trim: true },
//       description: { type: String, trim: true },
//       weight: { type: Number, required: true },
//       subQuestions: [{
//         subQuestion: { type: String, trim: true },
//       }]
//     }]
//   }]
// }, { timestamps: true })
// #region Assessment-Form
const institutionalizationFormSchema = new mongoose.Schema({
    version: { type: String, trim: true, required: true, unique: true },
    title: { type: String, trim: true },
    date: { type: Date },
    status: { type: String, trim: true, enum: FormStatusEnum },
    modules: [{
            instruction: { type: String, trim: true },
            moduleNo: { type: String, trim: true, required: true },
            condition: { type: String, trim: true, required: true },
            indicators: [{
                    instruction: { type: String, trim: true },
                    indicatorNo: { type: String, trim: true, required: true },
                    question: { type: String, trim: true },
                    description: { type: String, trim: true },
                    weight: { type: Number, required: true },
                    scale: { type: Number, default: 0 },
                    indicatorScore: { type: Number, default: 0 },
                    subQuestions: [{
                            subQuestion: { type: String, trim: true },
                            subAnswer: { type: String, trim: true },
                        }],
                    comments: [{
                            userId: { type: mongoose.Types.ObjectId },
                            date: { type: Date },
                            comment: { type: String, trim: true },
                        }]
                }],
            moduleScore: { type: Number, default: 0 },
            moduleClassification: { type: String, trim: true },
            comments: [{
                    userId: { type: mongoose.Types.ObjectId },
                    date: { type: Date },
                    comment: { type: String, trim: true },
                }]
        }],
    score: { type: Number, default: 0 },
    classification: { type: String, trim: true },
    comments: [{
            userId: { type: mongoose.Types.ObjectId },
            date: { type: Date },
            comment: { type: String, trim: true },
        }],
    createdBy: {
        userId: mongoose.Types.ObjectId,
        userName: { type: String, trim: true },
        performedAt: { type: String, trim: true }, // browser date string
    },
    lastModifiedBy: {
        userId: mongoose.Types.ObjectId,
        userName: { type: String, trim: true },
        performedAt: { type: String, trim: true }, // browser date string
    }
}, { timestamps: true });
// add plugin that converts mongoose to json
institutionalizationFormSchema.plugin(toJSON);
institutionalizationFormSchema.plugin(paginate);
const InstitutionalizationForm = mongoose.model('InstitutionalizationForm', institutionalizationFormSchema);
// #endregion
// #region Country-Assessment
const institutionalizationCountryReviewSchema = new mongoose.Schema({
    countryId: {
        type: mongoose.Types.ObjectId
    },
    title: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    year: {
        type: Number,
        required: true,
    },
    start: {
        type: Date,
        required: true,
    },
    end: {
        type: Date,
        required: true,
    },
    timeZone: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: AssessmentStatusEnum,
    },
    trainingComponents: {
        type: [{
                code: String,
                name: String
            }],
        _id: false
    },
    score: {
        type: Number
    },
    classification: {
        type: String,
    },
    createdBy: {
        userId: String,
        userName: String,
        performedAt: String // browser date string
    },
    lastModifiedBy: {
        userId: String,
        userName: String,
        performedAt: String // browser date string
    }
}, { timestamps: true });
// add plugin that converts mongoose to json
institutionalizationCountryReviewSchema.plugin(toJSON);
institutionalizationCountryReviewSchema.plugin(paginate);
institutionalizationCountryReviewSchema.index({ countryId: 1, title: 1 }, { unique: true });
const InstitutionalizationCountryReview = mongoose.model('InstitutionalizationCountryReview', institutionalizationCountryReviewSchema);
// #endregion
// #region Organization-Assessment
const institutionalizationOrganizationSchema = new mongoose.Schema({
    countryId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    languageId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    organizationId: {
        type: mongoose.Types.ObjectId
    },
    countryReviewId: {
        type: mongoose.Types.ObjectId
    },
    trainingComponent: {
        type: String,
        // enum: TrainingComponentEnum
    },
    status: {
        type: String,
        enum: AssessmentStatusEnum
    },
    start: {
        type: Date,
        required: true,
    },
    complete: {
        type: Date,
        required: true,
    },
    timeZone: {
        type: String,
        required: true
    },
    // score: {
    //   type: Number
    // },
    institutionalization: {},
    comments: [{
            userId: {
                type: mongoose.Types.ObjectId
            },
            date: {
                type: Date
            },
            comment: {
                type: String
            },
        }],
    endorse: {
        organizationId: {
            type: mongoose.Types.ObjectId
        },
        organization: {
            type: String,
            trim: true
        },
        userId: {
            type: mongoose.Types.ObjectId
        },
        date: {
            type: Date
        },
        comment: {
            type: String
        },
    }
}, { timestamps: true });
// add plugin that converts mongoose to json
institutionalizationOrganizationSchema.plugin(toJSON);
institutionalizationOrganizationSchema.plugin(paginate);
const InstitutionalizationOrganization = mongoose.model('InstitutionalizationOrganization', institutionalizationOrganizationSchema);
// #endregion
export { InstitutionalizationForm, InstitutionalizationCountryReview, InstitutionalizationOrganization };
//# sourceMappingURL=institutionalization.model.js.map