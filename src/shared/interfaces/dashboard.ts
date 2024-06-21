// export interface IStatistics {
//   id: string
//   // Assessment history
//   assessmentHistory: [
//     {
//       date: string
//       title: string
//       averageScore: number
//     }
//   ]
//   lastCountryReview: {
//     // Top main tiles
//     trainingComponentTiles: [
//       {
//         code: string
//         score: number
//       }
//     ]
//     // Progress
//     trainingComponentProgress: number
//     // Latest attempt
//     trainingComponentOverview: [
//       {
//         code: string
//         averageScore: string
//       }
//     ]
//     // Latest institutionalization
//     trainingComponentModules: [
//       {
//         moduleNo: string
//         condition: string
//         score: number
//       }
//     ]
//     // Teams progress
//     organizationOverview: [
//       {
//         organization: string
//         progress: number
//         averageScore: number
//       }
//     ]
//   }
//   // Recent users, or 3-row 2-item
//   countryOverview: [
//     {
//       country: string
//       averageScore: number
//     }
//   ]
// }

import { LevelStatEnum } from './report'

export interface ITrainingComponentTile {
  date: string
  code: string
  score: number
  country?: string
  organization?: string
}

export interface IAssessmentHistoryItem {
  date: string
  title: string
  averageScore: number
  country?: string
}

export interface ITrainingComponentOverviewItem {
  code: string
  averageScore: number
}

export interface ITrainingComponentModule {
  moduleNo: string
  condition: string
  score: number
}

export interface IOrganizationOverviewItem {
  organization: string
  progress: number
  averageScore: number
}

export interface ICountryOverviewItem {
  country: string
  averageScore: number
  date?: string
  reviewId?: string
}

export interface IStatisticDashboard {
  level: LevelStatEnum
  countryId: string
  organizationId: string
  // Top main tiles
  trainingComponentTiles: ITrainingComponentTile[]
  // Assessment history
  assessmentHistory: IAssessmentHistoryItem[]
  lastCountryReview: {
    // Progress
    trainingComponentProgress: number
    // Latest attempt
    trainingComponentOverview: ITrainingComponentOverviewItem[]
    // Latest institutionalization
    trainingComponentModules: ITrainingComponentModule[]
    // Teams progress
    organizationOverview: IOrganizationOverviewItem[]
  }
  // Recent users, or 3-row 2-item
  countryOverview: ICountryOverviewItem[]
}
