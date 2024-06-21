import lodash from 'lodash'

import { DefaultUsers } from '../constants/helper'

import authorizations from './authorization.json'

export enum accessType {
  Enable = 'enable', // 'Read-access'
  Disable = 'disable', // 'Read-and-write-access'
  Hidden = 'hidden', // 'No-access'
}

export const authorization = (
  role: string,
  page: string,
  item: string,
  action: string
): boolean => {
  // Manage with json
  const pathExist = lodash.has(authorizations, page)

  if (pathExist) {
    const currentAction = lodash.get(authorizations, `${page}.${item}.${role}`)
    // console.log(`${page} ${item} ${currentAction} <-> ${action}`)
    if (currentAction === action) return true
  }

  // baseUesr ----------------------
  // if ('baseUser_pages_Profile' === page) {
  //   if ('profile_background' === item) {
  //     if (
  //       DefaultUsers.COUNTRY_ADMINISTRATOR === role &&
  //       accessType.Enable === action //optional
  //     )
  //       return true
  //   }
  // }

  // countries -----------------------

  // if ('countries.components.CountryTable' === page) {
  //   if ('button.deleteAll' === item) {
  //     if (
  //       DefaultUsers.SUPER_ADMINISTRATOR === role &&
  //       accessType.Enable === action //optional
  //     )
  //       return true
  //   }
  // }
  // if ('countries.pages.CountryManagement' === page) {
  //   if ('button.add' === item) {
  //     if (
  //       (DefaultUsers.SUPER_ADMINISTRATOR === role ||
  //         DefaultUsers.ADPC_ADMINISTRATOR === role) &&
  //       accessType.Enable === action //optional
  //     )
  //       return true
  //   }
  // }

  // institutionalization -------------------

  // if (
  //   'institutionalization_organizationAssessment_pages_OrganizationHistoryManagement' ===
  //   page
  // ) {
  //   if ('manage-training-components_ok' === item) {
  //     if (
  //       DefaultUsers.ORGANIZATION_USER === role &&
  //       accessType.Enable === action //optional
  //     )
  //       return true
  //   }
  // }

  // if (
  //   'institutionalization_organizationAssessment_components_AssessmentHistoryTable' ===
  //   page
  // ) {
  //   if ('drop_down_filter' === item) {
  //     if (
  //       DefaultUsers.SUPER_ADMINISTRATOR === role &&
  //       accessType.Enable === action //optional
  //     )
  //       return true
  //   }
  // }

  // if (
  //   'institutionalization_organizationAssessment_components_AssessmentHistoryTable' ===
  //   page
  // ) {
  //   if ('drop_down_filter' === item) {
  //     if (
  //       (DefaultUsers.SUPER_ADMINISTRATOR !== role ||
  //         (DefaultUsers.SUPER_ADMINISTRATOR === role &&
  //           accessType.Enable === action)) && //optional
  //       !window.location.pathname.includes(
  //         `/${ROOT_ROUTE}/${INSTITUTIONALIZATION_ORGANIZATIONS_HISTORY_MANAGEMENT_ROUTE}?countryReviewId=${countryReview?.id}`
  //       )
  //     ) {
  //       return true
  //     }
  //   }
  // }

  // if ('institutionalization_formTemplate_components_FormTable' === page) {
  //   if ('delete-all-forms_button' === item) {
  //     if (
  //       DefaultUsers.SUPER_ADMINISTRATOR === role &&
  //       accessType.Enable === action //optional
  //     )
  //       return true
  //   } else if ('delete-selected-form_menu' === item) {
  //     if (
  //       DefaultUsers.SUPER_ADMINISTRATOR === role &&
  //       accessType.Enable === action //optional
  //     )
  //       return true
  //   }
  // }

  // if ('institutionalization_formTemplate_pages_FormManagement' === page) {
  //   if ('add-new-formOrModule_button' === item) {
  //     if (
  //       (DefaultUsers.SUPER_ADMINISTRATOR === role ||
  //         DefaultUsers.ADPC_ADMINISTRATOR === role) &&
  //       accessType.Enable === action //optional
  //     )
  //       return true
  //   }
  // }

  // if ('formTemplate_components_FormModuleTable' === page) {
  //   if ('delete select formModule_ok' === item) {
  //     if (
  //       DefaultUsers.SUPER_ADMINISTRATOR === role &&
  //       accessType.Enable === action //optional
  //     )
  //       return true
  //   } else if ('delete select formModuleIndicator_ok' === item) {
  //     if (
  //       DefaultUsers.SUPER_ADMINISTRATOR === role &&
  //       accessType.Enable === action //optional
  //     )
  //       return true
  //   } else if ('delete select formModuleIndicatorSubQuestion_ok' === item) {
  //     if (
  //       DefaultUsers.SUPER_ADMINISTRATOR === role &&
  //       accessType.Enable === action //optional
  //     )
  //       return true
  //   }
  // }

  // if (
  //   'institutionalization_countryReview_components_CountryReviewTable' === page
  // ) {
  //   if ('delete-all-reviews_button' === item) {
  //     if (
  //       DefaultUsers.SUPER_ADMINISTRATOR === role &&
  //       accessType.Enable === action //optional
  //     )
  //       return true
  //   } else if ('delete-selected-review_menu' === item) {
  //     if (
  //       DefaultUsers.SUPER_ADMINISTRATOR === role &&
  //       accessType.Enable === action //optional
  //     )
  //       return true
  //   } else if ('edit-selected-review_menu' === item) {
  //     if (
  //       (DefaultUsers.SUPER_ADMINISTRATOR === role ||
  //         DefaultUsers.ADPC_ADMINISTRATOR === role ||
  //         DefaultUsers.COUNTRY_ADMINISTRATOR === role) &&
  //       accessType.Enable === action //optional
  //     )
  //       return true
  //   } else if ('drop_down_filter' === item) {
  //     if (
  //       DefaultUsers.SUPER_ADMINISTRATOR === role &&
  //       accessType.Enable === action //optional
  //     )
  //       return true
  //   }
  // }

  // if (
  //   'institutionalization_countryReview_components_CountryReviewDialog' === page
  // ) {
  //   if ('countryReview_score' === item) {
  //     if (
  //       (DefaultUsers.SUPER_ADMINISTRATOR === role ||
  //         DefaultUsers.ADPC_ADMINISTRATOR === role ||
  //         DefaultUsers.COUNTRY_ADMINISTRATOR === role) &&
  //       accessType.Hidden === action //optional
  //     )
  //       return false
  //   } else if ('countryReview_classification' === item) {
  //     if (
  //       (DefaultUsers.SUPER_ADMINISTRATOR === role ||
  //         DefaultUsers.ADPC_ADMINISTRATOR === role ||
  //         DefaultUsers.COUNTRY_ADMINISTRATOR === role) &&
  //       accessType.Hidden === action //optional
  //     )
  //       return false
  //   }
  // }

  // if (
  //   'institutionalization_countryReview_pages_CountryReviewManagement' === page
  // ) {
  //   if ('add-new-review_button' === item) {
  //     if (
  //       (DefaultUsers.SUPER_ADMINISTRATOR === role ||
  //         DefaultUsers.ADPC_ADMINISTRATOR === role ||
  //         DefaultUsers.COUNTRY_ADMINISTRATOR === role) &&
  //       accessType.Enable === action //optional
  //     )
  //       return true
  //   }
  // }

  // landing ---------------

  // languages ----------------------

  // if ('languages_components_LanguageTable' === page) {
  //   if ('select all languages_ok' === item) {
  //     if (
  //       DefaultUsers.SUPER_ADMINISTRATOR === role &&
  //       accessType.Enable === action //optional
  //     )
  //       return true
  //   }
  //   if ('Edit all languages_ok' === item) {
  //     if (
  //       DefaultUsers.SUPER_ADMINISTRATOR === role ||
  //       (DefaultUsers.ADPC_ADMINISTRATOR === role &&
  //         accessType.Enable === action) //optional
  //     )
  //       return true
  //   }
  //   if ('Delete all languages_ok' === item) {
  //     if (
  //       DefaultUsers.SUPER_ADMINISTRATOR === role &&
  //       accessType.Enable === action //optional
  //     )
  //       return true
  //   }
  // }

  // if ('languages_pages_LanguageManagement' === page) {
  //   if ('manage-languages_ok' === item) {
  //     if (
  //       DefaultUsers.SUPER_ADMINISTRATOR === role &&
  //       accessType.Enable === action //optional
  //     )
  //       return true
  //   }
  // }

  // organizations -------------------------

  // if ('organizations_components_OrganizationTable' === page) {
  //   if ('select all organizations_ok' === item) {
  //     if (
  //       DefaultUsers.SUPER_ADMINISTRATOR === role &&
  //       accessType.Enable === action //optional
  //     )
  //       return true
  //   }
  //   if ('delete select organization_ok' === item) {
  //     if (
  //       DefaultUsers.SUPER_ADMINISTRATOR === role &&
  //       accessType.Enable === action //optional
  //     )
  //       return true
  //   }
  //   if ('Edit select organization_ok' === item) {
  //     if (
  //       (DefaultUsers.SUPER_ADMINISTRATOR === role ||
  //         DefaultUsers.ADPC_ADMINISTRATOR === role ||
  //         DefaultUsers.COUNTRY_ADMINISTRATOR === role ||
  //         DefaultUsers.ORGANIZATION_USER === role) &&
  //       accessType.Enable === action //optional
  //     )
  //       return true
  //   }
  //   if ('drop_down_filter' === item) {
  //     if (
  //       DefaultUsers.SUPER_ADMINISTRATOR === role &&
  //       accessType.Enable === action //optional
  //     )
  //       return true
  //   }
  // }

  // if ('organizations_pages_OrganizationManagement' === page) {
  //   if ('manage-organizations_ok' === item) {
  //     if (
  //       (DefaultUsers.SUPER_ADMINISTRATOR === role ||
  //         DefaultUsers.ADPC_ADMINISTRATOR === role ||
  //         DefaultUsers.COUNTRY_ADMINISTRATOR === role) &&
  //       accessType.Enable === action //optional
  //     )
  //       return true
  //   }
  //   if ('manage-branches_ok' === item) {
  //     if (
  //       (DefaultUsers.SUPER_ADMINISTRATOR === role ||
  //         DefaultUsers.ADPC_ADMINISTRATOR === role ||
  //         DefaultUsers.COUNTRY_ADMINISTRATOR === role) &&
  //       accessType.Enable === action //optional
  //     )
  //       return true
  //   }
  // }

  // if ('organizations_components_BranchTable' === page) {
  //   if ('delete select branch_ok' === item) {
  //     if (
  //       DefaultUsers.SUPER_ADMINISTRATOR === role &&
  //       accessType.Enable === action //optional
  //     )
  //       return true
  //   } else if ('Edit select branch_ok' === item) {
  //     if (
  //       (DefaultUsers.SUPER_ADMINISTRATOR === role ||
  //         DefaultUsers.ADPC_ADMINISTRATOR === role ||
  //         DefaultUsers.COUNTRY_ADMINISTRATOR === role ||
  //         DefaultUsers.ORGANIZATION_USER === role) &&
  //       accessType.Enable === action //optional
  //     )
  //       return true
  //   } else if ('branch actions_ok' === item) {
  //     if (
  //       (DefaultUsers.SUPER_ADMINISTRATOR === role ||
  //         DefaultUsers.ADPC_ADMINISTRATOR === role ||
  //         DefaultUsers.COUNTRY_ADMINISTRATOR === role) &&
  //       accessType.Enable === action //optional
  //     )
  //       return true
  //   } else if ('delete-all-branchess_button_ok' === item) {
  //     if (
  //       DefaultUsers.SUPER_ADMINISTRATOR === role &&
  //       accessType.Enable === action //optional
  //     )
  //       return true
  //   }
  // }

  // reports ----------------

  // users -----------

  // if ('users_components_UserTable' === page) {
  //   if ('Edit select country_ok' === item) {
  //     if (
  //       (DefaultUsers.SUPER_ADMINISTRATOR === role ||
  //         DefaultUsers.ADPC_ADMINISTRATOR === role) &&
  //       accessType.Enable === action //optional
  //     )
  //       return true
  //   }
  //   if ('delete select country_ok' === item) {
  //     if (
  //       DefaultUsers.SUPER_ADMINISTRATOR === role &&
  //       accessType.Enable === action //optional
  //     )
  //       return true
  //   } else if ('select all users_ok' === item) {
  //     if (
  //       DefaultUsers.SUPER_ADMINISTRATOR === role &&
  //       accessType.Enable === action //optional
  //     )
  //       return true
  //   } else if ('delete select user_ok' === item) {
  //     if (
  //       DefaultUsers.SUPER_ADMINISTRATOR === role &&
  //       accessType.Enable === action //optional
  //     )
  //       return true
  //   } else if ('drop down filter_ok' === item) {
  //     if (
  //       DefaultUsers.SUPER_ADMINISTRATOR === role &&
  //       accessType.Enable === action //optional
  //     )
  //       return true
  //   } else if ('Edit select user_ok' === item) {
  //     if (
  //       DefaultUsers.SUPER_ADMINISTRATOR === role ||
  //       DefaultUsers.ADPC_ADMINISTRATOR === role ||
  //       (DefaultUsers.COUNTRY_ADMINISTRATOR === role &&
  //         accessType.Enable === action) //optional
  //     )
  //       return true
  //   }
  // }

  // if ('users_pages_UserManagement' === page) {
  //   if ('manage-users_ok' === item) {
  //     if (
  //       (DefaultUsers.SUPER_ADMINISTRATOR === role ||
  //         DefaultUsers.ADPC_ADMINISTRATOR === role ||
  //         DefaultUsers.COUNTRY_ADMINISTRATOR === role) &&
  //       accessType.Enable === action //optional
  //     )
  //       return true
  //   }
  // }

  // ---------------

  return false
}
