import mongoose from 'mongoose';
import { LevelStatEnum } from '../../../shared/interfaces/report';
import { AssessmentStatusEnum } from '../../../shared/interfaces/institutionalization';
// #region Statistics
const statisticInstitutionalizationSchema = new mongoose.Schema({
    level: { type: String, enum: LevelStatEnum },
    countryId: { type: mongoose.Types.ObjectId },
    country: { type: String },
    countryReviewId: { type: mongoose.Types.ObjectId },
    countryReviewTitle: { type: String },
    organizationId: { type: mongoose.Types.ObjectId },
    organizationName: { type: String },
    trainingComponent: { type: String },
    assessmentScore: { type: Number },
    assessmentStatus: { type: String, enum: AssessmentStatusEnum },
    assessmentCount: { type: Number },
    moduleNo: { type: String },
    moduleScore: { type: Number },
    assessmentData: { type: Array }
}, { timestamps: true });
const StatisticInstitutionalization = mongoose.model('StatisticInstitutionalization', statisticInstitutionalizationSchema);
// #endregion
export { StatisticInstitutionalization };
//# sourceMappingURL=institutionalization.model.js.map