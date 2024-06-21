import mongoose from 'mongoose';
import { LevelStatEnum } from '../../../shared/interfaces/report';
// #region Statistics
const statisticDashboardSchema = new mongoose.Schema({
    level: { type: String, enum: LevelStatEnum },
    countryId: { type: mongoose.Types.ObjectId },
    organizationId: { type: mongoose.Types.ObjectId },
    // Top main tiles
    trainingComponentTiles: {
        type: [
            {
                date: { type: String },
                code: { type: String },
                score: { type: Number },
                country: { type: String },
                organization: { type: String },
            }
        ],
        _id: false
    },
    // Assessment history
    assessmentHistory: {
        type: [
            {
                date: { type: String },
                title: { type: String },
                averageScore: { type: Number },
                country: { type: String },
            }
        ],
        _id: false
    },
    lastCountryReview: {
        // Progress
        trainingComponentProgress: { type: Number },
        // Latest attempt
        trainingComponentOverview: {
            type: [
                {
                    code: { type: String },
                    averageScore: { type: Number },
                }
            ],
            _id: false
        },
        // Latest institutionalization
        trainingComponentModules: {
            type: [
                {
                    moduleNo: { type: String },
                    condition: { type: String },
                    score: { type: Number },
                }
            ],
            _id: false
        },
        // Teams progress
        organizationOverview: {
            type: [
                {
                    organization: { type: String },
                    progress: { type: Number },
                    averageScore: { type: Number },
                }
            ],
            _id: false
        }
    },
    // Recent users, or 3-row 2-item
    countryOverview: {
        type: [
            {
                country: { type: String },
                averageScore: { type: Number },
                date: { type: String },
                reviewId: { type: String },
            }
        ],
        _id: false
    }
}, { timestamps: true });
const statisticDashboard = mongoose.model('statisticDashboard', statisticDashboardSchema);
// #endregion
export { statisticDashboard };
//# sourceMappingURL=dashboard.model.js.map