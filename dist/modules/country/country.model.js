import mongoose from 'mongoose';
import { paginate } from '../../services/paginate';
import { toJSON } from '../../services/toJSON';
import { CountryStatusEnum } from '../../shared/interfaces/country';
const countrySchema = new mongoose.Schema({
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
    order: {
        type: Number,
        default: -1,
    },
    isAppCountry: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        trim: true,
        required: true,
        enum: CountryStatusEnum,
        default: CountryStatusEnum.Active,
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
countrySchema.plugin(toJSON);
countrySchema.plugin(paginate);
const Country = mongoose.model('Country', countrySchema);
export default Country;
//# sourceMappingURL=country.model.js.map