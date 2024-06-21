import mongoose from 'mongoose';
import { paginate } from '../../services/paginate';
import { toJSON } from '../../services/toJSON';
import { LanguageDirectionEnum, LanguageStatusEnum } from '../../shared/interfaces/language';
const languageSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    direction: {
        type: String,
        required: true,
        trim: true,
        enum: Object.keys(LanguageDirectionEnum),
        default: 'ltor',
    },
    order: {
        type: Number,
        default: -1,
    },
    recaptchaLanguageCode: {
        type: String,
        trim: true,
        default: 'en',
    },
    status: {
        type: String,
        trim: true,
        required: true,
        enum: LanguageStatusEnum,
        default: LanguageStatusEnum.Active,
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
}, {
    timestamps: true,
});
// add plugin that converts mongoose to json
languageSchema.plugin(toJSON);
languageSchema.plugin(paginate);
const Language = mongoose.model('Language', languageSchema);
export default Language;
//# sourceMappingURL=language.model.js.map